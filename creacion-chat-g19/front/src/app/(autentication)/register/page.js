"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./register.styles.css"

export default function RegisterPage() {
    const [usuarios, setUsuarios] = useState([])
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        fetch("http://localhost:4006/usuarios")
            .then(response => response.json())
            .then(result => setUsuarios(result))
            .catch(err => console.error("Error al cargar usuarios:", err))
    }, [])

    async function singUp(e) {
        e.preventDefault()
        const nuevoUsuario = {
            email: email,
            password: password
        }

        const existe = usuarios.some(u => u.email === nuevoUsuario.email)

        if (existe) {
            setError("Ese correo ya está registrado")
            return
        }

        try {
            const response = await fetch("http://localhost:4006/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario)
            })

            if (response.ok) {
                router.push("/login")
            } else {
                setError("Error al crear el usuario")
            }
        } catch (error) {
            setError("Hubo un problema con el registro")
        }
    }

    return (
        <div className="login-container">
            <h2>Crear Cuenta</h2>
            <form onSubmit={singUp}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setEmail(e.target.value)}
                    }
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setPassword(e.target.value)}
                    }
                    
                    required
                />
                <button type="submit">Registrarse</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>
                ¿Ya tienes cuenta?{" "}
                <Link href="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    )
}