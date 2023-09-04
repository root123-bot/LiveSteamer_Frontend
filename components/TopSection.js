import styles from "../static/css/topsec.module.css";
import { Input, Button } from "semantic-ui-react";
import Router from "next/router";

function TopSection({ title }) {
  return (
    <div className={styles.rootContainer}>
      <div className={styles.floatLeft}>
        <Input icon="search" placeholder={`Search ${title.toLowerCase()}...`} />
      </div>
      <div className={styles.floatRight}>
        <Button
          icon="plus"
          content={`Add ${title}`}
          onClick={() => Router.push(`/${title.toLowerCase()}`)}
        />
      </div>
    </div>
  );
}

export default TopSection;
