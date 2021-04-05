const supertest = require('supertest');
const serverApp = require('./fake-server');

describe('Body request tests', () => {
  let request;

  beforeAll(async () => {
    const app = await serverApp();
    request = supertest(app);
  });

  it('should throw error when required request is not being send', () => (
    request
      .post('/api/v1/songs')
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(response => {
        expect(response.body.name).toEqual('OpenAPIUtilsError');
        expect(response.body.message).toEqual(
          'Error in request: Schema Song should have required property \'title\'. You provide "{}"',
        );
      })
  ));

  it('should throw error when request is not valid', () => (
    request
      .post('/api/v1/songs')
      .send({ invalidKey: 'invalidKey' })
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(response => {
        expect(response.body.name).toEqual('OpenAPIUtilsError');
        expect(response.body.message).toEqual(
          'Error in request: Schema Song should have required property \'title\'. You provide "{"invalidKey":"invalidKey"}"',
        );
      })
  ));

  it('should throw error when request is not valid with default content type', () => (
    request
      .post('/api/v1/songs')
      .send({ invalidKey: 'invalidKey' })
      .expect(400)
      .then(response => {
        expect(response.body.name).toEqual('OpenAPIUtilsError');
        expect(response.body.message).toEqual(
          'Error in request: Schema Song should have required property \'title\'. You provide "{"invalidKey":"invalidKey"}"',
        );
      })
  ));

  it('should not throw error when request is valid', () => (
    request
      .post('/api/v1/songs')
      .send({ title: 'valid title' })
      .expect(200)
  ));
});
