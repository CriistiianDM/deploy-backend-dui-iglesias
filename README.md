# NOTA IMPORTANTE PARA CREACION DE CONSULTAS!!!!!!
 
Crear consultas efiencientes es importante y no solo para el desarrollo de la aplicacion, sino para la optimizacion de la base de datos y el desarrollo un buen programador.

Tener en cuenta que estamos usando el borrado logico, por lo tanto si queremos eliminar un registro de la base de datos, solo debemos cambiar el estado del registro a true.

Para evitar consultas ineficientes, vamos a tener en cuenta las siguientes consideraciones:
## NOTA: no validare ninguna consulta que considere que no sea optima.

1. No se debe usar el operador `LIKE` para buscar datos.
2. Tratar de usar join a gran medida para evitar consultas ineficientes.
3. Tratar de usar expresiones regulares en consultas.
4. crear indeces para consultas tipo  `SELECT * FROM tabla WHERE campo = 'valor'`
5. tratar no usar mucho las subconsultas y usar join a gran medida.


