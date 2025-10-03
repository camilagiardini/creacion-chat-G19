"use client";
import Contact from "../../../components/Contact";
import Button from "../../../components/Button";
import Message from "../../../components/Message";
import Input from "../../../components/Input";
import Title from "@/components/Title";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useSocket } from '../../../hooks/useSocket.js';
import styles from "@/app/(autentication)/chat/page.module.css";



export default function Chats() {
  const [contacts, setContacts] = useState([]);
  const [idChat, setIdChat] = useState(0);
  const [id_user, setIdUser] = useState(0);
  const [mensajes, setMensajes] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIdUser(searchParams.get("id_user"))
    console.log("id user:", id_user);
  }, [id_user])

  useEffect(() => {
    if (idChat) {
      console.log("idChat actualizado:", idChat);
    }
  }, [idChat]); //useEffect para cuando cambia idChat (diferente a la variable id_chat)

  useEffect(() => {
    if (id_user) {
      fetch(`http://localhost:4000/mostrarContactos?id_user=${id_user}`)
        .then((response) => response.json())
        .then((result) => {
          setContacts(result);
        });
    }
  }, [id_user]);

  useEffect(() => {
        if (!socket) return;

        // Recibir mensajes en tiempo real
        socket.on("newMessage", (data) => {
            console.log(data)
            setMensajes((prev) => [...prev, {
                id_user: data.message.id_user || "otro",
                textoMensaje: data.message.textoMensaje,
                hora: data.message.hora
            }]);
        });

        // Ping de prueba
        socket.on("pingAll", (data) => {
            console.log(" Ping recibido:", data);
        });

        return () => {
            socket.off("newMessage");
            socket.off("pingAll");
        }
    }, [socket, idChat]);


  //Abrir el popup
    const openPopup = () => {
        setPopupOpen(true)
    }

    //Cerrar el popup
    const closePopup = () => {
        setPopupOpen(false)
        setMailInput("") //Limpia el input al cerrar el popup
    }

  function mostrarChat(id_chat) {
    console.log("id chat:", id_chat);
    fetch(`http://localhost:4000/seleccionarChat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_user: id_user,
        id_chat: id_chat
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setIdChat(id_chat);
        console.log("Chat seleccionado:", id_chat);
        console.log("estado: ", idChat);
        return id_chat;
      })
      .then((id_chat) => {
        console.log("funcion traerMensajes");
        traerMensajes(id_chat);
      });
  }

  function traerMensajes(id_chat) {
    console.log("entro a traer mensajes");
    if (!id_chat || id_chat == 0) {
      console.log("No hay chat seleccionado");
    }
    fetch(`http://localhost:4000/obtenerMensajes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_user: id_user,
        id_chat: id_chat
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setMensajes(response);
        if (socket) {
          const roomName = `chat_${id_chat}`;
          socket.emit("joinRoom", { room: `chat_${id_chat}` });
          console.log(`Socket.IO: Uniéndose al room: ${roomName}`);
        }

        return response;
      })
      .then((mensajes) => console.log(mensajes))
  }

  

  function sendNewMessage() {
    console.log("entro a sendNewMessage");
    try {
      if (nuevoMensaje.trim === " " || !selectedContact || !socket) return;

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      const  messageData = {
        id_user: id_user,
        id_chat: idChat,
        textoMensaje: nuevoMensaje,
        hora: formattedDate
      }
      //socket.emit("sendMessage", messageData);

      setNuevoMensaje("")

      fetch("http://localhost:4000/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Mensaje enviado:", data);
      })
      if (socket) {
        socket.emit("sendMessage", messageData);
      }
    } catch (error) {
      console.log("error al enviar mensaje:", error);
    }
  }










  function newChat() {
    const userId = sessionStorage.getItem("userId")
        console.log(userId)
        try {
            // 1. compruebo que el mail sea valido
            if(!mailInput.trim()) {
                alert("Por favor, ingresa un mail")
                return
            }
            
            //2. Creo la constante de los datos del Nuevo Chat
            const datosNewChat = {
                email: mailInput.trim(),
                nombre: "",
                id_usuarioAjeno: 0
            }

            console.log("Datos del nuevo Chat: ", datosNewChat)
    
            // 3. Realizo el fetch que busca al usuario con ese mail.
            fetch('http://localhost:4000/conseguirUser', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: datosNewChat.email})
            })
            .then(res => res.json())
            .then(dataUser => {
                console.log("Datos del usuario: ", dataUser)
                if (dataUser.length === 1) {
                    console.log("Se ha encontrado al usuario")
                    datosNewChat.nombre = dataUser.vector[0].nombre
                    datosNewChat.id_usuarioAjeno = dataUser.vector[0].id_user
                    setContacts([...contacts, dataUser.vector[0]])
                    fetch('http://localhost:4000/newChat', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({id_usuarioAjeno: datosNewChat.id_usuarioAjeno, id_usuarioPropio: userId, tipo_chat: false})
                    })
                    .then(res => res.json())
                    .then(chat => {
                        console.log(chat)
                        closePopup()
                        
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }
  }

  return (
    <>
      <Title title="Chats" className={styles.tituloChat}></Title>
      <Button use="nuevoChat" text="Nuevo Chat" onClick={openPopup}/>
      <div className={styles.chats}>
        <div className={styles.contenedorcontactos}>
         
          {contacts.length != 0 &&
            contacts.map((element, i) => {
              return (<Contact
                key={i}
                foto_chat={element.foto_chat}
                nombreContacto={element.nombre_chat}
                id_user={element.id_user}
                onClick={() => mostrarChat(element.id_chat)}
                className={styles.Contact}
              ></Contact>)
            })}
        </div>

        <div className={styles.contenedorchatindividual}>
          {mensajes.length != 0 &&
            mensajes.map((element, i) => {
              return (<Message
                key={i}
                textoMensaje={element.content}
                hora={element.hora}
                id_messages={element.id_messages}
                className={styles.Message}
              ></Message>
            )
            })
          }
          {idChat !==0 && (
            <div className={styles.inputContainer}>
              <Input className={styles.inputMessage}
                page="chat"
                type="text"
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
              />
              <Button onClick={sendNewMessage} page="chat" text="enviar"></Button>
            </div>
          )}
      </div>
      </div>
      <Popup
                open={isPopupOpen}
                onClose={closePopup}
                modal
                nested
                closeOnDocumentClick={false}
                >
                    <div className={styles.modal}>
                        <div className={styles.header}>
                            <h2>Nuevo Chat</h2>
                        </div>
                        <div className={styles.content}>
                            <p>Ingresa el mail del usuario con quien quieres chatear</p>
                            <Input type="mail" placeholder="ejemplo@mail.com" value={mailInput} onChange={(e) =>setMailInput(e.target.value)} use="mailNewChat"/>
                        </div>
                        <div className={styles.actions}>
                            <button onClick={closePopup} className={styles.cancelBtn}>Cancelar</button>
                            <button onClick={newChat} className={styles.createBtn}>Crear chat</button>
                        </div>
                    </div>
            </Popup>
    </>
  );}