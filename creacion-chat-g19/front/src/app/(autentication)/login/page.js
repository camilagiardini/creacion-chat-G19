"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Form from "@/components/Form"
import styles from "./login.styles.css"



export default function LoginPage() {
    const [usuarios, setUsuarios] = useState([])
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    
    useEffect(() => {
        fetch("http://localhost:4000/usuarios")
        .then(response => response.json())
        .then(result => {
            setUsuarios(result)
        }) // .then es la forma para comunicarte con elback

        .catch((err) => {
            console.log("Error al conectar con el servidor:", err);
        })
    }, [])

    function singIn() {
        let encontrado = false;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].email === user && usuarios[i].contraseña === password) {
                encontrado = true;
                console.log("Login exitoso");
                router.push("/chat");
                break;
            }
        }
        if (!encontrado) {
            console.log("Usuario o contraseña incorrectos");
        }
    }
    function savePassword(event) {
        setPassword(event.target.value)
    }
    function saveUser(event){
        setUser(event.target.value)
    }



  return (
    <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={e => { e.preventDefault(); singIn(); }}>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={user}
                onChange={saveUser}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={savePassword}
                required
            />
            <button type="submit">Entrar</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
            ¿No tienes cuenta?{" "}
            <a href="/register">Regístrate aquí</a>
        </p>
    </div>
)
}