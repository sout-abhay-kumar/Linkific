import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user.full_name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveProfile(event) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileError("");
    setNotice("");
    try {
      const updatedUser = await api.updateProfile({
        full_name: fullName.trim(),
        email: email.trim(),
      });
      setUser(updatedUser);
      setFullName(updatedUser.full_name);
      setEmail(updatedUser.email);
      setNotice("Your profile has been updated.");
    } catch (error) {
      setProfileError(error.message || "Could not update your profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setSavingPassword(true);
    setPasswordError("");
    setNotice("");
    try {
      const result = await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setUser(null);
      navigate("/login", { replace: true, state: { message: result.message } });
    } catch (error) {
      setPasswordError(error.message || "Could not change your password.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function signOut() {
    setProfileError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setProfileError(error.message || "Could not sign out. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">
        YOUR ACCOUNT
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        Profile
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Keep your account details and sign-in information up to date.
      </p>
      {notice && (
        <p role="status" className="mt-5 rounded-xl bg-[#edf2ec] px-4 py-3 text-sm text-[#345744]">
          {notice}
        </p>
      )}
      {profileError && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileError}
        </p>
      )}

      <div className="mt-7 grid gap-5">
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold text-stone-900">Account details</h2>
          <p className="mt-1 text-sm text-stone-500">
            Member since{" "}
            {new Date(user.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <form onSubmit={saveProfile} className="mt-5 space-y-4">
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
            <button type="submit" disabled={savingProfile} className="btn-primary disabled:opacity-60">
              {savingProfile ? "Saving…" : "Save profile"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-semibold text-stone-900">Change password</h2>
          <p className="mt-1 text-sm text-stone-500">
            Changing your password signs out all active sessions.
          </p>
          <form onSubmit={changePassword} className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-stone-700">
              Current password
              <input
                required
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="form-input mt-1.5"
              />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              New password
              <input
                required
                type="password"
                minLength={12}
                maxLength={128}
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="form-input mt-1.5"
              />
            </label>
            <p className="-mt-2 text-xs leading-5 text-stone-500">
              Use 12–128 characters, including an uppercase letter, a lowercase
              letter, and a number.
            </p>
            {passwordError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {passwordError}
              </p>
            )}
            <button type="submit" disabled={savingPassword} className="btn-primary disabled:opacity-60">
              {savingPassword ? "Updating…" : "Change password"}
            </button>
          </form>
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-7">
          <div>
            <h2 className="font-semibold text-stone-900">Sign out</h2>
            <p className="mt-1 text-sm text-stone-500">
              End your current Papertrail session.
            </p>
          </div>
          <button type="button" onClick={signOut} className="btn-secondary">
            Sign out
          </button>
        </section>
      </div>
    </section>
  );
}
