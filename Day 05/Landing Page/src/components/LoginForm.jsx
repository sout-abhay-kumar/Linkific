import { ArrowRight, LockKeyhole, Mail, X } from "lucide-react";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onClose,
  onSwitchToSignup,
  message,
}) {
  return (
    <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>
        <X size={20} />
      </button>
      <div className="dialog-mark">C<span>.</span></div>
      <p className="tagline">WELCOME BACK</p>
      <h2 id="auth-title">Good to see you.</h2>
      <p className="dialog-description">
        Log in to continue connecting with your community.
      </p>

      <form className="auth-form" onSubmit={onSubmit}>
        <label htmlFor="login-email">Email address</label>
        <div className="input-wrap">
          <Mail size={17} />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <label htmlFor="login-password">Password</label>
        <div className="input-wrap">
          <LockKeyhole size={17} />
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            minLength={6}
            required
          />
        </div>

        <button className="primary-button auth-submit" type="submit">
          Log in <ArrowRight size={18} />
        </button>
        {message && <p className="form-feedback" role="status">{message}</p>}
      </form>

      <p className="switch-auth">
        New to Connectly?{" "}
        <button type="button" onClick={onSwitchToSignup}>Sign up</button>
      </p>
      <p className="fine-print">
        Front-end demo only — details are not sent to a server or saved.
      </p>
    </section>
  );
}