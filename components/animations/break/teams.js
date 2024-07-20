import styles from "../../../static/css/animations/break/teams.module.css";
import { motion } from "framer-motion";

function Teams() {
  return (
    <div className={styles.container}>
      <div className={styles.outerContainer}>
        <motion.div
          style={{
            position: "absolute",
            top: -20,
            color: "white",
            backgroundColor: "#ed543c",
            padding: 5,
            paddingRight: 20,
            paddingLeft: 20,
            fontStyle: "italic",
            fontSize: 20,
          }}
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            delay: 1,
          }}
        >
          <span>WEMBLEY STADIUM</span>
        </motion.div>
        <motion.div
          style={{
            padding: 10,
            paddingTop: 20,
            color: "white",
            backgroundColor: "rgb(12, 91, 136)",
          }}
          initial={{
            opacity: 0,
            x: -100,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.5,
          }}
        >
          <span
            style={{
              fontSize: 18,
            }}
          >
            Champions League
          </span>
        </motion.div>
        <motion.div
          className={styles.innerContainer}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              style={{
                margin: 30,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                rotate: 180
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 0
              }}
              transition={{
                delay: 0.2,
                duration: 1,
                type: "spring",
              }}
            
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="../../static/images/yanga.png"
                  style={{
                    width: "70%",
                  }}
                />
              </div>
              <p
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 25,
                }}
              >
                YANGA AFRICANS
              </p>
            </motion.div>
          </div>
          <motion.div
            style={{
              width: "49%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            initial={{
                opacity: 0,
                scale: 0,
                rotate: 180
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 1,
                type: "spring",
              }}
          >
            <div
              style={{
                margin: 30,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="../../static/images/azam.png"
                  style={{
                    width: "50%",
                  }}
                />
              </div>
              <p
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 25,
                }}
              >
                AZAM FC
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Teams;
