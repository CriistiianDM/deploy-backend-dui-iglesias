
const { generateToken } = require('./../_____/_____');


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  !no olvidar hacer la funcion de encriptacion para validar el token de seguridad
  *  @decs  : middelware para validar que solo se puedan ingresar peticiones desde el frontend
*/
const only_petitions_fronted = async (req, res, next) => {
    //console.log('holi verificar 12', (req.headers),generateToken((req.headers).authorization),(req.headers).authorization);

    if ((req.headers).origin === 'https://iglesia-pentacostal-colombia.vercel.app' ||
        (req.headers).origin === 'http://localhost:3000') {

        if (generateToken((req.headers).authorization)) {
            next();
        }
        else {
            res.status(401).send('acceso denegado');
        }
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
   
    const state = getNameState();
    let index = 0;

    (state).map((item) => {
       
        if (!validateFormate(((req.body)[item.data]),item.type)) {
           res.json({ message: 'error en el formato de los datos' });
        }else {
            index++;
        }
    });

    
    if (index === state.length) {
        next();
    }
}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : middelware para validar que los datos de la peticion crear grupo sean correctos
  *
*/
const verificar_post_cr_group = async (req, res, next) => {

    try {
        const state = get_name_state();
        let index = 0;
        let index_aux = 0;
    
        (state).map((item) => {
           
            if (!validateFormate(((req.body)[item.data]),item.type) && ((req.body)[item.data]) != '') {
               res.json({ message: 'error en el formato de los datos' });
            }

            if (index_aux === 0 && validateFormate(((req.body)[item.data]),item.type)||
               index_aux === 3 && validateFormate(((req.body)[item.data]),item.type)) {
                index++;
            }

            index_aux++;
        });
    
        
        if (index === (state.length - 2 )) {
            next();
        }

    } catch (error) {
        console.log(error);
    }
}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : middelware para validar que los campos de la peticion sean correctos para la asignacion de cargo
  *
*/
const verificar_post_cr_cargo = async (req, res, next) => {

    const state = get_name_state_cargo();
    let index = 0;

    (state).map((item) => {
       
        if (!validateFormate(((req.body)[item.data]),item.type)) {
           res.json({ message: 'error en el formato de los datos' });
        }else {
            index++;
        }
    });

    
    if (index === state.length) {
        next();
    }

}


/*
  ------- funciones complementarias -------
*/


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
        '1': /^[a-zA-Z]{3,50}$/,
        '2': /^[a-zA-Z]{2}$/,
        '3': /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
        '4': /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        '5': /^[a-zA-Z]$/,
        '6': /^[0-9-a-zA-Z\s#\-]{10,255}$/,
        '7': /^[0-9]{1,5}$/,
        '8': /^{[0-9-aA-zZ:,"\s{}]*}$/,
        '9': /^[0-9]{7,15}$/,
        '10': /^[a-zA-Z\s]{3,50}$/,
        '11': /^[0-9-aA-zZ\s\/:.]+$/,
    }

    //validar el formato
    if ((regex[type]).exec(e) != null) {
        return true;
    }
    else {
        return false;
    }

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : retornar el nombre de state a cambiar
*/
function get_name_state() {

    const state = [
      {'data': 'name' , 'type': 10},
      {'data': 'description' , 'type': 10},
      {'data': 'img_data' , 'type': 11},
      {'data': 'id_person', 'type': 7},
    ]
  
    return state;
  
  }


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : retornar el nombre de state a cambiar
*/
function get_name_state_cargo() {
    
    const state = [
        {'data': 'doc' , 'type': 0},
        {'data': 'name_cargo' , 'type': 10},
        {'data': 'id_cargo', 'type': 7},
    ]
    
    return state;
    
}


//exportar el middelware
module.exports = {
    only_petitions_fronted,
    verificar_post_cr_user,
    verificar_post_cr_group,
    verificar_post_cr_cargo
}