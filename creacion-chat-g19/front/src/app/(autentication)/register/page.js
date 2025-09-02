"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [usuarios, setUsuarios] = useState([])
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    useEffect(() => {
        fetch("http://localhost:4006/usuarios")
            .then(response => response.json())
            .then(result => setUsuarios(result))
            .catch(err => console.error("Error al cargar usuarios:", err))
    }, [])

    async function singUp() {
        const nuevoUsuario = {
            user: user,
            password: password
        }

        const existe = usuarios.some(u => u.user === nuevoUsuario.user)

        if (existe) {
            console.log("Ese usuario ya existe")
            return
        }

        try {
            const response = await fetch("http://localhost:4006/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario)
            })

            if (response.ok) {
                console.log("Usuario creado con éxito")
                router.push("./login")
            } else {
                console.log("Error al crear el usuario")
            }
        } catch (error) {
            console.error("Hubo un problema con el registro:", error)
        }
    }

    function saveUser(event) {
        setUser(event.target.value)
    }
    function savePassword(event) {
        setPassword(event.target.value)
    }

    return (
        <>
            <h1>Registrarse</h1>
            <div className="contenedor-register">
                <div className="inputs-register">
                    <Input placeholder="Usuario" type="text" onChange={saveUser} />
                    <Input placeholder="Contraseña" type="password" onChange={savePassword} />
                    
                    <Button text="Crear cuenta" onClick={singUp}></Button>
                    <h3>¿Ya tienes cuenta?</h3>
                    <Link href="./login">Inicia sesión</Link>
                </div>
            </div>
            
        </>
        
    )
}




