
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
    console.log( req.body, req.params,'holi verificar');
    const state = getNameState();
    
    (state).map( (item) => {
        console.log(item,'trending toping');
    });
    
    next();
}



/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : retornar el nombres de los parametros no nulos
*/
function getNameState() {

    const state = [
        {'data': 'doc'},
        {'data': 'first_name'},
        {'data': 'first_last_name'},
        {'data': 'doc_type'},
        {'data': 'birth_date'},
        {'data': 'email'},
        {'data': 'phone_1'},
        {'data': 'gender'},
        {'data': 'address'},
        {'data':  'place_birth'},
        {'data': 'baptism_date'},
        {'data': 'baptism_place_id'},
        {'data': 'holy_spirit_date'},
        {'data': 'date_init_church'}
    ]

    return state;

}





//exportar el middelware
module.exports = {
    only_petitions_fronted,
    verificar_post_cr_user
}