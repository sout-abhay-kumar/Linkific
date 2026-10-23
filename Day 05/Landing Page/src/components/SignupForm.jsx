import { ArrowRight, LockKeyhole, Mail, UserRound, X } from "lucide-react";

export default function SignupForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onClose,
  onSwitchToLogin,
  message,
}) {
  return (
    <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>
        <X size={20} />
      </button>
      <div className="dialog-mark">C<span>.</span></div>
      <p className="tagline">WELCOME TO CONNECTLY</p>
      <h2 id="auth-title">Find your people.</h2>
      <p className="dialog-description">
        Create your demo account and get closer to the people and interests you love.
      </p>

      <form className="auth-form" onSubmit={onSubmit}>
        <label htmlFor="signup-name">Your name</label>
        <div className="input-wrap">
          <UserRound size={17} />
          <input
            id="signup-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Alex Morgan"
            autoComplete="name"
            maxLength={60}
            required
          />
        </div>

        <label htmlFor="signup-email">Email address</label>
        <div className="input-wrap">
          <Mail size={17} />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <label htmlFor="signup-password">Password</label>
        <div className="input-wrap">
          <LockKeyhole size={17} />
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>

        <button className="primary-button auth-submit" type="submit">
          Create my account <ArrowRight size={18} />
        </button>
        {message && <p className="form-feedback" role="status">{message}</p>}
      </form>

      <p className="switch-auth">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin}>Log in</button>
      </p>
      <p className="fine-print">
        Front-end demo only — details are not sent to a server or saved.
      </p>
    </section>
  );
}