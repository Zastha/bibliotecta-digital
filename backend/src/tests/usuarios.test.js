const request = require('supertest');
const app     = require('../app');

describe('API Usuarios', () => {

  describe('Sin autenticación', () => {
    it('GET /api/usuarios debe devolver 401', async () => {
      const response = await request(app).get('/api/usuarios');
      expect(response.statusCode).toBe(401);
    });

    it('POST /api/usuarios debe devolver 401', async () => {
      const response = await request(app).post('/api/usuarios');
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Con rol incorrecto', () => {
    it('GET /api/usuarios con rol alumno debe devolver 403', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('auth-id', 'test-alumno-001');
      expect(response.statusCode).toBe(403);
    });

    it('POST /api/usuarios con rol alumno debe devolver 403', async () => {
      const response = await request(app)
        .post('/api/usuarios')
        .set('auth-id', 'test-alumno-001')
        .send({});
      expect(response.statusCode).toBe(403);
    });
  });

  describe('Con autenticación correcta', () => {
    it('GET /api/usuarios debe devolver 200 y un array', async () => {
      const response = await request(app)
        .get('/api/usuarios')
        .set('auth-id', 'test-admin-001');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /api/usuarios sin datos debe devolver 400', async () => {
      const response = await request(app)
        .post('/api/usuarios')
        .set('auth-id', 'test-admin-001')
        .send({});
      expect(response.statusCode).toBe(400);
    });

    it('GET /api/usuarios/:id inexistente debe devolver 404', async () => {
      const response = await request(app)
        .get('/api/usuarios/00000000-0000-0000-0000-000000000000')
        .set('auth-id', 'test-admin-001');
      expect(response.statusCode).toBe(404);
    });
  });

});