import { asAnnotation, Annotation, ObjectAnnotation } from './ast';

export function annotateFields(
    object: { [field: string]: unknown },
    fields: Array<[string, string | Annotation]>
): ObjectAnnotation;
export function annotateField(
    object: { [field: string]: unknown },
    field: string,
    ann: string | Annotation
): ObjectAnnotation;
export function annotatePairs(value: Array<[string, unknown]>, annotation?: string): ObjectAnnotation;
export default function annotate(value: unknown, annotation?: string): Annotation;
