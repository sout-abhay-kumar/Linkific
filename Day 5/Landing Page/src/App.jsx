import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm.jsx";
import SignupForm from "./components/SignupForm.jsx";
import {
  ArrowRight, ArrowUpRight, Check, Heart, MessageCircle, Menu, X,
  Share2, Sparkles, Globe2, Camera, Users, LockKeyhole, Mail, UserRound
} from "lucide-react";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [postedComment, setPostedComment] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [toast, setToast] = useState("");
  const [authMode, setAuthMode] = useState(null);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthMessage("");
    setAuthName("");
    setAuthEmail("");
    setAuthPassword("");
    setMenuOpen(false);
  };

  const closeAuth = () => {
    setAuthMode(null);
    setAuthMessage("");
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    if (!authEmail.trim() || !authPassword.trim() || (authMode === "signup" && !authName.trim())) return;
    setAuthMessage(
      authMode === "signup"
        ? `Welcome, ${authName.trim().split(" ")[0]}! Your demo account is ready in this browser session.`
        : "You're signed in for this front-end demo."
    );
    setToast(authMode === "signup" ? "Demo sign-up complete." : "Demo login complete.");
  };

  const handleShare = async () => {
    const shareData = { title: "Connectly", text: "Little moments, big memories.", url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        setToast("Page link copied to clipboard.");
      } else {
        setToast("Copy this page URL to share Connectly.");
      }
    } catch (error) {
      if (error.name !== "AbortError") setToast("Sharing is not available in this browser.");
    }
  };

  const navItems = [
    ["home", "Home"], ["features", "Features"], ["about", "About"]
  ];

  return (
    <div className="app-shell">
      <header className="navbar">
        <a href="#home" className="logo" aria-label="Connectly home">Connectly<span>.</span></a>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`nav-links ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {navItems.map(([id, label]) => (
            <a key={id} className={`nav-link ${activeSection === id ? "active" : ""}`} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="login-link" onClick={() => openAuth("login")}>Log in</button>
          <button className="nav-button" onClick={() => openAuth("signup")}>Sign up <ArrowUpRight size={16} /></button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content reveal">
            <p className="tagline"><Sparkles size={14} /> YOUR WORLD, YOUR PEOPLE</p>
            <h1>Connect with people who <span>matter.</span></h1>
            <p className="description">Share your moments, discover new interests, and stay connected with friends wherever life takes you.</p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => openAuth("signup")}>Get Started <ArrowRight size={18} /></button>
              <a href="#features" className="secondary-button"><span className="play-icon">▶</span> Explore Features</a>
            </div>
            <p className="community-text"><Sparkles size={14} /> A place to share, connect, and belong.</p>
            <div className="social-proof">
              <div className="avatar-stack" aria-hidden="true"><span>J</span><span>M</span><span>A</span><span>+</span></div>
              <p><strong>Join a growing community</strong><br /><span>Good people. Great conversations.</span></p>
            </div>
          </div>

          <div className="hero-visual reveal">
            <div className="decor decor-one" /><div className="decor decor-two" />
            <article className="social-card">
              <div className="post-header">
                <div className="avatar avatar-one">A</div>
                <div><h3>Alex Morgan <span className="verified"><Check size={11} /></span></h3><p>2 hours ago · <span>◎</span> Friends</p></div>
                <button className="icon-button more" aria-label="More post options" onClick={() => setToast("More post options coming soon.")}>•••</button>
              </div>
              <div className="post-image" role="img" aria-label="Illustration of a sunset over mountains">
                <div className="sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" />
                <span className="image-caption">chasing the golden hour</span>
              </div>
              <p className="post-copy">Little moments, big memories. 🌄</p>
              <div className="post-actions">
                <button className={`action-button like-button ${liked ? "liked" : ""}`} aria-pressed={liked} onClick={() => { setLiked(!liked); setToast(liked ? "Like removed." : "You liked Alex’s post."); }}>
                  <Heart size={19} fill={liked ? "currentColor" : "none"} /> <span>{liked ? 249 : 248}</span>
                </button>
                <button className="action-button" onClick={() => setCommentsOpen(!commentsOpen)}><MessageCircle size={18} /> <span>36</span></button>
                <button className="action-button share-button" onClick={handleShare}><Share2 size={17} /> <span>Share</span></button>
              </div>
              {commentsOpen && <div className="comments-panel">
                <p><strong>Jamie:</strong> This view is everything 💜</p>
                {postedComment && <p><strong>You:</strong> {postedComment}</p>}
                <form className="comment-form" onSubmit={(event) => { event.preventDefault(); if (!comment.trim()) return; setPostedComment(comment.trim()); setComment(""); setToast("Comment added to the demo."); }}>
                  <input value={comment} onChange={(event) => setComment(event.target.value)} aria-label="Write a comment" placeholder="Write a kind comment…" maxLength={140} required />
                  <button type="submit" aria-label="Post comment">↑</button>
                </form>
              </div>}
            </article>
            {notificationVisible && <div className="notification" aria-live="polite">
              <span className="notification-icon"><Heart size={18} fill="currentColor" /></span>
              <div><strong className="notification-title">New connection!</strong><p className="notification-message">Someone liked your post.</p></div>
              <button className="notification-close" aria-label="Dismiss notification" onClick={() => { setNotificationVisible(false); setToast("Notification dismissed."); }}><X size={17} /></button>
            </div>}
            <div className="floating-label"><span className="online-dot" /> Your people are here</div>
          </div>
        </section>

        <section className="features section" id="features">
          <div className="section-heading reveal">
            <p className="tagline">WHY CONNECTLY?</p>
            <h2>Everything social, <span>in one place.</span></h2>
            <p>Discover simple ways to bring your online community closer.</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card reveal"><div className="feature-icon icon-purple"><Camera size={25} /></div><h3>Share Moments</h3><p>Post photos, share updates, and let your friends be part of your day.</p><button className="feature-link" onClick={() => openAuth("signup")}>Share your story <ArrowRight size={16} /></button></article>
            <article className="feature-card reveal"><div className="feature-icon icon-pink"><MessageCircle size={25} /></div><h3>Stay Connected</h3><p>Keep conversations going and catch up with the people you care about.</p><button className="feature-link" onClick={() => openAuth("signup")}>Start a conversation <ArrowRight size={16} /></button></article>
            <article className="feature-card reveal"><div className="feature-icon icon-blue"><Globe2 size={25} /></div><h3>Discover People</h3><p>Meet people with similar interests and find your community.</p><button className="feature-link" onClick={() => openAuth("signup")}>Find your people <ArrowRight size={16} /></button></article>
          </div>
        </section>

        <section className="join-section reveal" id="join">
          <div className="join-orb orb-left" /><div className="join-orb orb-right" />
          <p className="tagline">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2>Your people are waiting.</h2>
          <p>Start sharing your world with Connectly today.</p>
          <button className="primary-button join-trigger" onClick={() => openAuth("signup")}>Join the Community <ArrowRight size={18} /></button>
          <div className="join-note">Free to join <span>·</span> Made for real connections</div>
        </section>
      </main>

      <footer id="about">
        <div><a href="#home" className="logo">Connectly<span>.</span></a><p>Bringing people closer, one connection at a time.</p></div>
        <p className="copyright">© 2026 Connectly. All rights reserved.</p>
      </footer>

      {authMode && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAuth(); }}>
        {authMode === "login" ? (
          <LoginForm
            email={authEmail}
            setEmail={setAuthEmail}
            password={authPassword}
            setPassword={setAuthPassword}
            onSubmit={handleAuthSubmit}
            onClose={closeAuth}
            onSwitchToSignup={() => openAuth("signup")}
            message={authMessage}
          />
        ) : (
          <SignupForm
            name={authName}
            setName={setAuthName}
            email={authEmail}
            setEmail={setAuthEmail}
            password={authPassword}
            setPassword={setAuthPassword}
            onSubmit={handleAuthSubmit}
            onClose={closeAuth}
            onSwitchToLogin={() => openAuth("login")}
            message={authMessage}
          />
        )}
      </div>}
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}

export default App;