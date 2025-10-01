"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "@/app/(autentication)/register/register.module.css"

export default function RegisterPage() {
    const [usuario, setUsuario] = useState([])
    const [email, setEmail] = useState("")
    const [nombre, setNombre] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [foto, setFoto] = useState("")
    const router = useRouter()

    useEffect(() => {
        if (usuario.existe == false) {
            signUp()
        } else if (usuario.existe == true) {
            console.log("Error - Ya existe un usuario con ese mail")
        }
    }, [usuario])


    function exists() {

        if (!nombre || !email || !password) {
            console.log("Error Complete todos los campos por favor")
            return
        }

        fetch("http://localhost:4000/encontrarUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: email})
        })
        .then(response => response.json())
        .then(result => {
            setUsuario(result)
        })
    }







    function signUp() {
        const userData = {
            nombre: nombre,
            email: email,
            password: password,
            foto_perfil: foto,
            online: false
        }

        if (password === passwordConfirm) {
            fetch("http://localhost:4000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(result => {
                console.log("usuario creado exitosamente")
                sessionStorage.setItem("isLogged", "true")
                fetch('http://localhost:4000/conseguirID', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                    })
                    .then(response => response.json())
                    .then(data => {
                        sessionStorage.setItem("userId", data[0].id_user); // guardar userId 
                        console.log("userId guardado en sessionStorage:", data[0].id_usuario);
                        router.replace("./chat")
                    })
            })
        } else {
            console.log("Contraseñas no coinciden")
        }



    }





    return (
        <div className={styles.Contenedorbody}>
            <div className={styles.loginContainer}>
                <h2>Register</h2>
                <br></br>
                <p>Complete los datos para el registro</p>
                <Input page="register" placeholder="Escriba su nombre" type="text" onChange={(e) => {setNombre(e.target.value)}}/>
                <Input page="register" placeholder="Escriba su Contraseña" type="password" onChange={(e) => {setPassword(e.target.value)}}/>
                <Input page="register" placeholder="Escriba su Contraseña De nuevo" type="password" onChange={(e) => {setPasswordConfirm(e.target.value)}}/>
                <Input page="register" placeholder="Escriba su mail" type="email" onChange={(e) => {setEmail(e.target.value)}}/>
                <Input page="register" placeholder="Ponga el enlace de su foto (publico)" type="text" onChange={(e) => {setFoto(e.target.value)}}/>
                <Button onClick={exists} page="register" text="Registrarse"></Button>
            </div>
            
        </div>
    )
}