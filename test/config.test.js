const getConfig = require('../utils/config');

describe('Config method tests', () => {
  it('should return default config when we do not set one parameter', () => {
    const expected = {
      body: true,
      params: true,
      headers: true,
      query: true,
      required: true,
      errorStatusCode: 400,
    };
    const result = getConfig();
    expect(result).toEqual(expected);
  });

  it('should return default config when we set "{}" as a parameter', () => {
    const expected = {
      body: true,
      params: true,
      headers: true,
      query: true,
      required: true,
      errorStatusCode: 400,
    };
    const result = getConfig({});
    expect(result).toEqual(expected);
  });

  it('should return default config merge with our custom configuration', () => {
    const expected = {
      body: true,
      params: true,
      headers: true,
      query: true,
      required: false,
      errorStatusCode: 400,
    };
    const result = getConfig({ required: false });
    expect(result).toEqual(expected);
  });
});
