// @flow

import debrief from '../index';

describe('debrief', () => {
    it('foo', () => {
        expect(debrief('foo')).toEqual('"foo"');
    });
});
