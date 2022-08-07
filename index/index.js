//librerary
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const taskRouter = require('./routers/task');
const { PORT } = process.env;


//inicializar express
const app = express();

//settings
app.set('port',  4500);

const only_petitions_fronted = async (req, res, next) => {
    //ver el host de donde viene la peticion
    //console.log('holi verificar',req);
    //ver kheaders de la peticion
    console.log('holi verificar 12', (req.headers).origin);

    if ((req.headers).origin === 'https://iglesia-pentacostal-colombia.vercel.app') {
        next();
    }
    else {
        res.status(401).send('no se puede acceder');
    }
   
}

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