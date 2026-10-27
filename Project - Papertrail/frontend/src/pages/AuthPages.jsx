import { useState } from "react";
import { BookOpen, Eye, EyeOff, KeyRound, Leaf } from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

function AuthFrame({ eyebrow, title, description, children, footer }) {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-3 no-underline">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6eee6] text-[#345744]">
            <BookOpen size={22} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-tight text-stone-900">
              papertrail
            </span>
            <span className="block text-[10px] font-semibold tracking-[.16em] text-stone-500">
              YOUR PERSONAL LIBRARY
            </span>
          </span>
        </Link>

        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf2ec] text-[#55745f]">
            <Leaf size={19} />
          </span>
          <p className="mt-5 text-[10px] font-bold tracking-[.2em] text-[#55745f]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
          <div className="mt-7">{children}</div>
          {footer && (
            <div className="mt-6 border-t border-stone-100 pt-5 text-center text-sm text-stone-500">
              {footer}
            </div>
          )}
        </section>
        <p className="mt-6 text-center text-xs text-stone-400">
          A calm place for the books you love.
        </p>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  name = "password",
  value,
  onChange,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <span className="relative mt-1.5 block">
        <input
          required
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          minLength={name === "current_password" ? undefined : 12}
          maxLength={128}
          className="form-input pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-2 grid w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-50 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8baa91]"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </label>
  );
}

function PasswordRequirements() {
  return (
    <p className="mt-2 text-xs leading-5 text-stone-500">
      Use 12–128 characters, with at least one uppercase letter, one lowercase
      letter, and one number.
    </p>
  );
}

function FormError({ children }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
    >
      {children}
    </p>
  );
}

function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export function LoginPage() {
  const { user, login, initializationError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message;
  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email: email.trim(), password });
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      eyebrow="WELCOME BACK"
      title="Welcome back to Papertrail"
      description="Your next chapter awaits."
      footer={
        <>
          New to Papertrail?{" "}
          <Link
            className="font-semibold text-[#47654e] hover:underline"
            to="/signup"
            state={location.state}
          >
            Create an account
          </Link>
        </>
      }
    >
      {initializationError && (
        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
          {initializationError}
        </p>
      )}
      {successMessage && (
        <p role="status" className="mb-4 rounded-xl bg-[#edf2ec] px-3 py-2.5 text-sm text-[#345744]">
          {successMessage}
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium text-stone-700">
          Email address
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="form-input mt-1.5"
          />
        </label>
        <PasswordField
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#47654e] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormError>{error}</FormError>
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
    </AuthFrame>
  );
}

export function SignupPage() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signup({ full_name: fullName.trim(), email: email.trim(), password });
      navigate(location.state?.from || "/", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      eyebrow="A NEW CHAPTER"
      title="Begin your next chapter"
      description="Create an account and keep your reading journey close."
      footer={
        <>
          Already have an account?{" "}
          <Link
            className="font-semibold text-[#47654e] hover:underline"
            to="/login"
            state={location.state}
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium text-stone-700">
          Full name
          <input
            required
            maxLength={120}
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="form-input mt-1.5"
          />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          Email address
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="form-input mt-1.5"
          />
        </label>
        <div>
          <PasswordField
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <PasswordRequirements />
        </div>
        <PasswordField
          label="Confirm password"
          name="confirm-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="new-password"
        />
        <FormError>{error}</FormError>
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthFrame>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setResetToken("");
    try {
      const result = await api.forgotPassword(email.trim());
      setMessage(result.message);
      setResetToken(result.reset_token || "");
    } catch (requestError) {
      setError(requestError.message || "Could not submit the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      eyebrow="ACCOUNT RECOVERY"
      title="Forgot your password?"
      description="Enter the email address linked to your account. We’ll show the same confirmation either way."
      footer={
        <Link className="font-semibold text-[#47654e] hover:underline" to="/login">
          Back to sign in
        </Link>
      }
    >
      {message ? (
        <div className="space-y-4">
          <p role="status" className="rounded-xl bg-[#edf2ec] px-3 py-3 text-sm leading-6 text-[#345744]">
            {message}
          </p>
          {resetToken && (
            <Link
              to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="btn-primary w-full"
            >
              Continue to reset password
            </Link>
          )}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-stone-700">
            Email address
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form-input mt-1.5"
            />
          </label>
          <FormError>{error}</FormError>
          <SubmitButton loading={loading}>Send reset instructions</SubmitButton>
        </form>
      )}
    </AuthFrame>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (!token) {
    return (
      <AuthFrame
        eyebrow="ACCOUNT RECOVERY"
        title="Reset link unavailable"
        description="This password reset link is missing its token. Request a new link to continue."
        footer={
          <Link className="font-semibold text-[#47654e] hover:underline" to="/forgot-password">
            Request another reset link
          </Link>
        }
      >
        <KeyRound className="text-[#55745f]" size={22} />
      </AuthFrame>
    );
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.resetPassword(token, password);
      navigate("/login", { replace: true, state: { message: result.message } });
    } catch (requestError) {
      setError(requestError.message || "This reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      eyebrow="ACCOUNT RECOVERY"
      title="Choose a new password"
      description="Set a fresh password to return to your reading space."
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <PasswordField
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <PasswordRequirements />
        </div>
        <PasswordField
          label="Confirm new password"
          name="confirm-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="new-password"
        />
        <FormError>{error}</FormError>
        <SubmitButton loading={loading}>Reset password</SubmitButton>
      </form>
    </AuthFrame>
  );
}
