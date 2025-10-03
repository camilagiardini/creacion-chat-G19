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
   const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const searchParams = useSearchParams();
  const { socket, isConnected } = useSocket({withCredentials: true}, "http://localhost:4000")

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

  return (
    <>
      <Title title="Chats" className={styles.tituloChat}></Title>
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

    </>
  );}