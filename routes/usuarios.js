/*
    Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { getUsuarios, crearUsuario, actualizarUsuario,borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();



router.get('/',validarJWT, getUsuarios);
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener 8 caracteres como minimo').isLength({ min: 8 }),
        validarCampos
    ],
    crearUsuario);

router.put('/:id',
[
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role  es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarUsuario
    );

    router.delete('/:id',
         validarJWT,
        borrarUsuario
    );

module.exports = router;