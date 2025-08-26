"use client"
import styles from "@/app/components/Button.module.css"
import clsx from "clsx"

export default function Button(props){
    return (
        <>
            <button className={
                clsx(
                    {
                        [styles.button] : true,
                        [styles.incrementar] : props.color == "verde",
                        [styles.decrementar] : props.color == "rojo"
                    }
                )
            } onClick={props.onClick}>{props.title}</button>
        </>
    )
}