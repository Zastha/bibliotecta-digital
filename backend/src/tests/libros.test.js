const request = require('supertest');
const app = require('../app');

describe('API Libros', () =>{

    describe('Sin Autenticacion', ()=>{
        it('GET /api/libros debe devolver 401', async () => {
            const response = await request(app).get('/api/libros');
            expect(response.statusCode).toBe(401);
        });

        it('POST /api/libros debe devolver 401', async () => {
            const response = await request(app).post('/api/libros');
            expect(response.statusCode).toBe(401);
        });
    });

    describe('Con rol incorrecto', () =>{
        it('POST /api/libros debe devolver 403', async () => {
            const response = await request(app)
            .post('/api/libros')
            .set('auth-id', 'test-alumno-001');
            expect(response.statusCode).toBe(403);
        });

        it('DELETE /api/libros debe devolver 403', async () => {
            const response = await request(app)
            .delete('/api/libros/d90ecbf6-1ce5-417a-a59b-3e7f7f4ee265')
            .set('auth-id', 'test-alumno-001');
            expect(response.statusCode).toBe(403);
        });
    });

    const request = require('supertest');
const app     = require('../app');

describe('API Libros', () => {

  // Sin autenticación
  describe('Sin autenticación', () => {
    it('GET /api/libros debe devolver 401', async () => {
      const response = await request(app).get('/api/libros');
      expect(response.statusCode).toBe(401);
    });

    it('POST /api/libros debe devolver 401', async () => {
      const response = await request(app).post('/api/libros');
      expect(response.statusCode).toBe(401);
    });
  });

  // Con rol incorrecto
  describe('Con rol incorrecto', () => {
    it('POST /api/libros con rol alumno debe devolver 403', async () => {
      const response = await request(app)
        .post('/api/libros')
        .set('auth-id', 'test-alumno-001');
      expect(response.statusCode).toBe(403);
    });

    it('DELETE /api/libros/:id con rol alumno debe devolver 403', async () => {
      const response = await request(app)
        .delete('/api/libros/uuid-cualquiera')
        .set('auth-id', 'test-alumno-001');
      expect(response.statusCode).toBe(403);
    });
  });

  // Con autenticación correcta
  describe('Con autenticación correcta', () => {
    it('GET /api/libros debe devolver 200 y un array', async () => {
      const response = await request(app)
        .get('/api/libros')
        .set('auth-id', 'test-admin-001');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /api/libros sin titulo debe devolver 400', async () => {
      const response = await request(app)
        .post('/api/libros')
        .set('auth-id', 'test-admin-001')
        .send({ autor: 'Autor Test' });
      expect(response.statusCode).toBe(400);
    });

    it('GET /api/libros/:id inexistente debe devolver 404', async () => {
      const response = await request(app)
        .get('/api/libros/00000000-0000-0000-0000-000000000000')
        .set('auth-id', 'test-admin-001');
      expect(response.statusCode).toBe(404);
    });
  });

});


});