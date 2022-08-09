

/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  TODO: toca dejar lac claves predeterminadas por cuestiones de tiempo
  *  @decs  : funcion que genera un token de seguridad para las peticiones ajax
*/
const generateToken = () => {

    const date = new Date();
    console.log(date);
    const day = date.getDate();
    const password_token = ((token_month[day]).split('|'));
    let token = '';

    (password_token).map(
        (item) => {
            token += encrypt_token[item];
        }
    )

    return token;

}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : dependiendo del dia esocgera una clave predeterminada para el token
*/
const token_month = {
    '1': 'E|!|1|d|5|d|s|6|7|9|s|5|r|6',
    '2': '4|k|5|d|5|6|s|5|7|h|8|t|r|e',
    '3': '5|d|j|f|9|8|s|e|7|h|8|f|6|e',
    '4': '6|d|k|f|9|8|s|e|7|h|8|5|6|3',
    '5': '7|c|k|f|9|8|s|e|7|h|8|5|6|4',
    '6': '8|g|k|f|9|8|s|e|7|h|8|f|6|h',
    '7': '9|c|k|f|9|8|s|e|7|h|8|j|6|f',
    '8': '0|h|7|9|9|8|t|t|7|h|8|h|6|7',
    '9': '1|j|k|f|9|8|s|t|7|h|8|m|6|f',
    '10': '2|j|k|f|9|8|r|e|7|h|8|n|6|t',
    '11': '3|j|k|f|9|8|e|e|7|h|8|z|6|6',
    '12': '4|j|k|f|9|4|s|e|7|h|8|x|6|f',
    '13': '5|j|k|f|9|5|s|e|7|h|8|a|6|e',
    '14': '6|j|k|f|7|8|s|y|u|c|a|x|6|2',
    '15': '7|5|k|f|9|r|s|r|d|h|8|g|6|2',
    '16': '8|6|k|f|9|8|s|e|7|h|8|c|6|1',
    '17': '9|7|k|f|9|8|s|e|7|h|8|f|6|q',
    '18': '0|8|k|f|9|8|s|e|7|h|8|4|6|a',
    '19': '1|9|k|f|9|8|s|e|7|h|8|6|6|a',
    '20': '2|7|k|f|9|8|s|e|7|h|8|7|6|s',
    '21': '3|5|t|l|t|8|s|e|7|h|8|8|6|c',
    '22': '4|j|k|f|t|r|d|e|7|h|8|0|6|l',
    '23': '5|j|k|f|9|8|s|e|7|h|8|f|6|f',
    '24': '6|j|k|f|9|8|s|e|7|y|8|h|6|s',
    '25': '7|j|k|f|9|8|s|e|7|u|8|k|6|a',
    '26': '8|j|k|f|9|8|s|e|7|u|8|3|6|a',
    '27': '9|j|k|f|9|8|s|e|7|s|8|f|6|d',
    '28': '0|j|k|f|9|8|s|e|7|q|8|g|6|7',
    '29': '1|j|k|f|9|8|s|e|7|q|8|6|6|5',
    '30': '2|j|k|f|9|8|s|e|7|f|8|7|6|t',
    '31': '3|j|k|f|9|8|s|e|7|h|8|f|6|i'
}

/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : encrytar el token de forma predeterminada
*/
const encrypt_token = {
    '0': '%uA=',
    '1': 'E$12',
    '2': 'F$#2',
    '3': 'M$!3',
    '4': 'A$&4',
    '5': 'M*(5',
    '6': 'Jp}6',
    '7': 'J%_7',
    '8': 'Aio8',
    '9': 'S$#9',
    'a': 'O?<1',
    'b': ',>N1',
    'c': 'D$#2',
    'd': 'E%%3',
    'e': 'P$$4',
    'f': '~@L5',
    'g': '@@16',
    'h': 'S@17',
    'i': '/7*8',
    'j': ')619',
    'k': 'D}?0',
    'l': '??21',
    'm': 't}<2',
    'n': 'O$#$',
    'o': 'L!~@',
    'p': '@_>{',
    'q': '*-?Z',
    'r': '_+?A',
    's': ':"AW',
    't': '$/&5',
    'u': 'E#30',
    'v': 'c*c*',
    'w': '#408',
    'x': 'F$#3',
    'y': 'M$#4',
    'z': 'A$#5'
}


/**
  *  @author : cristian Duvan Machado <cristian.machado@correounivalle.edu.co>
  *  @decs  : desincriptar el token de forma predeterminada
*/
const decrypt_token = {
    '%uA=': '0',
    'E$12': '1',
    'F$#2': '2',
    'M$!3': '3',
    'A$&4': '4',
    'M*(5': '5',
    'Jp}6': '6',
    'J%_7': '7',
    'Aio8': '8',
    'S$#9': '9',
    'O?<1': 'a',
    ',>N1': 'b',
    'D$#2': 'c',
    'E%%3': 'd',
    'P$$4': 'e',
    '~@L5': 'f',
    '@@16': 'g',
    'S@17': 'h',
    '/7*8': 'i',
    ')619': 'j',
    'D}?0': 'k',
    '??21': 'l',
    't}<2': 'm',
    'O$#$': 'n',
    'L!~@': 'o',
    '@_>{': 'p',
    '*-?Z': 'q',
    '_+?A': 'r',
    ':":AW': 's',
    '$/&5': 't',
    'E#30': 'u',
    'c*c*': 'v',
    '#408': 'w',
    'F$#3': 'x',
    'M$#4': 'y',
    'A$#5': 'z'
}


//exportar la funcion para generar el token

module.exports = {
    generateToken
}
