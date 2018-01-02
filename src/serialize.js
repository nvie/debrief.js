// @flow

// import type { Annotation } from './ast';

function serializeString(s: string, width: number = 80) {
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

function* iterArray(arr: Array<mixed>, prefix: string) {
    if (arr.length === 0) {
        yield '[]';
        return;
    }

    yield '[';
    for (const item of arr) {
        // if (item instanceof Annotation) {
        //     const ser = item.serialize(prefix + '  ');
        //     const ann = item.annotate();
        //     yield prefix + '  ' + ser + ',';
        //     yield prefix + '  ' + ann;
        // } else {
        yield prefix + '  ' + serialize(item, prefix + '  ') + ',';
        // }
    }
    yield prefix + ']';
}

function serializeArray(arr: Array<mixed>, prefix: string) {
    return [...iterArray(arr, prefix)].join('\n');
}

function* iterObject(o: { [key: string]: mixed }, prefix: string) {
    const keys = Object.keys(o);
    yield '{';
    for (const key of keys) {
        const val = o[key];
        // if (val instanceof Annotation) {
        //     const ser = val.serialize(prefix + '  ');
        //     const ann = val.annotate();
        //     yield prefix + '  ' + key + ': ' + ser + ',';
        //     yield prefix + '  ' + ann;
        // } else {
        yield prefix + '  ' + key + ': ' + serialize(val, prefix + '  ') + ',';
        // }
    }
    yield prefix + '}';
}

function serializeObject(o: { [key: string]: mixed }, prefix: string) {
    return [...iterObject(o, prefix)].join('\n');
}

// $FlowFixMe
export default function serialize(o: any, prefix: string = '') {
    if (o && o.annotation && o.value) {
        return o.toString();
    } else if (typeof o === 'string') {
        return serializeString(o);
    } else if (typeof o === 'number' || typeof o === 'boolean') {
        return JSON.stringify(o);
    } else if (o === null) {
        return JSON.stringify(o);
    } else if (o === undefined) {
        return 'undefined';
    } else if (typeof o.getMonth === 'function') {
        return `Date(${JSON.stringify(o.toString())})`;
    } else if (Array.isArray(o)) {
        return serializeArray(o, prefix);
    } else if (typeof o === 'object') {
        return serializeObject(o, prefix);
    }

    return '(unserializable)';
}
