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
          'Error in response: must be object. You provide "Error string"',
        );
      })
  ));

  it('should throw error when response schema is not valid', () => (
    request
      .post('/api/v2/name')
      .expect(500)
      .then(response => {
        expect(response.body.message).toEqual(
          'Error in response: Schema Song must be object. You provide "Error string"',
        );
      })
  ));

  it('should throw error when internal route is not valid', () => (
    request
      .get('/api/birds/error-response')
      .expect(500)
      .then(response => {
        expect(response.body.message).toEqual(
          'Error in response: must be string. You provide "true"',
        );
      })
  ));

  it('should not throw error if response matches the schema', () => (
    request
      .get('/api/test/responses/valid')
      .expect(200)
  ));

  it('should throw error if response has additional properties not defined in the schema', () => (
    request
      .get('/api/test/responses/extra-props')
      .expect(500)
      .then(response => {
        expect(response.body.message).toEqual(
          'Error in response: Schema Song must NOT have additional properties, invalid property "extra". You provide "{"title":"abum 1","extra":"this prop should not be here"}"',
        );
      })
  ));
});
