const UsuarioModel = require('../models/usuario.model');

const UsuarioController = {

  async getAll(req, res) {
    try {
      const usuarios = await UsuarioModel.getAll();
      res.status(200).json({ data: usuarios });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const usuario = await UsuarioModel.getById(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(200).json({ data: usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { auth_id, nombre, email, rol } = req.body;
      if (!auth_id || !nombre || !email || !rol) {
        return res.status(400).json({ error: 'auth_id, nombre, email y rol son requeridos' });
      }
      const usuario = await UsuarioModel.create({ auth_id, nombre, email, rol });
      res.status(201).json({ data: usuario });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Ya existe un usuario con ese email o auth_id' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const usuario = await UsuarioModel.update(req.params.id, req.body);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.status(200).json({ data: usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await UsuarioModel.delete(req.params.id);
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = UsuarioController;