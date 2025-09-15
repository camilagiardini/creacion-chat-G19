"use client"
import Contact from "../../../components/Contact";
import Button from "../../../components/Button";
import Message from "../../../components/Message";
import Input from "../../../components/Input";
import Title from "@/components/Title";
import clsx from "clsx";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";
import styles from "@/app/(autentication)/chat/page.module.css"

export default function Chats() {
    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useState("")
    const searchParams = useSearchParams();
    const id_user = searchParams.get("id_user"); // obtiene el id del usuario que inició sesión

    useEffect(() => {
        console.log("entró")
        fetch(`http://localhost:4000/mostrarContactos?id_user=${id_user}`)
        .then(response => response.json())
        .then(result => {
            setContacts(result)
        }) // .then es la forma para comunicarte con elback

    }, [id_user]) 

    return(
        <>  
            <div className="chats">
                <div className={styles.contenedorcontactos}>
                    <Title title="Chats" className="titulo"></Title>
                    {
                        contacts.length!=0 &&
                        contacts.map(element => (
                            <Contact foto_perfil={element.foto_perfil} nombreContacto={element.nombre} className={styles.Contact}></Contact>
                        ))
                    }
                </div>
                    <p>chat individual</p>
                <div className="contenedorchat">
                </div>
            </div>

        </>
    )
}