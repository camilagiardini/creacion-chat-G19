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
import styles from "@/app/(autentication)/chat/page.module.css";
import Popup from "reactjs-popup";



export default function Chats() {
  const [contacts, setContacts] = useState([]);
  const [idChat, setIdChat] = useState(0);
  const [id_user, setIdUser] = useState(0);
  const [chatSeleccionado, setChatSeleccionado] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const searchParams = useSearchParams()

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [mailInput, setMailInput] = useState("");

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
    if (id_chat == 0) {
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
        return response;
      })
      .then((mensajes) => console.log(mensajes))
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
              <Button onClick page="chat" text="enviar"></Button>
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
  );
}
