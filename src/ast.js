// @flow

export type Maybe<T> = T | void;

export type Annotation = {
    type: 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date',
    value: mixed,

    // True if this node has any annotations itself, or its children do
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};

export function isAnnotation(value: mixed): boolean {
    return (
        value !== null &&
        typeof value === 'object' &&
        value.hasOwnProperty('type') &&
        value.hasOwnProperty('value') &&
        value.hasOwnProperty('annotation') &&
        value.hasOwnProperty('hasAnnotation')
    );
}
