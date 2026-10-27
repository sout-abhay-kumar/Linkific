import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializationError, setInitializationError] = useState("");
  const initializationRequest = useRef(null);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      if (error.status === 401) {
        setUser(null);
        return null;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (!initializationRequest.current) {
      initializationRequest.current = (async () => {
        try {
          await api.getCsrf();
          return { user: await api.getCurrentUser(), error: null };
        } catch (error) {
          return {
            user: null,
            error: error.status === 401 ? null : error,
          };
        }
      })();
    }
    initializationRequest.current.then(({ user: currentUser, error }) => {
      if (!active) return;
      setUser(currentUser);
      if (error) {
        setInitializationError(error.message || "Could not check your session.");
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("papertrail:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("papertrail:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    const signedInUser = await api.login(credentials);
    setUser(signedInUser);
    setInitializationError("");
    return signedInUser;
  }, []);

  const signup = useCallback(async (details) => {
    const newUser = await api.signup(details);
    setUser(newUser);
    setInitializationError("");
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      initializationError,
      login,
      signup,
      logout,
      refreshCurrentUser,
      setUser,
    }),
    [
      user,
      loading,
      initializationError,
      login,
      signup,
      logout,
      refreshCurrentUser,
    ],
  );

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center px-5 text-sm text-stone-500">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-stone-200 border-t-[#55745f]" />
          <p className="mt-3">Opening your Papertrail…</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
