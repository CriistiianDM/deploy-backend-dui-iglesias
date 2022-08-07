
/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : middelware para validar que solo se puedan ingresar peticiones desde el frontend
*/
const only_petitions_fronted = async (req, res, next) => {
    console.log('holi verificar 12', (req.headers));

    if ((req.headers).origin === 'https://iglesia-pentacostal-colombia.vercel.app') {
        next();
    }
    else {
        res.status(401).send('acceso denegado');
    }
   
}



//exportar el middelware
module.exports = {
    only_petitions_fronted
}