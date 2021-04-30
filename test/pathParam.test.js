const supertest = require('supertest');
const serverApp = require('./fake-server');

describe('Path params tests', () => {
  let request;

  beforeAll(async () => {
    const app = await serverApp();
    request = supertest(app);
  });

  it('should not throw error when path is valid', () => (
    request
      .get('/api/v1/albums/param')
      .expect(200)
  ));

  it('should not throw error when path is valid because express params are always string', () => (
    request
      .get('/api/v1/albums/1')
      .expect(200)
  ));

  it('should throw error when path is not valid sending an string', () => (
    request
      .get('/api/v1/albums/1/songs/notNumber')
      .expect(400)
      .then(response => {
        expect(response.body.name).toEqual('OpenAPIUtilsError');
        expect(response.body.message).toEqual(
          'Error in path: must be number. You provide "notNumber"',
        );
      })
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
