"use client"

import Button from "./Button";
import Input from "./Input";
import Title from "./Title";

export default function Form(props){
    return (
        <>
            <Title></Title>
            <h3>Username:</h3>
            <Input></Input>
            <h3>Mail:</h3>
            <Input></Input>
            <h3>Password:</h3>
            <Input></Input>
            <Button texto={props.texto}></Button>
        </>
    )
}