export interface ScalarAnnotation {
    type: 'ScalarAnnotation';
    value: unknown;
    annotation?: string;
}
export interface AnnPair {
    key: string;
    value: Annotation;
}
export interface ObjectAnnotation {
    type: 'ObjectAnnotation';
    pairs: AnnPair[];
    annotation?: string;
}
export interface ArrayAnnotation {
    type: 'ArrayAnnotation';
    items: Annotation[];
    annotation?: string;
}
export type Annotation = ObjectAnnotation | ArrayAnnotation | ScalarAnnotation;
export function asAnnotation(thing: unknown): Annotation | undefined;
export function isAnnotation(thing: unknown): boolean;
