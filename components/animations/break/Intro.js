import { motion } from "framer-motion";
import styles from "../../../static/css/animations/break/result-bar-intro.module.css";

function ResultBarIntro() {
  return (
    <div className={styles.container}>
      <motion.div
        initial={{
          x: 1000,
          opacity: 0,
        }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{
          duration: 1,
        }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.innerContainer}>
            <motion.div
              style={{
                display: "flex",
                width: "45%",
                padding: 0,
                margin: 0,
                marginTop: 5,
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
                delay: 0.5,
                duration: 1.3,
              }}
            >
              <img src="../../static/images/yanga.png" width={80} height={60} />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ textAlign: "center", fontSize: 30, color: "white" }}
                >
                  YOUNG AFRICANS
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: 100,
                rotate: 180,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: 0,
              }}
              transition={{
                delay: 1.5,
                duration: 1,
                type: "spring",
              }}
              style={{ width: "10%" }}
            >
              <div
                style={{
                  display: "flex",
                  backgroundColor: "",
                }}
              >
                <div
                  style={{
                    width: "33.33%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0e1f29",
                    paddingTop: 3,
                    paddingBottom: 3,
                  }}
                >
                  <span
                    style={{ color: "white", fontSize: 35, textAlign: "left" }}
                  >
                    0
                  </span>
                </div>
                <div
                  style={{
                    width: "33.33%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0e1f29",
                    paddingTop: 3,
                    paddingBottom: 3,
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: 35,
                      textAlign: "center",
                    }}
                  >
                    -
                  </span>
                </div>
                <div
                  style={{
                    width: "33.33%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0e1f29",
                    paddingTop: 3,
                    paddingBottom: 3,
                  }}
                >
                  <span
                    style={{ color: "white", fontSize: 35, textAlign: "right" }}
                  >
                    0
                  </span>
                </div>
              </div>
            </motion.div>
            <motion.div
              style={{
                display: "flex",
                width: "45%",
                padding: 0,
                margin: 0,
                marginTop: 5,
              }}
              initial={{
                opacity: 0,
                x: 100,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.9,
                duration: 0.5,
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ textAlign: "center", fontSize: 30, color: "white" }}
                >
                  AZAM FC
                </span>
              </div>
              <img src="../../static/images/azam.png" width={60} height={60} />
            </motion.div>
          </div>
          <motion.div
            initial={{
              opacity: 0,
              x: 100,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.9,
              duration: 0.5,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#D499B9",
                  fontStyle: "italic",
                }}
              >
                WEMBLEY STADIUM
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src="../../static/images/stopwatch.png"
                  width={13}
                  height={13}
                />
                <span
                  style={{
                    color: "white",
                    fontStyle: "italic",
                    marginLeft: 5,
                  }}
                >
                  First Half
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: 5,
              }}
            >
              <span
                style={{
                  fontStyle: "italic",
                  color: "#EEE0CB",
                }}
              >
                CAF Champions League
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ResultBarIntro;
