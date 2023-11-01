/*
    Path '/api/login'
*/
const { Router } = require('express');
const { login, googleSignIn, renewToken  } = require('../controllers/auth'); //importamos el controlador que creamos en controllers/auth.js(login)
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router();
router.post('/',
    [
        check('email', 'El email es requerido').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos   
    ],
    login
);
router.post('/google',
    [
        check('token', 'El Token de google es obligatorio').not().isEmpty(),
        validarCampos   
    ],
    googleSignIn
);

router.get('/renew',
    validarJWT,
    renewToken  
);

module.exports = router;




