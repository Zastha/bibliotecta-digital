const {pool} = require('../config/database');

const LicenciaModel = {

    async getAll(){
        const result = await pool.query(
            `SELECT l.*, li.titulo as libro_titulo
            From licencias l
            join libros li on l.libro_id = li.id
            ORDER BY li.titulo ASC`
        );
        return result.rows;
    },

    async getByLibro(libroId){
        const result = await pool.query(
            'SELECT * FROM licencias where libro_id = $1',
            [libroId]
        );
        return result.rows;
    },

    async getDisponiblesByLibro(libroId){
        const result = await pool.query(
            'SELECT * FROM licencias where libro_id = $1 and estado = $2 LIMIT 1',
            [libroId, 'disponible']
        );

        return result.rows[0];
    },

    async create(libroId){
        const result = await pool.query(
            'INSERT INTO licencias (libro_id) VALUES ($1) RETURNING *',
            [libroId]
        );

        return result.rows[0];
    },

    async updateEstado(id, estado){
        const result = await pool.query(
            'UPDATE licencias SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, id]
        );

        return result.rows[0];
    },

    async delete(id){
        await pool.query(
            'DELETE FROM licencias WHERE id = $1',
            [id]
        );
    }


};

module.exports = LicenciaModel;