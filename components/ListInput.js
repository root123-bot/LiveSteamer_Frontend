import styles from "../static/css/listInput.module.css";
import { useRef } from "react";

function ListInput({ title, small }) {
  const tareaRef = useRef();

  function adjustTextAreaHeight(e) {
    console.log(e.target.scrollHeight); // so our text area scroll height change when we add a number of columns even if you said overflow: 'hidden'.. So lets adjust its height according to scroll-height..
    const height = e.target.scrollHeight;
    let elem = tareaRef.current;
    // to adjust height make sure you have the 'height' prop in your element and not in 'css' so that why we put style of height in our <textarea> element here instead of having it in listinput.module.css... Koz mwanzo nilivyokuwa najaribu kui-access ilikuwa inareturn 'undefined' it mean the element have no 'height' prop KO NOW NIMEELEWA SABABU..
    if (height > 50) {
      elem.style.height = height.toString() + "px"; // '100px'
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.lab}>{title}:</label>
      <br />
      <textarea
        ref={tareaRef}
        className={styles.tarea}
        onChange={adjustTextAreaHeight}
        style={{ height: "50px" }}
      />
      <small className={styles.sm}>Add new {small}</small>
    </div>
  );
}

export default ListInput;
