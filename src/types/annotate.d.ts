import { asAnnotation, Annotation, ObjectAnnotation } from './ast';

export function annotateFields(
    object: { [field: string]: unknown },
    fields: Array<[string, string | Annotation]>
): ObjectAnnotation;
export default function annotate(value: unknown, annotation?: string): Annotation;
