const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    const desde = Number(req.query.desde) || 0;

    /*     const usuarios = await Usuario.find({}, 'nombre email role google')
            .skip(desde)
            .limit(5);
    
        const total = await Usuario.count(); */
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios, //nombre de la propiedad igual al valor de la variable
        total
    });
}

const crearUsuario = async (req, res = response) => {
    const { email, password, nombre } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({ ok: false, msg: 'El correo ya esta registrado ' })
        }

        const usuario = new Usuario(req.body)
        //Encriptar contrasena
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        //Guardar usuario
        await usuario.save();


        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,  //nombre de la propiedad igual al valor de la variable
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Error inesperado... Revise logs' });
    }
}

const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
        return res.status(404).json({
            ok: false,
            msg: 'Usuario no encontrado'
        })
    }
    try {
        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperad. Contactese con el administrador'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {
    //TODO: validar token  y comprobar si el usuario es correcto
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        const { password, google, email, ...campos } = req.body;  //destructuracion de codigo
        if (usuarioDB.email != email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya esta registrado'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}