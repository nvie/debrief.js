import annotate from './annotate';
import serialize from './serialize';

class Foo {
    constructor() {
        this.foo = 'name';
        this.bar = 123;
    }
}
const parent = new Foo();

console.log(
    serialize(
        annotate([
            {
                firstName: annotate(123, 'must be string'),
                lastName: annotate('', 'must not be empty'),
                city: annotate(undefined, 'required'),
                age: 32,
                parent: annotate(parent, 'foo'),
                dob: [annotate(new Date(1981, 11, 24), 'dob does not match age'), annotate(null, 'must be date')],
            },
            {
                firstName: 'Vincent\nDriessen',
                lastName: annotate(null, 'must be string'),
                city: 'Deventer',
                age: 29,
            },
        ])
    )
);
