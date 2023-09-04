import styles from "../static/css/imageIn.module.css";
import { useRef } from "react";

function ImageInput({ title, style, save }) {
  const imageInp = useRef();

  function onChange(e) {
    e.preventDefault();
    const file = e.target.files[0];

    if (file && file.type.substr(0, 5) === "image") {
      const reader = new FileReader(); // this is going to give base64 encoding string of image which can be accepted in 'src' to preview...
      // this event wait for reader to read or convert image to base64 encoding..
      reader.onloadend = () => {
        imageInp.current.style.backgroundImage = `url(${reader.result})`;
        imageInp.current.style.backgroundSize = "100% 100%";
        imageInp.current.style.backgroundRepeat = "no-repeat";

        save(file);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("You uploaded different file type apart from image..");
    }
  }

  return (
    <div style={style}>
      <label className={styles.jina}>{title}:</label>
      <br />
      <input
        accept="image/*"
        id="upload"
        className={styles.upload}
        type="file"
        onChange={onChange}
      />
      <label htmlFor="upload" className={styles.chan} ref={imageInp}>
        <img src="../static/images/add-image.png" width={100} height={100} />
      </label>
    </div>
  );
}

export default ImageInput;
