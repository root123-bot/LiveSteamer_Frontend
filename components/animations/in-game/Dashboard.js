import { motion } from "framer-motion";
import styles from "../../../static/css/animations/in-game/dashboard.module.css";

function Dashboard() {
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
                width: "46%",
                padding: 0,
                margin: 0,
                marginTop: 5,
                marginBottom: 5,
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
              <img style={{
                marginLeft: 50

              }} src="../../static/images/yanga.png" width={80} height={60} />
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
            <div style={{
              display: "flex",
              width: "14%",
              alignItems: "center"
            }}>
              <div
                  style={{
                    width: "33.33%",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#0e1f29",
                    alignItems: "center",
                    
                    height: "100%"
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
                    alignItems: "center",
                    backgroundColor: "#0e1f29",
                    height: "100%"

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
                    alignItems: "center",
                    backgroundColor: "#0e1f29",
                    height: "100%"

                  }}
                >
                  <span
                    style={{ color: "white", fontSize: 35, textAlign: "right" }}
                  >
                    0
                  </span>
                </div>
            </div>
            <motion.div
              style={{
                display: "flex",
                width: "46%",
                padding: 0,
                margin: 0,
                marginTop: 5,
                marginBottom: 5,
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
              <img style={{
                marginRight: 50
              }} src="../../static/images/azam.png" width={60} height={60} />
            </motion.div>
          </div>
          
        </div>
        <div style={{
          height: 500,
          backgroundColor: "rgba(12, 90, 136, 0.773)",
          color: "white",
          marginLeft:40,
          marginRight: 40,
        }}>
          Hello world
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
