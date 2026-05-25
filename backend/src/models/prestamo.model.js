const { pool } = require('../config/database');
const LicenciaModel = require('./licencia.model');

const conTransaccion = async (operacion) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const resultado = await operacion(client);
    await client.query('COMMIT');
    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const PrestamoModel = {

  async getAll() {
    const result = await pool.query(`
      SELECT p.*, 
             u.nombre AS usuario_nombre,
             li.titulo AS libro_titulo
      FROM prestamos p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN licencias lc ON p.licencia_id = lc.id
      JOIN libros li ON lc.libro_id = li.id
      ORDER BY p.fecha_inicio DESC
    `);
    return result.rows;
  },

  async getByUsuario(usuarioId) {
    const result = await pool.query(`
      SELECT p.*,
             li.titulo AS libro_titulo
      FROM prestamos p
      JOIN licencias lc ON p.licencia_id = lc.id
      JOIN libros li ON lc.libro_id = li.id
      WHERE p.usuario_id = $1
      ORDER BY p.fecha_inicio DESC
    `, [usuarioId]);
    return result.rows;
  },

  async getActivos() {
    const result = await pool.query(`
      SELECT p.*,
             u.nombre AS usuario_nombre,
             li.titulo AS libro_titulo
      FROM prestamos p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN licencias lc ON p.licencia_id = lc.id
      JOIN libros li ON lc.libro_id = li.id
      WHERE p.estado = 'activo'
      ORDER BY p.fecha_vencimiento ASC
    `);
    return result.rows;
  },

  async getProximosAVencer(dias = 3) {
    const result = await pool.query(`
      SELECT p.*,
             u.nombre AS usuario_nombre,
             u.email AS usuario_email,
             li.titulo AS libro_titulo
      FROM prestamos p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN licencias lc ON p.licencia_id = lc.id
      JOIN libros li ON lc.libro_id = li.id
      WHERE p.estado = 'activo'
      AND p.fecha_vencimiento <= NOW() + INTERVAL '1 day' * $1
      ORDER BY p.fecha_vencimiento ASC
    `, [dias]);
    return result.rows;
  },

  async create(usuarioId, libroId, diasPrestamo = 14) {
    return conTransaccion(async (client) => {

      const prestamoActivo = await client.query(
        `SELECT p.id FROM prestamos p
        JOIN licencias lc ON p.licencia_id = lc.id
        WHERE lc.libro_id = $1 AND p.usuario_id = $2 AND p.estado = 'activo'`,
        [libroId, usuarioId]
      );


      if (prestamoActivo.rows[0]) throw new Error('Ya tienes un préstamo activo para este libro');
      
      const licencia = await LicenciaModel.getDisponiblesByLibro(libroId);
      if (!licencia) throw new Error('No hay licencias disponibles para este libro');

      await client.query(
        'UPDATE licencias SET estado = $1 WHERE id = $2',
        ['prestada', licencia.id]
      );

      const result = await client.query(
        `INSERT INTO prestamos (licencia_id, usuario_id, fecha_vencimiento)
         VALUES ($1, $2, NOW() + INTERVAL '1 day' * $3) RETURNING *`,
        [licencia.id, usuarioId, diasPrestamo]
      );
      return result.rows[0];
    });
  },

  async devolver(id) {
    return conTransaccion(async (client) => {
      const prestamo = await client.query(
        'SELECT * FROM prestamos WHERE id = $1', [id]
      );
      if (!prestamo.rows[0]) throw new Error('Préstamo no encontrado');

      await client.query(
        'UPDATE licencias SET estado = $1 WHERE id = $2',
        ['disponible', prestamo.rows[0].licencia_id]
      );

      const result = await client.query(
        `UPDATE prestamos SET estado = 'devuelto', fecha_devolucion = NOW() 
         WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    });
  }

};

module.exports = PrestamoModel;