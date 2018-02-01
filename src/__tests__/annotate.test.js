// @flow

import annotate, { annotateField } from '../annotate';

describe('parsing (scalars)', () => {
    it('strings', () => {
        expect(annotate('foo')).toEqual({
            type: 'ScalarAnnotation',
            value: 'foo',
            annotation: undefined,
            hasAnnotation: false,
        });
        expect(annotate('foo', '')).toEqual({
            type: 'ScalarAnnotation',
            value: 'foo',
            annotation: '',
            hasAnnotation: true,
        });
        expect(annotate('foo', 'great')).toEqual({
            type: 'ScalarAnnotation',
            value: 'foo',
            annotation: 'great',
            hasAnnotation: true,
        });
    });

    it('booleans', () => {
        expect(annotate(true)).toEqual({
            type: 'ScalarAnnotation',
            value: true,
            annotation: undefined,
            hasAnnotation: false,
        });
        expect(annotate(true, '')).toEqual({
            type: 'ScalarAnnotation',
            value: true,
            annotation: '',
            hasAnnotation: true,
        });
        expect(annotate(false, 'lies!')).toEqual({
            type: 'ScalarAnnotation',
            value: false,
            annotation: 'lies!',
            hasAnnotation: true,
        });
    });

    it('numbers', () => {
        expect(annotate(123)).toEqual({
            type: 'ScalarAnnotation',
            value: 123,
            annotation: undefined,
            hasAnnotation: false,
        });
        expect(annotate(234, '')).toEqual({
            type: 'ScalarAnnotation',
            value: 234,
            annotation: '',
            hasAnnotation: true,
        });
        expect(annotate(314, '100x π')).toEqual({
            type: 'ScalarAnnotation',
            value: 314,
            annotation: '100x π',
            hasAnnotation: true,
        });
    });

    it('dates', () => {
        const nyd = new Date(2018, 0, 1);
        expect(annotate(nyd)).toEqual({
            type: 'ScalarAnnotation',
            value: nyd,
            annotation: undefined,
            hasAnnotation: false,
        });
        expect(annotate(nyd, '')).toEqual({
            type: 'ScalarAnnotation',
            value: nyd,
            annotation: '',
            hasAnnotation: true,
        });
        expect(annotate(nyd, "new year's day")).toEqual({
            type: 'ScalarAnnotation',
            value: nyd,
            annotation: "new year's day",
            hasAnnotation: true,
        });
    });

    it('null', () => {
        expect(annotate(null)).toEqual({
            type: 'ScalarAnnotation',
            value: null,
            annotation: undefined,
            hasAnnotation: false,
        });
        expect(annotate(null, 'foo')).toEqual({
            type: 'ScalarAnnotation',
            value: null,
            annotation: 'foo',
            hasAnnotation: true,
        });
    });

    it('undefined', () => {
        expect(annotate(undefined)).toEqual({
            type: 'ScalarAnnotation',
            value: undefined,
            annotation: undefined,
            hasAnnotation: false,
        });
        expect(annotate(undefined, 'foo')).toEqual({
            type: 'ScalarAnnotation',
            value: undefined,
            annotation: 'foo',
            hasAnnotation: true,
        });
    });
});

describe('parsing (composite)', () => {
    it('arrays', () => {
        const arr1 = [1, 'foo'];
        expect(annotate(arr1)).toEqual({
            type: 'ArrayAnnotation',
            items: [
                {
                    type: 'ScalarAnnotation',
                    value: 1,
                    annotation: undefined,
                    hasAnnotation: false,
                },
                {
                    type: 'ScalarAnnotation',
                    value: 'foo',
                    annotation: undefined,
                    hasAnnotation: false,
                },
            ],
            annotation: undefined,
            hasAnnotation: false,
        });

        const arr2 = [annotate(1, 'uno'), 'foo'];
        expect(annotate(arr2)).toEqual({
            type: 'ArrayAnnotation',
            items: [
                {
                    type: 'ScalarAnnotation',
                    value: 1,
                    annotation: 'uno',
                    hasAnnotation: true,
                },
                {
                    type: 'ScalarAnnotation',
                    value: 'foo',
                    annotation: undefined,
                    hasAnnotation: false,
                },
            ],
            annotation: undefined,
            hasAnnotation: true,
        });
    });

    it('objects', () => {
        const obj = { name: 'Frank' };
        expect(annotate(obj)).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'name',
                    value: {
                        type: 'ScalarAnnotation',
                        value: 'Frank',
                        annotation: undefined,
                        hasAnnotation: false,
                    },
                },
            ],
            annotation: undefined,
            hasAnnotation: false,
        });
    });

    it('objects (values annotated)', () => {
        const obj = { name: annotate('nvie', 'Vincent'), age: 36 };
        expect(annotate(obj)).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'name',
                    value: { type: 'ScalarAnnotation', value: 'nvie', annotation: 'Vincent', hasAnnotation: true },
                },
                {
                    key: 'age',
                    value: { type: 'ScalarAnnotation', value: 36, annotation: undefined, hasAnnotation: false },
                },
            ],
            annotation: undefined,
            hasAnnotation: true,
        });
    });

    it('objects (via annotateField helper)', () => {
        // Annotate with a simple string
        const obj = { name: null };
        expect(annotateField(obj, 'name', 'Missing!')).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'name',
                    value: { type: 'ScalarAnnotation', value: null, annotation: 'Missing!', hasAnnotation: true },
                },
            ],
            annotation: undefined,
            hasAnnotation: true,
        });

        // Annotate with a full annotation object (able to change the annotate value itself)
        const obj2 = { name: null };
        expect(annotateField(obj2, 'name', annotate('example', 'An example value'))).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'name',
                    value: {
                        type: 'ScalarAnnotation',
                        value: 'example',
                        annotation: 'An example value',
                        hasAnnotation: true,
                    },
                },
            ],
            annotation: undefined,
            hasAnnotation: true,
        });
    });
});

describe('parsing is idempotent', () => {
    it('parsing an annotation returns itself', () => {
        const value = 'foo';
        const expected = { type: 'ScalarAnnotation', value: 'foo', annotation: undefined, hasAnnotation: false };

        expect(annotate(value)).toEqual(expected);
        expect(annotate(annotate(value))).toEqual(expected);
        expect(annotate(annotate(annotate(annotate(annotate(value)))))).toEqual(expected);

        // But providing a new value will update the existing annotation!
        expect(annotate(annotate(value), 'foo').annotation).toEqual('foo');
        expect(annotate(annotate(annotate(value), 'foo'), 'bar').annotation).toEqual('bar');
    });
});
