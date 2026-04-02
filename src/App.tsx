import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text as DreiText } from '@react-three/drei';
import * as THREE from 'three';
import { Terminal, Send, TerminalSquare, Info, Briefcase, Zap, Palette, GraduationCap, Globe, Link2, Mail, ChevronRight } from 'lucide-react';



const COMMANDS = [
  { cmd: '/help', desc: 'List all available commands', icon: <TerminalSquare size={14} /> },
  { cmd: '/about', desc: 'Who is Arnab Kundu?', icon: <Info size={14} /> },
  { cmd: '/experience', desc: 'Work history & track record', icon: <Briefcase size={14} /> },
  { cmd: '/skills', desc: 'Technical & AI/ML stacks', icon: <Zap size={14} /> },
  { cmd: '/education', desc: 'Academic background', icon: <GraduationCap size={14} /> },
  { cmd: '/social', desc: 'All social links & contact', icon: <Globe size={14} /> },
  { cmd: '/linkedin', desc: 'LinkedIn profile', icon: <Link2 size={14} /> },
  { cmd: '/github', desc: 'GitHub profile', icon: <Globe size={14} /> },
  { cmd: '/email', desc: 'Email address', icon: <Mail size={14} /> },
  { cmd: '/contact', desc: 'Contact details', icon: <Mail size={14} /> },
  { cmd: '/clear', desc: 'Clear the terminal output', icon: <Terminal size={14} /> },
  { cmd: '/themes', desc: 'Change environmental vibe', icon: <Palette size={14} /> }
];

const THEMES = ['default', 'matrix', 'dracula'];

const BOOT_LOGS = [
  "INITIALIZING KERNEL...",
  "LOADING AI MODULES: [OK]",
  "MOUNTING FILE SYSTEMS: [OK]",
  "DEPLOYING KUBERNETES CLUSTER: [OK]",
  "ESTABLISHING SECURE CONNECTION...",
  "WAKING ARNAB'S AI AGENT...",
  "LAUNCHING PORTFOLIO INTERFACE V1.0"
];

const AGENT_RESPONSES = [
  "Analyzing your request against Arnab's expertise matrix...",
  "Arnab designs enterprise-scale AI systems—bridging LLM research, data pipelines, and cloud-native architecture.",
  "Fun fact: Arnab scaled 7K samples to 140K structured points using Neo4j knowledge graphs + QLoRA. That's 20x data augmentation!",
  "I'm Arnab's AI proxy. He's currently architecting production-grade LLM systems, but I'm here to help.",
  "Deploying intelligence protocol... Just kidding, I'm your interactive portfolio assistant.",
  "Arnab builds end-to-end AI pipelines—from data engineering with Neo4j to fine-tuning LLMs like LLaMA-3 and Qwen via NVIDIA NeMo."
];

function TypewriterText({ text, speed = 30 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(intervalId);
    }, speed);
    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

// ==============================
// FLOATING NAME IN SPACE
// ==============================

function FloatingNameText({ mode }: { mode: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const accentColor = mode === 'skills' ? '#10b981'
    : mode === 'experience' ? '#f59e0b'
      : mode === 'education' ? '#818cf8'
        : mode === 'about' ? '#38bdf8'
          : '#5eead4';

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.10;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.03;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <DreiText
        position={[0, 0.07, 0]}
        fontSize={0.15}
        letterSpacing={0.14}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#000000"
      >
        ARNAB KUNDU
      </DreiText>
      <DreiText
        position={[0, -0.13, 0]}
        fontSize={0.04}
        letterSpacing={0.2}
        color="#475569"
        anchorX="center"
        anchorY="middle"
      >
        AI/ML & CLOUD ENGINEER
      </DreiText>
    </group>
  );
}

