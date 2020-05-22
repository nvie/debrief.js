// @flow strict

import { asAnnotation } from './ast';
import type { Annotation, ObjectAnnotation } from './ast';

export function annotateFields(
    object: { [string]: mixed, ... },
    fields: Array<[/* key */ string, string | Annotation]>
): ObjectAnnotation {
    // Convert the object to a list of pairs
    let pairs = Object.entries(object);

    // If we want to annotate keys that are missing in the object, add an
    // explicit "undefined" value for those now, so we have a place in the
    // object to annotate
    const existingKeys = new Set(Object.keys(object));
    for (const [field] of fields) {
        if (!existingKeys.has(field)) {
            pairs.push([field, undefined]);
        }
    }

    for (const [field, ann] of fields) {
        // prettier-ignore
        pairs = pairs.map(([k, v]) => (
            field === k
                ? [
                    k,
                    typeof ann === 'string' ? annotate(v, ann) : ann,
                ]
                : [k, v]
        ));
    }
    return annotatePairs(pairs);
}

export function annotateField(
    object: { [string]: mixed, ... },
    field: string,
    ann: string | Annotation
): ObjectAnnotation {
    return annotateFields(object, [[field, ann]]);
}

export function annotatePairs(value: Array<[string, mixed]>, annotation?: string): ObjectAnnotation {
    const pairs = value.map(([key, v]) => {
        return { key, value: annotate(v) };
    });
    return { type: 'ObjectAnnotation', pairs, annotation };
}

export default function annotate(value: mixed, annotation?: string): Annotation {
    if (
        value === null ||
        value === undefined ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value.getMonth === 'function'
    ) {
        return { type: 'ScalarAnnotation', value, annotation };
    } else {
        const ann = asAnnotation(value);
        // istanbul ignore else
        if (ann) {
            if (annotation === undefined) {
                return ann;
            } else if (ann.type === 'ObjectAnnotation') {
                return { type: 'ObjectAnnotation', pairs: ann.pairs, annotation };
            } else if (ann.type === 'ArrayAnnotation') {
                return { type: 'ArrayAnnotation', items: ann.items, annotation };
            } else if (ann.type === 'FunctionAnnotation') {
                return { type: 'FunctionAnnotation', annotation };
            } else {
                return { type: 'ScalarAnnotation', value: ann.value, annotation };
            }
        } else if (Array.isArray(value)) {
            const items = value.map((v) => annotate(v));
            return { type: 'ArrayAnnotation', items, annotation };
        } else if (typeof value === 'object') {
            return annotatePairs(Object.entries(value), annotation);
        } else if (typeof value === 'function') {
            return { type: 'FunctionAnnotation', annotation };
        } else {
            throw new Error('Unknown annotation');
        }
    }
}
