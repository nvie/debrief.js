// @flow

import { any } from 'itertools';

import { isAnnotation } from './ast';
import type { Annotation, Maybe } from './ast';

type deliberatelyAny = $FlowFixMe;

export function annotateFields(
    object: { [string]: mixed },
    fields: Array<[/* key */ string, Annotation<mixed>]>
): Annotation<mixed> {
    let pairs = Object.entries(object);
    for (const [field, ann] of fields) {
        pairs = pairs.map(([k, v]) => (field === k ? [k, ann] : [k, v]));
    }
    return annotatePairs(pairs);
}

export function annotateField(
    object: { [string]: mixed },
    field: string,
    annotation: Maybe<string>
): Annotation<mixed> {
    const pairs = Object.entries(object);
    return annotatePairs(pairs.map(([k, v]) => (field === k ? [k, annotate(v, annotation)] : [k, v])));
}

// $FlowFixMe: this signature stinks
export function annotatePairs(value, annotation: Maybe<string>): Annotation<mixed> {
    const pairs = value.map(([k, v]) => {
        return { key: annotate(k), value: annotate(v) };
    });
    const hasAnnotation = any(pairs, pair => pair.key.hasAnnotation || pair.value.hasAnnotation);
    return { type: 'object', value: pairs, hasAnnotation, annotation };
}

export default function annotate<T>(value: deliberatelyAny, annotation: Maybe<string>): Annotation<T> {
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
        if (annotation !== undefined) {
            return { ...value, annotation, hasAnnotation };
        } else {
            return value;
        }
    } else if (typeof value === 'object') {
        return annotatePairs(Object.entries(value), annotation);
    }

    throw new Error('Unknown JavaScript type: cannot annotate');
}
