//librerary
const pool = require('../bd');
const { application } = require('express');

const petitions_get = async (req, res) => {

    try {
        //const answer = await pool.query('SELECT * FROM city');
        //console.log('req.body', answer);
        res.send(__dirname + '/archivos/');
    } catch (error) {
        console.log(error, 'error');
    }

}

/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : comsulta para vericar si el login es correcto
*/
const petitions_get_login = async (req, res) => {
    //try catch para capturar errores
    try {
        //variables para capturar los parametros
        const { doc, passwd } = req.params;
        //consulta
        const answer = await pool.query('SELECT doc FROM user_account WHERE doc = $1 AND passwd = $2 AND logical_erase = false', [doc, passwd]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);
    } catch (error) {
        console.log(error, 'error');
    }
}
/**
  *  @author : Juan Sebastian Camino Muñoz <juan.camino@correounivalle.edu.co>
  *  @decs  : verificar cuantos cargos existen en la Base de datos que no tiene el usuario
*/
const petitions_get_cargoFaltantesUser = async (req, res)=>{
    try {
        //variables para capturar los parametros
        const { doc } = req.params;

        const answer = await pool.query('SELECT id,name FROM position_librarian WHERE id NOT IN(SELECT position_id FROM person_position WHERE person_id IN (SELECT id FROM person WHERE doc = $1 AND logical_erase = false))', [doc])
        res.json(answer.rows);
    } catch (error) {
     console.log(error, 'error'); 
    }
}
/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  TODO : PELIGRO NIVEL TUMBA SERVIDOR -- EL BUCLE VA A SU BOLA CON LA INTERACIONES
  *  @decs  : verificar cuantos cargos tiene vigentes el usuario
