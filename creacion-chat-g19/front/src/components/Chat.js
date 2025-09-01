"use client"

export default function Chats(props){
    return (
        <>
            <Contact></Contact>
            <Button llamada={props.llamada}></Button>
            <Button videollamada={props.videollamada}></Button>
            <img src={props.fondo} alt="fondo de chat"></img>
            <Message></Message>
            <Button archivosAdjuntos={props.archivosAdjuntos}></Button>
            <Input></Input>
            <Button enviar={props.enviar}></Button>
        </>
    )
}