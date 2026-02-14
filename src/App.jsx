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
      { text: "Shumaila.", type: "heading", delay: 2000 },
      { text: "More than 8 years ago… you walked into my life.", type: "body", marginTop: true, delay: 3000 },
      { text: "And somehow, you never really left.", type: "body", delay: 3500 },
      { text: "No matter how messy, complicated, or imperfect we were.", type: "body", delay: 4000 },
    ],
  },
  {
    id: "truth",
    paragraphs: [
      { text: "We weren’t always easy.", type: "body", delay: 2500 },
      { text: "We fought.", type: "body", delay: 2200 },
      { text: "We stopped talking.", type: "body", delay: 2200 },
      { text: "Sometimes… we even walked away for months.", type: "body", marginTop: true, delay: 3500 },
      { text: "But somehow… we always found our way back to each other.", type: "body", marginTop: true, delay: 4000 },
    ],
  },
  {
    id: "accountability",
    paragraphs: [
      { text: "I wasn’t always the man you deserved.", type: "body", delay: 2500 },
      { text: "I hurt you in ways I wish I could undo.", type: "body", delay: 3000 },
      { text: "I didn’t always know how to show how deeply I loved you.", type: "body", delay: 3500 },
      { text: "But not a single day passed where I chose anyone else over you.", type: "body", marginTop: true, delay: 4000 },
      { text: "Even when it was hard… I chose you.", type: "body", delay: 3500 },
    ],
  },
  {
    id: "choice",
    paragraphs: [
      { text: "From the day you became part of my world,", type: "body", delay: 2500 },
      { text: "I couldn’t imagine another girl in your place.", type: "body", delay: 3000 },
      { text: "No matter how stubborn I was.", type: "body", delay: 2500 },
      { text: "No matter how much convincing it took.", type: "body", delay: 2500 },
      { text: "It was always you.", type: "body", marginTop: true, delay: 4000 },
    ],
  },
  {
    id: "growth",
    paragraphs: [
      { text: "But love is not just choosing.", type: "body", delay: 2500 },
      { text: "It is learning.", type: "body", delay: 2500 },
      { text: "It is growing.", type: "body", delay: 2500 },
      { text: "It is becoming better… for the person who stayed.", type: "body", marginTop: true, delay: 3500 },
      { text: "And I am not the same man I was before.", type: "body", delay: 3500 },
      { text: "I want to love you the way you deserve to be loved.", type: "body", marginTop: true, delay: 4000 },
    ],
  },
  {
    id: "stay",
    paragraphs: [
      { text: "Sid has always been part of your name.", type: "body", delay: 3000 },
      { text: "But you have always been my whole heart.", type: "body", delay: 3500 },
      { text: "I don’t promise perfection.", type: "body", marginTop: true, delay: 3000 },
      { text: "I promise effort.", type: "body", delay: 2500 },
      { text: "I promise growth.", type: "body", delay: 2500 },
      { text: "I promise to choose you… every single day.", type: "body", marginTop: true, delay: 4000 },
    ],
  },
  {
    id: "final",
    paragraphs: [
      { text: "Shumaila Siddiqui…", type: "heading", delay: 2500 },
      { text: "Will you stay with me?", type: "body", marginTop: true, delay: 4000 },
      { text: "Not because we’ve been together for 8 years.", type: "body", marginTop: true, delay: 3500 },
      { text: "But because we are finally learning how to love each other better.", type: "body", delay: 4500 },
    ],
  },
];


