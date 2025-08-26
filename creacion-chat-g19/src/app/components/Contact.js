"use client"

export default function Contact(props){
    return (
        <>
            <img src={props.perfil} alt="foto de perfil"></img>
            <h1>{props.nombreContacto}</h1>
            <p>{props.numeroTelefono}</p>
            <p>{props.descripcion}</p>
        </>
            
    )
}