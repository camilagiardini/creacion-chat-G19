import styles from './Title.module.css';

export default function Title(props){
    return(
        <>
            <h1 className={`${styles.title} ${styles.tituloChat}`}>{props.title}</h1>
        </>
    )
}