const UsuarioModel = require('../models/usuario.model');

const authMiddleware = async(req, res, next) => {

    try{

        //Si no fuera una simulacion recibiriamos un JWT encripatdo
        //El cual tendriamos que decriptar para ver si es valido
        //Pero por ahora usaremos el auth-id
        const authId = req.headers['auth-id'];
        if(!authId){
            return res.status(401).json({error: 'No autorizado, auth-id requerido'});
        }


        const usuario = await UsuarioModel.getByAuthId(authId);

        if(!usuario){
            return res.status(401).json({error: 'Usuario no encontrado'});
        }

        //Se agrega usuario a peticion para poder ser usado en el controlador
        req.usuario = usuario;

        next();

    }catch(error){
        res.status(500).json({error: error.message});
    }
}


module.exports = authMiddleware;