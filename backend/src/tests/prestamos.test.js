const request = require('supertest');
const app     = require('../app');

describe('API Prestamos', () => {

  describe('Sin autenticación', () => {
    it('GET /api/prestamos debe devolver 401', async () => {
      const response = await request(app).get('/api/prestamos');
      expect(response.statusCode).toBe(401);
    });

    it('POST /api/prestamos debe devolver 401', async () => {
      const response = await request(app).post('/api/prestamos');
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Con rol incorrecto', () => {
    it('GET /api/prestamos con rol alumno debe devolver 403', async () => {
      const response = await request(app)
        .get('/api/prestamos')
        .set('auth-id', 'test-alumno-001');
      expect(response.statusCode).toBe(403);
    });
  });

  describe('Con autenticación correcta', () => {
    it('GET /api/prestamos debe devolver 200 y un array', async () => {
      const response = await request(app)
        .get('/api/prestamos')
        .set('auth-id', 'test-admin-001');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('GET /api/prestamos/activos debe devolver 200 y un array', async () => {
      const response = await request(app)
        .get('/api/prestamos/activos')
        .set('auth-id', 'test-admin-001');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /api/prestamos sin datos debe devolver 400', async () => {
      const response = await request(app)
        .post('/api/prestamos')
        .set('auth-id', 'test-alumno-001')
        .send({});
      expect(response.statusCode).toBe(400);
    });

    it('POST /api/prestamos con libro inexistente debe devolver 400', async () => {
      const response = await request(app)
        .post('/api/prestamos')
        .set('auth-id', 'test-alumno-001')
        .send({
          usuarioId: '00000000-0000-0000-0000-000000000000',
          libroId: '00000000-0000-0000-0000-000000000000',
          diasPrestamo: 14
        });
      expect(response.statusCode).toBe(400);
    });
  });

});