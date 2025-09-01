"use client"


export default function Button(props){
    return (
        <>
            <button className="button-login" onClick={props.onClick}>{props.text}</button>
        </>
    )
}