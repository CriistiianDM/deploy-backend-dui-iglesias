
/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  !no olvidar hacer la funcion de encriptacion para validar el token de seguridad
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


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : middelware para validar que los datos de la peticion sean correctos
*/
const verificar_post_cr_user = async (req, res, next) => {
    console.log( await req.body,await req.params,'holi verificar');
    next();
}


//exportar el middelware
module.exports = {
    only_petitions_fronted,
    verificar_post_cr_user
}