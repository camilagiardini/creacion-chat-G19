"use client"
import styles from "./Message.module.css"

export default function Message(props) {
    return(
        <>
            <p className={styles.message}>{props.content}</p>
        </>
    )
}