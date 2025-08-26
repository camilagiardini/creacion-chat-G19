"use client"

export default function Estados(props){
    return (
        <>
            <Title></Title>
            <Button añardirEstado={props.añadirEstado}></Button>
            <h1>Recientes</h1>
            <h1>Vistos</h1>
        </>
    )
}