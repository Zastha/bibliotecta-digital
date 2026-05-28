const { resolveAuthContext } = require('../utils/auth');

const authMiddleware = async(req, res, next) => {

    try{
        const authContext = await resolveAuthContext(req);

        req.auth = authContext;
        req.usuario = authContext.usuario;

        next();

    }catch(error){
        res.status(error.statusCode || 500).json({error: error.message});
    }
}


module.exports = authMiddleware;