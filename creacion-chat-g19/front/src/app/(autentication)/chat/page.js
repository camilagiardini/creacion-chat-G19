"use client";

import Contact from "../../../components/Contact";
import Button from "../../../components/Button";
import Message from "../../../components/Message";
import Input from "../../../components/Input";
import Title from "@/components/Title";
import Popup from "reactjs-popup";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from '../../../hooks/useSocket.js';
import styles from "@/app/(autentication)/chat/page.module.css";

export default function Chats() {
  const [contacts, setContacts] = useState([]);
  const [idChat, setIdChat] = useState(0);
  const [id_user, setIdUser] = useState(0);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mailInput, setMailInput] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);     
  const searchParams = useSearchParams();
  const { socket, isConnected } = useSocket();

  // Obtener id_user desde los params
  useEffect(() => {
    const id = searchParams.get("id_user");
    if (id) setIdUser(id);
  }, [searchParams]);

  // Cargar contactos
  useEffect(() => {
    if (!id_user) return;

    fetch(`http://localhost:4000/mostrarContactos?id_user=${id_user}`)
      .then((res) => res.json())
      .then((result) => setContacts(result));
  }, [id_user]);

  // Socket: recibir mensajes y ping
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      console.log("Nuevo mensaje recibido:", data);
      setMensajes(prev => [...prev, data.message]);
    });

    socket.on("pingAll", (data) => {
      console.log("Ping recibido:", data);
    });

    return () => {
      socket.off("newMessage");
      socket.off("pingAll");
    };
  }, [socket, idChat]);

  // Abrir y cerrar popup
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setMailInput("");
  };

  // Seleccionar chat
  function mostrarChat(id_chat) {
    if (!id_chat) return;

    fetch(`http://localhost:4000/seleccionarChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_user, id_chat }),
    })
      .then(res => res.json())
      .then(() => {
        setIdChat(id_chat);
        traerMensajes(id_chat);
      });
  }

  // Traer mensajes de un chat
  function traerMensajes(id_chat) {
    if (!id_chat) return;

    fetch(`http://localhost:4000/obtenerMensajes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_user, id_chat }),
    })
      .then(res => res.json())
      .then((msgs) => {
        setMensajes(msgs);
        if (socket) {
          const roomName = `chat_${id_chat}`;
          socket.emit("joinRoom", { room: roomName });
          console.log(`Socket.IO: Uniéndose al room: ${roomName}`);
        }
      });
  }

  // Enviar mensaje
  function sendNewMessage() {
    if (nuevoMensaje.trim() === "" || !idChat || !socket) return;

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

    const messageData = {
      id_user,
      id_chat: idChat,
      content: nuevoMensaje,
      formattedDate: formattedDate,
    };

    setNuevoMensaje("");
    console.log(nuevoMensaje)

    // Enviar al backend
    fetch("http://localhost:4000/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    })
      .then(res => res.json())
      .then(data => console.log("Mensaje enviado:", data));

    // Emitir socket
    socket.emit("sendMessage", messageData);
  }

  // Crear nuevo chat
  function newChat() {
    const userId = sessionStorage.getItem("userId");
    if (!mailInput.trim()) {
      alert("Por favor, ingresa un mail");
      return;
    }

    const datosNewChat = { email: mailInput.trim(), nombre: "", id_usuarioAjeno: 0 };

    fetch("http://localhost:4000/conseguirUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: datosNewChat.email }),
    })
      .then(res => res.json())
      .then(dataUser => {
        if (dataUser.length === 1) {
          datosNewChat.nombre = dataUser.vector[0].nombre;
          datosNewChat.id_usuarioAjeno = dataUser.vector[0].id_user;
          setContacts([...contacts, dataUser.vector[0]]);

          fetch("http://localhost:4000/newChat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_usuarioAjeno: datosNewChat.id_usuarioAjeno,
              id_usuarioPropio: userId,
              tipo_chat: false
            }),
          })
            .then(res => res.json())
            .then(chat => {
              console.log("Nuevo chat creado:", chat);
              closePopup();
            });
        }
      });
  }

  return (
    <>
      <Title title="Chats" className={styles.tituloChat} />
      <Button use="nuevoChat" text="Nuevo Chat" onClick={openPopup} />

      <div className={styles.chats}>
        <div className={styles.contenedorcontactos}>
          {contacts.map((element, i) => (
            <Contact
              key={i}
              foto_chat={element.foto_chat}
              nombreContacto={element.nombre_chat}
              id_user={element.id_user}
              onClick={() => {
                mostrarChat(element.id_chat);
                setSelectedContact(element);
              }}
              className={styles.Contact}
            />
          ))}
        </div>

        <div className={styles.contenedorchatindividual}>
          {mensajes.map((element, i) => (
            <Message
              key={i}
              content={element.content}
              hora={element.hora}
              id_messages={element.id_messages}
              className={styles.Message}
            />
          ))}

          {idChat !== 0 && (
            <div className={styles.inputContainer}>
              <Input
                className={styles.inputMessage}
                page="chat"
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
              />
              <Button onClick={sendNewMessage} page="chat" text="Enviar" />
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
            <Input
              type="mail"
              placeholder="ejemplo@mail.com"
              value={mailInput}
              onChange={(e) => setMailInput(e.target.value)}
              use="mailNewChat"
            />
          </div>
          <div className={styles.actions}>
            <button onClick={closePopup} className={styles.cancelBtn}>
              Cancelar
            </button>
            <button onClick={newChat} className={styles.createBtn}>
              Crear chat
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}