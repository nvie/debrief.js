// @flow

import type { Annotation } from './ast';

type Keypath = Array<number | string>;

/**
 * Walks the annotation tree and emits the annotation's key path within the
 * object tree, and the message as a series of messages (array of strings).
 */
function* iterSummarize(ann: Annotation, keypath: Keypath): Iterable<string> {
    if (ann.type === 'ArrayAnnotation') {
        const items = ann.items;
        let index = 0;
        for (const ann of items) {
            yield* iterSummarize(ann, [...keypath, index++]);
        }
    } else if (ann.type === 'ObjectAnnotation') {
        const pairs = ann.pairs;
        for (const pair of pairs) {
            yield* iterSummarize(pair.value, [...keypath, pair.key]);
        }
    }

    const annotation = ann.annotation;
    if (!annotation) {
        return;
    }

    let prefix: string;
    if (keypath.length === 0) {
        prefix = '';
    } else if (keypath.length === 1) {
        prefix =
            typeof keypath[0] === 'number'
                ? `Value at index ${keypath[0]}: `
                : `Value at key ${JSON.stringify(keypath[0])}: `;
    } else {
        prefix = `Value at keypath ${keypath.map(x => x.toString()).join('.')}: `;
    }
    yield `${prefix}${annotation}`;
}

/**
 * Walks the annotation tree and emits the annotation's key path within the
 * object tree, and the message as a series of messages (array of strings).
 */
export default function summarize(ann: Annotation, keypath: Keypath = []): Array<string> {
    return [...iterSummarize(ann, keypath)];
}
