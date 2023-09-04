import styles from "../static/css/header.module.css";

function Title({ title, optionTitle, style }) {
  return (
    <div className={styles.head}>
      <p className={styles.mini} style={style && style.minHeader}>
        {optionTitle ? optionTitle.toUpperCase() : "Manage"}
      </p>
      <p className={styles.max} style={style && style.mainHeader}>
        {title}
      </p>
    </div>
  );
}

export default Title;
