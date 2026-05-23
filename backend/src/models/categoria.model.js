const { pool } = require('../config/database');

const CategoriaModel = {

    async getAll(){
        const result = await pool.query('SELECT * FROM categorias Order by nombre ASC');
        return result.rows;
    },

    async getById(id){
        const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
        return result.rows[0];
    },

    async create(nombre){
        const result = await pool.query(
            'INSERT INTO categorias (nombre) VALUES ($1) RETURNING *',
            [nombre]
        );
        return result.rows[0];
    },

    async delete(id){
        await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    }

};

module.exports = CategoriaModel;