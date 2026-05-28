const request = require('supertest');
const app = require('../app');
const { pool } = require('../config/database');

describe('API Lista de Espera', () => {
  it('GET /api/lista-espera con rol alumno debe devolver 200 y su lista', async () => {
    const response = await request(app)
      .get('/api/lista-espera')
      .set('auth-id', 'test-alumno-001');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('GET /api/lista-espera/usuario/:usuarioId con el mismo alumno debe devolver 200', async () => {
    const response = await request(app)
      .get('/api/lista-espera/usuario/870ae30a-35b7-4162-9946-0c9eab4d15d4')
      .set('auth-id', 'test-alumno-001');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('POST /api/lista-espera debe reactivar una entrada inactiva cuando el usuario vuelve a unirse', async () => {
    const usuarioRes = await pool.query(
      'SELECT id FROM usuarios WHERE auth_id = $1 LIMIT 1',
      ['test-alumno-001']
    );
    const libroRes = await pool.query(
      `SELECT l.id
       FROM libros l
       LEFT JOIN licencias lc ON lc.libro_id = l.id AND lc.estado = 'disponible'
       WHERE lc.id IS NULL
       LIMIT 1`
    );

    if (!usuarioRes.rows[0] || !libroRes.rows[0]) {
      throw new Error('No hay usuario o libro disponible para la prueba de reactivación');
    }

    const usuarioId = usuarioRes.rows[0].id;
    const libroId = libroRes.rows[0].id;

    await pool.query(
      `INSERT INTO lista_espera (usuario_id, libro_id, activo)
       VALUES ($1, $2, FALSE)
       ON CONFLICT (usuario_id, libro_id) DO UPDATE SET activo = FALSE`,
      [usuarioId, libroId]
    );

    const response = await request(app)
      .post('/api/lista-espera')
      .set('auth-id', 'test-alumno-001')
      .send({ usuarioId, libroId });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('activo', true);

    const estado = await pool.query(
      'SELECT activo FROM lista_espera WHERE usuario_id = $1 AND libro_id = $2',
      [usuarioId, libroId]
    );

    expect(estado.rows[0].activo).toBe(true);
  });
});
