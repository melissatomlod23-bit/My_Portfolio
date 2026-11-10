
import React, { useEffect, useRef, useState } from "react";
import { profile, about, projects } from "./data.js";


// Reveal elements when they enter the viewport
function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

// Navigation
function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Projects", "#projects"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="site-header">
      <a href="#home" className="brand">
        Melissa.
      </a>

      <button
        className="menu-btn"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={open ? "nav open" : "nav"}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

// Home section
function Hero() {
  return (
    <section id="home" className="hero">
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>
              WELCOME! BROWSE MY PORTFOLIO • {profile.roles.join(" • ")} •
              &nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="hero-inner">
        <div className="hero-text">
          <p className="eyebrow">Hi, I'm {profile.name}</p>

          <h1>Fresh Graduate in Computer Science</h1>

          <p className="lead">{profile.tagline}</p>

          <div className="hero-actions">
            <a className="btn primary" href="#projects">
              Explore My Work
            </a>

            <a className="btn ghost" href="#contact">
              Get in Touch
            </a>
          </div>
        </div>

        <div className="hero-photo">
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
        </div>
      </div>
    </section>
  );
}

// About section
function About() {
  return (
    <section id="about" className="section">
      <Reveal as="h2" className="section-title">
        About Me
      </Reveal>

      <div className="grid three">
        {about.map((item, i) => (
          <Reveal
            key={item.title}
            delay={i * 120}
            className="card"
          >
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// Individual project card
function ProjectCard({ p, index }) {
  const links = [
    p.demo && ["Live Demo", p.demo],
    p.code && ["Source Code", p.code],
  ].filter(Boolean);

  return (
    <Reveal
      delay={index * 120}
      as="article"
      className="card project"
    >
      <div className="project-media">
        {p.image ? (
          <img
            src={p.image}
            alt={`${p.title} screenshot`}
            loading="lazy"
          />
        ) : (
          <div className="placeholder">
            Project Screenshot Coming Soon
          </div>
        )}

        <span className="badge">{p.type}</span>
      </div>

      <h3>{p.title}</h3>

      <dl className="impact">
        <dt>Problem</dt>
        <dd>{p.problem}</dd>

        <dt>What I Built</dt>
        <dd>{p.solution}</dd>

        <dt>Result</dt>
        <dd>{p.result}</dd>
      </dl>

      <ul className="tags">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      {links.length > 0 && (
        <div className="project-links">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {label} →
            </a>
          ))}
        </div>
      )}
    </Reveal>
  );
}

// Projects section
function Projects() {
  return (
    <section id="projects" className="section alt">
      <Reveal as="h2" className="section-title">
        Featured Projects
      </Reveal>

      <div className="grid three">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}

// Contact section
function Contact() {
  const [status, setStatus] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const subject = encodeURIComponent(
      `Portfolio message from ${formData.get("first")} ${formData.get("last")}`
    );

    const body = encodeURIComponent(
      `${formData.get("message")}\n\nFrom: ${formData.get("email")}`
    );

    window.location.href =
      `mailto:${profile.email}?subject=${subject}&body=${body}`;

    setStatus("Opening your email application...");
  };

  return (
    <section id="contact" className="section">
      <Reveal as="h2" className="section-title">
        Contact Me
      </Reveal>

      <div className="contact-wrap">
        <Reveal className="contact-info">
          <p>
            I'm open to developer opportunities. If you'd like to
            get in touch, feel free to send me a message or reach
            out through my social profiles.
          </p>

          <ul>
            <li>
              Email:{" "}
              <a href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>

            {profile.github && (
              <li>
                GitHub:{" "}
                <a href={profile.github} target="_blank" rel="noreferrer">
                  GitHub Profile
                </a>
              </li>
            )}

            {profile.linkedin && (
              <li>
                LinkedIn:{" "}
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn Profile
                </a>
              </li>
            )}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <form className="card form" onSubmit={onSubmit}>
            <div className="row">
              <input
                name="first"
                type="text"
                placeholder="First name"
                required
              />

              <input
                name="last"
                type="text"
                placeholder="Last name"
                required
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
            />

            <textarea
              name="message"
              rows="5"
              placeholder="Write your message..."
              required
            />

            <button className="btn primary" type="submit">
              Send Message
            </button>

            {status && (
              <p className="status" role="status">
                {status}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

// Main application
export default function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
      </footer>
    </>
  );
}
