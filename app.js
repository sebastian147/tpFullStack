//Inicializacion
const express = require('express');
const mysql = require('mysql');
const util = require('util');

const app = express();
const port = 3000;
app.use(express.json()); //permite el mapeo de la peticion json a objetos js

app.use(express.static(__dirname));
app.use(express.urlencoded());

const conexion = mysql.createConnection({
    host: 'localhost', //si fuera un server pongo la dir del server
    user: 'root',
    password: '', //depende como me logueo en el php my admin
    database: 'fullstack_m3tpfinal'
})
conexion.connect((error) => {
    if (error) {
        throw error; //salta al catch con el error
    } else {
        console.log('Conexion con la base de daros mysql establecida');
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
        if (!req.body.nombre) {
            throw new Error('faltan datos'); // esto salta al catch
        }
        const nombre = req.body.nombre.toUpperCase();
        let query = 'SELECT id FROM categoria WHERE nombre = ?';
        let respuesta = await qy(query, [nombre]);
        if (respuesta.length > 0) { //si el string tiene tamaño significa que existe
            throw new Error('ese nombre de categoria ya existe');
        }
        query = 'INSERT INTO categoria (nombre) VALUE (?)';
        respuesta = await qy(query, [nombre]);
        res.status(200).send({ "id": respuesta.insertId, "nombre": nombre });
        //cuando tengo que usar error inesperado?
    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
    }
});

app.get('/categoria', async function(req, res) {
    try {
        const query = 'SELECT * FROM categoria';
        const respuesta = await qy(query);

        res.status(200).send(respuesta);
    } catch (e) {

        if (e.length == 0) {
            e.mensaje = [];
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
        //[]?
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
    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
    }
});

app.delete('/categoria/:id', async function(req, res) {
    try {
        let query = 'SELECT * FROM libro WHERE categoria_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length > 0) {
            throw new Error("categoria con libros asociados, no se puede eliminar"); //verificar
        }
        query = 'SELECT * FROM categoria WHERE id = ?';
        respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("no existe la categoria indicada");
        }
        query = 'DELETE FROM categoria WHERE id = ?'; //cuidado con el delete, si no le pongo el where borro toda la tabla
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({ mensaje: "se borro correctamente" });
    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
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
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const email = req.body.email.toUpperCase();
        const alias = req.body.alias.toUpperCase();

        let query = 'SELECT * FROM persona WHERE email LIKE ?';
        let respuesta = await qy(query, [email]);
        console.log(respuesta);

        if (respuesta.length > 0) {
            throw new Error('Persona ya ingresada');
        }

        query = 'INSERT into persona (nombre, apellido, email, alias) VALUE (?, ?, ?, ?)';
        respuesta = await qy(query, [nombre, apellido, email, alias]);

        console.log(respuesta);
        res.send({ 'respuesta': respuesta });



    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
    }
});

/* GET '/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] o bien status 413 y []
 */
app.get('/persona', async function(req, res) {
    try {
        const query = 'SELECT * FROM persona';
        const respuesta = await qy(query, [req.body.nombre, req.body.apellido, req.body.email, req.body.alias]); //cambiar a uppercase

        res.status(200).send(respuesta);
    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
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
            throw new Error('Persona no encontrada');
        }
        res.status(200).send(respuesta[0]);
    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
    }
});

/* PUT '/persona/:id' recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar. retorna status 200 y el objeto modificado o bien 
 *  status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
 */
app.put('/persona/:id', async(req, res) => {
    try {
        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const alias = req.body.alias.toUpperCase();
        let query = 'SELECT * FROM persona WHERE id <> ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta > 0) {
            throw new Error("No se encuentra esa persona");
        }

        query = 'UPDATE persona SET nombre = ?, apellido = ?, alias = ? WHERE id = ?';

        respuesta = await qy(query, [nombre, apellido, alias, req.params.id]);

        res.send({ "respuesta": respuesta });

    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
    }
});

/* DELETE '/persona/:id' retorna: 200 y {mensaje: "se borro correctamente"} o 
 *  bien 413, {mensaje: <descripcion del error>} "error inesperado", "no existe esa persona", "esa persona tiene libros asociados, no se puede eliminar"
 * 
 */
app.delete('/persona/:id', async function(req, res) {
    try {
        let query = 'SELECT * FROM libro WHERE persona_id = ?';
        let respuesta = await qy(query, [req.params.id]);
        if (respuesta.length > 0) {
            throw new Error("Persona con libros asociados, no se puede eliminar"); //verificar
        }
        query = 'SELECT * FROM persona WHERE id = ?';
        respuesta = await qy(query, [req.params.id]);
        if (respuesta.length == 0) {
            throw new Error("No existe esa persona");
        }
        query = 'DELETE FROM persona WHERE id = ?'; //cuidado con el delete, si no le pongo el where borro toda la tabla
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({ mensaje: "Se borro correctamente" });
    } catch (e) {
        if (e.length == 0) {
            e.mensaje = "error inesperado";
        }
        //si no se pudo hago esto otro
        console.error(e.message);
        res.status(413).send({ "mensaje": e.message });
    }
});


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




//Escucha servidor
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});