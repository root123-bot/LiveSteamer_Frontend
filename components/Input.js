import styles from "../static/css/input.module.css";
import { useLayoutEffect, useRef } from "react";

function Input({ label, style, save, max, shouldBeCleared, placeholder }) {
  useLayoutEffect(() => {
    save(""); // this means we assign '' we should not assign it 'undefined' since in our code in team.js we used .trim() and as you remember this trim works with string and not 'undefined', to our state of input found in our parent..
    inputRef.current.value = "";
  }, [shouldBeCleared]);
  const inputRef = useRef();

  function onChangeHandler(e) {
    e.preventDefault();
    save(inputRef.current.value);
  }

  return (
    <div className={styles.container} style={style}>
      <label className={styles.lab}>{label}:</label>
      <br />
      <input
        type="text"
        className={styles.inp}
        ref={inputRef}
        onChange={onChangeHandler}
        maxLength={max && max}
        placeholder={placeholder && placeholder}
        style={placeholder && { fontStyle: "italic" }}
      />
    </div>
  );
}

export default Input;
