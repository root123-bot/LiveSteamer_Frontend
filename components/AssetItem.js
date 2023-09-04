import styles from "../static/css/aitem.module.css";

function AssetItem({ title }) {
  return (
    <div className={styles.item}>
      <img src="../static/images/pointer.png" width={20} />
      <span className={styles.lab}>{title}</span>
    </div>
  );
}

export default AssetItem;
