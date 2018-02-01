// @flow

import { asAnnotation } from './ast';
import type { Annotation, Maybe, ObjectAnnotation } from './ast';

// Taken from https://github.com/nvie/itertools.js#any and inlined here to
// avoid a dependency on itertools just for this function
export function any<T>(iterable: Iterable<T>, keyFn: T => boolean): boolean {
    for (let item of iterable) {
        if (keyFn(item)) {
            return true;
        }
    }
    return false;
}

export function annotateFields(
    object: { [string]: mixed },
    fields: Array<[/* key */ string, string | Annotation]>
): ObjectAnnotation {
    let pairs = Object.entries(object);
    for (const [field, ann] of fields) {
        pairs = pairs.map(([k, v]) => (field === k ? [k, typeof ann === 'string' ? annotate(v, ann) : ann] : [k, v]));
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
    const hasAnnotation = any(pairs, pair => pair.value.hasAnnotation);
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
        if (ann) {
            if (annotation === undefined) {
                return ann;
            } else if (ann.type === 'ObjectAnnotation') {
                return { type: 'ObjectAnnotation', pairs: ann.pairs, annotation, hasAnnotation };
            } else if (ann.type === 'ArrayAnnotation') {
                return { type: 'ArrayAnnotation', items: ann.items, annotation, hasAnnotation };
            } else if (ann.type === 'ScalarAnnotation') {
                return { type: ann.type, value: ann.value, annotation, hasAnnotation };
            } else {
                throw new Error('Unknown type');
            }
        } else if (Array.isArray(value)) {
            const items = value.map(v => annotate(v));
            hasAnnotation = any(items, ann => ann.hasAnnotation);
            return { type: 'ArrayAnnotation', items, hasAnnotation, annotation };
        } else if (typeof value === 'object') {
            return annotatePairs(Object.entries(value), annotation);
        }

        // istanbul ignore next
        throw new Error('Unknown JavaScript type: cannot annotate');
    }
}
