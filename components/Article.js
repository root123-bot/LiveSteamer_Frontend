import styles from "../static/css/article.module.css";

function Article({ title, logo }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "0.5vw",
      }}
    >
      <img src={logo} width={22} />
      <span className={styles.head}>{title}</span>
    </div>
  );
}

export default Article;
