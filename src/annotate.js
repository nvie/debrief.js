// @flow

import { isAnnotation } from './ast';
import type { Annotation, Maybe } from './ast';

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

export function annotateFields(object: { [string]: mixed }, fields: Array<[/* key */ string, Annotation]>): Annotation {
    let pairs = Object.entries(object);
    for (const [field, ann] of fields) {
        pairs = pairs.map(([k, v]) => (field === k ? [k, ann] : [k, v]));
    }
    return annotatePairs(pairs);
}

export function annotateField(object: { [string]: mixed }, field: string, ann: Annotation): Annotation {
    return annotateFields(object, [[field, ann]]);
}

// $FlowFixMe: this signature stinks
export function annotatePairs(value, annotation: Maybe<string>): Annotation {
    const pairs = value.map(([k, v]) => {
        return { key: annotate(k), value: annotate(v) };
    });
    const hasAnnotation = any(pairs, pair => pair.key.hasAnnotation || pair.value.hasAnnotation);
    return { type: 'object', value: pairs, hasAnnotation, annotation };
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
        value = value.map(v => annotate(v));
        hasAnnotation = any(value, ann => ann.hasAnnotation);
        return { type: 'array', value, hasAnnotation, annotation };
    } else if (isAnnotation(value)) {
        const ann: Annotation = ((value: $FlowFixMe): Annotation);
        if (annotation !== undefined) {
            return { ...ann, annotation, hasAnnotation };
        } else {
            return ann;
        }
    } else if (typeof value === 'object') {
        return annotatePairs(Object.entries(value), annotation);
    }

    throw new Error('Unknown JavaScript type: cannot annotate');
}
