import styles from '../static/css/pointer.module.css'

function Pointer({text, value}) {
    return (
        <div className={styles.holder}>
            <img src='../static/images/point0.png' width={25} height={25} />
            <p className={styles.popo}>{text}: <span className={styles.val}>{value}</span></p>
            <hr className={styles.hrc} />
        </div>
    )
}

export default Pointer;