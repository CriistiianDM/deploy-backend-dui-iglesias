//librerary
const pool = require('../bd');

const petitions_get = async (req, res) => {

    try {
        const answer = await pool.query('SELECT * FROM city');
        console.log('req.body', answer);
        res.json(answer.rows);
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
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
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

        //conseguir el id de la persona de la tabla person atreves de su documento
        const answer = await pool.query('SELECT id FROM person WHERE doc = $1 AND logical_erase = false', [doc]);
        //res.json(answer.rows);
        if ((answer.rows[0]) !== undefined) {

            id_person = answer.rows[0].id;

            //consulta para obtener los id de los cargos y el tiempo de vigencia
            answer2 = await pool.query('SELECT period_id, position_id  FROM person_position WHERE person_id = $1 AND logical_erase = false', [id_person]);
            //guardar cuntos registros tiene la consulta
            index_answer2 = (answer2.rows).length;
            console.log('answer2', (answer2.rows).length, typeof (answer2.rows));
            //recorrer el arreglo para obtener el tiempo de vigencia for each
            answer2.rows.forEach(async (element, index) => {

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
                        console.log('no entro papa');
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


                if (index === (index_answer2 - 1)) {
                    categoria_vigente = `${categoria_vigente.substring(0, categoria_vigente.length - 1)}`;
                    res.json(categoria_vigente);
                }
                console.log(categoria_vigente, 'categoria_vigente');
            });

            //console.log(categoria_vigente, 'categoria_vigente 1');
            //res.json((answer.rows)[0]);

        }

        //categoria_vigente = categoria_vigente.substring(0, categoria_vigente.length - 1);

        //consulta
        //onst answer = await pool.query('SELECT count(*) FROM cargo WHERE doc = $1 AND logical_erase = false', [doc]);
        //console.log('req.body',answer);
        //retonar la respuesta
        //console.log('answer', (answer.rows)[0]);

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


module.exports = {
    petitions_get,
    petitions_get_login,
    petitions_get_cargo_vigigentes,
    petitions_put_periodo,
    petitions_get_user,
    petitions_get_all_user_active
}





