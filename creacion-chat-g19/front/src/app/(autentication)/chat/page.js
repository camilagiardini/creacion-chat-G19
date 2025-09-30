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

export default function Chats() {
  const [contacts, setContacts] = useState([]);
  const [id_chat, setIdChat] = useState(0);
  const [id_user, setIdUser] = useState(0);
  const searchParams = useSearchParams();

    useEffect(() => {
        setIdUser(searchParams.get("id_user"))
    }, [])

  useEffect(() => {
    fetch(`http://localhost:4000/mostrarContactos?id_user=${id_user}`)
      .then((response) => response.json())
      .then((result) => {
        setContacts(result);
      }); // .then es la forma para comunicarte con elback
  }, [id_user]);

  function mostrarChat(id_chat) {
    setIdChat(id_chat);
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
    }).then(
        (response) => response.json())
        .then(
            (response) => console.log(response)
        )
    ;
  }

  return (
    <>
      <div className={styles.chats}>
        <div className={styles.contenedorcontactos}>
          <Title title="Chats" className="titulo"></Title>
          {contacts.length != 0 &&
            contacts.map((element,i) => {
              console.log(element)
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

        <div className="contenedorchatindividual">
          <p>chat individual</p>
        </div>
      </div>
    </>
  );
}
