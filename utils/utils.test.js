const { filterUndefinedProps } = require('./index');

describe('filterUndefinedProps tests', () => {
  it('filter undefined props from simple object', () => {
    const input = {
      name: 'simple',
      empty: undefined,
    };

    const expected = {
      name: 'simple',
    };

    expect(filterUndefinedProps(input)).toMatchObject(expected);
  });

  it('filter undefined props from object with nested props', () => {
    const input = {
      name: 'nested',
      empty: undefined,
      nested: {
        one: 1,
        empty: undefined,
        nullable: null,
      },
    };

    const expected = {
      name: 'nested',
      nested: {
        one: 1,
        nullable: null,
      },
    };

    expect(filterUndefinedProps(input)).toMatchObject(expected);
  });

  it('filter undefined props from object with array of basic types', () => {
    const input = {
      name: 'basic array',
      empty: undefined,
      array: [1, 2],
    };

    const expected = {
      name: 'basic array',
      array: [1, 2],
    };

    expect(filterUndefinedProps(input)).toMatchObject(expected);
  });

  it('filter undefined props from object with array of objects', () => {
    const input = {
      name: 'object array',
      empty: undefined,
      array: [
        { id: 1, content: undefined },
        { id: 2, content: 'stuff' },
      ],
    };

    const expected = {
      name: 'object array',
      array: [
        { id: 1 },
        { id: 2, content: 'stuff' },
      ],
    };

    expect(filterUndefinedProps(input)).toMatchObject(expected);
  });

  it('filter undefined props from object with nested array of objects', () => {
    const input = {
      name: 'nested object array',
      empty: undefined,
      array: [
        [
          { id: 1, content: undefined },
          { id: 2, content: 'stuff' },
        ],
        'other value',
      ],
    };

    const expected = {
      name: 'nested object array',
      array: [
        [
          { id: 1 },
          { id: 2, content: 'stuff' },
        ],
        'other value',
      ],
    };

    expect(filterUndefinedProps(input)).toMatchObject(expected);
  });
});
