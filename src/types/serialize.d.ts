import { AnnPair, Annotation, Maybe } from './ast';
import { INDENT, indent, isMultiline } from './utils';

export function serializeValue(value: unknown): string;
export function serializeAnnotation(ann: Annotation, prefix?: string): [string, Maybe<string>];
export default function serialize(ann: Annotation): string;
