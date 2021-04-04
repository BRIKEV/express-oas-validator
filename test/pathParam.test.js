const supertest = require('supertest');
const serverApp = require('./fake-server');

describe.only('Path params tests', () => {
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
});
