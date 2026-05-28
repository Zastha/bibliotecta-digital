const crypto = require('crypto');
const request = require('supertest');
const app = require('../app');

function createJwtToken(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

describe('API Auth', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  it('POST /api/auth/verificar debe aceptar JWT y devolver el usuario', async () => {
    const token = createJwtToken(
      {
        auth_id: 'test-admin-001',
        rol: 'administrador',
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      process.env.JWT_SECRET
    );

    const response = await request(app)
      .post('/api/auth/verificar')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('auth_id', 'test-admin-001');
    expect(response.body.data).toHaveProperty('rol', 'administrador');
  });

  it('POST /api/auth/verificar debe seguir aceptando auth-id', async () => {
    const response = await request(app)
      .post('/api/auth/verificar')
      .set('auth-id', 'test-admin-001');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('auth_id', 'test-admin-001');
  });

  it('GET /api/usuarios debe aceptar JWT en el middleware', async () => {
    const token = createJwtToken(
      {
        auth_id: 'test-admin-001',
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      process.env.JWT_SECRET
    );

    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});