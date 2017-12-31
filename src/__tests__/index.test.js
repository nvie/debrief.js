// @flow

import { serialize, annotate } from '..';

const whitespace_re = /^\s*$/;

function dedent(value: string): string {
    let lines = value.split('\n');
    if (lines.length > 0 && whitespace_re.test(lines[0])) {
        lines.shift();
    }
    if (lines.length > 0 && whitespace_re.test(lines[lines.length - 1])) {
        lines.pop();
    }
    const level = Math.min(...lines.filter(s => !!s).map(s => s.search(/\S/)));
    const dedented = lines.map(value => (value ? value.substring(level) : ''));
    return dedented.join('\n');
}

describe('dedent', () => {
    it('works', () => {
        expect(dedent('foo\nbar')).toEqual('foo\nbar');
        expect(dedent('foo\n    bar')).toEqual('foo\n    bar');
        expect(dedent('  foo\n    bar')).toEqual('foo\n  bar');
        expect(dedent('\n  foo\n\n    bar')).toEqual('foo\n\n  bar');

        const snippet = `
          [
            1234,
            true,
          ]
        `;
        expect(dedent(snippet)).toEqual('[\n  1234,\n  true,\n]');
    });
});

function assert(serializedValue: string, expected: string) {
    expect(serializedValue).toEqual(dedent(expected));
}

describe('debrief', () => {
    it('serializes normal JS values', () => {
        expect(serialize(1234)).toEqual('1234');
        expect(serialize(true)).toEqual('true');
        expect(serialize('foo')).toEqual('"foo"');
        expect(serialize(['foo', 123])).toEqual('[\n  "foo",\n  123,\n]');
    });

    it('serializes annotated primitives', () => {
        assert(
            serialize(annotate(123, 'a number')),
            `
              123
              ^^^ a number
            `
        );
        assert(
            serialize(annotate(true, 'not false')),
            `
              true
              ^^^^ not false
            `
        );
        assert(
            serialize(annotate('foo', 'This is a foo')),
            `
              "foo"
              ^^^^^ This is a foo
            `
        );
    });

    it('serializes data inside arrays', () => {
        const test = [[annotate(1234, 'ABC')], annotate(true, 'not false')];
        assert(
            serialize(test),
            `
              [
                [
                  1234,
                  ^^^^ ABC
                ],
                true,
                ^^^^ not false
              ]
            `
        );
    });

    it('serializes data inside objects', () => {
        // const test2 = annotateField({ name: 1234 }, 'name', 'The name should be a string');
        // should produce:
        const test2 = { name: annotate(123, 'The name should be a string') };

        // THIS YET FAILS BECAUSE THE "name: " prefix isn't added!
        assert(
            serialize(test2),
            `
              {
                name: 123,
                      ^^^ The name should be a string
              }
            `
        );

        // const structure = [{ name: 'Peter' }, { name: 'John', email: 123 }];
        // const test2 = annotateKeyPath(structure, [1, 'email', 'Must be string']);
    });
});
