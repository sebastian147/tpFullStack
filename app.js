//Este trabajo se podria haber resuelto mediante varios archivos con aplicaciones especificas. Pero por motivos practicos 
//para la realizacion de el trabajo practico lo dejamos todo en un mismo archivo.

//Inicializacion
const express = require('express');
const mysql = require('mysql');
const util = require('util');
const cors = require('cors');
const app = express();
const port = preocess.enc.port


app.use(cors({origin: 'http://192.168.1.9:4200', credentials: true}));

app.use(express.json()); //permite el mapeo de la peticion json a objetos js

app.use(express.static(__dirname));
app.use(express.urlencoded());


const conexion = mysql.createConnection({
    host: 'sql10.freesqldatabase.com', //si fuera un server pongo la dir del server
    user: 'sql10428628',
    password: 'VaS8En87nl', //depende como me logueo en el php my admin
    database: 'fullstack_m3tpfinal'//depende del nombre de mi base de datos
})
conexion.connect((error) => {
    if (error) {
        throw error; //salta al catch con el error
    } else {
        console.log('Conexion con la base de datos mysql establecida');
    }
});
const qy = util.promisify(conexion.query).bind(conexion); //permite el uso de asyn await en la conexion mysql
//Finalizacion inicializacion


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
app.post('/categoria', async function(req, res) {
    try {
        if (!req.body.nombre || !req.body.nombre.trim()) {
            throw new Error('faltan datos'); 
        }
        const nombre = req.body.nombre.toUpperCase();
        let query = 'SELECT id FROM categoria WHERE nombre = ?';
        let respuesta = await qy(query, [nombre]);
        if (respuesta.length > 0) { 
            throw new Error('ese nombre de categoria ya existe');
        }
        query = 'INSERT INTO categoria (nombre) VALUE (?)';
        respuesta = await qy(query, [nombre]);
        res.status(200).send({ "id": respuesta.insertId, "nombre": nombre });
         
    } 
    catch (e) {
        //La parte de manejo de errores se podia resolver mediante el uso de una funcion para no repetir el codigo constantemente.
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.get('/categoria', async function(req, res) {
    try {
        const query = 'SELECT * FROM categoria';
        const respuesta = await qy(query);

        res.status(200).send(respuesta);
    } 
    catch (e) {
        console.error([]);
        res.status(413).send([]);
    }
});

app.get('/categoria/:id', async function(req, res) {
    try {
        const query = 'SELECT * FROM categoria WHERE id = ?';

        const respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error('categoria no encontrada');
        }
        res.status(200).send(respuesta[0]);
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.delete('/categoria/:id', async function(req, res) {
    try {
        let query = 'SELECT * FROM libro WHERE categoria_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length > 0) {
            throw new Error("categoria con libros asociados, no se puede eliminar");
        }
        query = 'SELECT * FROM categoria WHERE id = ?';
        respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("no existe la categoria indicada");
        }
        query = 'DELETE FROM categoria WHERE id = ?';          
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({ mensaje: "se borro correctamente" });
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

/**
 * PERSONA
* 
* POST '/persona' recibe: {nombre: string, apellido: string, alias: string, email: string} retorna: 
 *  status: 200, {id: numerico, nombre: string, apellido: string, alias: string, email: string} 
 *  - status: 413, {mensaje: <descripcion del error>} que puede ser: "faltan datos",
 *  "el email ya se encuentra registrado", "error inesperado"
 */
app.post('/persona', async(req, res) => {
    try {
        if(!req.body.nombre || !req.body.nombre.trim() || !req.body.apellido || !req.body.apellido.trim() || !req.body.email || !req.body.email.trim() || !req.body.alias || !req.body.alias.trim()){
            throw new Error('faltan datos');
        }
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const email = req.body.email.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        let query = 'SELECT * FROM persona WHERE email LIKE ?';
        let respuesta = await qy(query, [email]);
        console.log(respuesta);

        if (respuesta.length > 0) {
            throw new Error('el email ya se encuentra registrado');
        }

        query = 'INSERT into persona (nombre, apellido, email, alias) VALUE (?, ?, ?, ?)';
        respuesta = await qy(query, [nombre, apellido, email, alias]);

        console.log(respuesta);
        res.status(200).send({ "id": respuesta.insertId, "nombre": nombre, "apellido":apellido, "alias":alias, "email":email});
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

/* GET '/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] o bien status 413 y []
 */
app.get('/persona', async function(req, res) {
    try {
        const query = 'SELECT * FROM persona';
        const respuesta = await qy(query, [req.body.nombre, req.body.apellido, req.body.email, req.body.alias]);
        res.status(200).send(respuesta);
    } 
    catch (e) {
        console.error([]);
        res.status(413).send([]);
    }
});

/* GET '/persona/:id' retorna status 200 y {id: numerico, nombre: string, apellido: string, alias: string, email; string} 
 *  - status 413 , {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
 */
app.get('/persona/:id', async function(req, res) {
    try {
        const query = 'SELECT * FROM persona WHERE id = ?';

        const respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error('no se encuentra esa persona');
        }
        res.status(200).send(respuesta[0]);
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

/* PUT '/persona/:id' recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar. retorna status 200 y el objeto modificado o bien 
 *  status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
 */
app.put('/persona/:id', async(req, res) => {
    try {
        //habria que tener en cuenta que el usuario puede no cargar alguno de los valores. Pero no estaba contemplado en la consigna. Esto lleva a un error inesperado.
        //este problema se puede resolver con varios if anidados para fijarse que valor no fue cargado y accionar en funcion de eso.
        //o mismo si alguno de los datos no fue cargado pedirle que cargue todos(sin contar el email).
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        let query = 'SELECT * FROM persona WHERE id = ?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("no se encuentra esa persona");
        }
        query = 'UPDATE persona SET nombre = ?, apellido = ?, alias = ? WHERE id = ?';

        respuesta = await qy(query, [nombre, apellido, alias, req.params.id]);

        query = 'SELECT * FROM persona WHERE id = ?';
        respuesta = await qy(query, req.params.id);
        res.status(200).send(respuesta[0]);

    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

/* DELETE '/persona/:id' retorna: 200 y {mensaje: "se borro correctamente"} o 
 *  bien 413, {mensaje: <descripcion del error>} "error inesperado", "no existe esa persona", "esa persona tiene libros asociados, no se puede eliminar"
 */
app.delete('/persona/:id', async function(req, res) {
    try {
        let query = 'SELECT * FROM libro WHERE persona_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length > 0) {
            throw new Error("esa persona tiene libros asociados, no se puede eliminar");
        }
        query = 'SELECT * FROM persona WHERE id = ?';
        respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("no existe esa persona");
        }
        query = 'DELETE FROM persona WHERE id = ?';          
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({ mensaje: "se borro correctamente" });
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});


/**
 * LIBRO
 * 
 * POST '/libro' recibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} devuelve 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} o 
 *  bien status 413,  {mensaje: <descripcion del error>} que puede ser "error inesperado", "ese libro ya existe", "nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada"
 * 
 * GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}] o 
 *  bien 413, {mensaje: <descripcion del error>} "error inesperado"
 * 
 * GET '/libro/:id' devuelve 200 {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} 
 * y status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro"
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
 app.post('/libro', async function(req, res) {
    try {
        if (!req.body.nombre || !req.body.nombre.trim() || !req.body.categoria_id) {
            throw new Error('nombre y categoria son datos obligatorios'); 
        }
        const nombre = req.body.nombre.toUpperCase();
        let query = 'SELECT id FROM libro WHERE nombre = ?';
        let respuesta = await qy(query, nombre);
        if (respuesta.length > 0) { 
            throw new Error('ese libro ya existe');
        }
        query = 'SELECT * FROM categoria WHERE id = ?';
        respuesta = await qy(query, req.body.categoria_id);
        if (respuesta.length == 0) { 
            throw new Error('no existe la categoria indicada');
        }
        let persona_id = req.body.persona_id;
        if(!req.body.persona_id){
            persona_id = null;
        }
        else{
            query = 'SELECT * FROM persona WHERE id = ?';
            respuesta = await qy(query, persona_id);
            if (respuesta.length == 0) { 
                throw new Error('no existe la persona indicada');
            }
        }
        let descripcion = req.body.descripcion;
        if(descripcion != null){
            descripcion = req.body.descripcion.toUpperCase();
        }
        query = 'INSERT INTO libro (nombre, descripcion, categoria_id, persona_id) VALUE (?, ?, ?, ?)';
        respuesta = await qy(query, [nombre, descripcion, req.body.categoria_id, persona_id]);
        res.status(200).send({ "id": respuesta.insertId, "nombre": nombre, "descripcion":descripcion, "categoria_id":req.body.categoria_id, "persona_id":persona_id });
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.get('/libro', async function(req, res) {
    try {
        const query = 'SELECT * FROM libro';
        const respuesta = await qy(query);

        res.status(200).send(respuesta);
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.get('/libro/:id', async function(req, res) {
    try {
        const query = 'SELECT * FROM libro WHERE id = ?';

        const respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error('no se encuentra ese libro');
        }
        res.status(200).send(respuesta[0]);
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.put('/libro/:id', async function(req, res) {
    try {
        //Agregamos errores, ademas de los que decia la consigna, por que no nos parecia correcto.
        //si no los agregabamos tiraba error inesperado
        let query = 'SELECT * FROM libro WHERE id = ?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta == 0) {
            throw new Error("no se encontro el libro");
        }
        let descripcion = req.body.descripcion;
        if(descripcion != null){
            descripcion = req.body.descripcion.toUpperCase();
        }
        else{
            throw new Error("solo se puede modificar la descripcion del libro, y no se envio valor a modificar de la misma");
        }
        query = 'UPDATE libro SET descripcion = ? WHERE id = ?';
        respuesta = await qy(query, [descripcion, req.params.id]);
        query = 'SELECT * FROM libro WHERE id = ?';
        respuesta = await qy(query, req.params.id);
        res.status(200).send(respuesta[0]);
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.put('/libro/prestar/:id', async function(req, res) {
    try {
        //Agrego este error ya que no estaba contemplado por la consigna y lleva a comportamientos no deseados
        if(!req.body.persona_id){
            throw new Error("No se indico una persona a la cual prestar el libro");
        }
        let query = 'SELECT * FROM libro WHERE id = ?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("no se encontro el libro");
        }
        query = 'SELECT persona_id FROM libro WHERE id = ?';
        respuesta = await qy(query, req.params.id);
        if(respuesta[0].persona_id != null){
            throw new Error("el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva");
        }
        query = 'SELECT * FROM persona WHERE id = ?';
        respuesta = await qy(query, req.body.persona_id);
        if(respuesta.length == 0){
            throw new Error("no se encontro la persona a la que se quiere prestar el libro");
        }
        query = 'UPDATE libro SET persona_id = ? WHERE id = ?';
        respuesta = await qy(query, [req.body.persona_id, req.params.id]);
        res.status(200).send({mesnaje: "se presto correctamente"});
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.put('/libro/devolver/:id', async function(req, res) {
    try {
        let query = 'SELECT * FROM libro WHERE id = ?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("ese libro no existe");
        }
        query = 'SELECT persona_id FROM libro WHERE id = ?';
        respuesta = await qy(query, req.params.id);
        if(respuesta[0].persona_id == null){
            throw new Error("ese libro no estaba prestado!");
        }
        query = 'UPDATE libro SET persona_id = ? WHERE id = ?';
        respuesta = await qy(query, [null, req.params.id]);
        res.status(200).send({mesnaje: "se realizo la devolucion correctamente"});
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});

app.delete('/libro/:id', async function(req, res) {
    try {
        let query = 'SELECT * FROM libro WHERE id = ?';
        let respuesta = await qy(query, req.params.id);
        if (respuesta.length == 0) {
            throw new Error("no se encuentra ese libro");
        }
        query = 'SELECT persona_id FROM libro WHERE id = ?';
        respuesta = await qy(query, req.params.id);
        if (respuesta[0].persona_id != null) {
            throw new Error("ese libro esta prestado no se puede borrar");
        }
        query = 'DELETE FROM libro WHERE id = ?';          
        respuesta = await qy(query, req.params.id);
        res.status(200).send({ mensaje: "se borro correctamente" });
    } 
    catch (e) {
        if (e.name != "Error") {
            console.error("error inesperado");
            res.status(413).send({ "mensaje": "error inesperado" });
        }
        else{
            console.error(e.message);
            res.status(413).send({ "mensaje": e.message });
        }
    }
});



//Escucha servidor
app.listen(port, function() {
    console.log('Example app listening on port 3000!');
});