import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const SECTIONS = [
  {
    id: "intro",
    intro: true,
    paragraphs: [],
  },
  {
    id: "years",
    paragraphs: [
      { text: "8 years.", type: "body" },
      { text: "Not perfect years.", type: "body" },
      { text: "Not easy years.", type: "body" },
      { text: "But real years.", type: "body", marginTop: true },
    ],
  },
  {
    id: "truth",
    paragraphs: [
      { text: "We fought.", type: "body" },
      { text: "We misunderstood.", type: "body" },
      { text: "We disappeared sometimes.", type: "body" },
      { text: "But somehow… we always came back.", type: "body", marginTop: true },
    ],
  },
  {
    id: "sneakers",
    paragraphs: [
      { text: "When you gave me those sneakers…", type: "body" },
      { text: "I felt something different.", type: "body" },
      { text: "I felt chosen.", type: "body", marginTop: true },
      {
        text: "And I don't think I've told you how much that meant.",
        type: "body",
        marginTop: true,
      },
    ],
  },
  {
    id: "stay",
    paragraphs: [
      { text: "I don't want dramatic love.", type: "body" },
      { text: "I don't want temporary love.", type: "body" },
      { text: "I want peaceful love.", type: "body", marginTop: true },
      { text: "With you.", type: "body" },
    ],
  },
  {
    id: "final",
    paragraphs: [
      { text: "Happy Valentine's Day.", type: "heading" },
      { text: "Thank you for choosing me again.", type: "body", marginTop: true },
    ],
  },
];

const PARAGRAPH_DELAY_MS = 2500;
const INITIAL_DELAY_MS = 800;
const SECTION_HOLD_MS = 2500;
const INTRO_HOLD_MS = 2000;
const EXIT_DURATION_MS = 600;

const HEARTS = [
  { left: "8%", top: "12%", size: 16, opacity: 0.1 },
  { left: "15%", top: "65%", size: 12, opacity: 0.08 },
  { left: "78%", top: "20%", size: 14, opacity: 0.09 },
  { left: "85%", top: "55%", size: 18, opacity: 0.11 },
  { left: "25%", top: "35%", size: 10, opacity: 0.07 },
  { left: "70%", top: "75%", size: 12, opacity: 0.08 },
  { left: "45%", top: "8%", size: 14, opacity: 0.09 },
  { left: "55%", top: "88%", size: 11, opacity: 0.07 },
  { left: "92%", top: "40%", size: 13, opacity: 0.08 },
  { left: "5%", top: "45%", size: 15, opacity: 0.09 },
  { left: "35%", top: "78%", size: 11, opacity: 0.06 },
  { left: "62%", top: "15%", size: 13, opacity: 0.08 },
  { left: "18%", top: "42%", size: 9, opacity: 0.06 },
  { left: "88%", top: "82%", size: 12, opacity: 0.07 },
];

const FALLING_HEARTS = Array.from({ length: 6 }, (_, i) => ({
  left: `${(i * 15 + 8) % 95}%`,
  delay: `${i * 3}s`,
  duration: 14 + (i % 4),
  size: 12 + (i % 4) * 2,
  opacity: 0.15 + (i % 2) * 0.08,
}));