function OrbitRing({ radius, speed, color, tilt }: { radius: number; speed: number; color: string; tilt: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * speed;
  });

  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <mesh>
        <torusGeometry args={[radius, 0.005, 6, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function SpaceDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const COUNT = 320;
  const dummy = new THREE.Object3D();
  const pts = useRef(
    Array.from({ length: COUNT }).map((_, i) => ({
      theta: (i / COUNT) * Math.PI * 2,
      phi: Math.acos(2 * (i / COUNT) - 1),
      r: 0.62 + (i % 5) * 0.05,
      speed: 0.001 + (i % 5) * 0.0008,
      offset: (i / COUNT) * Math.PI * 6,
    }))
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    pts.current.forEach((p, i) => {
      p.theta += p.speed;
      const x = p.r * Math.sin(p.phi) * Math.cos(p.theta);
      const y = p.r * Math.cos(p.phi) * 0.4 + Math.sin(t * 0.3 + p.offset) * 0.1;
      const z = p.r * Math.sin(p.phi) * Math.sin(p.theta);
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.6 + Math.sin(t * 0.5 + p.offset) * 0.4);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.012, 4, 4]} />
      <meshBasicMaterial color="#94a3b8" transparent opacity={0.55} />
    </instancedMesh>
  );
}

function FragmentedCognitiveCore({ mode }: { mode: string }) {
  const [ready, setReady] = useState(false);

  // Ensure camera is properly initialized after canvas creation
  useEffect(() => {
    // Small delay to ensure everything is initialized
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    // Return a simple loading state to prevent black spots
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-[var(--color-term-text-h)]">Loading 3D Scene...</div>
      </div>
    );
  }

  return (
<div className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-black">
      <Canvas
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 3.0], fov: 55 }}
        onCreated={({ gl, size }) => {
          gl.setClearColor(0x000000, 0);
          gl.setSize(size.width, size.height);
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 1, 2]} intensity={1.2} color="#5eead4" />
        <pointLight position={[-2, -1, -2]} intensity={0.6} color="#818cf8" />

        <Stars radius={18} depth={25} count={700} factor={1.5} saturation={0} fade speed={1} />

        <FloatingNameText mode={mode} />

        <OrbitRing radius={0.68} speed={0.3} color="#5eead4" tilt={0.4} />
        <OrbitRing radius={0.88} speed={-0.18} color="#818cf8" tilt={1.1} />
        <OrbitRing radius={0.52} speed={0.5} color="#fcd34d" tilt={0.8} />

        <SpaceDust />

        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}

function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars radius={100} depth={60} count={5000} factor={5} saturation={0} fade speed={1.5} />
      </Canvas>
    </div>
  );
}

// ==============================
// APPLICATION STATE
// ==============================

type HistoryItem = {
  id: string;
  type: 'command' | 'agent' | 'home' | 'experience' | 'skills' | 'education' | 'social' | 'linkedin' | 'github' | 'email' | 'contact' | 'error' | 'help';
  content?: string;
};

