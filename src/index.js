// @flow

import annotate, { annotateField, annotateFields, annotatePairs } from './annotate';
import { isAnnotation } from './ast';
import type { Annotation } from './ast';
import serialize from './serialize';

export type { Annotation };
export { annotate, annotateField, annotateFields, annotatePairs, isAnnotation, serialize };
