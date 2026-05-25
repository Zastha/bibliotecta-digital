const { pool } = require('../config/database');

const UsuarioModel = {
    async getAll(){
        const result = await pool.query('SELECT * FROM usuarios ORDER BY nombre ASC');
        return result.rows;
    },
    async getById(id){
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        return result.rows[0];
    },
    async getByAuthId(authId){
        const result = await pool.query('SELECT * FROM usuarios WHERE auth_id = $1', [authId]);
        return result.rows[0];
    },
    async create(usuario){
        const { auth_id, nombre, email, rol } = usuario;
        const result = await pool.query(
            `INSERT INTO usuarios (auth_id, nombre, email, rol)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [auth_id, nombre, email, rol]
        );
        return result.rows[0];
    },


    async update(id, campos) {
    const keys = Object.keys(campos);
    const values = Object.values(campos);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const result = await pool.query(
      `UPDATE usuarios SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  },

   async delete(id) {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  }


    
};


module.exports = UsuarioModel;