const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const login = async (req, res = response) => {
    const Usuario = require('../models/usuario');
    const { email, password } = req.body;

    try {
        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: "Credentials incorrectas"
            });
        }

        //Verificar password
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password); //

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Credentials incorrectas"
            });
        }

        //Generar token - JWT token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
           token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
};

const googleSignIn  = async (req, res = response) => {
    res.status(500).json({
        ok: true,
        msg:req.body.token
    });
}

module.exports = { 
    login,
    googleSignIn
};