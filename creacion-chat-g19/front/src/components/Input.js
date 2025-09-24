
import styles from "@/components/Input.module.css"
import clsx from "clsx"

export default function Input(props) {

    return (

        <input
            className={clsx((styles.input), {
                [styles.inputRegister] : props.page === "register"
            })}
            type={props.type}
            onChange={props.onChange}
            checked={props.checked}
            placeholder={props.placeholder}/>
    )
}