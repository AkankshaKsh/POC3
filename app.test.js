const request = require('supertest');
const app = require('./index');

describe('GET /', () => {
  it('responds with JSON {status:"ok"}', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
