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

// -------------- aca comienza el proyecto del chat


app.get('/usuarios', async function(req,res){
    try {
        console.log("Entre")
        const response = await realizarQuery(`
            SELECT * FROM Users    
        `)
        res.send(response)
        
    } catch (error) {
        console.log(error)
    }
})

app.post('/encontrarUsuario', async function(req,res){
    try {
        const response = await realizarQuery(`
            SELECT * FROM Users WHERE email = '${req.body.email}'    
        `)
        if (response.length > 0) {
            res.send({existe: true, vector: response})
        } else {
            res.send({existe: false, vector: response})
        }        
    } catch (error) {
        console.log(error)
    }
})

app.get('/mostrarContactos', async function(req,res){
    try {
        const response = await realizarQuery(/*`
            SELECT DISTINCT Users.nombre, Users.foto_perfil, Users.id_user
            FROM Users
            INNER JOIN UsersChats on UsersChats.id_user = Users.id_user
            WHERE Users.id_user != '${req.query.id_user}'

            UNION ALL

            SELECT DISTINCT Chats.nombre_chat, Chats.foto_chat, Chats.id_chat
            FROM Chats
            INNER JOIN UsersChats ON UsersChats.id_chat = Chats.id_chat
            INNER JOIN Users ON Users.id_user = UsersChats.id_user
            WHERE Chats.tipo_chat = 'grupo' AND Users.id_user = '${req.query.id_user}';


        `*/
            `SELECT DISTINCT c.id_chat, CASE 
            WHEN c.tipo_chat = 'grupo' THEN c.nombre_chat
            ELSE u2.nombre 
            END AS nombre_chat
            FROM UsersChats uc
            JOIN Chats c ON uc.id_chat = c.id_chat
            LEFT JOIN UsersChats uc2 ON uc2.id_chat = c.id_chat AND uc2.id_user != uc.id_user
            LEFT JOIN Users u2 ON uc2.id_user = u2.id_user
            WHERE uc.id_user = '${req.query.id_user}';`
        )


        console.log(response)
        console.log("funcionó")
        res.send(response)   
    } catch (error) {
        console.error(error);
        res.send("error obtener contactos");
    }
})

app.post('/conseguirID', async function(req,res){
    const response = await realizarQuery(`
        SELECT id_user FROM Users WHERE email = '${req.body.email}'     
    `)
    res.send(response)
})

app.post('/seleccionarChat', async function (req,res){
    console.log("mostrar chat seleccionado")
    try {
        /*const response = await realizarQuery(`
            SELECT DISTINCT Chats.nombre_chat, Chats.foto_chat, Chats.id_chat, Chats.tipo_chat
            FROM Chats
            INNER JOIN UsersChats on UsersChats.id_chat = Chats.id_chat
            INNER JOIN Users on Users.id_user = UsersChats.id_user
            WHERE Chats.id_chat='${req.body.id_chat}'
        `)*/
        const response = await realizarQuery(`
            SELECT DISTINCT
            CASE
                WHEN Chats.tipo_chat = 'privado' THEN (
                SELECT Users.nombre
                FROM Users
                INNER JOIN UsersChats UC2 ON Users.id_user = UC2.id_user
                WHERE UC2.id_chat = Chats.id_chat
                    AND Users.id_user <> ${req.body.id_user}
                LIMIT 1
                )
                ELSE Chats.nombre_chat
            END AS nombre_chat,
            Chats.foto_chat,
            Chats.id_chat,
            Chats.tipo_chat
            FROM Chats
            INNER JOIN UsersChats ON UsersChats.id_chat = Chats.id_chat
            INNER JOIN Users ON Users.id_user = UsersChats.id_user
            WHERE Chats.id_chat = '${req.body.id_chat}'
        `)
        console.log("id user:")
        console.log(req.body.id_user)
        console.log(req.body.id_chat)
        console.log("respuesta")
        console.log(response)

        /*for (let i = 0; i < response.length; i++) {
            const chat = response[i];
            let segundaConsulta;
            if (chat.tipo_chat == "privado") {
                console.log("segunda consulta (privado)")
                segundaConsulta = await realizarQuery(`
                    SELECT Users.nombre, Users.foto_perfil
                    FROM Users
                    INNER JOIN UsersChats ON UsersChats.id_user = Users.id_user
                    INNER JOIN Chats ON Chats.id_chat = UsersChats.id_chat
                    WHERE UsersChats.id_chat = '${chat.id_chat}' AND Users.id_user!='${req.body.id_user}';
                `);

            } else {
                console.log("segunda consulta (grupo)")
                segundaConsulta = await realizarQuery(`
                    SELECT Users.nombre, Users.foto_perfil, Users.id_user
                    FROM Users
                    INNER JOIN UsersChats ON UsersChats.id_user = Users.id_user
                    WHERE UsersChats.id_chat = '${chat.id_chat}' AND Users.id_user!='${req.body.id_user}'
                `);
            }
        }*/

        console.log("funcionó")
        console.log(response)
        res.send(response)   
    } catch (error) {
        console.error(error);
        res.send("error obtener contactos");
    }
})

app.post('/obtenerMensajes', async function (req,res){
    try {
        const response = await realizarQuery(`
            SELECT * FROM Messages WHERE id_chat = '${req.body.id_chat}'    
        `);
        res.send(response);
    } catch (error) {
        console.error(error);
        res.send("error al obtener mensajes");
    }
});

app.post('/register', async function (req, res) {
    console.log(req.body)
    try {
        if (req.body.foto_perfil == null) {
            req.body.foto_perfil = null
        } else {
            req.body.foto_perfil = `'${req.body.foto_perfil}'`
        }
        const respuesta = await realizarQuery(`
            INSERT INTO Users (nombre, email, contraseña, foto_perfil, online)    
            VALUES ('${req.body.nombre}', '${req.body.email}', '${req.body.password}', ${req.body.foto_perfil}, ${req.body.online})
        `)
        res.send({res: true, message: "Usuario Creado Correctamente"})
    } catch (error) {
        console.log(error)
    }
})