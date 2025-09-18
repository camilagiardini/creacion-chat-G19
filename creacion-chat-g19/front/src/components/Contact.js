"use client"
import styles from "./Contact.module.css"

export default function Contact(props){
    return (
        <>
            <div className={styles.contactoindividual} onclick={props.onClick}>
                <img src={`/images/${props.foto_perfil}`}></img>
                <h1 className={styles.nombrecontacto}>{props.nombreContacto}</h1>
            </div>
        </>
            
    )
}

/*let contactos = [
    {nombre:Martin, foto:lafoto, nroTelefono: 1456416}
]*/