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
    it('serializes primitives', () => {
        expect(serialize('foo')).toEqual('"foo"');
        expect(annotate('foo', 'This is a foo')).toEqual({ annotation: 'This is a foo', value: 'foo' });

        const test = [annotate(1234, 'ABC'), true];
        assert(
            serialize(test),
            `
              [
                1234,
                ^^^^ ABC
                true,
              ]
            `
        );

        // const test2 = annotateField({ name: 1234 }, 'name', 'The name should be a string');
        // should produce:
        // const test2 = annotate({ name: annotate(1234, 'The name should be a string')});
        // assert(
        //     serialize(test2),
        //     `
        //       {
        //         name: 1234,
        //               ^^^^ The name should be a string
        //       }
        //     `
        // );

        // const structure = [{ name: 'Peter' }, { name: 'John', email: 123 }];
        // const test2 = annotateKeyPath(structure, [1, 'email', 'Must be string']);
    });
});
