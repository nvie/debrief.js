// @flow

export type Maybe<T> = T | void;

type cast = $FlowFixMe;

export type ScalarAnnotation = {
    type: 'ScalarAnnotation',
    value: mixed,
    hasAnnotation: boolean, // TODO: Remove (makes no sense on scalar)
    annotation: Maybe<string>,
};

export type AnnPair = { key: string, value: Annotation };

export type ObjectAnnotation = {
    type: 'ObjectAnnotation',
    pairs: Array<AnnPair>,
    hasAnnotation: boolean,
    annotation: Maybe<string>,
};

export type ArrayAnnotation = {
    type: 'ArrayAnnotation',
    items: Array<Annotation>,
    hasAnnotation: boolean,
    annotation: Maybe<string>,
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
