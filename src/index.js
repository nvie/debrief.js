// @flow

import annotate, { annotateField, annotatePairs } from './annotate';
import { isAnnotation } from './ast';
import type { Annotation } from './ast';
import serialize from './serialize';

export type { Annotation };
export { annotate, annotateField, annotatePairs, isAnnotation, serialize };
