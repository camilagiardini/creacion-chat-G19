import styles from "@/components/Button.module.css"
import clsx from "clsx"


export default function Button(props){
    return (
        <>
            <button 
            className={clsx((styles.button), {
                [styles.buttonRegister] : props.page === "register",
                [styles.buttonEnviar] : props.page === "chat"
            })} 
            
            onClick={props.onClick} 
            >{props.text}
            </button>
        </>
    )
}