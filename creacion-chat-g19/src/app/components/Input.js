export default function Input(props) {

    return (
        <>
            <input type={props.type} onChange={props.onChange} checked={props.checked} ></input>
        </>
    )
}