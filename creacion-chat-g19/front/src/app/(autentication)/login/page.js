"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Form from "@/components/Form"


export default function LoginPage() {
    let entrar = false
    const [usuarios, setUsuarios] = useState([])
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    
    useEffect(() => {
        fetch("http://localhost:4000/usuarios") //trae usuarios y lo devuelve
        .then(response => response.json())
        .then(result => {
            setUsuarios(result)
            console.log(usuarios)
        })
    })   //.then es la forma para comunicarte con elback 


    function singIn() {
        for (let i=0; i < usuarios.lenght; i++) {
            if (usuarios[i].mail == user) {
                if (usuarios[i].contraseña == password) {
                    entrar = true
                    console.log ("entramos")
                    router.push("./../chat")
                }
            }
        }
        if (entrar == false) {
                console.log("Usuario o Contraseña incorrectos")
            }
    }
    function savePassword(event) {
        setPassword(event.target.value)
    }
    function saveUser(event){
        setUser(event.target.value)
    }


    return(
        <>
            <h1>Este serà el login</h1>
            <div className="contenedor-login">
                <div className="inputs-login">
                    <Input placeholder="Escriba su email" id="email" className="inputs-login" type="email" onChange={saveUser}/>
                    
                    <Input placeholder="Escriba su contraseña" id="password" className="inputs-login" type="password" onChange={savePassword}/>
                    <Button text="Sing in" onClick={singIn}></Button>
                    <h3>¿Es tu primera vez ingresando?</h3>
                    <Link href="./register">Registrarse</Link>
                </div>
            </div>
            <Form></Form>
        </>
    )
}   