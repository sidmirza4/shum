import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function App() {
  const [step, setStep] = useState(0);

  const next = () => setStep((prev) => prev + 1);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.6 },
    },
  };

  const Section = ({ children }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={styles.section}
    >
      {children}
    </motion.div>
  );

  return (
    <div style={styles.wrapper}>
      {/* Google Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400;500&display=swap');
        `}
      </style>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <Section key="intro">
            <h1 style={styles.heading}>
              For the girl <br /> who stayed.
            </h1>
            <button style={styles.button} onClick={next}>
              Open
            </button>
          </Section>
        )}

        {step === 1 && (
          <Section key="years">
            <p style={styles.body}>
              8 years. <br />
              Not perfect years. <br />
              Not easy years. <br />
              <br />
              But real years.
            </p>
            <button style={styles.button} onClick={next}>
              Continue
            </button>
          </Section>
        )}

        {step === 2 && (
          <Section key="truth">
            <p style={styles.body}>
              We fought. <br />
              We misunderstood. <br />
              We disappeared sometimes. <br />
              <br />
              But somehow… we always came back.
            </p>
            <button style={styles.button} onClick={next}>
              Continue
            </button>
          </Section>
        )}

        {step === 3 && (
          <Section key="sneakers">
            <p style={styles.body}>
              When you gave me those sneakers… <br />
              I felt something different. <br />
              <br />
              I felt chosen. <br />
              <br />
              And I don’t think I’ve told you <br />
              how much that meant.
            </p>
            <button style={styles.button} onClick={next}>
              Continue
            </button>
          </Section>
        )}

        {step === 4 && (
          <Section key="stay">
            <h1 style={styles.heading}>
              I don’t want dramatic love. <br />
              I don’t want temporary love. <br />
              <br />
              I want peaceful love. <br />
              With you.
            </h1>
            <button style={styles.button} onClick={next}>
              Stay 🤍
            </button>
          </Section>
        )}

        {step === 5 && (
          <Section key="final">
            <h1 style={styles.heading}>
              Happy Valentine’s Day.
            </h1>
            <p style={{ ...styles.body, marginTop: 20 }}>
              Thank you for choosing me again.
            </p>
          </Section>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "40px",
    boxSizing: "border-box",
    background:
      "linear-gradient(180deg, #F8F4F1 0%, #EFE7E1 100%)",
    color: "#2E2A27",
  },
  section: {
    maxWidth: "700px",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontSize: "72px",
    lineHeight: 1.05,
    marginBottom: "40px",
    letterSpacing: "-0.5px",
  },
  body: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: "20px",
    lineHeight: 1.7,
  },
  button: {
    marginTop: "40px",
    padding: "14px 36px",
    fontSize: "16px",
    borderRadius: "40px",
    border: "none",
    backgroundColor: "#C8A2A2",
    color: "white",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};
