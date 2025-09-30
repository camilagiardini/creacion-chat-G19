import styles from './Title.module.css';

export default function Title(props){
    return(
        <>
            <h1 className={styles.title}>{props.title}</h1>
        </>
    )
}