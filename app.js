/**
 * CATEGORIA
 * 
 * POST '/categoria' recibe: {nombre: string} 
 *  retorna: status: 200, {id: numerico, nombre: string} 
 *  - status: 413, {mensaje: <descripcion del error>} que puede ser: "faltan datos", "ese nombre de categoria ya existe", "error inesperado"
 * 
 * GET '/categoria' retorna: status 200  y [{id:numerico, nombre:string}]  - status: 413 y []
 * 
 * GET '/categoria/:id' retorna: status 200 y {id: numerico, nombre:string} 
 *  - status: 413, {mensaje: <descripcion del error>} que puede ser: "error inesperado", "categoria no encontrada"
 * 
 * DELETE '/categoria/:id' retorna: status 200 y {mensaje: "se borro correctamente"} 
 * - status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", "categoria con libros asociados, no se puede eliminar",
 *  "no existe la categoria indicada"
 * 
 * No se debe implementar el PUT
 * 
 */




/**
 * PERSONA
 * 
 * POST '/persona' recibe: {nombre: string, apellido: string, alias: string, email: string} retorna: 
 *  status: 200, {id: numerico, nombre: string, apellido: string, alias: string, email: string} 
 *  - status: 413, {mensaje: <descripcion del error>} que puede ser: "faltan datos",
 *  "el email ya se encuentra registrado", "error inesperado"
 * 
 * GET '/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] o bien status 413 y []
 * 
 * GET '/persona/:id' retorna status 200 y {id: numerico, nombre: string, apellido: string, alias: string, email; string} 
 *  - status 413 , {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
 * 
 * PUT '/persona/:id' recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar. retorna status 200 y el objeto modificado o bien 
 *  status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
 * 
 * DELETE '/persona/:id' retorna: 200 y {mensaje: "se borro correctamente"} o 
 *  bien 413, {mensaje: <descripcion del error>} "error inesperado", "no existe esa persona", "esa persona tiene libros asociados, no se puede eliminar"
 * 
 */





/**
 * LIBRO
 * 
 * POST '/libro' recibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} devuelve 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} o 
 *  bien status 413,  {mensaje: <descripcion del error>} que puede ser "error inesperado", "ese libro ya existe", "nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada"
 * 
 * 
 * GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}] o 
 *  bien 413, {mensaje: <descripcion del error>} "error inesperado"
 * 
 * GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}] o 
 *  bien 413, {mensaje: <descripcion del error>} "error inesperado"
 * 
 * PUT '/libro/:id' y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} devuelve status 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} modificado o 
 *  bien status 413, {mensaje: <descripcion del error>} "error inesperado",  "solo se puede modificar la descripcion del libro
 * 
 * PUT '/libro/prestar/:id' y {id:numero, persona_id:numero} devuelve 200 y {mensaje: "se presto correctamente"} o 
 *  bien status 413, {mensaje: <descripcion del error>} "error inesperado", "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva", "no se encontro el libro", "no se encontro la persona a la que se quiere prestar el libro"
 * 
 * PUT '/libro/devolver/:id' y {} devuelve 200 y {mensaje: "se realizo la devolucion correctamente"} o 
 *  bien status 413, {mensaje: <descripcion del error>} "error inesperado", "ese libro no estaba prestado!", "ese libro no existe"
 * 
 * DELETE '/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  o 
 *  bien status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro", "ese libro esta prestado no se puede borrar"
 * 
 */




