// @flow

import annotate from '../parser';
import serialize from '../printer';

import { dedent } from './helpers';

function debrief(input, expected) {
    expect(serialize(annotate(input))).toEqual(dedent(expected));
}

describe('debrief', () => {
    it('serializes normal JS values', () => {
        debrief(1234, '1234');
        debrief(true, 'true');
        debrief('foo', '"foo"');
        debrief(
            ['foo', 123],
            `
              [
                "foo",
                123,
              ]`
        );
    });

    it('serializes annotated primitives', () => {
        debrief(
            annotate(123, 'a number'),
            `
              123
              ^^^ a number
            `
        );
        debrief(
            annotate(true, 'not false'),
            `
              true
              ^^^^ not false
            `
        );
        debrief(
            annotate('foo', 'This is a foo'),
            `
              "foo"
              ^^^^^ This is a foo
            `
        );
    });

    it('serializes data inside arrays', () => {
        debrief(
            [[annotate(1234, 'ABC')], annotate(true, 'not false')],
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
        // THIS YET FAILS BECAUSE THE "name: " prefix isn't added!
        debrief(
            { name: annotate(123, 'The name should be a string') },
            `
              {
                "name": 123,
                        ^^^ The name should be a string
              }
            `
        );

        // const structure = [{ name: 'Peter' }, { name: 'John', email: 123 }];
        // const test2 = annotateKeyPath(structure, [1, 'email', 'Must be string']);
    });
});
