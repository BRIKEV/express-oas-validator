const supertest = require('supertest');
const serverApp = require('./fake-server');

describe('Query params tests', () => {
  let request;

  beforeAll(async () => {
    const app = await serverApp();
    request = supertest(app);
  });

  it('should throw error when query param is not a valid type', () => (
    request
      .get('/api/v1/authors?name=123')
      .expect(400)
      .then(response => {
        expect(response.body.name).toEqual('OpenAPIUtilsError');
        expect(response.body.message).toEqual(
          'Error in query: should be equal to one of the allowed values: type1, type2. You provide "123"',
        );
      })
  ));

  it('should throw error when license query param is not valid', () => (
    request
      .get('/api/v1/authors?name=type1&license=12')
      .expect(400)
      .then(response => {
        expect(response.body.name).toEqual('OpenAPIUtilsError');
        expect(response.body.message).toEqual(
          'Error in query: should be array. You provide "12"',
        );
      })
  ));

  it('should not throw error when query param is valid', () => (
    request
      .get('/api/v1/authors?name=type1')
      .expect(200)
  ));

  it('should not throw error when query param is valid with array values', () => (
    request
      .get('/api/v1/authors?name=type1&license[]=ISC&license[]=MIT')
      .expect(200)
  ));
});
