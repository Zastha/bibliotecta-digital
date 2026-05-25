const { pool } = require('../config/database');

const LIBRO_CON_CATEGORIAS = `
  SELECT l.*, ARRAY_AGG(c.nombre) AS categorias
  FROM libros l
  LEFT JOIN libro_categorias lc ON l.id = lc.libro_id
  LEFT JOIN categorias c ON lc.categoria_id = c.id
`;

const actualizarCategorias = async (client, libroId, categorias) => {
  await client.query('DELETE FROM libro_categorias WHERE libro_id = $1', [libroId]);
  for (const categoriaId of categorias) {
    await client.query(
      'INSERT INTO libro_categorias (libro_id, categoria_id) VALUES ($1, $2)',
      [libroId, categoriaId]
    );
  }
};

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

const LibroModel = {

  async getAll() {
    const result = await pool.query(`
      ${LIBRO_CON_CATEGORIAS}
      GROUP BY l.id
      ORDER BY l.titulo ASC
    `);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`
      ${LIBRO_CON_CATEGORIAS}
      WHERE l.id = $1
      GROUP BY l.id
    `, [id]);
    return result.rows[0];
  },

  async create(libro, categorias = []) {
    return conTransaccion(async (client) => {
      const { titulo, autor, isbn, descripcion, imagen_portada } = libro;
      const result = await client.query(
        `INSERT INTO libros (titulo, autor, isbn, descripcion, imagen_portada)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [titulo, autor, isbn, descripcion, imagen_portada]
      );
      const libroCreado = result.rows[0];
      await actualizarCategorias(client, libroCreado.id, categorias);
      return libroCreado;
    });
  },

  async update(id, campos) {
    const { categorias, ...camposLibro } = campos;
    return conTransaccion(async (client) => {
      let libroActualizado;
      if (Object.keys(camposLibro).length > 0) {
        const keys = Object.keys(camposLibro);
        const values = Object.values(camposLibro);
        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
        const result = await client.query(
          `UPDATE libros SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
          [...values, id]
        );
        libroActualizado = result.rows[0];
      }
      if (categorias) await actualizarCategorias(client, id, categorias);

      const resultado = await client.query(`
          SELECT l.*, ARRAY_AGG(c.nombre) AS categorias
          FROM libros l
          LEFT JOIN libro_categorias lc ON l.id = lc.libro_id
          LEFT JOIN categorias c ON lc.categoria_id = c.id
          WHERE l.id = $1
          GROUP BY l.id
        `, [id]);
    
      return resultado.rows[0];
    });
  },

  async delete(id) {
    await pool.query('DELETE FROM libros WHERE id = $1', [id]);
  }

};

module.exports = LibroModel;