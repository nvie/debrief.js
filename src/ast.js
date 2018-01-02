// @flow

export type Maybe<T> = T | void;

export type Annotation<T> = {
    type: 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date',
    value: T,

    // True if this node has any annotations itself, or its children do
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};

// $FlowFixMe
export function isAnnotation(value: any): boolean {
    return (
        typeof value === 'object' &&
        value.hasOwnProperty('type') &&
        value.hasOwnProperty('value') &&
        value.hasOwnProperty('annotation') &&
        value.hasOwnProperty('hasAnnotation')
    );
}
