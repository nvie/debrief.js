export type Maybe<T> = T | undefined;
export interface ScalarAnnotation {
    type: 'ScalarAnnotation';
    value: unknown;
    hasAnnotation: boolean;
    annotation: Maybe<string>;
}
export interface AnnPair {
    key: string;
    value: Annotation;
}
export interface ObjectAnnotation {
    type: 'ObjectAnnotation';
    pairs: AnnPair[];
    hasAnnotation: boolean;
    annotation: Maybe<string>;
}
export interface ArrayAnnotation {
    type: 'ArrayAnnotation';
    items: Annotation[];
    hasAnnotation: boolean;
    annotation: Maybe<string>;
}
export type Annotation = ObjectAnnotation | ArrayAnnotation | ScalarAnnotation;
export function asAnnotation(thing: unknown): Annotation | undefined;
export function isAnnotation(thing: unknown): boolean;
