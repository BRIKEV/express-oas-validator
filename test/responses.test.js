const supertest = require('supertest');
const serverApp = require('./fake-server');

describe('Responses tests', () => {
  let request;

  beforeAll(async () => {
    const app = await serverApp();
    request = supertest(app);
  });

  it('should throw error when response is not valid', () => (
    request
      .post('/api/v1/name')
      .expect(500)
      .then(response => {
        expect(response.body.message).toEqual(
          'Error in response: should be object. You provide "Error string"',
        );
      })
  ));

  it('should throw error when response schema is not valid', () => (
    request
      .post('/api/v2/name')
      .expect(500)
      .then(response => {
        expect(response.body.message).toEqual(
          'Error in response: Schema Song should be object. You provide "Error string"',
        );
      })
  ));
});
