const ListaEsperaModel = require('../models/listaEspera.model');
const LicenciaModel = require('../models/licencia.model');
const { getByUsuario } = require('./prestamo.controller');

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