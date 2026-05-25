const ListaEsperaModel = require('../models/listaEspera.model');
const LicenciaModel = require('../models/licencia.model');
const { getByUsuario } = require('./prestamo.controller');
const { pool } = require('../config/database');

const ListaEsperaController = {
    async getAll(req, res){
        try{
            const lista = await ListaEsperaModel.getAll();
            res.status(200).json({data: lista});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async getByLibro(req, res){

        try{
            
        const lista = await ListaEsperaModel.getByLibro(req.params.libroId);
        res.status(200).json({data: lista});


        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async getByUsuario(req, res){
        try{
            const lista = await ListaEsperaModel.getByUsuario(req.params.getByUsuario);
            res.status(200).json({data: lista});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async create(req, res){
        try{
            const {usuarioId, libroId} = req.body;
            if(!usuarioId || !libroId){
                return res.status(400).json({error: 'El usuario y el libro son obligatorios'});
            }

            const prestamoActivo = await pool.query(
                `SELECT p.id FROM prestamos p
                JOIN licencias lc ON p.licencia_id = lc.id
                WHERE lc.libro_id = $1 AND p.usuario_id = $2 AND p.estado = 'activo'`,
                [libroId, usuarioId]
                );
                if (prestamoActivo.rows[0]) {
                return res.status(400).json({ error: 'Ya tienes este libro prestado, no puedes unirte a la lista de espera' });
                }

            const licenciaDisponible = await LicenciaModel.getDisponiblesByLibro(libroId);
            if(licenciaDisponible){
                return res.status(400).json({error: 'Hay licencias disponibles, no es necesario entrar a la lista de espera'});
            }

            const entrada = await ListaEsperaModel.create(usuarioId, libroId);
            res.status(201).json({data: entrada});
        }catch(error){

            if(error.code === '23505'){
                return res.status(400).json({error: 'El usuario ya esta en la lista de espera'});
            }
            res.status(500).json({error: error.message});
        }
    },

    async desactivar(req, res){
        try{
            const {usuarioId, libroId} = req.body;

            if(!usuarioId || !libroId){
                return res.status(400).json({error: 'El usuario y el libro son obligatorios'});
            }

            const entrada = await ListaEsperaModel.desactivar(usuarioId, libroId);

            if(!entrada) return res.status(404).json({error: 'Entrada no encontrada'});

            res.status(200).json({data: entrada});

        }catch(error){
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = ListaEsperaController;