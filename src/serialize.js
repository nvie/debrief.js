// @flow

import type { AnnPair, Annotation, Maybe } from './ast';
import { INDENT, indent, isMultiline } from './utils';

function serializeString(s: string, width: number = 80) {
    // Full string
    // Abbreviated to $maxlen i.e. "Vincent Driess..." [truncated]
    let ser = JSON.stringify(s);
    if (ser.length <= width) {
        return ser;
    }

    // Cut off a bit
    const truncated = s.substring(0, width - 15) + '...';
    ser = JSON.stringify(truncated) + ' [truncated]';
    return ser;
}

function* iterArray(arr: Array<Annotation>, prefix: string) {
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

function serializeArray(value: Array<Annotation>, hasAnnotations: boolean, prefix: string) {
    // TODO: Inspect 'hasAnnotations' and decide whether to inline or expand serialize
    return [...iterArray(value, prefix)].join('\n');
}

function* iterObject(pairs: Array<AnnPair>, prefix: string) {
    if (pairs.length === 0) {
        yield '{}';
        return;
    }

    yield '{';
    for (const pair of pairs) {
        const key: string = pair.key;
        const value: Annotation = pair.value;
        const kser = serializeValue(key);

        const valPrefix = prefix + INDENT + ' '.repeat(kser.length + 2);
        const [vser, vann] = serializeAnnotation(value, prefix + INDENT);

        yield prefix + INDENT + kser + ': ' + vser + ',';
        if (vann !== undefined) {
            yield indent(vann, valPrefix);
        }
    }
    yield prefix + '}';
}

function serializeObject(pairs: Array<AnnPair>, hasAnnotations: boolean, prefix: string) {
    return [...iterObject(pairs, prefix)].join('\n');
}

export function serializeValue(value: mixed): string {
    // istanbul ignore else
    if (typeof value === 'string') {
        return serializeString(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
        return value.toString();
    } else if (value === null) {
        return 'null';
    } else if (value === undefined) {
        return 'undefined';
    } else if (value instanceof Date) {
        return `new Date(${JSON.stringify(value.toISOString())})`;
    } else {
        return '(unserializable)';
    }
}

export function serializeAnnotation(ann: Annotation, prefix: string = ''): [string, Maybe<string>] {
    let serialized;
    if (ann.type === 'ArrayAnnotation') {
        serialized = serializeArray(ann.items, ann.hasAnnotation, prefix);
    } else if (ann.type === 'ObjectAnnotation') {
        serialized = serializeObject(ann.pairs, ann.hasAnnotation, prefix);
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

export default function serialize(ann: Annotation): string {
    const [serialized, annotation] = serializeAnnotation(ann);
    if (annotation !== undefined) {
        return `${serialized}\n${annotation}`;
    } else {
        return `${serialized}`;
    }
}
