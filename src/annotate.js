// @flow

import { isAnnotation } from './ast';
import type { AnnObject, Annotation, Maybe } from './ast';

type cast = $FlowFixMe;

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
): AnnObject {
    let pairs = Object.entries(object);
    for (const [field, ann] of fields) {
        pairs = pairs.map(([k, v]) => (field === k ? [k, typeof ann === 'string' ? annotate(v, ann) : ann] : [k, v]));
    }
    return annotatePairs(pairs);
}

export function annotateField(object: { [string]: mixed }, field: string, ann: string | Annotation): AnnObject {
    return annotateFields(object, [[field, ann]]);
}

export function annotatePairs(value: Array<[string, mixed]>, annotation: Maybe<string>): AnnObject {
    const pairs = value.map(([key, v]) => {
        return { key, value: annotate(v) };
    });
    const hasAnnotation = any(pairs, pair => pair.value.hasAnnotation);
    return { type: 'object', pairs, hasAnnotation, annotation };
}

export default function annotate(value: mixed, annotation: Maybe<string>): Annotation {
    let hasAnnotation = annotation !== undefined;

    if (typeof value === 'string') {
        return { type: 'string', value, hasAnnotation, annotation };
    } else if (typeof value === 'number') {
        return { type: 'number', value, hasAnnotation, annotation };
    } else if (typeof value === 'boolean') {
        return { type: 'boolean', value, hasAnnotation, annotation };
    } else if (value === null) {
        return { type: 'null', value, hasAnnotation, annotation };
    } else if (value === undefined) {
        return { type: 'undefined', value, hasAnnotation, annotation };
    } else if (typeof value.getMonth === 'function') {
        return { type: 'date', value, hasAnnotation, annotation };
    } else if (Array.isArray(value)) {
        const items = value.map(v => annotate(v));
        hasAnnotation = any(items, ann => ann.hasAnnotation);
        return { type: 'array', items, hasAnnotation, annotation };
    } else if (isAnnotation(value)) {
        const ann: Annotation = ((value: cast): Annotation);
        if (annotation !== undefined) {
            if (ann.type === 'object') {
                return { type: 'object', pairs: ann.pairs, annotation, hasAnnotation };
            } else if (ann.type === 'array') {
                return { type: 'array', items: ann.items, annotation, hasAnnotation };
            } else {
                return { type: ann.type, value: ann.value, annotation, hasAnnotation };
            }
        } else {
            return ann;
        }
    } else if (typeof value === 'object') {
        return annotatePairs(Object.entries(value), annotation);
    }

    // istanbul ignore next
    throw new Error('Unknown JavaScript type: cannot annotate');
}
