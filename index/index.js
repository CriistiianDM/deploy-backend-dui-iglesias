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


//middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(taskRouter);


//listering of server
app.listen(PORT, () => {
    console.log('Server on port', PORT);
});