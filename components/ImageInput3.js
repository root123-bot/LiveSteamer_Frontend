import styles from "../static/css/imageIn.module.css";
import { useRef, useLayoutEffect } from "react";

{
  /* when we use these imageInput more that one we need to have more than ImageInput componets and 
    everyone should possed unique label 'id' htmlFor otherwise they  overapping since we should not have
    the code in page which resembles the id... that's make me creating multiple ImageInputs for team.js since
    there we use three imageInputs.. */
}

function ImageInput3({ title, style, save, shouldBeCleared }) {
  useLayoutEffect(() => {
    save(); //.. the meaning of sending nothing 'save()' is to assign the profile in team.js as 'undefined'... here i send this to team to clear the state of previous image..
    imageInp.current.style.backgroundImage = "none";
  }, [shouldBeCleared]);

  const imageInp = useRef();

  function onChange(e) {
    e.preventDefault();
    const file = e.target.files[0];

    if (file && file.type.substr(0, 5) === "image") {
      const reader = new FileReader(); // this is going to give base64 encoding string of image which can be accepted in 'src' to preview...
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
        id="upload3"
        className={styles.upload}
        type="file"
        onChange={onChange}
      />
      <label htmlFor="upload3" className={styles.chan} ref={imageInp}>
        <img src="../static/images/add-image.png" width={100} height={100} />
      </label>
    </div>
  );
}

export default ImageInput3;
