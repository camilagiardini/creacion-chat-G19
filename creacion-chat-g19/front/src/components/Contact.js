"use client"

export default function Contact(props){
    return (
        <>
            <img src={props.foto_perfil}></img>
            <h1>{props.nombreContacto}</h1>
            <p>{props.numeroTelefono}</p>
            <p>{props.descripcion}</p>
        </>
            
    )
}

/*let contactos = [
    {nombre:Martin, foto:lafoto, nroTelefono: 1456416}
]*/