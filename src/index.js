// @flow strict

import annotate, { annotateFields } from './annotate';
import { isAnnotation } from './ast';
import type { Annotation } from './ast';
import serialize from './serialize';
import summarize from './summarize';
import { indent } from './utils';

export type { Annotation };
export { annotate, annotateFields, indent, isAnnotation, serialize, summarize };
