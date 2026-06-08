import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial, Sphere, OrbitControls, Torus } from "@react-three/drei";
import * as THREE from "three";

/* ─────────── OCEAN DEPTHS COLOR SCHEME ─────────── */
const C = {
  deep:        "#264653",   // deep teal (primary dark)
  teal:        "#2a9d8f",   // vibrant teal
  gold:        "#e9c46a",   // warm gold
  orange:      "#f4a261",   // sandy orange
  coral:       "#e76f51",   // coral/red
  cream:       "#f8f4ee",   // warm off-white background
  glass:       "rgba(248,244,238,0.72)",
  glassBorder: "rgba(42,157,143,0.22)",
  text:        "#264653",
  textMid:     "rgba(38,70,83,0.60)",
  textSoft:    "rgba(38,70,83,0.40)",
};

const NAV_ITEMS = ["Home", "About", "Skills", "Projects", "Experience", "Contact"];

const SKILLS = [
  { name: "HTML",       level: 95, color: C.coral  },
  { name: "CSS",        level: 90, color: C.teal   },
  { name: "JavaScript", level: 85, color: C.gold   },
  { name: "DOM",        level: 80, color: C.deep   },
  { name: "Bootstrap",  level: 85, color: C.orange },
  { name: "React",      level: 80, color: C.teal   },
  { name: "Tailwind",   level: 95, color: C.coral  },
];

const PROJECTS = [
  {
    title: "Food Cart",
    desc:  "Online food ordering UI with category filtering & cart interactions",
    tags:  ["React", "Tailwind"],
    color: C.coral,
    icon:  "🍔",
    link:  "https://foodcart-mu.vercel.app/",
  },
  {
    title: "Admin Dashboard",
    desc:  "Analytics, charts, user management & modern widgets",
    tags:  ["React", "Tailwind"],
    color: C.teal,
    icon:  "📊",
    link:  "https://dashboardd-plum.vercel.app/",
  },
  {
    title: "Weather App",
    desc:  "Real-time weather data with beautiful UI and location search",
    tags:  ["React", "API", "Tailwind"],
    color: C.gold,
    icon:  "🌤️",
    link:  "https://weather-5nje.vercel.app/",
  },
  {
    title: "Ecommerce Store",
    desc:  "Product listings, cart, checkout UI & smart filters",
    tags:  ["React", "Tailwind"],
    color: C.deep,
    icon:  "🛍️",
    link:  "https://ecommerceee-pi.vercel.app/",
  },
  {
    title: "Expense Tracker",
    desc:  "Income tracking, expense management & financial analytics",
    tags:  ["React", "JS", "CSS"],
    color: C.orange,
    icon:  "💰",
    link:  "https://expense-tracker-eta-ochre-40.vercel.app/",
  },
];

