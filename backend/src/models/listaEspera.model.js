const { pool } = require('../config/database');

const ListaEsperaModel = {

   async getAll() {
  const result = await pool.query(`
    SELECT le.*,
           u.nombre AS usuario_nombre,
           u.email AS usuario_email,
           li.titulo AS libro_titulo
    FROM lista_espera le
    JOIN usuarios u ON le.usuario_id = u.id
    JOIN libros li ON le.libro_id = li.id
    WHERE le.activo = TRUE
    ORDER BY le.created_at ASC
  `);
  return result.rows;
}, 
  async getByLibro(libroId) {
    const result = await pool.query(`
      SELECT le.*,
             u.nombre AS usuario_nombre,
             u.email AS usuario_email
      FROM lista_espera le
      JOIN usuarios u ON le.usuario_id = u.id
      WHERE le.libro_id = $1 AND le.activo = TRUE
      ORDER BY le.created_at ASC
    `, [libroId]);
    return result.rows;
  },

  async getByUsuario(usuarioId) {
    const result = await pool.query(`
      SELECT le.*,
             li.titulo AS libro_titulo
      FROM lista_espera le
      JOIN libros li ON le.libro_id = li.id
      WHERE le.usuario_id = $1 AND le.activo = TRUE
      ORDER BY le.created_at ASC
    `, [usuarioId]);
    return result.rows;
  },

  async create(usuarioId, libroId) {
    const result = await pool.query(
      `INSERT INTO lista_espera (usuario_id, libro_id) 
       VALUES ($1, $2) RETURNING *`,
      [usuarioId, libroId]
    );
    return result.rows[0];
  },

  async desactivar(usuarioId, libroId) {
    const result = await pool.query(
      `UPDATE lista_espera SET activo = FALSE 
       WHERE usuario_id = $1 AND libro_id = $2 RETURNING *`,
      [usuarioId, libroId]
    );
    return result.rows[0];
  },

  async getSiguiente(libroId) {
    const result = await pool.query(`
      SELECT le.*,
             u.nombre AS usuario_nombre,
             u.email AS usuario_email
      FROM lista_espera le
      JOIN usuarios u ON le.usuario_id = u.id
      WHERE le.libro_id = $1 AND le.activo = TRUE
      ORDER BY le.created_at ASC
      LIMIT 1
    `, [libroId]);
    return result.rows[0];
  }

};

module.exports = ListaEsperaModel;