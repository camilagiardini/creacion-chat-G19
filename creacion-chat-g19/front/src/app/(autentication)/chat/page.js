"use client"
import Contact from "../../../components/Contact";
import Button from "../../../components/Button";
import Message from "../../../components/Message";
import Input from "../../../components/Input";
import Title from "@/components/Title";
import styles from "./chat.styles.css";
import clsx from "clsx";
import {useEffect, useState} from "react";
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";
import { SearchParams } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

export default function Chats(props) {
    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useState("")
    const searchParams = useSearchParams();
    const id_user = searchParams.get("id_user"); // obtiene el id del usuario que inició sesión

    useEffect(() => {
        fetch(`http://localhost:3000/mostrarContactos?id_user=${id_user}`)
        .then(response => response.json())
        .then(result => {
            setContacts(result)
        }) // .then es la forma para comunicarte con elback

    }, [id_user]) 

    return(
        <>  
            <div className="chats">
                <div className="contenedor-contactos">
                    <Title title="Chats"></Title>
                    <Contact></Contact>
                </div>
                <div className="contenedor-chat">
                    <p>acá aparece el chat</p>
                </div>
            </div>

        </>
    )
}