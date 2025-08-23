const request = require('supertest');
const app = require('../../src/app');

describe('Minimal test /products (vrai code)', () => {
  test('GET /products -> 200', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
