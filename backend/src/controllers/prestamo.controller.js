const PrestamoModel = require('../models/prestamo.model');
const ListaEsperaModel = require('../models/listaEspera.model');

const PrestamoController = {
    async getAll(req, res){
        try{
            const prestamos = await PrestamoModel.getAll();
            res.status(200).json({data: prestamos});
        }catch(error){
            res.status(500).json({error: error.message});
        }
    },

    async getActivos(res, res){
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

        async getProximosAVencer(res, res){
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
                res.status(201).json({data: prestamo});
            }catch (error) {
            if (error.message === 'No hay licencias disponibles para este libro') {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
            }
        },

        async devolver(req, res){
            try{
                const prestamo = await PrestamoModel.devolver(req.params.id);
                if(!prestamo) return res.status(404).json({error: 'Prestamo no encontrado'});

                const licencia = await prestamo.licencia_id;
                const siguiente = await ListaEsperaModel.getSiguiente(licencia);

                if(siguiente){
                    await ListaEsperaModel.desactivar(siguiente.usuario_id, licencia);
                }

                res.status(200).json({
                    data:prestamo,
                    siguienteEnEspera: siguiente || null
                });
            }catch(error){
                res.status(500).json({error: error.message});
            }
        }
};

module.exports = PrestamoController;