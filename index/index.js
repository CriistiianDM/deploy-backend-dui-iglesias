//librerary
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const taskRouter = require('./routers/task');
const { only_petitions_fronted } = require('./middleware/middleware');
const { PORT } = process.env;


//inicializar express
const app = express();

//settings
app.set('port',  4500);

/*
   TODO: mañana hacer un archivo pa los middlewares y empezar por esta parte
   ? primer avance de seguridad para las peticiones y backedend
   ! no olvidar hacer una funcion de encriptacion para la clave de acceso para las peticiones y esta cambiaria automaticamente cada dia

const only_petitions_fronted = async (req, res, next) => {
    console.log('holi verificar 12', (req.headers));

    if ((req.headers).origin === 'https://iglesia-pentacostal-colombia.vercel.app') {
        next();
    }
    else {
        res.status(401).send('acceso denegado');
    }
   
}*/

//verfificar como llegan los datos
const verificar = async (req, res, next) => {
    console.log( await req.body,await req.params,'holi verificar');
    next();
}


//middleware
app.use(express.json());
app.use(morgan('short'));
app.use(cors());
app.use(only_petitions_fronted);
app.all('/zincrp', verificar);
app.use(taskRouter);



//listering of server
app.listen(PORT, () => {
    console.log('Server on port', PORT);
});