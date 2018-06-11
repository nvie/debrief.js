// @flow strict

export type Maybe<T> = T | void;

type cast = $FlowFixMe;
type Metadata = { +[string]: mixed };

export type ScalarAnnotation = {
    type: 'ScalarAnnotation',
    value: mixed,
    annotation: Maybe<string>,
    metadata: Maybe<Metadata>,
};

export type AnnPair = { key: string, value: Annotation };

export type ObjectAnnotation = {
    type: 'ObjectAnnotation',
    pairs: Array<AnnPair>,
    annotation: Maybe<string>,
    metadata: Maybe<Metadata>,
};

export type ArrayAnnotation = {
    type: 'ArrayAnnotation',
    items: Array<Annotation>,
    annotation: Maybe<string>,
    metadata: Maybe<Metadata>,
};

export type Annotation = ObjectAnnotation | ArrayAnnotation | ScalarAnnotation;

export function asAnnotation(thing: mixed): Annotation | void {
    if (typeof thing === 'object' && thing !== null) {
        if (thing.type === 'ObjectAnnotation') {
            return ((thing: cast): ObjectAnnotation);
        } else if (thing.type === 'ArrayAnnotation') {
            return ((thing: cast): ArrayAnnotation);
        } else if (thing.type === 'ScalarAnnotation') {
            return ((thing: cast): ScalarAnnotation);
        }
    }
    return undefined;
}

export function isAnnotation(thing: mixed): boolean {
    return asAnnotation(thing) !== undefined;
}
