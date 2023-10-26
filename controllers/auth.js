const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const Usuario = require('../models/usuario');


const login = async (req, res = response) => {
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

const googleSignIn = async (req, res = response) => {
    try {
        const {email, name, picture} = await googleVerify(req.body.token);
        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if (!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: 'XXX',
                img:picture,
                google: true

            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en DB
        await usuario.save();

        //Generar token - JWT token
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok: true,
            email, name, picture,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: "Token de Google no es válido"
        });


    }
}

module.exports = {
    login,
    googleSignIn
};