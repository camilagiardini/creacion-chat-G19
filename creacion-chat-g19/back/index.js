var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

//Pongo el servidor a escuchar
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});

// ACA EMPIEZA EL TRABAJO NUESTRO

/*app.post('/obtenerDatosRegistro'), async function (req,res) {
    try {
         await realizarQuery(`
        ('INSERT INTO Usuarios (nombre_usuario, contraseña, es_admin) VALUES ('${req.body.nombre_usuario}', '${req.body.contraseña}', '${req.body.es_admin}');')
    `)
    res.send("se agrego correctamente")
    } catch(error){
        console.log(error);
    }

}*/
/*
app.post('/guardarUsuarios', async function (req,res) {
    try {
        await realizarQuery(`
        INSERT INTO Usuarios (nombre_usuario,contraseña, es_admin) 
            VALUES ('${req.body.nombre_usuario}', '${req.body.contraseña}', ${req.body.es_admin})
        `)
        res.send({mensaje:"se agrego correctamente"})

    } catch(error){
        console.log(error);
        res.send(error)
    }

})

app.post('/guardarCanciones', async function (req,res) {
    try {
        await realizarQuery(`
        INSERT INTO Canciones (nombre_cancion, nombre_artista, nro_reproducciones) 
            VALUES ('${req.body.nombre_cancion}','${req.body.nombre_artista}', '${req.body.nro_reproducciones}')
        `)
        res.send({mensaje: "se agrego correctamente"})
    } catch(error){
        console.log(error);
        res.send(error)
/*
    } catch(error){
        console.log(error);
        res.send(error)
    }

})

app.post('/guardarCanciones', async function (req,res) {
    try {
        await realizarQuery(`
        INSERT INTO Canciones (nombre_cancion, nombre_artista, nro_reproducciones) 
            VALUES ('${req.body.nombre_cancion}','${req.body.nombre_artista}', '${req.body.nro_reproducciones}')
        `)
        res.send({mensaje: "se agrego correctamente"})
    } catch(error){
        console.log(error);
        res.send(error)

    }

})

app.post('/buscarUsuario', async function(req,res){
    console.log(req.query.nombre_usuario)
    try {
        const response = await realizarQuery(`
            SELECT * FROM Usuarios WHERE nombre_usuario = '${req.body.nombre_usuario}' and contraseña = '${req.body.contraseña}'     
        `)
        console.log(response)
        res.send(response)
    } catch (error) {
        console.log(error)
    }
})


app.post('/conseguirID', async function(req,res){
    const response = await realizarQuery(`
        SELECT idUsuario FROM Usuarios WHERE nombre_usuario = '${req.body.nombre_usuario}'     
    `)
    console.log(response)
    res.send(response) 
})


app.post('/esAdmin', async function(req,res){
    try {
        const response = await realizarQuery(`
            SELECT es_admin FROM Usuarios WHERE nombre_usuario = '${req.body.nombre_usuario}'     
        `)
        console.log(response)
        res.send(response)
    } catch (error) {
        console.log(error)
    }
})


app.get('/usuarios', async function(req,res){
    const response = await realizarQuery(`
        SELECT * FROM Usuarios   
    `)
    console.log(response)
    res.send(response)
})

app.get('/cancionesJuego', async function(req,res){
    try {
        const response = await realizarQuery(`
        SELECT * FROM Canciones ORDER BY RAND()   
    `)
        console.log(response)
        res.json(response)   
    } catch (error) {
        res.send("error obtener canciones")
    }
})

app.get('/traerCanciones', async function(req,res){
    try {
        const response = await realizarQuery(`
        SELECT * FROM Canciones  
    `)
        console.log(response)
        res.json(response)   
    } catch (error) {
        res.send("error obtener canciones")
    }
})


app.get('/mejoresPuntajes', async function (req,res) {
    try {
        const response = await realizarQuery(`
        SELECT nombre_usuario, puntaje FROM Usuarios ORDER BY puntaje DESC LIMIT 5
    `)
        res.send(response)
    } catch (error) {
        res.send("error al ordenar los puntajes")
    }
})

app.post('/agregarPuntaje', async function (req,res) {
    try {
        const response = await realizarQuery(`
        SELECT * FROM Usuarios WHERE idUsuario = '${req.body.idUsuario}'')
    `)
        if (response.length<0){
            await realizarQuery(`
            INSERT INTO Usuarios (nombre_usuario, contraseña, es_admin, puntaje) VALUES ('${req.body.nombre_usuario}','${req.body.contraseña}', '${req.body.es_admin}', '${req.body.contadorPuntaje}')
            `)
        } else {
            await realizarQuery(`
            UPDATE Usuarios SET puntaje = '${req.body.contadorPuntaje}' WHERE idUsuario='${req.body.idUsuario}')
            `)
        }
        res.send("se agregó el puntaje correctamente")
    } catch (error) {
        res.send("error al agregar el puntaje")
    }
})

app.put('/modificarCanciones', async function (req, res) {
    try {
        const result = await realizarQuery(`UPDATE Canciones SET ${req.body.campo}='${req.body.nuevoValor}' WHERE nombre_cancion = '${req.body.cancionSeleccionada}'`);
        res.json(result);
    } catch (error) {
        res.json("error al modificar la canción")
    }
})

app.delete('/eliminarCanciones', async function (req,res) {
    try {
        const result= await realizarQuery(`DELETE FROM Canciones WHERE nombre_cancion="${req.body.cancionSeleccionadaDelete}"`)
        res.json(result)
    } catch (error) {
        
    }
})*/

// -------------- aca comienza el proyecto del chat


app.get('/usuarios', async function(req,res){
    try {
        const response = await realizarQuery(`
            SELECT * FROM Users    
        `)
        res.send(response)
        
    } catch (error) {
        console.log(error)
    }
})

app.get('/mostrarContactos', async function(req,res){
    try {
        const response = await realizarQuery(`

        SELECT nombre, foto_perfil
        FROM Users
        WHERE Users.id_user=´${req.body.id_user}´
        UNION ALL
        SELECT nombre_chat, foto_chat
        FROM Users
        INNER JOIN Chats on Chats.id_chat = UserChats.id_chat
        INNER JOIN Users on Users.id_user = UserChats.id_user
        WHERE Chats.tipo_chat="grupo" AND Users.id_user='${req.body.id_user}'
        
    `)
        console.log(response)
        res.json(response)   
    } catch (error) {
        res.send("error obtener contactos")
    }
})

app.post('/conseguirID', async function(req,res){
    const response = await realizarQuery(`
        SELECT id_user FROM Users WHERE email = '${req.body.email}'     
    `)
    console.log(response)
    res.send(response) 
})