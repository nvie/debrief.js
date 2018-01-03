// @flow

import annotate, { annotatePairs } from '../annotate';

describe('parsing (scalars)', () => {
    it('strings', () => {
        expect(annotate('foo')).toEqual({ type: 'string', value: 'foo', annotation: undefined, hasAnnotation: false });
        expect(annotate('foo', '')).toEqual({ type: 'string', value: 'foo', annotation: '', hasAnnotation: true });
        expect(annotate('foo', 'great')).toEqual({
            type: 'string',
            value: 'foo',
            annotation: 'great',
            hasAnnotation: true,
        });
    });

    it('booleans', () => {
        expect(annotate(true)).toEqual({ type: 'boolean', value: true, annotation: undefined, hasAnnotation: false });
        expect(annotate(true, '')).toEqual({ type: 'boolean', value: true, annotation: '', hasAnnotation: true });
        expect(annotate(false, 'lies!')).toEqual({
            type: 'boolean',
            value: false,
            annotation: 'lies!',
            hasAnnotation: true,
        });
    });

    it('numbers', () => {
        expect(annotate(123)).toEqual({ type: 'number', value: 123, annotation: undefined, hasAnnotation: false });
        expect(annotate(234, '')).toEqual({ type: 'number', value: 234, annotation: '', hasAnnotation: true });
        expect(annotate(314, '100x π')).toEqual({
            type: 'number',
            value: 314,
            annotation: '100x π',
            hasAnnotation: true,
        });
    });

    it('dates', () => {
        const nyd = new Date(2018, 0, 1);
        expect(annotate(nyd)).toEqual({ type: 'date', value: nyd, annotation: undefined, hasAnnotation: false });
        expect(annotate(nyd, '')).toEqual({ type: 'date', value: nyd, annotation: '', hasAnnotation: true });
        expect(annotate(nyd, "new year's day")).toEqual({
            type: 'date',
            value: nyd,
            annotation: "new year's day",
            hasAnnotation: true,
        });
    });
});

describe('parsing (composite)', () => {
    it('arrays', () => {
        const arr1 = [1, 'foo'];
        expect(annotate(arr1)).toEqual({
            type: 'array',
            value: [
                {
                    type: 'number',
                    value: 1,
                    annotation: undefined,
                    hasAnnotation: false,
                },
                {
                    type: 'string',
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
            type: 'array',
            value: [
                {
                    type: 'number',
                    value: 1,
                    annotation: 'uno',
                    hasAnnotation: true,
                },
                {
                    type: 'string',
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
            type: 'object',
            value: [
                {
                    key: {
                        type: 'string',
                        value: 'name',
                        annotation: undefined,
                        hasAnnotation: false,
                    },
                    value: {
                        type: 'string',
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
            type: 'object',
            value: [
                {
                    key: { type: 'string', value: 'name', annotation: undefined, hasAnnotation: false },
                    value: { type: 'string', value: 'nvie', annotation: 'Vincent', hasAnnotation: true },
                },
                {
                    key: { type: 'string', value: 'age', annotation: undefined, hasAnnotation: false },
                    value: { type: 'number', value: 36, annotation: undefined, hasAnnotation: false },
                },
            ],
            annotation: undefined,
            hasAnnotation: true,
        });
    });

    it('objects (keys annotated)', () => {
        const obj = [[annotate('name', 'missing'), '???']];
        expect(annotatePairs(obj)).toEqual({
            type: 'object',
            value: [
                {
                    key: { type: 'string', value: 'name', annotation: 'missing', hasAnnotation: true },
                    value: { type: 'string', value: '???', annotation: undefined, hasAnnotation: false },
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
        const expected = { type: 'string', value: 'foo', annotation: undefined, hasAnnotation: false };

        expect(annotate(value)).toEqual(expected);
        expect(annotate(annotate(value))).toEqual(expected);
        expect(annotate(annotate(annotate(annotate(annotate(value)))))).toEqual(expected);

        // But providing a new value will update the existing annotation!
        expect(annotate(annotate(value), 'foo').annotation).toEqual('foo');
        expect(annotate(annotate(annotate(value), 'foo'), 'bar').annotation).toEqual('bar');
    });
});
