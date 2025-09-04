"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Form from "@/components/Form"


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
                <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>Iniciar sesión</h1>
                <div style={{width: '100%'}}>
                    <label style={{fontWeight: '500', color: '#64748b'}}>Email:</label>
                    <Input placeholder="Escriba su email" id="email" type="email" onChange={saveUser} style={{width: '100%', marginBottom: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '10px'}}/>
                </div>
                <div style={{width: '100%'}}>
                    <label style={{fontWeight: '500', color: '#64748b'}}>Contraseña:</label>
                    <Input placeholder="Escriba su contraseña" id="password" type="password" onChange={savePassword} style={{width: '100%', marginBottom: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', padding: '10px'}}/>
                </div>
                <Button text="Entrar" onClick={singIn} style={{width: '100%', background: '#6366f1', color: '#fff', borderRadius: '10px', padding: '12px', fontWeight: 'bold', fontSize: '1rem', border: 'none', boxShadow: '0 2px 8px rgba(99,102,241,0.15)'}}/>
                <Link href="./register" style={{color: '#6366f1', fontWeight: '500', marginTop: '10px'}}>¿No tienes cuenta? Regístrate</Link>
            </div>
        </div>
    )
}   
    

/*
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e) => {
    e.preventDefault()

    // Ejemplo simple de validación
    if (email === "admin@test.com" && password === "1234") {
      alert("Login exitoso ✅")
      router.push("/home") // redirige a la página principal
    } else {
      alert("Usuario o contraseña incorrectos ❌")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Entrar
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          ¿No tienes cuenta? <a href="/register" className="text-blue-500">Regístrate</a>
        </p>
      </div>
    </div>
  )
}
 */