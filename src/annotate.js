// @flow

import { any } from 'itertools';

import { isAnnotation } from './ast';
import type { Annotation, Maybe } from './ast';

type deliberatelyAny = $FlowFixMe;

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
        return value;
    } else if (typeof value === 'object') {
        return annotatePairs(Object.entries(value));
    }

    throw new Error('Unknown JavaScript type: cannot annotate');
}
