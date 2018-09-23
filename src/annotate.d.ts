import { asAnnotation, Annotation, Maybe, ObjectAnnotation } from './ast';

export function any<T>(iterable: Iterable<T>, keyFn: (item: T) => boolean): boolean;
export function annotateFields(
    object: { [fied: string]: unknown },
    fields: Array<[string, string | Annotation]>
): ObjectAnnotation;
export function annotateField(object: { [fied: string]: unknown }, field: string, ann: string | Annotation): ObjectAnnotation;
export function annotatePairs(value: Array<[string, unknown]>, annotation: Maybe<string>): ObjectAnnotation;
export default function annotate(value: unknown, annotation: Maybe<string>): Annotation;
