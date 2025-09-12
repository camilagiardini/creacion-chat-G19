"use client"
import Contact from "../../../components/Contact";
import Button from "../../../components/Button";
import Message from "../../../components/Message";
import Input from "../../../components/Input";
import Title from "@/components/Title";
import styles from "./chat.styles.css";
import clsx from "clsx";
import {useEffect, useState} from "react";

export default function Chats(props) {
    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useState("")
    async function mostrarContactos(){
        response = await fetch (`http://localhost:3000/mostrarContactos?id_user=${id_user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const result = await response.json()
        return result
    }

    useEffect(() => {
        mostrarContactos()
        console.log("cambio el estado")
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