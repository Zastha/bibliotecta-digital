const UsuarioModel = require('../models/usuario.model');

const authMiddleware = async(req, res, next) => {

    try{
        const authId = req.headers['auth-id'];
        if(!authId){
            return res.status(401).json({error: 'No autorizado, auth-id requerido'});
        }


        //TODO: Si se consigue un contranto con el equipo de autenticacion 
        // Haremos una peticion a la api de autenticacion para validar el token
        // Por ahora simularemos la validacion buscando el usuario en la base de datos

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