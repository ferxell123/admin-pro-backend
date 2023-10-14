const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        //borrar la imagen anterior
        fs.unlinkSync(path);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {
    console.log("Actualizar imagen")
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No existe medico con ese id');
                return false;
            }
            const pathViejo = `./uploads/${tipo}/${medico.img}`;
            borrarImagen(pathViejo);
            medico.img = nombreArchivo;
            await medico.save();
            return true
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No existe hospital con ese id');
                return false;
            }
            const pathHospitalViejo = `./uploads/${tipo}/${hospital.img}`;
            borrarImagen(pathHospitalViejo);
            hospital.img = nombreArchivo;
            await hospital.save();
            return true

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No existe usuario con ese id');
                return false;
            } 
            const pathUsuarioViejo = `./uploads/${tipo}/${usuario.img}`;
            borrarImagen(pathUsuarioViejo);
            usuario.img = nombreArchivo;
            await usuario.save();
            return true

    }
}




module.exports = {
    actualizarImagen
}