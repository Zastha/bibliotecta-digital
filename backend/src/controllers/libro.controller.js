const LibroModel = require('../models/libro.model');

const LibroController = {
    async getAll(req, res){
        try{
            const libros = await libroModel.getAll();
            res.status(200).json({data: libros});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async getById(req, res){
        try{
            const libro = await libroModel.getById(req.params.id);
            if(!libro) return res.status(404).json({error: 'Libro no encontrado'});
            res.status(200).json({data: libro});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async create(req, res){
        try{
            const {categorias, ...libro} = req.body;
            if(!libro.titutlo || !libro.autor){
                return res.status(400).json({error: 'El título y el autor son obligatorios'});
            }
            const libroCreado = await LibroModel.create(libro, categorias);
            res.status(201).json({data: libroCreado});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async update(req, res){
        try{
            const libroActualizado = await LibroModel.update(req.params.id,req.body);
            if(!libroActualizado) return res.status(404).json({error: 'Libro no encontrado'});
            res.status(200).json({data: libroActualizado});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async delete(req,res){
        try{
            await LibroModel.delete(req.params.id);
            res.status(200).json({message: 'Libro eliminado Correctamente'});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    }
};

modeule.exports = LibroController;