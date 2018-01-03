// @flow

import annotate from './annotate';
import { isAnnotation } from './ast';
import type { Annotation } from './ast';
import serialize from './serialize';

export type { Annotation };
export { annotate, isAnnotation, serialize };
