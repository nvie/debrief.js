// @flow

import debrief from '../index';

describe('debrief', () => {
    it('trivial test for now', () => {
        expect(debrief('foo')).toEqual('"foo"');
    });
});
