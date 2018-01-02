// @flow

import serialize from './serialize';
import type { Annotation } from './ast';

export function print(ann: Annotation<*>): string {
    const serialized = serialize(ann.value);
    if (this.hasAnnotation) {
        const linecount = serialized.split('\n').length;
        const sep = '^'.repeat(linecount > 1 ? 1 : serialized.length);
        return `${serialized}\n${sep}${ann.annotation ? ' ' + ann.annotation : ''}`;
    } else {
        return serialized;
    }
}
