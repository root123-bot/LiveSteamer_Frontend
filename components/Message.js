import styles from "../static/css/message.module.css";

function Message({ content, style }) {
  return (
    <div style={style} className={styles.container}>
      <img src="../static/images/check-mark.png" width={20} height={20} />
      {content}
    </div>
  );
}

export default Message;