/* ─────────── HELPERS ─────────── */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1],16)}, ${parseInt(result[2],16)}, ${parseInt(result[3],16)}`
    : "42,157,143";
}

/* ─────────── 3D SCENE ─────────── */
function FloatingOrb({ position, color, speed = 1 }) {
  const mesh = useRef();
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.35;
    mesh.current.rotation.x += 0.003;
    mesh.current.rotation.z += 0.002;
  });
  return (
    <mesh ref={mesh} position={position}>
      <Sphere args={[0.42, 32, 32]}>
        <MeshDistortMaterial
          color={color} distort={0.45} speed={2.5}
          roughness={0} metalness={0.6} transparent opacity={0.65}
        />
      </Sphere>
    </mesh>
  );
}

function HeroRing() {
  const mesh = useRef();
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.32;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.22;
  });
  return (
    <mesh ref={mesh}>
      <Torus args={[2.5, 0.025, 16, 100]}>
        <meshStandardMaterial color={C.teal} emissive={C.deep} emissiveIntensity={1.4} />
      </Torus>
    </mesh>
  );
}

function HeroRing2() {
  const mesh = useRef();
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = -state.clock.elapsedTime * 0.22;
    mesh.current.rotation.z =  state.clock.elapsedTime * 0.18;
  });
  return (
    <mesh ref={mesh}>
      <Torus args={[3.6, 0.018, 16, 100]}>
        <meshStandardMaterial color={C.gold} emissive={C.coral} emissiveIntensity={1.0} transparent opacity={0.55} />
      </Torus>
    </mesh>
  );
}

function MouseReactiveSphere() {
  const mesh = useRef();
  const { mouse } = useThree();
  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.rotation.y = mouse.x * 0.6;
    mesh.current.rotation.x = mouse.y * 0.35;
  });
  return (
    <mesh ref={mesh}>
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={C.teal} distort={0.55} speed={3.5}
          roughness={0} metalness={0.5}
          emissive={C.deep} emissiveIntensity={0.22}
        />
      </Sphere>
    </mesh>
  );
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[5,  5,  5]} color={C.teal}   intensity={2.2} />
      <pointLight position={[-5,-5, -5]} color={C.gold}   intensity={1.6} />
      <pointLight position={[0,  0,  3]} color="#ffffff"  intensity={1.1} />
      <MouseReactiveSphere />
      <HeroRing />
      <HeroRing2 />
      <FloatingOrb position={[ 3,  1, -2]} color={C.teal}   speed={0.8} />
      <FloatingOrb position={[-3, -1, -3]} color={C.gold}   speed={1.2} />
      <FloatingOrb position={[ 2, -2, -1]} color={C.coral}  speed={0.6} />
      <FloatingOrb position={[-2,  2, -2]} color={C.orange} speed={1.5} />
    </>
  );
}

/* ─────────── CURSOR ─────────── */
function Cursor() {
  const cursorRef = useRef(null);
  const ringRef   = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let rafId, mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      if (cursorRef.current) cursorRef.current.style.transform = `translate(${mx-6}px,${my-6}px)`;
      if (ringRef.current)   ringRef.current.style.transform   = `translate(${rx-20}px,${ry-20}px)`;
      rafId = requestAnimationFrame(tick);
    };
    const over  = (e) => { if (e.target.closest("button,a,[data-hover]")) setHovered(true); };
    const out   = ()  => setHovered(false);
    const down  = ()  => setClicked(true);
    const up    = ()  => setClicked(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout",  out);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup",   up);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout",  out);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup",   up);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999]"
        style={{ background: C.teal, boxShadow: `0 0 12px ${C.teal}, 0 0 24px ${C.gold}55`, transition: "transform 0.04s" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          width:  hovered ? 58 : 40,
          height: hovered ? 58 : 40,
          border: `1.5px solid ${hovered ? C.teal : C.teal + "55"}`,
          boxShadow: hovered ? `0 0 22px ${C.teal}44` : "none",
          transform: clicked ? "scale(0.78)" : "scale(1)",
          transition: "width 0.28s cubic-bezier(.16,1,.3,1), height 0.28s cubic-bezier(.16,1,.3,1), border-color 0.3s, box-shadow 0.3s",
        }}
      />
    </>
  );
}

/* ─────────── NAVBAR ─────────── */
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-4xl"
    >
      <div
        className="px-6 py-3 rounded-2xl flex items-center justify-between"
        style={{
          background: scrolled ? "rgba(248,244,238,0.97)" : "rgba(248,244,238,0.85)",
          backdropFilter: "blur(28px)",
          border: `1px solid ${C.glassBorder}`,
          boxShadow: scrolled ? "0 8px 36px rgba(42,157,143,0.16)" : "0 2px 18px rgba(0,0,0,0.07)",
          transition: "all 0.4s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="text-lg font-black tracking-wider cursor-pointer"
          style={{ fontFamily: "'Cinzel', serif", color: C.deep }}
          onClick={() => scrollTo("home")}
        >
          AIMAN<span style={{ color: C.coral }}>.</span>
        </motion.div>

        <div className="hidden md:flex gap-1">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item}
              data-hover
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => scrollTo(item.toLowerCase())}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                fontFamily: "'Cinzel', serif",
                color: active === item.toLowerCase() ? C.coral : C.textMid,
                background: active === item.toLowerCase() ? `rgba(42,157,143,0.10)` : "transparent",
                border: active === item.toLowerCase() ? `1px solid rgba(42,157,143,0.30)` : "1px solid transparent",
                letterSpacing: "0.06em",
                fontSize: "0.68rem",
                transition: "all 0.25s ease",
              }}
            >
              {item}
            </motion.button>
          ))}
        </div>

        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {[0,1,2].map((i) => (
            <motion.div
              key={i}
              animate={{
                rotate:  menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                y:       menuOpen && i === 0 ?  8 : menuOpen && i === 2 ?  -8 : 0,
                opacity: menuOpen && i === 1 ?  0 : 1,
              }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-5 h-0.5 rounded-full"
              style={{ background: C.deep }}
            />
          ))}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{    opacity: 0, y: -12, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }}
            className="mt-2 rounded-2xl p-4 md:hidden"
            style={{
              background: "rgba(248,244,238,0.97)",
              backdropFilter: "blur(28px)",
              border: `1px solid ${C.glassBorder}`,
              boxShadow: "0 8px 36px rgba(42,157,143,0.12)",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm mb-1"
                style={{ fontFamily: "'Cinzel', serif", color: C.textMid, fontSize: "0.72rem", letterSpacing: "0.1em" }}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─────────── TYPEWRITER ─────────── */
function TypeWriter({ texts, speed = 75 }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx]         = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (charIdx > 0) {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setIdx((i) => (i + 1) % texts.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts, speed]);

  return (
    <span>
      {display}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.75, repeat: Infinity }}
        style={{ color: C.teal }}
      >|</motion.span>
    </span>
  );
}

/* ─────────── GLASS CARD ─────────── */
function GlassCard({ children, className = "", style = {}, hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.025, y: -5, transition: { duration: 0.32, ease: [0.16,1,0.3,1] } } : {}}
      className={`rounded-2xl ${className}`}
      style={{
        background: "rgba(248,244,238,0.80)",
        backdropFilter: "blur(22px)",
        border: `1px solid rgba(42,157,143,0.16)`,
        boxShadow: "0 4px 28px rgba(38,70,83,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────── SECTION ─────────── */
function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`relative min-h-screen py-24 px-4 ${className}`}>
      {children}
    </section>
  );
}

/* ─────────── HERO ─────────── */
function Hero() {
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const rawY   = useTransform(scrollY, [0, 600], [0, -160]);
  const rawOp  = useTransform(scrollY, [0, 400], [1, 0]);
  const y      = useSpring(rawY,  { stiffness: 80, damping: 20 });
  const opacity= useSpring(rawOp, { stiffness: 80, damping: 20 });

  return (
    <Section id="home" className="overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <HeroScene />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "rgba(248,244,238,0.48)" }} />

      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(42,157,143,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(42,157,143,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(233,196,106,0.16) 0%, transparent 70%)" }}
      />

      <motion.div
        ref={heroRef}
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-5xl mx-auto px-4"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16,1,0.3,1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{
            background: "rgba(42,157,143,0.10)",
            border: "1px solid rgba(42,157,143,0.28)",
            backdropFilter: "blur(14px)",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-2 h-2 rounded-full block"
            style={{ background: C.teal }}
          />
          <span className="text-xs tracking-[0.3em] uppercase"
            style={{ color: C.teal, fontFamily: "'Cinzel', serif" }}>
            Frontend Developer · Pakistan
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 55 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-8xl font-black mb-4 leading-none"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <span className="block" style={{ color: C.deep }}>AIMAN</span>
          <span
            className="block"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.coral}, ${C.teal})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SHAFIQ
          </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="text-lg sm:text-2xl md:text-3xl font-light mb-6"
          style={{ fontFamily: "'Cinzel', serif", color: C.textSoft, letterSpacing: "0.18em" }}
        >
          <TypeWriter texts={["Frontend Web Developer","React Specialist","UI/UX Enthusiast","Creative Coder"]} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.85 }}
          className="text-sm sm:text-base max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ color: C.textSoft, letterSpacing: "0.05em" }}
        >
          Crafting Intelligent Digital Experiences Through Modern Web Technologies
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.75, ease: [0.16,1,0.3,1] }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {[
            { label: "Explore Portfolio", primary: true },
            { label: "Contact Me",        primary: false },
          ].map((btn) => (
            <motion.button
              key={btn.label}
              data-hover
              whileHover={{ scale: 1.06, y: -3, transition: { duration: 0.28, ease: [0.16,1,0.3,1] } }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                const id = btn.label === "Contact Me" ? "contact" : "projects";
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl text-sm font-semibold tracking-wider"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                background: btn.primary
                  ? `linear-gradient(135deg, ${C.teal}, ${C.deep})`
                  : "rgba(248,244,238,0.85)",
                color:  btn.primary ? "#f8f4ee" : C.deep,
                border: btn.primary ? "none" : `1px solid rgba(42,157,143,0.35)`,
                backdropFilter: btn.primary ? "none" : "blur(14px)",
                boxShadow: btn.primary
                  ? `0 0 32px rgba(42,157,143,0.35)`
                  : `0 2px 14px rgba(42,157,143,0.10)`,
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.65, duration: 0.6 }}
          className="flex flex-wrap gap-2 justify-center mt-12"
        >
          {["React","JavaScript","HTML/CSS","Tailwind","Bootstrap","DOM"].map((tech, i) => (
            <motion.span
              key={tech}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              className="px-3 py-1 rounded-lg text-xs"
              style={{
                background: "rgba(248,244,238,0.80)",
                border: "1px solid rgba(42,157,143,0.22)",
                color: C.textMid,
                fontFamily: "'Cinzel', serif",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                backdropFilter: "blur(10px)",
              }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-[0.3em]"
          style={{ color: C.textSoft, fontFamily: "'Cinzel', serif" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 9, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10"
          style={{ background: `linear-gradient(to bottom, ${C.teal}, transparent)` }}
        />
      </motion.div>
    </Section>
  );
}

/* ─────────── ABOUT ─────────── */
function About() {
  const stats = [
    { label: "Projects",     value: "5+" },
    { label: "Technologies", value: "7"  },
    { label: "Training",     value: "6 Mo" },
    { label: "Semester",     value: "4th" },
  ];

  return (
    <Section id="about">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase mb-4 block"
            style={{ color: C.teal, fontFamily: "'Cinzel', serif" }}>
            01 — About
          </span>
          <h2 className="text-4xl md:text-5xl font-black"
            style={{
              fontFamily: "'Cinzel', serif",
              background: `linear-gradient(135deg, ${C.deep}, ${C.coral})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >Who Am I</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -55 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, ease: [0.16,1,0.3,1] }}
          >
            <GlassCard className="p-6 sm:p-8 h-full">
              <div className="relative mb-6 inline-block">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black"
                  style={{
                    background: `linear-gradient(135deg, rgba(233,196,106,0.22), rgba(42,157,143,0.12))`,
                    border: `2px solid rgba(42,157,143,0.28)`,
                    fontFamily: "'Cinzel', serif",
                    color: C.deep,
                  }}>
                  AS
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 rounded-2xl"
                  style={{ border: `1px dashed rgba(42,157,143,0.38)` }}
                />
              </div>

              <h3 className="text-2xl font-black mb-1"
                style={{ fontFamily: "'Cinzel', serif", color: C.deep }}>
                Aiman Shafiq
              </h3>
              <p className="text-sm mb-6"
                style={{ color: C.teal, fontFamily: "'Cinzel', serif", fontSize: "0.68rem", letterSpacing: "0.1em" }}>
                Frontend Web Developer · Pakistan
              </p>
              <p className="leading-relaxed text-sm mb-6"
                style={{ color: C.textMid, lineHeight: 1.85 }}>
                Passionate Frontend Developer with strong knowledge of HTML, CSS, JavaScript, DOM, Bootstrap, Tailwind, and React. Dedicated to creating responsive, user-friendly, and visually engaging web experiences.
              </p>

              <div className="space-y-3">
                {[
                  { label: "Education", value: "BSIT (Affiliated) – 4th Semester" },
                  { label: "Training",  value: "Corvit – Front-End Dev (6 Months)" },
                  { label: "Location",  value: "Pakistan 🇵🇰" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-xs shrink-0 mt-0.5 tracking-widest"
                      style={{ color: C.teal, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                      {item.label}
                    </span>
                    <span className="text-xs" style={{ color: C.textSoft }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Right */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                >
                  <GlassCard className="p-5 text-center">
                    <div className="text-3xl font-black mb-1"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        background: `linear-gradient(135deg, ${C.gold}, ${C.coral})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>
                      {s.value}
                    </div>
                    <div className="text-xs tracking-wider"
                      style={{ color: C.textSoft, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                      {s.label}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 55 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.95, delay: 0.28, ease: [0.16,1,0.3,1] }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                    style={{ background: "rgba(42,157,143,0.10)", border: "1px solid rgba(42,157,143,0.22)" }}>
                    🎓
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: C.deep }}>Corvit Systems</div>
                    <div className="text-xs" style={{ color: C.textSoft, fontSize: "0.65rem" }}>
                      Front-End Development Training · 6 Months
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["HTML","CSS","JavaScript","Bootstrap","Tailwind","React","DOM"].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded text-xs"
                      style={{
                        background: "rgba(42,157,143,0.08)",
                        border: "1px solid rgba(42,157,143,0.22)",
                        color: C.teal,
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.6rem",
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────── SKILLS ─────────── */
function SkillOrb({ skill, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.45, y: 45 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16,1,0.3,1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      data-hover
      className="relative cursor-pointer"
    >
      <motion.div
        animate={{ y: [0, -9, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <motion.div
          animate={{ scale: hovered ? 1.25 : 1, opacity: hovered ? 0.65 : 0.22 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${skill.color}55 0%, transparent 70%)`, filter: "blur(9px)" }}
        />
        <div
          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex flex-col items-center justify-center gap-2 p-4"
          style={{
            background: hovered ? `rgba(${hexToRgb(skill.color)}, 0.12)` : "rgba(248,244,238,0.85)",
            border: `1px solid ${hovered ? skill.color + "60" : "rgba(42,157,143,0.16)"}`,
            backdropFilter: "blur(18px)",
            boxShadow: hovered ? `0 0 34px ${skill.color}28` : "0 2px 14px rgba(0,0,0,0.05)",
            transition: "all 0.32s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-xs font-bold tracking-widest"
            style={{
              fontFamily: "'Cinzel', serif",
              color: hovered ? skill.color : C.textMid,
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              transition: "color 0.3s",
            }}>
            {skill.name}
          </span>
          <svg width="60" height="60" className="-rotate-90">
            <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="3" />
            <motion.circle
              cx="30" cy="30" r="24" fill="none"
              stroke={skill.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*24}`}
              initial={{ strokeDashoffset: 2*Math.PI*24 }}
              whileInView={{ strokeDashoffset: 2*Math.PI*24*(1-skill.level/100) }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: index * 0.1, ease: "easeOut" }}
              style={{ filter: `drop-shadow(0 0 5px ${skill.color})` }}
            />
            <text x="30" y="30" textAnchor="middle" dominantBaseline="middle"
              fill={skill.color} fontSize="10" fontFamily="Cinzel"
              transform="rotate(90, 30, 30)">
              {skill.level}%
            </text>
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Skills() {
  return (
    <Section id="skills">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase mb-4 block"
            style={{ color: C.teal, fontFamily: "'Cinzel', serif" }}>
            02 — Skills
          </span>
          <h2 className="text-4xl md:text-5xl font-black"
            style={{
              fontFamily: "'Cinzel', serif",
              background: `linear-gradient(135deg, ${C.deep}, ${C.coral})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            Tech Arsenal
          </h2>
          <p className="mt-3 text-sm" style={{ color: C.textSoft }}>
            Technologies I wield to build digital experiences
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {SKILLS.map((skill, i) => <SkillOrb key={skill.name} skill={skill} index={i} />)}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-16">
          {SKILLS.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -35 : 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: i * 0.09, ease: [0.16,1,0.3,1] }}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(248,244,238,0.75)",
                border: "1px solid rgba(42,157,143,0.14)",
                backdropFilter: "blur(14px)",
              }}
            >
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold"
                  style={{ fontFamily: "'Cinzel', serif", color: C.textMid, fontSize: "0.65rem", letterSpacing: "0.15em" }}>
                  {skill.name}
                </span>
                <span className="text-xs"
                  style={{ color: skill.color, fontFamily: "'Cinzel', serif", fontSize: "0.65rem" }}>
                  {skill.level}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, delay: i * 0.1, ease: "easeOut" }}
                  style={{
                    background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                    boxShadow: `0 0 9px ${skill.color}60`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─────────── PROJECTS ─────────── */
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 65 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, delay: index * 0.13, ease: [0.16,1,0.3,1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={()   => setHovered(false)}
      data-hover
      className="relative group cursor-pointer"
    >
      <motion.div
        animate={{ y: hovered ? -10 : 0 }}
        transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: hovered ? `rgba(${hexToRgb(project.color)}, 0.09)` : "rgba(248,244,238,0.80)",
          border: `1px solid ${hovered ? project.color + "45" : "rgba(42,157,143,0.14)"}`,
          backdropFilter: "blur(22px)",
          boxShadow: hovered
            ? `0 22px 65px ${project.color}20, 0 0 0 1px ${project.color}20`
            : "0 2px 18px rgba(0,0,0,0.06)",
          transition: "all 0.38s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div
          className="h-40 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${project.color}14, ${project.color}06)`,
            borderBottom: "1px solid rgba(42,157,143,0.08)",
          }}
        >
          <div className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(42,157,143,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(42,157,143,0.07) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
          <motion.div
            animate={{ scale: hovered ? 1.22 : 1, rotate: hovered ? 12 : 0 }}
            transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
            className="text-6xl relative z-10"
          >
            {project.icon}
          </motion.div>
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 50% 50%, ${project.color}1E 0%, transparent 70%)` }}
          />
        </div>

        <div className="p-5">
          <h3 className="text-base font-black mb-1"
            style={{
              fontFamily: "'Cinzel', serif",
              color: hovered ? project.color : C.deep,
              transition: "color 0.3s",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
            }}>
            {project.title}
          </h3>
          <p className="text-xs mb-4 leading-relaxed" style={{ color: C.textSoft }}>{project.desc}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded text-xs"
                style={{
                  background: `rgba(${hexToRgb(project.color)}, 0.09)`,
                  border: `1px solid ${project.color}35`,
                  color: project.color,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                }}>
                {tag}
              </span>
            ))}
          </div>
          <motion.a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : 4 }}
            transition={{ duration: 0.32 }}
            className="mt-1 text-xs font-bold tracking-widest inline-block"
            style={{ color: project.color, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            VIEW PROJECT →
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Projects() {
  return (
    <Section id="projects">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase mb-4 block"
            style={{ color: C.teal, fontFamily: "'Cinzel', serif" }}>
            03 — Projects
          </span>
          <h2 className="text-4xl md:text-5xl font-black"
            style={{
              fontFamily: "'Cinzel', serif",
              background: `linear-gradient(135deg, ${C.deep}, ${C.coral})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            My Work
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((project, i) => <ProjectCard key={project.title} project={project} index={i} />)}
        </div>
      </div>
    </Section>
  );
}

