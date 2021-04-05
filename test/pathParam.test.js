const supertest = require('supertest');
const serverApp = require('./fake-server');

describe('Path params tests', () => {
  let request;

  beforeAll(async () => {
    const app = await serverApp();
    request = supertest(app);
  });

  it('should not throw error when request is valid', () => (
    request
      .get('/api/v1/albums/1')
      .expect(200)
  ));

  it('should not throw error when param is undefined', () => (
    request
      .get('/api/v1/albums/undefined')
      .expect(400)
      .then(response => {
        expect(response.body.name).toEqual('OpenAPIUtilsError');
        expect(response.body.message).toEqual(
          'Required error: id path param is required.',
        );
      })
  ));
});
