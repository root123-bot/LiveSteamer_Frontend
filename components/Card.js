import styles from '../static/css/card.module.css'
import { Button, Icon } from 'semantic-ui-react'


function BehaveLikeCard({title, number, logo, iconName}) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={logo} width={100} />
            </div>
            <p className={styles.item1}>{number}</p>
            <p className={styles.item2}>{title}</p>
            <div className={styles.buttonWrapper}>
                <Button animated color='brown'>
                    <Button.Content visible>
                        {`Create ${title}`}
                    </Button.Content>
                    <Button.Content hidden>
                        <Icon name={iconName} />
                    </Button.Content>
                </Button>
            </div>
            {/* <p>{`Create ${title}`}</p> */}
        </div>
    )
}

export default BehaveLikeCard