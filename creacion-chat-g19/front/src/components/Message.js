"use client"
import styles from "./Message.module.css"

export default function Message(props) {
    return(
        <>
            <p className={styles.textomensaje}>{props.textoMensaje}</p>
        </>
    )
}