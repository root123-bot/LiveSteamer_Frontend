import styles from "../static/css/acard.module.css";
function AssetCard({ title, logo, lname, height }) {
  return (
    <div className={styles.container}>
      <div className={styles.imgWrapper}>
        <img src={logo} width={150} height={height && 150} />
      </div>

      <p className={styles.name}>
        {title} {lname}
      </p>
    </div>
  );
}

export default AssetCard;
