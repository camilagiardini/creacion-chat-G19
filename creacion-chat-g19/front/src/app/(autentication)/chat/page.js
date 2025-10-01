"use client";



import Contact from "@/components/Contact"; 
import Button from "@/components/Button"; 
import Message from "@/components/Message"; 
import Input from "@/components/Input"; 
import Title from "@/components/Title";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/app/chat/page.module.css";  

export default function Chats() {

  const router = useRouter()
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [contacts, setContacts] = useState([]);

  
  const [idChat, setIdChat] = useState(0);
  const [id_user, setIdUser] = useState(0);
  const searchParams = useSearchParams(); 

  useEffect(() => {
    try {
        const isLogged = sessionStorage.getItem("isLogged");
        if (isLogged !== "true") {
            router.replace("./login")
        }
    } catch (error) {
        console.log(error)
    }
}, [])

  useEffect(() => {
    if (idChat) {
      console.log("idChat actualizado:", idChat);
    }
  }, [idChat]); //useEffect para cuando cambia idChat (diferente a la variable id_chat)

  useEffect(() => {
    fetch("http://localhost:4000/mostrarContactos", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id_user: sessionStorage.getItem("userId")})
    })
    .then((response) => response.json())
    .then((data) => {
      setContacts(data);
    }); // .then es la forma para comunicarte con elback
  }, []);

    function mostrarChat(id_chat) {
      console.log(id_user);
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
        .then((id_chat) =>{
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
      .then((mensajes)=> console.log(mensajes))
  }

  return (
    <>
      <div className={styles.chats}>
        <div className={styles.contenedorcontactos}>
        <Title title="Chats" className={styles.tituloChat}></Title>
          {contacts.length != 0 &&
            contacts.map((element,i) => {
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
          <p>chat individual</p>
          {mensajes.length != 0 &&
            mensajes.map((element,i) => {
              return (<Message
                key={i}
                textoMensaje={element.content}
                id_messages={element.id_messages}
                className={styles.Message}
              ></Message>)
            })
          }
        </div>
      </div>
    </>
  );
}