const HomeOutput = ({ executeCommand, mode }: { executeCommand: (cmd: string) => void; mode: string }) => (
  <div className="flex flex-col xl:flex-row w-full gap-2 sm:gap-4 flex-1">
    {/* Left: 3D Canvas — stretches to full height of the row */}
    <div className="xl:w-[42%] rounded-xl overflow-hidden border border-[var(--color-term-border)] relative shrink-0 h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] w-full xl:w-[42%]">
      <FragmentedCognitiveCore mode={mode} />
      {/* Contact overlay pinned to bottom of the 3D block */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/80 to-transparent">
        <div>
          <p className="uppercase tracking-widest text-[10px] font-bold" style={{ color: 'var(--color-term-text-h)' }}>AI/ML & Cloud Engineer</p>
          <p className="text-[10px] opacity-60 flex items-center gap-1 mt-0.5">Kolkata, WB, India <span className="animate-pulse text-[var(--color-term-green)]">●</span></p>
        </div>
        <div className="flex items-center gap-3">
          <a href="mailto:arnabkundu854@gmail.com" className="hover:text-[var(--color-term-accent)] transition-colors opacity-70 hover:opacity-100"><Mail size={15} /></a>
          <a href="https://www.linkedin.com/in/arnweb/" target="_blank" rel="noreferrer" className="hover:text-[var(--color-term-accent)] transition-colors opacity-70 hover:opacity-100"><Link2 size={15} /></a>
          <a href="https://github.com" className="hover:text-[var(--color-term-accent)] transition-colors opacity-70 hover:opacity-100"><Globe size={15} /></a>
        </div>
      </div>
    </div>

    {/* Right column */}
    <div className="xl:w-[55%] flex flex-col shrink-0 gap-6">
      <div className="p-6 lg:p-8 border border-[var(--color-term-border)] border-dashed rounded-xl bg-[var(--color-bg)]/10">
        <h2 className="font-bold mb-4 tracking-wider relative pb-2 border-b-2 uppercase text-sm" style={{ color: 'var(--color-term-accent)', borderColor: 'color-mix(in srgb, var(--color-term-accent) 30%, transparent)' }}>Core Subroutines</h2>
        <div className="space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-baseline xl:gap-4"><span className="xl:w-40 font-bold mb-1 xl:mb-0 opacity-60 text-[10px] xl:text-xs tracking-wider uppercase">LLM Systems</span><span className="font-semibold" style={{ color: 'var(--color-term-text-h)' }}>LangChain, LangGraph, LangFlow, RAG, Agentic AI</span></div>
          <div className="flex flex-col xl:flex-row xl:items-baseline xl:gap-4"><span className="xl:w-40 font-bold mb-1 xl:mb-0 opacity-60 text-[10px] xl:text-xs tracking-wider uppercase">Languages</span><span className="font-semibold" style={{ color: 'var(--color-term-text-h)' }}>Python, Java, TypeScript, PowerShell</span></div>
          <div className="flex flex-col xl:flex-row xl:items-baseline xl:gap-4"><span className="xl:w-40 font-bold mb-1 xl:mb-0 opacity-60 text-[10px] xl:text-xs tracking-wider uppercase">Frameworks</span><span className="font-semibold" style={{ color: 'var(--color-term-text-h)' }}>FastAPI, Angular, React</span></div>
          <div className="flex flex-col xl:flex-row xl:items-baseline xl:gap-4"><span className="xl:w-40 font-bold mb-1 xl:mb-0 opacity-60 text-[10px] xl:text-xs tracking-wider uppercase">Cloud</span><span className="font-semibold" style={{ color: 'var(--color-term-text-h)' }}>Docker, Kubernetes, Azure DevOps, AWS EKS, AKS</span></div>
        </div>
      </div>

      <div className="p-6 lg:p-8 flex-1 border border-[var(--color-term-border)] border-dashed rounded-xl bg-[var(--color-bg)]/10">
        <h2 className="font-bold mb-4 tracking-wider relative pb-2 border-b-2 uppercase text-sm" style={{ color: 'var(--color-term-accent)', borderColor: 'color-mix(in srgb, var(--color-term-accent) 30%, transparent)' }}>Available Hubs</h2>
        <p className="text-xs mb-4 opacity-70">Execute commands or click nodes below to navigate.</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:gap-4">
          {COMMANDS.slice(1, 5).map((cmd, i) => (
            <li key={i}>
              <button
                onClick={() => executeCommand(cmd.cmd)}
                className="hover:pl-3 transition-all duration-300 flex items-center group cursor-pointer w-full text-left bg-[var(--color-bg)]/40 p-3 rounded-md border border-transparent hover:border-[var(--color-term-border)] hover:bg-[var(--color-bg)]/80"
                style={{ color: 'var(--color-term-text-h)' }}
              >
                <span className="text-[var(--color-term-green)] mr-3 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">{cmd.icon}</span>
                <span className="font-bold tracking-wide">{cmd.cmd}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const ExperienceOutput = () => (
  <div className="w-full flex flex-col my-6 animate-fade-in-up">
    <h2 className="font-extrabold text-2xl sm:text-3xl mb-6 tracking-wide" style={{ color: 'var(--color-term-accent)' }}>Professional Experience</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
      {/* EY GDS */}
      <div className="border rounded-xl p-6 lg:p-8 backdrop-blur-md" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-accent)' }}>Ernst & Young GDS</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-600 text-white whitespace-nowrap">May 2025 - Current</span>
        </div>
        <div className="text-sm font-bold mb-4 uppercase tracking-wider opacity-90" style={{ color: 'var(--color-term-text-h)' }}>Senior AI Analyst (AI & DATA) • Kolkata</div>
        <ul className="space-y-3 leading-relaxed text-sm md:text-base opacity-80 list-none">
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Built the organization's first enterprise AI-driven compliance solution to help senior leadership (Manager+ levels) accurately declare stock and insurance holdings, meeting regulatory requirements.</li>
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Developed an automated document processing and data reconciliation pipeline for NSDL/CDSL files using Azure Document Intelligence with RapidOCR fallback, enabling reliable structured extraction and auditable compliance reporting.</li>
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Pre-trained and fine-tuned a Qwen 4B small language model on a cybersecurity domain corpus using NVIDIA NeMo SLM training format, and designed a scalable data curation pipeline to support high-quality SLM training and domain adaptation.</li>
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Fine-tuned & deployed LLMs (LLaMA-3, Qwen, Azure OpenAI) via Neo4j knowledge graphs using QLoRA. Scaled 7K samples to 140K structured points—20x data augmentation.</li>
        </ul>
      </div>

      {/* LTIMindtree */}
      <div className="border rounded-xl p-6 lg:p-8 backdrop-blur-md" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-accent)' }}>LTIMindtree</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-600 text-white whitespace-nowrap">2021 - 2025</span>
        </div>
        <div className="text-sm font-bold mb-4 uppercase tracking-wider opacity-90" style={{ color: 'var(--color-term-text-h)' }}>Associate GenAI Engineer (Insurance) • Kolkata</div>
        <ul className="space-y-3 leading-relaxed text-sm md:text-base opacity-80 list-none">
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Fine-tuned and deployed LLMs (Azure OpenAI, LLaMA-3) using domain-specific datasets, scaling data pipelines.</li>
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Designed end-to-end AI pipelines in Python for data preprocessing, fine-tuning, inference, and evaluation.</li>
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Trained multimodal models and implemented document AI pipelines with Azure Document Intelligence + RapidOCR fallback.</li>
          <li className="flex gap-2"><span style={{ color: 'var(--color-term-accent)' }}>▹</span> Architected scalable cloud platforms with Azure Service Bus, OAuth2, and multi-tier microservices.</li>
        </ul>
      </div>
    </div>
  </div>
);

const SkillsOutput = () => (
  <div className="w-full flex flex-col my-6 animate-fade-in-up">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl items-stretch">
      {[
        { title: "AI / LLM Systems", skills: "LLaMA-3, Qwen, Azure OpenAI, QLoRA, RAG, LangChain, LangGraph, LangFlow, Agentic AI, NeMo" },
        { title: "Physical AI", skills: "NVIDIA Isaac Sim, NVIDIA Omniverse, ROS2, Robotics Simulation" },
        { title: "Languages", skills: "Python, Java, TypeScript, PowerShell" },
        { title: "Frameworks", skills: "FastAPI, Angular, React, LangChain, LangGraph" },
        { title: "Cloud & DevOps", skills: "Docker, Kubernetes, Azure DevOps, Azure Services, AWS EKS, Terraform, CI/CD" },
        { title: "Enterprise & Security", skills: "OAuth2, Azure AD, Azure Service Bus, Neo4j, Compliance Systems" },
      ].map((block, i) => (
        <div key={i} className="border p-6 rounded-xl bg-[var(--color-bg)]/40 hover:bg-[var(--color-bg)]/80 transition-colors" style={{ borderColor: 'var(--color-term-border)' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide" style={{ color: 'var(--color-term-accent)' }}>
            {block.title}
          </h3>
          <p className="leading-loose font-semibold opacity-90 text-[var(--color-term-text-h)]">
            {block.skills.split(', ').map((skill, j) => (
              <span key={j} className="inline-block px-3 py-1 mr-2 mb-2 rounded border border-[var(--color-term-border)] bg-[var(--color-term-bg)]/50 text-xs shadow-sm">{skill}</span>
            ))}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const EducationOutput = () => (
  <div className="w-full flex flex-col my-6 animate-fade-in-up">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl items-stretch">
      {/* Card 1: MCA */}
      <div className="border rounded-xl p-6 lg:p-8 backdrop-blur-md h-full min-h-[190px]" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-accent)' }}>Masters of Computer Application</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-600 text-white">2020-2022</span>
        </div>
        <div className="text-base" style={{ color: 'var(--color-term-text-h)' }}>Future Institute of Engineering & Management</div>
      </div>

      {/* Card 2: BSc */}
      <div className="border rounded-xl p-6 lg:p-8 backdrop-blur-md h-full min-h-[190px]" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-accent)' }}>Bachelor of Computer Science</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-600 text-white whitespace-nowrap">2017 - 2020</span>
        </div>
        <div className="text-base" style={{ color: 'var(--color-term-text-h)' }}>Ramakrishna Mission Residential College</div>
      </div>

      {/* Card 3: Higher Secondary */}
      <div className="border rounded-xl p-6 lg:p-8 backdrop-blur-md h-full min-h-[190px]" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-accent)' }}>Higher Secondary (Class XII)</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-600 text-white whitespace-nowrap">2017</span>
        </div>
        <div className="text-base" style={{ color: 'var(--color-term-text-h)' }}>Jodhpur Park Boys</div>
      </div>

      {/* Card 4: Secondary */}
      <div className="border rounded-xl p-6 lg:p-8 backdrop-blur-md h-full min-h-[190px]" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
        <div className="flex items-center justify-between mb-2 gap-2">
          <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-accent)' }}>Secondary (Class X)</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-600 text-white whitespace-nowrap">2015</span>
        </div>
        <div className="text-base" style={{ color: 'var(--color-term-text-h)' }}>Jodhpur Park Boys</div>
      </div>
    </div>
  </div>
);

const HelpOutput = () => (
  <div className="w-full flex flex-col my-6 max-w-2xl bg-[var(--color-bg)]/40 border border-[var(--color-term-border)] rounded-xl p-6 animate-fade-in-up">
    <h3 className="font-bold mb-4 uppercase tracking-widest text-[var(--color-term-accent)] text-sm border-b border-[var(--color-term-border)] pb-2">Available Commands</h3>
    <ul className="space-y-3">
      {COMMANDS.map((cmd) => (
        <li key={cmd.cmd} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
          <span className="font-bold text-[var(--color-term-text-h)] w-32">{cmd.cmd}</span>
          <span className="opacity-70 text-sm text-[var(--color-term-text)]">{cmd.desc}</span>
        </li>
      ))}
    </ul>
    <div className="mt-6 text-sm opacity-50 italic">
      Tip: Type any text without a "/" to engage the AI Agent.
    </div>
  </div>
);

const SocialOutput = ({ type }: { type: string }) => (
  <div className="w-full flex flex-col my-6 animate-fade-in-up">
    <h2 className="font-extrabold text-2xl sm:text-3xl mb-6 tracking-wide" style={{ color: 'var(--color-term-accent)' }}>
      {type === 'social' ? 'Social Links' : type === 'linkedin' ? 'LinkedIn' : type === 'github' ? 'GitHub' : type === 'email' ? 'Email' : 'Contact'}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
      {(type === 'social' || type === 'linkedin' || type === 'contact') && (
        <a href="https://www.linkedin.com/in/arnweb/" target="_blank" rel="noreferrer" className="border rounded-xl p-6 lg:p-8 backdrop-blur-md hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02]" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
          <div className="flex items-center gap-4">
            <Link2 size={32} style={{ color: 'var(--color-term-accent)' }} />
            <div>
              <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-text-h)' }}>LinkedIn</h3>
              <p className="text-sm opacity-70">linkedin.com/in/arnweb</p>
            </div>
          </div>
        </a>
      )}
      {(type === 'social' || type === 'github' || type === 'contact') && (
        <a href="https://github.com" target="_blank" rel="noreferrer" className="border rounded-xl p-6 lg:p-8 backdrop-blur-md hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02]" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
          <div className="flex items-center gap-4">
            <Globe size={32} style={{ color: 'var(--color-term-accent)' }} />
            <div>
              <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-text-h)' }}>GitHub</h3>
              <p className="text-sm opacity-70">github.com</p>
            </div>
          </div>
        </a>
      )}
      {(type === 'social' || type === 'email' || type === 'contact') && (
        <a href="mailto:arnabkundu854@gmail.com" className="border rounded-xl p-6 lg:p-8 backdrop-blur-md hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02]" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
          <div className="flex items-center gap-4">
            <Mail size={32} style={{ color: 'var(--color-term-accent)' }} />
            <div>
              <h3 className="font-bold text-xl" style={{ color: 'var(--color-term-text-h)' }}>Email</h3>
              <p className="text-sm opacity-70">arnabkundu854@gmail.com</p>
            </div>
          </div>
        </a>
      )}
      {type === 'contact' && (
        <div className="border rounded-xl p-6 lg:p-8 backdrop-blur-md col-span-1 md:col-span-2" style={{ borderColor: 'var(--color-term-border)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
          <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--color-term-accent)' }}>Contact Details</h3>
          <div className="space-y-2 text-sm" style={{ color: 'var(--color-term-text-h)' }}>
            <p><span className="opacity-70">Email:</span> arnabkundu854@gmail.com</p>
            <p><span className="opacity-70">Location:</span> Kolkata, WB, India</p>
            <p><span className="opacity-70">Available for:</span> Full-time opportunities, Freelance AI/ML projects</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default function App() {
  const [booting, setBooting] = useState(true);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const [history, setHistory] = useState<HistoryItem[]>([
    { id: '1', type: 'home' }
  ]);

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // 3D Cognitive Mode State
  const [cognitiveMode, setCognitiveMode] = useState<string>('idle');

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filteredCommands = COMMANDS.filter(c => {
    const term = input.toLowerCase();
    return c.cmd.startsWith(term) || c.cmd.substring(1).startsWith(term);
  });

  useEffect(() => {
    let currLog = 0;
    const interval = setInterval(() => {
      setBootLogs(prev => [...prev, BOOT_LOGS[currLog]]);
      currLog++;
      if (currLog >= BOOT_LOGS.length) {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 800);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES[themeIndex]);
  }, [themeIndex]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [history, isTyping]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (input.startsWith('/')) setShowAutocomplete(true);
    else setShowAutocomplete(false);
    setSelectedIndex(0);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showAutocomplete || filteredCommands.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && input.startsWith('/')) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex].cmd);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setInput(filteredCommands[selectedIndex].cmd);
    }
  };

  const pushCommandToHistory = (cmdStr: string) => {
    setHistory(prev => [...prev, { id: Date.now().toString(), type: 'command', content: cmdStr }]);
  };

  const executeCommand = (cmd: string) => {
    setInput('');
    setShowAutocomplete(false);
    pushCommandToHistory(cmd);

    // Command → 3D Cognitive Mode Mapping
    if (cmd === '/experience') setCognitiveMode('experience');
    else if (cmd === '/skills') setCognitiveMode('skills');
    else if (cmd === '/education') setCognitiveMode('education');
    else if (cmd === '/about') setCognitiveMode('about');
    else setCognitiveMode('idle');

    setTimeout(() => {
      if (cmd === '/themes') {
        const nextTheme = (themeIndex + 1) % THEMES.length;
        setThemeIndex(nextTheme);
        setHistory(prev => [...prev, { id: Date.now().toString() + '-t', type: 'agent', content: `Theme changed to [${THEMES[nextTheme]}]` }]);
      } else if (cmd === '/clear') {
        setHistory([{ id: Date.now().toString() + '-h', type: 'home' }]);
        setCognitiveMode('idle');
      } else if (cmd === '/about') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-h', type: 'home' }]);
      } else if (cmd === '/experience') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-e', type: 'experience' }]);
      } else if (cmd === '/skills') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-s', type: 'skills' }]);
      } else if (cmd === '/education') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-ed', type: 'education' }]);
      } else if (cmd === '/social') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-so', type: 'social' }]);
      } else if (cmd === '/linkedin') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-li', type: 'linkedin' }]);
      } else if (cmd === '/github') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-gh', type: 'github' }]);
      } else if (cmd === '/email') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-em', type: 'email' }]);
      } else if (cmd === '/contact') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-co', type: 'contact' }]);
      } else if (cmd === '/help') {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-he', type: 'help' }]);
      } else {
        setHistory(prev => [...prev, { id: Date.now().toString() + '-er', type: 'error', content: `Command not found: ${cmd}. Type /help for a list of commands.` }]);
      }
      inputRef.current?.focus();
    }, 100);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentInput = input.trim();
    if (!currentInput) return;

    if (currentInput.startsWith('/')) {
      const match = COMMANDS.find(c => c.cmd === currentInput.toLowerCase() || c.cmd.substring(1) === currentInput.toLowerCase());
      if (match) executeCommand(match.cmd);
      else {
        pushCommandToHistory(currentInput);
        setInput('');
        setShowAutocomplete(false);
        setCognitiveMode('idle');
        setTimeout(() => {
          setHistory(prev => [...prev, { id: Date.now().toString() + '-er', type: 'error', content: `Command not found: ${currentInput}. Type /help for a list of commands.` }]);
        }, 100);
      }
    } else {
      pushCommandToHistory(currentInput);
      setInput('');
      setShowAutocomplete(false);
      setIsTyping(true);
      // Reset cognitive mode to idle during AI response
      setCognitiveMode('idle');

      setTimeout(() => {
        const randomResponse = AGENT_RESPONSES[Math.floor(Math.random() * AGENT_RESPONSES.length)];
        setHistory(prev => [...prev, { id: Date.now().toString() + '-ag', type: 'agent', content: randomResponse }]);
        setIsTyping(false);
      }, 1200);
    }
  };

  if (booting) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-8 font-mono text-green-500 overflow-hidden text-sm md:text-base selection:bg-green-900">
        <div className="w-full max-w-xl space-y-2 flex flex-col items-start justify-center">
          {bootLogs.map((log, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={i === bootLogs.length - 1 ? 'animate-pulse text-white font-bold' : ''}
            >
              <TypewriterText text={`> ${log}`} speed={10} />
            </motion.div>
          ))}
          <div className="animate-blink w-3 h-5 bg-green-500 mt-2 self-start" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-1 sm:p-6 lg:p-12 font-mono relative overflow-hidden text-[var(--color-term-text)] text-sm transition-colors duration-700 bg-black">

      <Background3D />

      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none transition-colors duration-1000 bg-[var(--color-bg)]/50" />
      <motion.div animate={{ x: mousePos.x - 300, y: mousePos.y - 300 }} transition={{ type: "spring", damping: 50, stiffness: 200, mass: 0.5 }} className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 z-0 pointer-events-none" style={{ background: 'var(--glow-color-1)' }} />

      <motion.div
        ref={windowRef} drag dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }} dragElastic={0.1} dragMomentum={false}
        initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 50 }} animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }} transition={{ duration: 0.8, type: "spring", bounce: 0.4 }} style={{ perspective: 1000 }}
        className="w-full max-w-[1500px] h-full max-h-[95vh] sm:max-h-[96vh] 2xl:max-h-[98vh] xl:w-[96vw] z-10 glass-panel rounded-xl flex flex-col overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.6)] border border-[var(--color-term-border)]"
      >
        {/* Title Bar */}
        <div className="h-10 shrink-0 bg-[var(--color-bg)]/90 border-b border-[var(--color-term-border)] flex items-center px-4 justify-between select-none cursor-move group">
          <div className="flex gap-2 w-16 opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500" />
          </div>
          <div className="text-xs font-semibold tracking-wider flex items-center gap-2 truncate px-2 opacity-80" style={{ color: 'var(--color-term-text)' }}>
            <Terminal size={14} style={{ color: 'var(--color-term-accent)' }} className="shrink-0" />
            <span className="truncate">arnab_ai_cli ~ /portfolio [{THEMES[themeIndex]}]</span>
          </div>
          <div className="w-16" />
        </div>

        {/* Scrolling Terminal History */}
        <div ref={containerRef} className="flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col p-2 sm:p-4 lg:p-6 w-full custom-scrollbar scroll-smooth" style={{ backgroundColor: 'color-mix(in srgb, var(--color-term-bg) 85%, transparent)', minHeight: '20vh' }}>
          {history.map((item, index) => (
            <div key={item.id} className="w-full flex flex-col max-w-full">
              {item.type === 'command' && (
                <div className="flex items-center gap-3 text-lg font-bold mb-4 mt-2">
                  <span style={{ color: 'var(--color-term-accent)' }}><ChevronRight size={20} strokeWidth={3} /></span>
                  <span style={{ color: 'var(--color-term-text-h)' }}>{item.content}</span>
                </div>
              )}
              {item.type === 'agent' && (
                <div className="mb-6 p-4 rounded-xl border border-[var(--color-term-accent)]/30 w-fit max-w-[85%] bg-[var(--color-term-accent)]/5">
                  <div className="text-[10px] font-bold mb-1 opacity-50 uppercase tracking-widest text-[var(--color-term-text-h)]">Agent Core</div>
                  <div className="font-semibold" style={{ color: 'var(--color-term-text-h)' }}>
                    {index === history.length - 1 ? <TypewriterText text={item.content || ""} speed={15} /> : item.content}
                  </div>
                </div>
              )}
              {item.type === 'error' && <div className="mb-6 text-red-400 font-bold">{item.content}</div>}
              {item.type === 'home' && <HomeOutput executeCommand={(cmd) => executeCommand(cmd)} mode={cognitiveMode} />}
              {item.type === 'experience' && <ExperienceOutput />}
              {item.type === 'skills' && <SkillsOutput />}
              {item.type === 'education' && <EducationOutput />}
              {(item.type === 'social' || item.type === 'linkedin' || item.type === 'github' || item.type === 'email' || item.type === 'contact') && <SocialOutput type={item.type} />}
              {item.type === 'help' && <HelpOutput />}
            </div>
          ))}

          {isTyping && (
            <div className="mb-6 p-4 rounded-xl border border-[var(--color-term-accent)]/30 w-fit bg-[var(--color-term-accent)]/5 flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-term-accent)' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-term-accent)', animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--color-term-accent)', animationDelay: '0.4s' }} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="shrink-0 border-t z-50 transition-colors relative" style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-term-border)' }}>
          <AnimatePresence>
            {showAutocomplete && filteredCommands.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 w-full border-t border-r border-l shadow-[0_-15px_40px_rgba(0,0,0,0.6)] backdrop-blur-3xl z-[100]"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 98%, transparent)', borderColor: 'var(--color-term-border)' }}
              >
                <ul className="max-h-64 overflow-y-auto custom-scrollbar border-b" style={{ borderColor: 'var(--color-term-border)' }}>
                  {filteredCommands.map((cmd, i) => (
                    <li
                      key={cmd.cmd} onClick={() => executeCommand(cmd.cmd)} onMouseEnter={() => setSelectedIndex(i)}
                      className="flex items-center px-6 py-3.5 cursor-pointer transition-colors"
                      style={{
                        backgroundColor: i === selectedIndex ? 'color-mix(in srgb, var(--color-term-border) 40%, transparent)' : 'transparent',
                        color: i === selectedIndex ? 'var(--color-term-text-h)' : 'var(--color-term-text)'
                      }}
                    >
                      <div className="flex w-32 sm:w-48 shrink-0 font-bold tracking-wide" style={{ color: 'var(--color-term-accent)' }}>{cmd.cmd}</div>
                      <div className="text-xs sm:text-sm font-semibold opacity-70 shrink-0 select-none hidden sm:block">{cmd.desc}</div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleFormSubmit} className="flex items-center gap-2 sm:gap-4 w-full p-2 sm:p-4">
            <span className="font-bold text-lg select-none shrink-0" style={{ color: 'var(--color-term-accent)' }}>
              <ChevronRight size={24} strokeWidth={3} />
            </span>
            <input
              ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
              placeholder="Type command..."
              className="flex-1 bg-transparent border-none outline-none font-bold font-mono text-xs sm:text-sm w-full min-w-0 placeholder-opacity-40"
              style={{ color: 'var(--color-term-text-h)', caretColor: 'var(--color-term-accent)' }}
              autoComplete="off" spellCheck="false"
            />
            <button
              type="submit" className="p-2.5 rounded-lg transition-all shrink-0 hover:opacity-80 disabled:opacity-20 shadow-sm" disabled={!input.trim()}
              style={{ backgroundColor: input.trim() ? 'var(--color-term-accent)' : 'transparent', color: input.trim() ? 'var(--color-bg)' : 'var(--color-term-text)' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
