// @flow

export type Maybe<T> = T | void;

export type AnnScalar = {
    type: 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'date',
    value: mixed,
    hasAnnotation: boolean, // TODO: Remove (makes no sense on scalar)
    annotation: Maybe<string>,
};

export type AnnPair = { key: string, value: Annotation };

export type AnnObject = {
    type: 'object',
    pairs: Array<AnnPair>,
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};

export type AnnArray = {
    type: 'array',
    items: Array<Annotation>,
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};

export type Annotation = AnnObject | AnnArray | AnnScalar;

export const isAnnObject = (value: mixed): boolean %checks =>
    value !== null &&
    typeof value === 'object' &&
    value.type === 'object' &&
    Array.isArray(value.pairs) &&
    typeof value.hasAnnotation === 'boolean';

export const isAnnArray = (value: mixed): boolean %checks =>
    value !== null &&
    typeof value === 'object' &&
    value.type === 'array' &&
    Array.isArray(value.items) &&
    typeof value.hasAnnotation === 'boolean';

export const isAnnScalar = (value: mixed): boolean %checks =>
    value !== null &&
    typeof value === 'object' &&
    (value.type === 'string' ||
        value.type === 'null' ||
        value.type === 'undefined' ||
        value.type === 'number' ||
        value.type === 'boolean' ||
        value.type === 'date') &&
    typeof value.hasAnnotation === 'boolean';

export function isAnnotation(value: mixed): boolean %checks {
    return isAnnObject(value) || isAnnArray(value) || isAnnScalar(value);
}
