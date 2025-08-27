"use client"

import Button from "../../components/Button"
import Input from "../../components/Input"
import Link from "../../components/Link"


export default function LoginPage() {
    let entrar = false
    const [usuarios, setUsuarios] = useState([])
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    
    useEffect(() => {
        fetch("http://localhost:4006/usuarios") //trae usuarios y lo devuelve
        .then(response => response.json())
        .then(result => {
            setUsuarios(result)
        })
    })   //.then es la forma para comunicarte con elback 

    useEffect(() => {
        console.log(usuarios)
    }, [usuarios])

    function singIn() {
        for (let i=0; i < usuarios.lenght; i++)
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

    function singUp(){

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
                    <input placeHolder="Escriba su email" id="email" className="inputs-login" type="email" onChange={saveUser}/>
                    <input placeHolder="Escriba su contraseña" id="password" className="inputs-login" type="password" onChange={savePassword}/>
                    <Button text="Sing in" onClick={singIn}></Button>
                    <h3>¿Es tu primera vez ingresando?</h3>
                    <Link href="./register">Registrarse</Link>
                </div>
            </div>
            <Form></Form>
        </>
    )
}