const PrestamoModel = require('../models/prestamo.model');
const ListaEsperaModel = require('../models/listaEspera.model');
const { pool } = require('../config/database');
const axios = require('axios');
const PrestamoController = {
    async getAll(req, res){
        try{
            const prestamos = await PrestamoModel.getAll();
            res.status(200).json({data: prestamos});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async getActivos(req, res){
        try{
            const prestamos = await PrestamoModel.getActivos();
            res.status(200).json({data: prestamos});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async getByUsuario(req, res){
        try{
            const prestamos = await PrestamoModel.getByUsuario(req.params.usuarioId);
        res.status(200).json({data: prestamos});
        }catch(error){
            res.status(500).json({error: error.message});
        }

        },

        async getProximosAVencer(req, res){
            try{
                const dias = req.query.dias || 3;
                const prestamos = await PrestamoModel.getProximosAVencer(dias);
                res.status(200).json({data: prestamos});
            }catch(error){
                res.status(500).json({error: error.message});
            }
        },

        async create(req, res){
            try{

                const{usuarioId, libroId, diasPrestamo} = req.body;
                if(!usuarioId || !libroId){
                    return res.status(400).json({error: 'El usuario y el libro son obligatorios'});
                }

                const prestamo = await PrestamoModel.create(usuarioId, libroId, diasPrestamo);

                // Notificar al modulo de notificaciones
                const usuario = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuarioId]);
                const libro = await pool.query('SELECT * FROM libros WHERE id = $1', [libroId]);

                await axios.post(process.env.NOTIFICACIONES_PRESTAMO_URL, {
                    userId: usuarioId,
                    prioridad: 'alta',
                    tituloLibro: libro.rows[0].titulo,
                    autorLibro: libro.rows[0].autor,
                    fechaPrestamo: prestamo.fecha_inicio,
                    fechaVencimiento: prestamo.fecha_vencimiento
                }).catch(err => console.error('Error al notificar prestamo', err.message));

                res.status(201).json({data: prestamo});
            }catch (error) {
            if (error.message === 'No hay licencias disponibles para este libro') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
            }
        },

        async devolver(req, res) {
            try {
                const prestamo = await PrestamoModel.devolver(req.params.id);
                if (!prestamo) return res.status(404).json({ error: 'Préstamo no encontrado' });

                const licenciaResult = await pool.query(
                'SELECT libro_id FROM licencias WHERE id = $1',
                [prestamo.licencia_id]
                );
                const libroId = licenciaResult.rows[0]?.libro_id;

                const siguiente = await ListaEsperaModel.getSiguiente(libroId);
                if (siguiente) {
                await ListaEsperaModel.desactivar(siguiente.usuario_id, libroId);
                }


                const libro = await pool.query(
                    'SELECT l.* FROM libros l JOIN licencias lc ON lc.libro_id = l.id WHERE lc.id = $1',
                    [prestamo.licencia_id]
                );

                await axios.post(process.env.NOTIFICACIONES_DEVOLUCION_URL, {
                    userId: prestamo.usuario_id,
                    prioridad: 'alta',
                    tituloLibro: libro.rows[0].titulo,
                    autorLibro: libro.rows[0].autor,
                    fechaPrestamo: prestamo.fecha_inicio,
                    fechaVencimiento: prestamo.fecha_vencimiento
                }).catch(err => console.error('Error al notificar devolucion', err.message));

                res.status(200).json({
                data: prestamo,
                siguienteEnEspera: siguiente || null
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            }
};

module.exports = PrestamoController;