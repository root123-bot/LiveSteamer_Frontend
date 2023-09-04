import { Icon } from "semantic-ui-react";
import styles from "../static/css/mmatch.module.css";

function Match({ homeLogo, awayLogo, home, away, stadium, warning }) {
  return (
    <div className={styles.holder}>
      <div className={styles.wrapper}>
        <div className={styles.teamWrapper}>
          <img src={homeLogo} width={30} />
          <span className={styles.teamName}>{home}</span>
        </div>
        <img src="../static/images/versus1.png" width={30} height={20} />
        <div className={styles.teamWrapper}>
          <img src={awayLogo} width={30} />
          <span className={styles.teamName}>{away}</span>
        </div>
      </div>
      <hr className={styles.hl} />
      <div className={styles.otherContentWrapper}>
        <img src="../static/images/kiwanja.png" width={33} height={33} />
        <span className={styles.pitchName}>{stadium}</span>
      </div>
      <div className={styles.otherContentWrapper1}>
        <div className={styles.time}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              console.log("He clicked mark as completed");
            }}
            className={styles.timeValue}
          >
            Mark as completed
          </span>
          {warning && <Icon name="warning circle" color="red" />}
        </div>
      </div>
    </div>
  );
}

export default Match;
