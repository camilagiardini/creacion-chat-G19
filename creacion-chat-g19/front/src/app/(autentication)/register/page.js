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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '40px',
                width: '350px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center'
            }}>
                <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>Registrarse</h1>
                <div style={{width: '100%'}}>
                    <label style={{fontWeight: '500', color: '#64748b'}}>Usuario:</label>
                    <Input placeholder="Usuario" type="text" onChange={saveUser} style={{width: '100%', marginBottom: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '10px'}}/>
                </div>
                <div style={{width: '100%'}}>
                    <label style={{fontWeight: '500', color: '#64748b'}}>Contraseña:</label>
                    <Input placeholder="Contraseña" type="password" onChange={savePassword} style={{width: '100%', marginBottom: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '10px'}}/>
                </div>
                <Button text="Crear cuenta" onClick={singUp} style={{width: '100%', background: '#6366f1', color: '#fff', borderRadius: '10px', padding: '12px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(99,102,241,0.15)'}}/>
                <Link href="./login" style={{color: '#6366f1', fontWeight: '500', marginTop: '10px'}}>¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
        </div>
    )
}


