import styles from "../static/css/dropdown.module.css";
import { Dropdown } from "semantic-ui-react";
import { useEffect } from "react";

function DropdownDiv({
  options,
  create,
  title,
  placeholder,
  newComp,
  changeHandler,
}) {
  useEffect(() => {
    console.log("Im detecting the changes in newComp ", newComp);
  }, [newComp]);

  function itChange(e, { value }) {
    changeHandler(value);
  }

  if (newComp) {
    return (
      <div style={{ width: "300px" }}>
        <Dropdown
          fluid
          search
          selection
          options={options}
          value={options.length > 0 && options[options.length - 1].value}
          placeholder={placeholder}
          defaultUpward={true}
          onChange={itChange}
        />
        <small className={styles.sm} onClick={create}>
          {title}
        </small>
      </div>
    );
  } else {
    return (
      <div style={{ width: "300px" }}>
        <Dropdown
          fluid
          search
          selection
          options={options}
          placeholder={placeholder}
          onChange={itChange}
        />
        <small className={styles.sm} onClick={create}>
          {title}
        </small>
      </div>
    );
  }
}
export default DropdownDiv;
