import { Annotation } from './ast';

type Keypath = Array<number | string>;

export default function summarize(ann: Annotation, keypath?: Keypath): Array<string>;
