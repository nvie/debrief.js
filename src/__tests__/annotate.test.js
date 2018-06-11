// @flow strict

import annotate, { annotateField } from '../annotate';
import { isAnnotation } from '../ast';

describe('annotation detection', () => {
    it('detects annotation instances', () => {
        expect(isAnnotation(undefined)).toBe(false);
        expect(isAnnotation(null)).toBe(false);
        expect(isAnnotation(42)).toBe(false);
        expect(isAnnotation('foo')).toBe(false);
        expect(isAnnotation([])).toBe(false);
        expect(isAnnotation({})).toBe(false);
        expect(isAnnotation({ type: 'foo' })).toBe(false);
        expect(isAnnotation({ type: 'ObjectAnnotation' })).toBe(true);
        expect(isAnnotation({ type: 'ArrayAnnotation' })).toBe(true);
        expect(isAnnotation({ type: 'ScalarAnnotation' })).toBe(true);
    });
});

describe('parsing (scalars)', () => {
    it('strings', () => {
        expect(annotate('foo')).toEqual({
            type: 'ScalarAnnotation',
            value: 'foo',
            annotation: undefined,
            metadata: undefined,
        });
        expect(annotate('foo', '')).toEqual({
            type: 'ScalarAnnotation',
            value: 'foo',
            annotation: '',
            metadata: undefined,
        });
        expect(annotate('foo', 'great')).toEqual({
            type: 'ScalarAnnotation',
            value: 'foo',
            annotation: 'great',
            metadata: undefined,
        });
    });

    it('booleans', () => {
        expect(annotate(true)).toEqual({
            type: 'ScalarAnnotation',
            value: true,
            annotation: undefined,
            metadata: undefined,
        });
        expect(annotate(true, '')).toEqual({
            type: 'ScalarAnnotation',
            value: true,
            annotation: '',
            metadata: undefined,
        });
        expect(annotate(false, 'lies!')).toEqual({
            type: 'ScalarAnnotation',
            value: false,
            annotation: 'lies!',
            metadata: undefined,
        });
    });

    it('numbers', () => {
        expect(annotate(123)).toEqual({
            type: 'ScalarAnnotation',
            value: 123,
            annotation: undefined,
            metadata: undefined,
        });
        expect(annotate(234, '')).toEqual({
            type: 'ScalarAnnotation',
            value: 234,
            annotation: '',
            metadata: undefined,
        });
        expect(annotate(314, '100x π')).toEqual({
            type: 'ScalarAnnotation',
            value: 314,
            annotation: '100x π',
            metadata: undefined,
        });
    });

    it('dates', () => {
        const nyd = new Date(2018, 0, 1);
        expect(annotate(nyd)).toEqual({
            type: 'ScalarAnnotation',
            value: nyd,
            annotation: undefined,
            metadata: undefined,
        });
        expect(annotate(nyd, '')).toEqual({
            type: 'ScalarAnnotation',
            value: nyd,
            annotation: '',
            metadata: undefined,
        });
        expect(annotate(nyd, "new year's day")).toEqual({
            type: 'ScalarAnnotation',
            value: nyd,
            annotation: "new year's day",
            metadata: undefined,
        });
    });

    it('null', () => {
        expect(annotate(null)).toEqual({
            type: 'ScalarAnnotation',
            value: null,
            annotation: undefined,
            metadata: undefined,
        });
        expect(annotate(null, 'foo')).toEqual({
            type: 'ScalarAnnotation',
            value: null,
            annotation: 'foo',
            metadata: undefined,
        });
    });

    it('undefined', () => {
        expect(annotate(undefined)).toEqual({
            type: 'ScalarAnnotation',
            value: undefined,
            annotation: undefined,
            metadata: undefined,
        });
        expect(annotate(undefined, 'foo')).toEqual({
            type: 'ScalarAnnotation',
            value: undefined,
            annotation: 'foo',
            metadata: undefined,
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
                    metadata: undefined,
                },
                {
                    type: 'ScalarAnnotation',
                    value: 'foo',
                    annotation: undefined,
                    metadata: undefined,
                },
            ],
            annotation: undefined,
            metadata: undefined,
        });

        const arr2 = [annotate(1, 'uno'), 'foo'];
        expect(annotate(arr2)).toEqual({
            type: 'ArrayAnnotation',
            items: [
                {
                    type: 'ScalarAnnotation',
                    value: 1,
                    annotation: 'uno',
                    metadata: undefined,
                },
                {
                    type: 'ScalarAnnotation',
                    value: 'foo',
                    annotation: undefined,
                    metadata: undefined,
                },
            ],
            annotation: undefined,
            metadata: undefined,
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
                        metadata: undefined,
                    },
                },
            ],
            annotation: undefined,
            metadata: undefined,
        });
    });

    it('objects (values annotated)', () => {
        const obj = { name: annotate('nvie', 'Vincent'), age: 36 };
        expect(annotate(obj)).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'name',
                    value: {
                        type: 'ScalarAnnotation',
                        value: 'nvie',
                        annotation: 'Vincent',
                        metadata: undefined,
                    },
                },
                {
                    key: 'age',
                    value: {
                        type: 'ScalarAnnotation',
                        value: 36,
                        annotation: undefined,
                        metadata: undefined,
                    },
                },
            ],
            annotation: undefined,
            hasAnnotation: true,
        });
    });

    it('annotates fields in object', () => {
        // Annotate with a simple string
        const obj = { name: null };
        expect(annotateField(obj, 'name', 'Missing!')).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'name',
                    value: {
                        type: 'ScalarAnnotation',
                        value: null,
                        annotation: 'Missing!',
                        metadata: undefined,
                    },
                },
            ],
            annotation: undefined,
        });

        // Annotate with a full annotation object (able to change the annotate value itself)
        const obj2 = { name: null, age: 20 };
        expect(annotateField(obj2, 'name', annotate('example', 'An example value'))).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'name',
                    value: {
                        type: 'ScalarAnnotation',
                        value: 'example',
                        annotation: 'An example value',
                        metadata: undefined,
                    },
                },
                {
                    key: 'age',
                    value: {
                        type: 'ScalarAnnotation',
                        value: 20,
                        annotation: undefined,
                        metadata: undefined,
                    },
                },
            ],
            annotation: undefined,
            metadata: undefined,
        });
    });

    it('annotates missing fields in object', () => {
        // Annotate with a simple string
        const obj = { foo: 'hello' };
        expect(annotateField(obj, 'bar', 'Missing')).toEqual({
            type: 'ObjectAnnotation',
            pairs: [
                {
                    key: 'foo',
                    value: {
                        type: 'ScalarAnnotation',
                        value: 'hello',
                        annotation: undefined,
                        metadata: undefined,
                    },
                },
                {
                    key: 'bar',
                    value: {
                        type: 'ScalarAnnotation',
                        value: undefined,
                        annotation: 'Missing',
                        metadata: undefined,
                    },
                },
            ],
            annotation: undefined,
            metadata: undefined,
        });
    });
});

describe('parsing is idempotent', () => {
    it('parsing an annotation returns itself', () => {
        for (const value of ['a string', 42, [], {}]) {
            // Annotated once yields an Annotation, but annotating it more often
            // has no effect on the result
            const once = annotate(value);
            expect(annotate(annotate(annotate(once)))).toEqual(once);

            // But providing a new value will update the existing annotation!
            expect(annotate(annotate(value), 'foo').annotation).toEqual('foo');
            expect(annotate(annotate(annotate(value), 'foo'), 'bar').annotation).toEqual('bar');
        }
    });
});
