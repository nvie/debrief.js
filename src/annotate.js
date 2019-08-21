// @flow strict

import { asAnnotation } from './ast';
import type { Annotation, Maybe, ObjectAnnotation } from './ast';

export function annotateFields(
    object: { [string]: mixed },
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

export function annotateField(object: { [string]: mixed }, field: string, ann: string | Annotation): ObjectAnnotation {
    return annotateFields(object, [[field, ann]]);
}

export function annotatePairs(value: Array<[string, mixed]>, annotation: Maybe<string>): ObjectAnnotation {
    const pairs = value.map(([key, v]) => {
        return { key, value: annotate(v) };
    });
    const hasAnnotation = pairs.some(pair => pair.value.hasAnnotation);
    return { type: 'ObjectAnnotation', pairs, hasAnnotation, annotation };
}

export default function annotate(value: mixed, annotation: Maybe<string>): Annotation {
    let hasAnnotation = annotation !== undefined;

    if (
        value === null ||
        value === undefined ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value.getMonth === 'function'
    ) {
        return { type: 'ScalarAnnotation', value, hasAnnotation, annotation };
    } else {
        const ann = asAnnotation(value);
        // istanbul ignore else
        if (ann) {
            if (annotation === undefined) {
                return ann;
            } else if (ann.type === 'ObjectAnnotation') {
                return { type: 'ObjectAnnotation', pairs: ann.pairs, annotation, hasAnnotation };
            } else if (ann.type === 'ArrayAnnotation') {
                return { type: 'ArrayAnnotation', items: ann.items, annotation, hasAnnotation };
            } else if (ann.type === 'FunctionAnnotation') {
                return { type: 'FunctionAnnotation', annotation, hasAnnotation };
            } else {
                return { type: 'ScalarAnnotation', value: ann.value, annotation, hasAnnotation };
            }
        } else if (Array.isArray(value)) {
            const items = value.map(v => annotate(v));
            hasAnnotation = items.some(ann => ann.hasAnnotation);
            return { type: 'ArrayAnnotation', items, hasAnnotation, annotation };
        } else if (typeof value === 'object') {
            return annotatePairs(Object.entries(value), annotation);
        } else if (typeof value === 'function') {
            return { type: 'FunctionAnnotation', hasAnnotation, annotation };
        } else {
            throw new Error('Unknown annotation');
        }
    }
}
