
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
    console.log(req.body, req.params, 'holi verificar');
    const state = getNameState();

    (state).map((item) => {
        console.log(item.data, validateFormate(((req.body)[item.data]),item.type) ,'trending toping',((req.body)[item.data]));
    });

    next();
}



/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : retornar el nombres de los parametros no nulos
*/
function getNameState() {

    const state = [
        { 'data': 'doc', 'type': 0 },
        { 'data': 'first_name', 'type': 1 },
        { 'data': 'first_last_name', 'type': 1 },
        { 'data': 'doc_type', 'type': 2 },
        { 'data': 'birth_date', 'type': 3 },
        { 'data': 'email', 'type': 4 },
        { 'data': 'phone_1', 'type': 9 },
        { 'data': 'gender', 'type': 5 },
        { 'data': 'address', 'type': 6 },
        { 'data': 'place_birth', 'type': 7 },
        { 'data': 'baptism_date', 'type': 3 },
        { 'data': 'baptism_place_id', 'type': 7 },
        { 'data': 'holy_spirit_date', 'type': 3 },
        { 'data': 'date_init_church', 'type': 3 },
    ]

    return state;

}

/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : Validar formatos
*/
function validateFormate(e, type) {

    //expresssion regular 
    var regex = {
        '0': /^[0-9]{9,15}$/,
        '1': /^[aA-zZ]{3,50}$/,
        '2': /^[aA-zZ]{2}$/,
        '3': /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
        '4': /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        '5': /^[a-zA-Z]$/,
        '6': /^[0-9-a-zA-Z\s#\-]{10,255}$/,
        '7': /^[0-9]{1,5}$/,
        '8': /^{[0-9-aA-zZ:,"\s{}]*}$/,
        '9': /^[0-9]{7,15}$/,
    }

    //validar el formato
    if ((regex[type]).exec(e) != null) {
        return true;
    }
    else {
        return false;
    }

}




//exportar el middelware
module.exports = {
    only_petitions_fronted,
    verificar_post_cr_user
}