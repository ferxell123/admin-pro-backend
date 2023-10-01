const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) => {
    //leer tokern
    const token = req.header('x-token');
    if (!token) {
        res.status(401).json({
            ok: false,
            msg: 'No hay token provided'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid; 
        next();
    } catch (error) {
        res.status(401).json({
            ok: false,
             msg:'Token no valido'});
    }


}

module.exports = { validarJWT }