*/
const petitions_get_cargo_vigigentes = async (req, res) => {
    //try catch para capturar errores
    try {

        //variables para capturar los parametros
        const { doc } = req.params;
        let id_person = 0;
        let date_js = new Date();
        let answer2;
        let categoria_vigente = '';
        let index_answer2 = 0;
        let index = 0

        //conseguir el id de la persona de la tabla person atreves de su documento
        const answer = await pool.query('SELECT id FROM person WHERE doc = $1 AND logical_erase = false', [doc]);
        //res.json(answer.rows);
        if ((answer.rows[0]) !== undefined) {

            id_person = answer.rows[0].id;

            //consulta para obtener los id de los cargos y el tiempo de vigencia
            answer2 = await pool.query('SELECT period_id, position_id  FROM person_position WHERE person_id = $1 AND logical_erase = false', [id_person]);
            //guardar cuntos registros tiene la consulta
            index_answer2 = (answer2.rows).length;
            console.log('answer2', (answer2.rows).length, 'numero de cargos',(answer2.rows));
            //recorrer el arreglo para obtener el tiempo de vigencia for each
            answer2.rows.forEach(async (element) => {
                console.log(categoria_vigente, 'categoria_vigente parte inicia',index);
                //consulta para obtener la fecha de fin de vigencia
                const answer3 = await pool.query('SELECT date_end FROM periodo WHERE id = $1 AND logical_erase = false', [element.period_id]);
                //consulta para obtener la categoria del cargo
                const answer4 = await pool.query('SELECT name FROM position_librarian WHERE id = $1 AND logical_erase = false', [element.position_id]);
                const year_end = ((((answer3.rows[0]).date_end)).toLocaleDateString()).split('/');
                const year_now = (date_js.toLocaleDateString()).split('/');
                console.log('year_end', year_end, year_now);

                //comparar la fecha de fin de vigencia con la fecha actual
                if (Number(year_end[2]) > Number(year_now[2])) {
                    //este cargo es vigente 
                    //consulta para obtener el nombre del cargo
                    categoria_vigente += `${(answer4.rows[0]).name},`;
                }
                else if (Number(year_end[2]) === Number(year_now[2])) {

                    //verificar el mes
                    if (Number(year_end[0]) > Number(year_now[0])) {
                        // tiene viginte el cargo pero proximo a vencer
                        console.log('no entro papa noel',categoria_vigente);
                        categoria_vigente += (`${(answer4.rows[0]).name},`);
                    }
                    else if (Number(year_end[0]) === Number(year_now[0])) {

                        //verificar el dia
                        if (Number(year_end[1]) > Number(year_now[1])) {
                            //tiene viginte el cargo pero proximo a vencer
                            categoria_vigente += `${(answer4.rows[0]).name},`
                        }
                        else {
                            //si el dia es el mismo o menor se cambia el borrado logico a true
                            vigencia_cargo_actuliazcion(element.period_id);
                        }

                    }
                    else {
                        console.log('no entro', year_end[1], year_now[1]);
                        //si el mes es menor cambiar a true el borrado logico de ese periodo
                        vigencia_cargo_actuliazcion(element.period_id);
                    }

                }
                else {
                    //si el año es menor cambiar a true el borrado logico de ese periodo
                    vigencia_cargo_actuliazcion(element.period_id);
                }

                console.log(index === (index_answer2 - 1), 'parte media',index);
                if (index === (index_answer2 - 1)) {
                    console.log(categoria_vigente,index,index_answer2 - 1, 'antes de enviarla');
                    categoria_vigente = `${categoria_vigente.substring(0, categoria_vigente.length - 1)}`;
                    console.log(categoria_vigente,index,index_answer2 - 1, 'final');
                    res.json(categoria_vigente);
                }

                console.log(categoria_vigente, 'categoria_vigente parte final',index);
                index++

            });

        }
        else {
            res.send('no tiene cargos');
        }


    } catch (error) {
        console.log(error, 'error');
    }
}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : fecht para actulizar dentro de los controles como una funcion auxiliar
*/
async function vigencia_cargo_actuliazcion(id) {

    try {

        //fetch
        const response = await fetch(`http://localhost:4500/zuppt/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        //convertir la respuesta a json
        const json = await response.json();
        console.log('json', json);

    } catch (error) {
        console.log(error, 'error');
    }

}



/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : actulizar el borrado logico de un registro de la tabla periodo
*/
const petitions_put_periodo = async (req, res) => {

    //try catch para capturar errores
    try {
        //variables para capturar los parametros
        const { id } = req.params;
        //consulta
        const answer = await pool.query('UPDATE periodo SET logical_erase = true WHERE id = $1', [id]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);
    } catch (error) {
        console.log(error, 'error');
    }

}

/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : get para obtener el primer nombre y apellido de un usuario
*/
const petitions_get_user = async (req, res) => {

    //try catch para capturar errores
    try {
        //variables para capturar los parametros
        const { doc } = req.params;
        //consulta
        const answer = await pool.query('SELECT first_name ,  first_last_name FROM person WHERE doc = $1 AND logical_erase = false', [doc]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);
    } catch (error) {
        console.log(error, 'error');
    }

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : get para mostrar todos los usuarios activos
*/
const petitions_get_all_user_active = async (req, res) => {

    //try catch para capturar errores
    try {
        //consulta
        const answer = await pool.query('SELECT id , first_name ,  first_last_name , doc FROM person WHERE logical_erase = false ');
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);
    } catch (error) {
        console.log(error, 'error');
    }

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : get para saber si el usuario ya existe
*/
const petitions_get_user_exist = async (req, res) => {

    try {
        //variables para capturar los parametros
        const { doc } = req.params;
        //consulta
        const answer = await pool.query('SELECT doc FROM user_account WHERE doc = $1 AND logical_erase = false', [doc]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);

    } catch (error) {
        console.log(error, 'error');
    }

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : get para saber si el email ya existe
*/
const petitions_get_email_exist = async (req, res) => {

    try {

        //variables para capturar los parametros
        const { email } = req.params;
        //consulta
        const answer = await pool.query('SELECT email FROM person WHERE email = $1 AND logical_erase = false', [email]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);


    } catch (error) {
        console.log(error, 'error');
    }

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : get para obtener los nombres de los paises,regiones y ciudades
*/
const petitions_get_all_country = async (req, res) => {

    try {

        const { id, consult } = req.params;

        //consulta
        if (id === '1') {

            const answer = await pool.query('SELECT id , name FROM country');
            console.log('req.body', answer);
            //retonar la respuesta
            res.json(answer.rows);

        }
        if (id === '2') {

            const answer = await pool.query('SELECT id,name FROM region WHERE country_id = $1 AND logical_erase = false', [consult]);
            console.log('req.body', answer);
            //retonar la respuesta
            res.json(answer.rows);

        }
        if (id === '3') {

            const answer = await pool.query('SELECT id,name FROM city WHERE region_id = $1 AND logical_erase = false', [consult]);
            console.log('req.body', answer);
            //retonar la respuesta
            res.json(answer.rows);

        }



    } catch (error) {
        console.log(error, 'error');
    }

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : post para crear un usuario
*/
const petitions_post_user = async (req, res) => {

    try {

        //variables para capturar los parametros
        const { doc,
            doc_from,
            doc_type,
            first_name,
            second_name,
            first_last_name,
            second_last_name,
            birth_date,
            email,
            phone_1,
            phone_2,
            gender,
            address,
            type_person,
            place_birth,
            baptism_date,
            baptism_place_id,
            holy_spirit_date,
            date_init_church,
            experience_json,
            id_church_now
        } = req.body;


        //insertar usuario
        const answer1 = await pool.query(`INSERT INTO user_account (id, doc, passwd, logical_erase) VALUES (nextval('user_seq'), $1, $1, false)`, [doc]);
        const consult_1 = await pool.query(`SELECT id FROM user_account WHERE doc = $1 AND logical_erase = false`, [doc]);
        const id_user = consult_1.rows[0].id;
        //consulta
        const answer2 = await pool.query(`INSERT INTO person ( id, doc , doc_type , doc_from , first_name , second_name , 
                                                              first_last_name , second_last_name, birth_date , email , phone_1 , phone_2 , gender , type_person ,
                                                              id_user , place_birth , logical_erase,diretion) VALUES 
                                                              (nextval('person_seq'), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
            [doc, doc_type, doc_from, first_name, second_name, first_last_name, second_last_name, birth_date, email, phone_1, phone_2, gender, type_person, id_user, place_birth, false, address]);
        //console.log('req.body', answer);

        const consult_2 = await pool.query(`SELECT id FROM person WHERE doc = $1 AND logical_erase = false`, [doc]);
        const id_person = consult_2.rows[0].id

        //insert a tabla person_eclesial
        const answer3 = await pool.query(`INSERT INTO person_eclesial (id, person_id , baptism_date, baptism_place_id, holy_spirit_date, date_init_church, experience_json, id_church_now, logical_erase) VALUES (nextval('person_eclesial_seq'), $1, $2, $3, $4, $5, $6, $7, false)`, [id_person, baptism_date, baptism_place_id, holy_spirit_date, date_init_church, experience_json, id_church_now]);

        const answer4 = await pool.query(`INSERT INTO person_position (id, name , person_id , position_id, period_id , id_group ,logical_erase) VALUES (nextval('person_position_seq'), 'creyente', $1, 1, 1,NULL, false)`, [id_person]);

        console.log('req.body', answer4);
        //retonar la respuesta
        res.json({ message: 'ok' });


    } catch (error) {
        console.log(error, 'error');

    }

}



/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : get para obtener toda la informacion de un usuario
*/
const petitions_get_info_user = async (req, res) => {

    try {

        //variables para capturar los parametros
        const { doc } = req.params;
        //consulta
        const answer = await pool.query(`SELECT * FROM person AS t1 JOIN person_eclesial AS t2 ON t1.id = t2.person_id WHERE t1.logical_erase = false AND t2.logical_erase = false AND t1.doc = $1 `, [doc]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);
    }
    catch (error) {
        console.log(error, 'error');
    }

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : post para guaradar archivos
*/
const petitions_post_file = async (req, res) => {

    try {

        res.json({ message: 'ok' });

    } catch (error) {
        console.log(error, 'error');

    }

}



/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : post para crear un grupo
*/
const petitions_post_group = async (req, res) => {

    try {

        //variables para capturar los parametros
        const { name, description,id_person } = req.body;

        //insertar usuario
        const answer = await pool.query(`INSERT INTO groups_eclesial  (id, name, description, status , url_img , logical_erase) VALUES (nextval('groups_seq'), $1, $2, 'activo', $3, false)`, [name, description, application['img']]);
        const comsult_id_group = await pool.query(`SELECT id FROM groups_eclesial WHERE name = $1 AND logical_erase = false`, [name]);
        const id_group = comsult_id_group.rows[0].id;
        const answer2 = await pool.query(`INSERT INTO person_group (id, person_id, groups_id ,position_id ,status,logical_erase) VALUES (nextval('person_group_seq'), $1, $2, 4 ,'A', false)`, [id_person, id_group]);


        console.log('salida', answer);
        //retonar la respuesta
        res.json({ message: 'ok' });

    } catch (error) {
        console.log(error, 'error');

    }

}



/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : post para asignar un cargo a un usuario
*/
const petitions_post_position = async (req, res) => {

    try {

        let { doc,name_cargo,id_cargo } = req.body;
        const answer = await pool.query('SELECT id FROM person WHERE doc = $1 AND logical_erase = false', [doc]);
        const id_person = answer.rows[0].id;
        console.log('id_person', id_person);
        const consult_1 = await pool.query(`INSERT INTO person_position (id, name , person_id , position_id, period_id , id_group ,logical_erase) VALUES (nextval('person_position_seq'), $2, $1 , $3 , 1,NULL, false)`, [id_person,name_cargo,id_cargo]);
        res.json({ message: 'ok' });

    } catch (error) {
        console.log(error, 'error');

    }
}

/**
  *  @author : Juan Felipe Osorio Zapata <juan.felipe.osorio@correounivalle.edu.co>
  *  @decs  : post para establecer el registro de un usuario
  * 
*/
const petitions_post_register = async (req, res) => {
    
    try {
        //hacer un post para
        let {date_attendence, kid, men, vist, woman, } = req.body;
        const answer = await pool.query(`INSERT INTO attendence(date_attendence, id, kid, logical_erase, men, vist,woman) VALUES ($1, nextval('attendence_seq'),$2,false, $3, $4, $5 )`, [date_attendence, kid,men, vist, woman]);
        res.json({ message: 'ok'}); 
    }catch (error) {
        console.log(error, 'error'); 
    }
}


/**
  *  @author : Juan Felipe Osorio Zapata <juan.felipe.osorio@correounivalle.edu.co>
  *  @decs  : get para obtener los jovenes lideres que no pertenezcan a un grupo
  * 
*/
const petitions_get_jovenes_lideres = async (req, res) => {

    try {

        //consulta
        const answer = await pool.query(`SELECT  first_name , first_last_name , doc,name , t1.id FROM person AS t1
        JOIN person_position AS t2 ON t1.id = t2.person_id 
        AND t2.logical_erase = false AND t1.logical_erase = false
        AND t2.position_id = 4  AND t2.id_group is null`);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);

    } catch (error) {
        console.log(error, 'error');
    }
}

const petitions_get_all_person_not_group = async (req, res) =>{
    try {
        let {id} = req.params;
        const answer = await pool.query(`SELECT id,doc,first_name,second_name,first_last_name,second_last_name FROM person
                                        WHERE id NOT IN(SELECT person_id FROM person_group
                                        WHERE groups_id = $1)`,[id]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);
    } catch (error) {
        console.log(error, 'error'); 
    }
}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : get para obtener los nombres de los grupos
*/
const petitions_get_group_exist = async (req, res) => {
    try {
   
        const { name } = req.params;

        //consulta
        const answer = await pool.query(`SELECT name FROM groups_eclesial WHERE name = $1 AND logical_erase = false`, [name]);

        //retonar la respuesta
        res.json(answer.rows);

    } catch (error) {
        console.log(error, 'error');
    }
}

/**
  *  @author : Juan Felipe Osorio Zapata <juan.felipe.osorio@correounivalle.edu.co>
  *  @decs  : get para obtener los grupos a los que pertenece una persona
  * 
*/
const petitions_get_grupos_persona = async (req, res) => {
    
    try {

        //variables para capturar los parametros
        const { doc } = req.params;
        //consulta
        const answer = await pool.query(`select g.id AS id, g.description AS descripcion, g.name AS nombre_Grupo, g.url_img
        from groups_eclesial g
        INNER JOIN person_group AS p
        ON g.id = p.groups_id AND g.logical_erase = false AND p.logical_erase = false
        WHERE p.person_id in (SELECT id from person where doc = $1 AND logical_erase = false)
        ORDER BY nombre_Grupo ASC; `, [doc]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);

    } catch (error) {
        console.log(error, 'error');
    }
}
const petitions_post_group_person = async (req, res) => {
    try {
        let {person_id,group_id,position_id,status,logical_erase} = req.body;
        const answer = await pool.query(`INSERT INTO person_group(id,person_id,groups_id,position_id,status,logical_erase)
        VALUES(nextval('person_group_seq'),$1,$2,$3,$4,$5) `, [person_id,group_id,position_id,status,logical_erase]);

        //retonar la respuesta
        res.json({ message: 'ok' });        
    } catch (error) {
        console.log(error, 'error');
    }
}

const petitions_get_all_person_group = async (req, res) => {
    
    try {

        //variables para capturar los parametros
        const { id } = req.params;
        //consulta
        const answer = await pool.query(`SELECT person.doc,person.first_name,person.first_last_name,person_group.status FROM person INNER JOIN person_group 
        ON person.id = person_group.person_id AND person_group.groups_id =$1`, [id]);
        console.log('req.body', answer);
        //retonar la respuesta
        res.json(answer.rows);

    } catch (error) {
        console.log(error, 'error');
    }
}


module.exports = {
    petitions_get,
    petitions_get_login,
    petitions_get_cargo_vigigentes,
    petitions_put_periodo,
    petitions_get_user,
    petitions_get_all_user_active,
    petitions_get_user_exist,
    petitions_get_email_exist,
    petitions_get_all_country,
    petitions_post_user,
    petitions_get_info_user,
    petitions_post_file,
    petitions_post_group,
    petitions_post_position, 
    petitions_get_jovenes_lideres,
    petitions_get_cargoFaltantesUser,
    petitions_get_all_person_not_group,
    petitions_get_group_exist,
    petitions_get_grupos_persona,
    petitions_post_group_person,
    petitions_get_all_person_group,
    petitions_post_register
}





