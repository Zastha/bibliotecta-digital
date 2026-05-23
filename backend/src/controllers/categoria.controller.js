const CategoriaModel = require('../models/categoria.model');

const CategoriaController = {


    async getAll(req, res) {
    try {
      const categorias = await CategoriaModel.getAll();
      res.status(200).json({ data: categorias });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const categoria = await CategoriaModel.getById(req.params.id);
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
      res.status(200).json({ data: categoria });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { nombre } = req.body;
      if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });
      const categoria = await CategoriaModel.create(nombre);
      res.status(201).json({ data: categoria });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
      }
      res.status(500).json({ error: error.message });
    }
  },

    async delete(req, res) {
    try {
      await CategoriaModel.delete(req.params.id);
      res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = CategoriaController;