// @flow strict

export type Maybe<T> = T | void;

type cast = $FlowFixMe;

export type ScalarAnnotation = {
    type: 'ScalarAnnotation',
    value: mixed,
    annotation: Maybe<string>,
};

export type FunctionAnnotation = {
    type: 'FunctionAnnotation',
    annotation: Maybe<string>,
};

export type AnnPair = { key: string, value: Annotation };

export type ObjectAnnotation = {
    type: 'ObjectAnnotation',
    pairs: Array<AnnPair>,
    annotation: Maybe<string>,
};

export type ArrayAnnotation = {
    type: 'ArrayAnnotation',
    items: Array<Annotation>,
    annotation: Maybe<string>,
};

export type Annotation = ObjectAnnotation | ArrayAnnotation | ScalarAnnotation | FunctionAnnotation;

export function asAnnotation(thing: mixed): Annotation | void {
    if (typeof thing === 'object' && thing !== null) {
        if (thing.type === 'ObjectAnnotation') {
            return ((thing: cast): ObjectAnnotation);
        } else if (thing.type === 'ArrayAnnotation') {
            return ((thing: cast): ArrayAnnotation);
        } else if (thing.type === 'ScalarAnnotation') {
            return ((thing: cast): ScalarAnnotation);
        } else if (thing.type === 'FunctionAnnotation') {
            return ((thing: cast): FunctionAnnotation);
        }
    }
    return undefined;
}

export function isAnnotation(thing: mixed): boolean {
    return asAnnotation(thing) !== undefined;
}
