//librerary
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const taskRouter = require('./routers/task');
const { only_petitions_fronted,
        verificar_post_cr_user  } = require('./middleware/middleware');
const { PORT } = process.env;


//inicializar express
const app = express();

//settings
app.set('port',  4500);



//middleware
app.use(express.json());
app.use(morgan('short'));
app.use(cors());
app.use(only_petitions_fronted);
app.all('/zincrp', verificar_post_cr_user);
app.use(taskRouter);



//listering of server
app.listen(PORT, () => {
    console.log('Server on port', PORT);
});