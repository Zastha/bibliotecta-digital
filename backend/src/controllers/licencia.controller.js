const LicenciaModel = require('../models/licencia.model');

const LicenciaController = {

    async getAll(req, res){
        try{
            const licencias = await LicenciaModel.getAll();
            res.status(200).json({data: licencias});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async getByLibro(req,res){
        try{
            const licencias = await LicenciaModel.getByLibro(req.params.id);
            res.status(200).json({data: licencias});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async create(req, res){
        try{
            const {libroId} = req.body;
            if(!libroId) return res.status(400).json({error: 'libroId es requerido'});
            const licencia = await LicenciaModel.create(libroId);
            res.status(201).json({data: licencia});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async delete(req, res){
        try{
            await LicenciaModel.delete(req.params.id);
            res.status(200).json({message: 'Licencia eliminada correctamente'});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }


};

module.exports = LicenciaController;