const INITIAL_DELAY_MS = 800;
const SECTION_HOLD_MS = 2500;
const INTRO_HOLD_MS = 2000;
const EXIT_DURATION_MS = 600;
const MUSIC_FADE_DURATION_MS = 8000; // 8 seconds to reach full volume
const INITIAL_VOLUME = 0.05;
const TARGET_VOLUME = 0.5;

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const volumeFadeRef = useRef(null);
  const pausedTimeRef = useRef(null);
  const remainingTimeRef = useRef(null);

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
    audio.volume = INITIAL_VOLUME;
    audio
      .play()
      .then(() => {
        setMusicPlaying(true);
        hasStartedMusicRef.current = true;
        
        // Gradually increase volume
        const startTime = Date.now();
        const fadeVolume = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / MUSIC_FADE_DURATION_MS, 1);
          audio.volume = INITIAL_VOLUME + (TARGET_VOLUME - INITIAL_VOLUME) * progress;
          
          if (progress < 1) {
            volumeFadeRef.current = requestAnimationFrame(fadeVolume);
          }
        };
        volumeFadeRef.current = requestAnimationFrame(fadeVolume);
      })
      .catch((err) => {
        console.warn("[Music] Play button failed:", err);
      });
  }, []);

  const isLastSection = sectionIndex === SECTIONS.length - 1;

  // Handle pause/play toggle
  const handleTogglePause = useCallback(() => {
    if (isIntro && !musicPlaying) return; // Don't allow pause before starting
    
    const audio = audioRef.current;
    if (!isPaused) {
      // Pausing
      if (audio && !audio.paused) {
        audio.pause();
      }
      setIsPaused(true);
    } else {
      // Resuming
      if (audio && audio.paused && musicPlaying) {
        audio.play();
      }
      setIsPaused(false);
    }
  }, [isPaused, isIntro, musicPlaying]);

  // Trigger confetti on final section when first paragraph appears
  useEffect(() => {
    if (isLastSection && visibleCount === 1 && !showConfetti) {
      setShowConfetti(true);
    }
  }, [isLastSection, visibleCount, showConfetti]);

  // Auto-advance: paragraphs appear one by one, then section exits
  useEffect(() => {
    if (isExiting || isPaused) return;

    if (isIntro) {
      if (!musicPlaying) return;
      // After intro + music starts, hold then exit
      timerRef.current = setTimeout(goToNextSection, INTRO_HOLD_MS);
      return () => clearTimeout(timerRef.current);
    }

    const paragraphs = section.paragraphs;
    if (visibleCount < paragraphs.length) {
      // First paragraph: shorter delay after section appears; rest: use custom delay
      const delay = visibleCount === 0 ? INITIAL_DELAY_MS : (paragraphs[visibleCount - 1]?.delay || 2500);
      
      const startTime = Date.now();
      pausedTimeRef.current = startTime;
      remainingTimeRef.current = delay;
      
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
  }, [isIntro, musicPlaying, section, visibleCount, isExiting, isLastSection, isPaused, goToNextSection]);

  // Handle pause/resume of timers
  useEffect(() => {
    if (isPaused && timerRef.current) {
      // Save remaining time and clear timer
      const elapsed = Date.now() - pausedTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      clearTimeout(timerRef.current);
      timerRef.current = null;
    } else if (!isPaused && !timerRef.current && remainingTimeRef.current !== null) {
      // Resume with remaining time
      if (isIntro) {
        timerRef.current = setTimeout(goToNextSection, remainingTimeRef.current);
      } else if (visibleCount < section.paragraphs.length) {
        pausedTimeRef.current = Date.now();
        timerRef.current = setTimeout(
          () => setVisibleCount((prev) => prev + 1),
          remainingTimeRef.current
        );
      } else if (!isLastSection) {
        timerRef.current = setTimeout(goToNextSection, remainingTimeRef.current);
      }
    }
  }, [isPaused, isIntro, visibleCount, section, isLastSection, goToNextSection]);

  useEffect(() => {
    const tryPlay = () => {
      if (hasStartedMusicRef.current) return;
      hasStartedMusicRef.current = true;
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = INITIAL_VOLUME;
      audio
        .play()
        .then(() => {
          setMusicPlaying(true);
          
          // Gradually increase volume
          const startTime = Date.now();
          const fadeVolume = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / MUSIC_FADE_DURATION_MS, 1);
            audio.volume = INITIAL_VOLUME + (TARGET_VOLUME - INITIAL_VOLUME) * progress;
            
            if (progress < 1) {
              volumeFadeRef.current = requestAnimationFrame(fadeVolume);
            }
          };
          volumeFadeRef.current = requestAnimationFrame(fadeVolume);
        })
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
      if (volumeFadeRef.current) {
        cancelAnimationFrame(volumeFadeRef.current);
      }
    };
  }, []);

  // Calculate progress through the experience for background gradient
  const totalSections = SECTIONS.length;
  const progressRatio = sectionIndex / (totalSections - 1);

  return (
    <div 
      style={{
        ...styles.wrapper,
        background: `linear-gradient(180deg, 
          rgb(${Math.round(248 - progressRatio * 15)}, ${Math.round(244 - progressRatio * 15)}, ${Math.round(241 - progressRatio * 15)}) 0%, 
          rgb(${Math.round(239 - progressRatio * 20)}, ${Math.round(231 - progressRatio * 20)}, ${Math.round(225 - progressRatio * 20)}) 100%)`,
        transition: 'background 2s ease-in-out',
      }}
      onClick={handleTogglePause}
    >
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
          @keyframes confetti-fall {
            0% { transform: translateY(-10vh) translateX(0) rotate(0deg) scale(1); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(110vh) translateX(var(--tx)) rotate(var(--rot)) scale(0.5); opacity: 0; }
          }
          @keyframes pulse-fade {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.7; }
          }
          .pause-indicator {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 300;
            color: #2E2A27;
            opacity: 0.5;
            pointer-events: none;
            z-index: 100;
            animation: pulse-fade 2s ease-in-out infinite;
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
              animationPlayState: isPaused ? 'paused' : 'running',
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
              animationPlayState: isPaused ? 'paused' : 'running',
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
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        ))}
        
        {/* Rose Petals Confetti for Final Section */}
        {showConfetti && Array.from({ length: 40 }).map((_, i) => {
          const colors = ['#ff6b9d', '#ff8fab', '#ffc1d4', '#ffadc7', '#e8b4b8', '#ff85a2'];
          const randomColor = colors[i % colors.length];
          const randomLeft = Math.random() * 100;
          const randomDelay = Math.random() * 2;
          const randomDuration = 3 + Math.random() * 3;
          const randomTx = (Math.random() - 0.5) * 200;
          const randomRot = Math.random() * 720;
          
          return (
            <div
              key={`confetti-${i}`}
              style={{
                position: "absolute",
                left: `${randomLeft}%`,
                top: "-10vh",
                width: 8 + Math.random() * 6,
                height: (8 + Math.random() * 6) * 1.4,
                background: randomColor,
                borderRadius: "50% 50% 50% 0",
                opacity: 0.9,
                pointerEvents: "none",
                animation: `confetti-fall ${randomDuration}s ease-in ${randomDelay}s forwards`,
                animationPlayState: isPaused ? 'paused' : 'running',
                '--tx': `${randomTx}px`,
                '--rot': `${randomRot}deg`,
              }}
            />
          );
        })}
      </div>

      {/* Pause Indicator */}
      {isPaused && musicPlaying && (
        <div className="pause-indicator">
          Paused · Click anywhere to continue
        </div>
      )}

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
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayMusic();
                    }}
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
              {sectionIndex === SECTIONS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: visibleCount === section.paragraphs.length ? 1 : 0,
                    y: visibleCount === section.paragraphs.length ? 0 : 20
                  }}
                  transition={{ delay: 2.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ marginTop: 40, minHeight: 52 }}
                >
                  {visibleCount === section.paragraphs.length && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const audio = audioRef.current;
                        if (audio) {
                          audio.pause();
                          audio.currentTime = 0;
                        }
                        setMusicPlaying(false);
                        setSectionIndex(0);
                        setVisibleCount(0);
                        setShowConfetti(false);
                        setIsPaused(false);
                        if (volumeFadeRef.current) {
                          cancelAnimationFrame(volumeFadeRef.current);
                        }
                      }}
                      style={styles.beginButton}
                      className="begin-btn"
                    >
                      Start over
                    </button>
                  )}
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
