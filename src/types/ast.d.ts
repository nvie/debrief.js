export type Maybe<T> = T | void;
export type ScalarAnnotation = {
    type: 'ScalarAnnotation',
    value: unknown,
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};
export type AnnPair = { key: string, value: Annotation };
export type ObjectAnnotation = {
    type: 'ObjectAnnotation',
    pairs: Array<AnnPair>,
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};
export type ArrayAnnotation = {
    type: 'ArrayAnnotation',
    items: Array<Annotation>,
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};
export type Annotation = ObjectAnnotation | ArrayAnnotation | ScalarAnnotation;
export function asAnnotation(thing: unknown): Annotation | undefined;
export function isAnnotation(thing: unknown): boolean;
