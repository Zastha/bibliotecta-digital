const request = require('supertest');
const app = require('../app');

describe('GET /api/health', () => {
  it('debe responder con status 200 y mensaje de OK', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});