/* ─────────── EXPERIENCE ─────────── */
function Experience() {
  const achievements = [
    "Developed multiple responsive websites from scratch",
    "Built React applications with component architecture",
    "Improved UI/UX experiences through design principles",
    "Debugging, testing & cross-browser compatibility",
    "Team collaboration & agile workflows",
  ];

  return (
    <Section id="experience">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase mb-4 block"
            style={{ color: C.teal, fontFamily: "'Cinzel', serif" }}>
            04 — Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-black"
            style={{
              fontFamily: "'Cinzel', serif",
              background: `linear-gradient(135deg, ${C.deep}, ${C.coral})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            Journey
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute left-6 top-0 bottom-0 w-px origin-top"
            style={{ background: `linear-gradient(to bottom, ${C.teal}, transparent)` }}
          />

          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, ease: [0.16,1,0.3,1] }}
            className="pl-16 relative"
          >
            <motion.div
              animate={{ scale: [1, 1.45, 1], boxShadow: [`0 0 18px ${C.teal}55`, `0 0 32px ${C.teal}88`, `0 0 18px ${C.teal}55`] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute left-4 top-2 w-4 h-4 rounded-full -translate-x-1/2"
              style={{ background: C.teal }}
            />
            <GlassCard className="p-5 sm:p-6" hover={false}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black mb-1"
                    style={{ fontFamily: "'Cinzel', serif", color: C.deep, fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    Front-End Development Training
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold"
                      style={{ color: C.teal, fontFamily: "'Cinzel', serif", fontSize: "0.68rem" }}>
                      Corvit Systems
                    </span>
                    <span className="text-xs" style={{ color: C.textSoft }}>·</span>
                    <span className="text-xs" style={{ color: C.textSoft }}>6 Months</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: "rgba(42,157,143,0.10)",
                    border: "1px solid rgba(42,157,143,0.28)",
                    color: C.teal,
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.6rem",
                  }}>
                  Completed
                </span>
              </div>
              <div className="space-y-2.5">
                {achievements.map((ach, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.52, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
                    className="flex items-start gap-3"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: C.teal, boxShadow: `0 0 7px ${C.teal}70` }}
                    />
                    <span className="text-sm" style={{ color: C.textMid }}>{ach}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.28, ease: [0.16,1,0.3,1] }}
          className="pl-16 relative mt-6"
        >
          <div className="absolute left-4 top-2 w-4 h-4 rounded-full -translate-x-1/2"
            style={{ background: C.gold, boxShadow: `0 0 22px ${C.gold}66` }} />
          <GlassCard className="p-5 sm:p-6" hover={false}>
            <h3 className="text-base font-black mb-1"
              style={{ fontFamily: "'Cinzel', serif", color: C.deep }}>
              BSIT (Affiliated)
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold"
                style={{ color: C.gold, fontFamily: "'Cinzel', serif", fontSize: "0.68rem" }}>
                Currently Enrolled
              </span>
              <span className="text-xs" style={{ color: C.textSoft }}>·</span>
              <span className="text-xs" style={{ color: C.textSoft }}>4th Semester · Ongoing</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─────────── CONTACT ─────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const inputStyle = (name) => ({
    background: focused === name ? "rgba(248,244,238,0.99)" : "rgba(248,244,238,0.75)",
    border: `1px solid ${focused === name ? "rgba(42,157,143,0.55)" : "rgba(42,157,143,0.20)"}`,
    borderRadius: 12,
    padding: "12px 16px",
    color: C.deep,
    fontSize: "0.85rem",
    outline: "none",
    width: "100%",
    transition: "all 0.3s cubic-bezier(.16,1,.3,1)",
    boxShadow: focused === name ? "0 0 22px rgba(42,157,143,0.10)" : "none",
    fontFamily: "inherit",
  });

  const contacts = [
    { icon: "📞", label: "Phone",    value: "+92 319 1080021"          },
    { icon: "✉️", label: "Email",    value: "aimanmalik3447@gmail.com"  },
    { icon: "📍", label: "Location", value: "Pakistan"                 },
  ];

  return (
    <Section id="contact">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.4em] uppercase mb-4 block"
            style={{ color: C.teal, fontFamily: "'Cinzel', serif" }}>
            05 — Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-black"
            style={{
              fontFamily: "'Cinzel', serif",
              background: `linear-gradient(135deg, ${C.deep}, ${C.coral})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
            Get In Touch
          </h2>
          <p className="mt-3 text-sm" style={{ color: C.textSoft }}>
            Let's build something extraordinary together
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 sm:gap-8">
          <div className="md:col-span-2 space-y-4">
            {contacts.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.13, ease: [0.16,1,0.3,1] }}
              >
                <GlassCard className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: "rgba(42,157,143,0.10)", border: "1px solid rgba(42,157,143,0.22)" }}>
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-xs mb-0.5 tracking-widest"
                      style={{ color: C.teal, fontFamily: "'Cinzel', serif", fontSize: "0.6rem" }}>
                      {c.label}
                    </div>
                    <div className="text-sm font-medium" style={{ color: C.deep }}>{c.value}</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, ease: [0.16,1,0.3,1] }}
          >
            <GlassCard className="p-5 sm:p-6" hover={false}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.78 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{    opacity: 0, scale: 0.78 }}
                    transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
                    className="h-full flex flex-col items-center justify-center py-12 text-center gap-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="text-5xl"
                    >✨</motion.div>
                    <div className="text-lg font-black"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        background: `linear-gradient(135deg, ${C.gold}, ${C.teal})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>
                      Message Sent!
                    </div>
                    <p className="text-sm" style={{ color: C.textSoft }}>I'll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      {["name","email"].map((field) => (
                        <input
                          key={field}
                          name={field}
                          value={form[field]}
                          onChange={handle}
                          onFocus={() => setFocused(field)}
                          onBlur={() => setFocused(null)}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          style={inputStyle(field)}
                        />
                      ))}
                    </div>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={handle}
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused(null)}
                      placeholder="Subject"
                      style={{ ...inputStyle("subject"), marginBottom: 12 }}
                    />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handle}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      placeholder="Your message..."
                      rows={4}
                      style={{ ...inputStyle("message"), resize: "none", marginBottom: 16 }}
                    />
                    <motion.button
                      data-hover
                      whileHover={{ scale: 1.03, boxShadow: `0 0 40px rgba(42,157,143,0.35)`, transition: { duration: 0.28 } }}
                      whileTap={{ scale: 0.96 }}
                      onClick={submit}
                      className="w-full py-3.5 rounded-xl font-bold"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.2em",
                        background: `linear-gradient(135deg, ${C.teal}, ${C.deep})`,
                        color: C.cream,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: `0 0 32px rgba(42,157,143,0.25)`,
                      }}
                    >
                      TRANSMIT MESSAGE →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────── FOOTER ─────────── */
function Footer() {
  return (
    <footer className="relative py-10 px-4 text-center">
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${C.teal}55, transparent)` }}
      />
      <div className="text-lg font-black mb-2"
        style={{
          fontFamily: "'Cinzel', serif",
          background: `linear-gradient(135deg, ${C.gold}, ${C.teal})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
        AIMAN SHAFIQ
      </div>
      <p className="text-xs" style={{ color: C.textSoft, fontFamily: "'Cinzel', serif", letterSpacing: "0.2em" }}>
        © 2025 · CRAFTED WITH ♥ IN PAKISTAN
      </p>
    </footer>
  );
}

/* ─────────── AMBIENT PARTICLES ─────────── */
function AmbientParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:  Math.random() * 3.5 + 1,
            height: Math.random() * 3.5 + 1,
            left:   `${Math.random() * 100}%`,
            top:    `${Math.random() * 100}%`,
            background: i % 4 === 0 ? C.teal
                       : i % 4 === 1 ? C.gold
                       : i % 4 === 2 ? C.coral
                       : C.orange,
            opacity: 0.3,
          }}
          animate={{ y: [0, -(110 + Math.random() * 110)], opacity: [0, 0.35, 0], scale: [0, 1, 0] }}
          transition={{
            duration:  4.5 + Math.random() * 5,
            repeat:    Infinity,
            delay:     Math.random() * 7,
            ease:      "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────── SECTION TRACKER ─────────── */
function useSectionTracker() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

/* ─────────── APP ─────────── */
export default function App() {
  const active = useSectionTracker();

  return (
    <div
      style={{
        background: `linear-gradient(160deg, #f8f4ee 0%, #f0ece0 30%, #e8e0cc 60%, #ddd5b8 100%)`,
        minHeight: "100vh",
        color: C.text,
        fontFamily: "'Lato', sans-serif",
        cursor: "none",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Lato:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f8f4ee; }
        ::-webkit-scrollbar-thumb { background: rgba(42,157,143,0.40); border-radius: 2px; }
        ::selection { background: rgba(42,157,143,0.20); color: #264653; }
        input::placeholder, textarea::placeholder { color: rgba(38,70,83,0.30); }
        @media (max-width: 768px) {
          section { padding-top: 5rem !important; padding-left: 1rem !important; padding-right: 1rem !important; }
        }
      `}</style>

      <Cursor />
      <AmbientParticles />
      <Navbar active={active} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

