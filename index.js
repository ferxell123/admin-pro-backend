require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { main } = require('./database/config')

//Crear el servidor express
const app = express();

//Configurar CORS
app.use(cors());

//No es necesario
//main();

console.log(process.env);
//Rutas
app.get('/', (req, res)=>{
    res.json({
        ok: true,
        msg: 'Hola mundo'
    })
} )


app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto '+process.env.PORT);
    
})