// @flow

import { isAnnotation } from './ast';
import type { Annotation } from './ast';

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
        if (isAnnotation(item)) {
            const ser = serializeAnnotation({ ...item, annotation: undefined }, prefix + '  ');
            yield prefix + '  ' + ser + ',';
            const annotation = item.annotation;
            if (annotation) {
                const linecount = ser.split('\n').length;
                const sep = '^'.repeat(linecount > 1 ? 1 : ser.length);
                yield prefix + '  ' + sep + ' ' + annotation;
            }
        } else {
            yield prefix + '  ' + serializeAnnotation(item, prefix + '  ') + ',';
        }
    }
    yield prefix + ']';
}

function serializeArray(ann: Annotation<*>, prefix: string) {
    // TODO: Inspect 'hasAnnotations' and decide whether to inline or expand serialize
    return [...iterArray(ann.value, prefix)].join('\n');
}

// $FlowFixMe
function* iterObject(pairs: Array<{ key: Annotation<string>, value: Annotation<mixed> }>, prefix: string) {
    yield '{';
    for (const pair of pairs) {
        const key: Annotation<string> = pair.key;
        const value: Annotation<*> = pair.value;
        if (isAnnotation(value)) {
            const kser = serializeAnnotation({ ...key, annotation: undefined });
            const vser = serializeAnnotation({ ...value, annotation: undefined });

            yield prefix + '  ' + kser + ': ' + vser + ',';

            const annotation = value.annotation;
            if (annotation) {
                const linecount = vser.split('\n').length;
                const sep = '^'.repeat(linecount > 1 ? 1 : vser.length);
                yield prefix + '  ' + ' '.repeat(kser.length + 2) + sep + ' ' + annotation;
            }
        } else {
            yield prefix +
                '  ' +
                serializeAnnotation({ ...key, annotation: undefined }) +
                ': ' +
                serializeAnnotation(value, prefix + '  ') +
                ',';
        }
    }
    yield prefix + '}';
}

function serializeObject(ann: Annotation<{ [key: string]: mixed }>, prefix: string) {
    // TODO: Inspect 'hasAnnotations' and decide whether to inline or expand serialize
    return [...iterObject(ann.value, prefix)].join('\n');
}

export function serializeAnnotation(ann: deliberatelyAny, prefix: string = ''): string {
    if (ann.type === 'string') {
        return serializeString(ann.value);
    } else if (ann.type === 'number' || ann.type === 'boolean') {
        return JSON.stringify(ann.value);
    } else if (ann.type === 'null') {
        return 'null';
    } else if (ann.type === 'undefined') {
        return 'undefined';
    } else if (ann.type === 'date') {
        return `Date(${JSON.stringify(ann.value.toString())})`;
    } else if (ann.type === 'array') {
        return serializeArray(ann, prefix);
    } else if (ann.type === 'object') {
        return serializeObject(ann, prefix);
    }

    return '(unserializable)';
}

export default function serialize(ann: Annotation<*>): string {
    const serialized = serializeAnnotation(ann);
    const annotation = ann.annotation;
    if (annotation !== undefined) {
        const linecount = serialized.split('\n').length;
        const sep = '^'.repeat(linecount > 1 ? 1 : serialized.length);
        return `${serialized}\n${sep} ${annotation}`;
    } else {
        return serialized;
    }
}
