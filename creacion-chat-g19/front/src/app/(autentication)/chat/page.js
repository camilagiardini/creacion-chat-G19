"use client"
import Contact from "../../../components/Contact";
import Button from "../../../components/Button";
import Message from "../../../components/Message";
import Input from "../../../components/Input";
import Title from "@/components/Title";
import styles from "./chat.styles.css";
import clsx from "clsx";

export default function Chats(props) {
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