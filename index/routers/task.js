const { Router, application } = require('express');
const { petitions_get, petitions_get_login, petitions_get_cargo_vigigentes,
    petitions_put_periodo, petitions_get_user, petitions_get_all_user_active,
    petitions_get_user_exist, petitions_get_email_exist, petitions_get_all_country,
    petitions_post_user, petitions_get_info_user, petitions_post_file, petitions_post_group ,
    petitions_post_position, petitions_get_jovenes_lideres,petitions_get_cargoFaltantesUser,
    petitions_get_group_exist,petitions_get_all_person_not_group,petitions_get_grupos_persona,
    petitions_post_group_person} = require('../controls/controls');


const multer = require('multer');
const mimeTypes = require('mime-types');
const router = Router();

application['img'] = '';

const storage = multer.diskStorage({
    destination: 'archivos/',
    filename: (req, file, cb) => {
        let name_file = Date.now() + file.originalname + '.' + mimeTypes.extension(file.mimetype)
        application['img'] = name_file;
        cb(null, name_file);
    }
});

const upload = multer({
    storage: storage
});


router.get('/', petitions_get);
//router.get('/', petitions_get);
//la ruta se llamara zlgz y tendra 2 parametros hara referencia a la consulta del login
router.get('/zlgz/:doc/:passwd', petitions_get_login);
//la ruta se llamara zallcf llama a todos los cargos faltantes de un usuario segun su documento
router.get('/zallcf/:doc',petitions_get_cargoFaltantesUser);
//la ruta se llamara zcvg y tendra un parametro hara referencia a los cargos vigentes
router.get('/zcvg/:doc', petitions_get_cargo_vigigentes);
//la ruta se llamara znlp y tendra un parametro hara referencia al documento del usuario
router.get('/znlp/:doc', petitions_get_user);
//la ruta se llamara zaup 
router.get('/zaup', petitions_get_all_user_active);
//la ruta se llamara zsdcr y tendra un parametro hara referencia al documento del usuario
router.get('/zsdcr/:doc', petitions_get_user_exist);
//la ruta se llamara zsdemp y tendra un parametro hara referencia al documento del usuario
router.get('/zsdemp/:email', petitions_get_email_exist);
//la ruta se llamara zcrcp y tendra un parametro hara referencia a cual consulta se va a realizar y el otro al id
router.get('/zcrcp/:id/:consult', petitions_get_all_country);
//la routa se llamara zincrp y sera un post para guardar un nuevo usuario
router.post('/zincrp', petitions_post_user);
//la routa se llamara zadtus y sera un get para traer la informacion de un usuario
router.get('/zadtus/:doc', petitions_get_info_user);
//la routa se lamara zfiles y sera un post para guardar archivos
router.post('/zfiles', upload.single('file_img'), petitions_post_file);
//la routa se llamara zcrgppipe y sera un post para crear un grupo 
router.post('/zcrgppipe', petitions_post_group);
//la routa se llamara zagcat y sera un post para asignar un cargo a un usuario
router.post('/zagcat', petitions_post_position);
//la ruta se llamara zuppt y tendra un parametro que sera el id del periodo para actualizar el periodo
router.put('/zuppt/:id', petitions_put_periodo);
//la ruta se llamara zjlp y sera tipo get para traer todos los usuarios jovenes lideres
router.get('/zjlp', petitions_get_jovenes_lideres);
//la ruta se llamara zdpsg y sera tipo get para traer todos los datos de las personas que no pertenecen al grupo seleccionado
router.get('/zdpsg/:id', petitions_get_all_person_not_group)
//la ruta se llamara gpi y sera tipo get para traer todos los grupos de un usuario
router.get('/gpi/:doc',petitions_get_grupos_persona);
//la routa se llamara znmgr y sera un get para ver si el nombre del grupo existe
router.get('/znmgr/:name', petitions_get_group_exist);
//la ruta se llama zipg y sera un post para asignar personas a un grupo
router.post('/zipg', petitions_post_group_person);


module.exports = router;