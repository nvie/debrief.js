// @flow

import type { Annotation, Maybe } from './ast';
import { INDENT, indent, isMultiline } from './utils';

type deliberatelyAny = $FlowFixMe;

function serializeString(s: deliberatelyAny, width: number = 80) {
    // Full string
    // Abbreviated to $maxlen i.e. "Vincent Driess..." [truncated]
    let ser = JSON.stringify(s);
    if (ser.length <= width) {
        return ser;
    }

    // Cut off a bit
    s = s.substring(0, width - 15) + '...';
    ser = JSON.stringify(s) + ' [truncated]';
    return ser;
}

function* iterArray(arr: Array<Annotation<mixed>>, prefix: string) {
    if (arr.length === 0) {
        yield '[]';
        return;
    }

    yield '[';
    for (const item of arr) {
        const [ser, ann] = serializeAnnotation(item, prefix + INDENT);
        yield prefix + INDENT + ser + ',';
        if (ann !== undefined) {
            yield indent(ann, prefix + INDENT);
        }
    }
    yield prefix + ']';
}

function serializeArray(value: Array<Annotation<mixed>>, hasAnnotations: boolean, prefix: string) {
    // TODO: Inspect 'hasAnnotations' and decide whether to inline or expand serialize
    return [...iterArray(value, prefix)].join('\n');
}

function* iterObject(pairs: Array<{ key: Annotation<mixed>, value: Annotation<mixed> }>, prefix: string) {
    if (pairs.length === 0) {
        yield '{}';
        return;
    }

    yield '{';
    for (const pair of pairs) {
        const key: Annotation<mixed> = pair.key;
        const value: Annotation<mixed> = pair.value;
        const [kser /* , kann */] = serializeAnnotation(key);

        const valPrefix = prefix + INDENT + ' '.repeat(kser.length + 2);
        const [vser, vann] = serializeAnnotation(value, valPrefix);

        yield prefix + INDENT + kser + ': ' + vser + ',';
        if (vann !== undefined) {
            yield indent(vann, valPrefix);
        }
    }
    yield prefix + '}';
}

function serializeObject(
    value: Array<{ key: Annotation<mixed>, value: Annotation<mixed> }>,
    hasAnnotations: boolean,
    prefix: string
) {
    // TODO: Inspect 'hasAnnotations' and decide whether to inline or expand serialize
    return [...iterObject(value, prefix)].join('\n');
}

export function serializeValue(value: deliberatelyAny): string {
    if (typeof value === 'string') {
        return serializeString(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
        return JSON.stringify(value);
    } else if (value === null) {
        return 'null';
    } else if (value === undefined) {
        return 'undefined';
    } else if (typeof value.getMonth === 'function') {
        return `new Date(${JSON.stringify(value.toString())})`;
    }

    return '(unserializable)';
}

export function serializeAnnotation(ann: Annotation<mixed>, prefix: string = ''): [string, Maybe<string>] {
    let serialized;
    if (ann.type === 'array') {
        serialized = serializeArray(
            ((ann.value: deliberatelyAny): Array<Annotation<mixed>>),
            ann.hasAnnotation,
            prefix
        );
    } else if (ann.type === 'object') {
        serialized = serializeObject(
            ((ann.value: deliberatelyAny): Array<{ key: Annotation<mixed>, value: Annotation<mixed> }>),
            ann.hasAnnotation,
            prefix
        );
    } else {
        serialized = serializeValue(ann.value);
    }

    const annotation = ann.annotation;
    if (annotation !== undefined) {
        const sep = '^'.repeat(isMultiline(serialized) ? 1 : serialized.length);
        return [serialized, [sep, annotation].join(isMultiline(annotation) ? '\n' : ' ')];
    } else {
        return [serialized, undefined];
    }
}

export default function serialize(ann: Annotation<*>): string {
    const [serialized, annotation] = serializeAnnotation(ann);
    if (annotation !== undefined) {
        return `${serialized}\n${annotation}`;
    } else {
        return `${serialized}`;
    }
}