const PETALS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 7 + 3) % 100}%`,
  delay: `${i * 2.5}s`,
  duration: 12 + (i % 5),
  size: 8 + (i % 6),
  opacity: 0.25 + (i % 3) * 0.1,
  rotation: (i * 30) % 360,
}));

export default function App() {
  const audioRef = useRef(null);
  const hasStartedMusicRef = useRef(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const section = SECTIONS[sectionIndex];
  const isIntro = section?.intro === true;

  const goToNextSection = useCallback(() => {
    if (sectionIndex >= SECTIONS.length - 1) return;
    setIsExiting(true);
    exitTimerRef.current = setTimeout(() => {
      setSectionIndex((prev) => prev + 1);
      setVisibleCount(0);
      setIsExiting(false);
    }, EXIT_DURATION_MS);
  }, [sectionIndex]);

  const handlePlayMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    audio
      .play()
      .then(() => {
        setMusicPlaying(true);
        hasStartedMusicRef.current = true;
      })
      .catch((err) => {
        console.warn("[Music] Play button failed:", err);
      });
  }, []);

  const isLastSection = sectionIndex === SECTIONS.length - 1;

  // Auto-advance: paragraphs appear one by one, then section exits
  useEffect(() => {
    if (isExiting) return;

    if (isIntro) {
      if (!musicPlaying) return;
      // After intro + music starts, hold then exit
      timerRef.current = setTimeout(goToNextSection, INTRO_HOLD_MS);
      return () => clearTimeout(timerRef.current);
    }

    const paragraphs = section.paragraphs;
    if (visibleCount < paragraphs.length) {
      // First paragraph: shorter delay after section appears; rest: standard delay
      const delay = visibleCount === 0 ? INITIAL_DELAY_MS : PARAGRAPH_DELAY_MS;
      timerRef.current = setTimeout(
        () => setVisibleCount((prev) => prev + 1),
        delay
      );
      return () => clearTimeout(timerRef.current);
    }

    // All paragraphs visible - exit to next section (unless last section)
    if (!isLastSection) {
      timerRef.current = setTimeout(goToNextSection, SECTION_HOLD_MS);
    }
    return () => clearTimeout(timerRef.current);
  }, [isIntro, musicPlaying, section, visibleCount, isExiting, isLastSection, goToNextSection]);

  useEffect(() => {
    const tryPlay = () => {
      if (hasStartedMusicRef.current) return;
      hasStartedMusicRef.current = true;
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = 0.5;
      audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {
          hasStartedMusicRef.current = false;
        });
    };
    const events = ["click", "keydown", "touchstart"];
    const onInteraction = () => {
      tryPlay();
      events.forEach((e) => document.removeEventListener(e, onInteraction));
    };
    events.forEach((e) => document.addEventListener(e, onInteraction, { once: true, passive: true }));
    return () => events.forEach((e) => document.removeEventListener(e, onInteraction));
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(exitTimerRef.current);
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <audio ref={audioRef} src="/music.m4a" loop preload="auto" />
      <style>
        {`
          html, body {
            overflow: hidden;
            height: 100%;
            margin: 0;
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%239d6b6b' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") 12 12, auto;
          }
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400;500&display=swap');
          .begin-btn:hover { opacity: 1; background: rgba(46,42,39,0.06); }
          .begin-btn:active { transform: translateY(2px); }
          .begin-btn { transition: opacity 0.2s ease, background 0.2s ease, transform 0.15s ease; }
          button:hover {
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%239d6b6b' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E") 12 12, auto;
          }
          @keyframes petal-fall {
            0% { transform: translateY(-10%) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 0.6; }
            100% { transform: translateY(110vh) translateX(50px) rotate(360deg); opacity: 0.3; }
          }
          @keyframes heart-fall {
            0% { transform: translateY(-20px) translateX(0) rotate(-15deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 0.5; }
            100% { transform: translateY(110vh) translateX(-30px) rotate(15deg); opacity: 0.2; }
          }
        `}
      </style>

      <div style={styles.backgroundLayer} aria-hidden>
        {HEARTS.map((h, i) => (
          <span
            key={`heart-${i}`}
            style={{
              position: "absolute",
              left: h.left,
              top: h.top,
              fontSize: h.size,
              opacity: h.opacity,
              color: "#c9a0a0",
              pointerEvents: "none",
            }}
          >
            ♥
          </span>
        ))}
        {FALLING_HEARTS.map((h, i) => (
          <span
            key={`falling-heart-${i}`}
            style={{
              position: "absolute",
              left: h.left,
              top: "-30px",
              fontSize: h.size,
              color: "#c9a0a0",
              opacity: h.opacity,
              pointerEvents: "none",
              animation: `heart-fall ${h.duration}s ease-in-out ${h.delay} infinite`,
            }}
          >
            ♥
          </span>
        ))}
        {PETALS.map((p, i) => (
          <div
            key={`petal-${i}`}
            style={{
              position: "absolute",
              left: p.left,
              top: "-20px",
              width: p.size,
              height: p.size * 1.4,
              background: "linear-gradient(135deg, #e8b4b8 0%, #c9a0a0 50%, #b76e79 100%)",
              borderRadius: "50% 50% 50% 0",
              transform: `rotate(${p.rotation}deg)`,
              opacity: p.opacity,
              pointerEvents: "none",
              animation: `petal-fall ${p.duration}s ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div style={styles.viewport}>
        <AnimatePresence mode="wait">
          <motion.div
            key={section.id}
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            exit={{ opacity: 0, transition: { duration: EXIT_DURATION_MS / 1000 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={styles.blockContent}
          >
            {isIntro ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: musicPlaying ? 0 : 1 }}
                transition={{ duration: musicPlaying ? 1.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={styles.introContent}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={styles.heading}
                >
                  For the girl <br /> who stayed.
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    onClick={handlePlayMusic}
                    style={styles.beginButton}
                    className="begin-btn"
                  >
                    Let's begin
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <>
              {section.paragraphs.map((para, i) => (
                <motion.div
                  key={`${para.text}-${i}`}
                  initial={false}
                  animate={{
                    opacity: i < visibleCount ? 1 : 0,
                    y: i < visibleCount ? 0 : 20,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    marginBottom: para.marginTop ? 30 : 0,
                    pointerEvents: i < visibleCount ? "auto" : "none",
                  }}
                >
                  {para.type === "heading" ? (
                    <h1 style={{ ...styles.heading, ...(para.marginTop && { marginTop: 40 }) }}>
                      {para.text}
                    </h1>
                  ) : (
                    <p style={{ ...styles.body, ...(para.marginTop && { marginTop: 30 }) }}>
                      {para.text}
                    </p>
                  )}
                </motion.div>
              ))}
              {sectionIndex === SECTIONS.length - 1 &&
                visibleCount === section.paragraphs.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ marginTop: 40 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const audio = audioRef.current;
                        if (audio) {
                          audio.pause();
                          audio.currentTime = 0;
                        }
                        setMusicPlaying(false);
                        setSectionIndex(0);
                        setVisibleCount(0);
                      }}
                      style={styles.beginButton}
                      className="begin-btn"
                    >
                      Start over
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    background: "linear-gradient(180deg, #F8F4F1 0%, #EFE7E1 100%)",
    color: "#2E2A27",
  },
  backgroundLayer: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    overflow: "hidden",
  },
  viewport: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    boxSizing: "border-box",
  },
  blockContent: {
    maxWidth: 700,
    textAlign: "center",
  },
  introContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300,
    fontSize: "72px",
    lineHeight: 1.2,
    marginBottom: "20px",
    letterSpacing: "-0.5px",
  },
  body: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300,
    fontSize: "24px",
    lineHeight: 1.8,
    marginBottom: "20px",
  },
  beginButton: {
    marginTop: 30,
    padding: "14px 32px",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: 400,
    letterSpacing: "0.5px",
    color: "#2E2A27",
    background: "transparent",
    border: "1.5px solid #2E2A27",
    borderRadius: 50,
    opacity: 0.85,
  },
};
