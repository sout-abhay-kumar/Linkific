import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.getAdminUsers()
      .then((result) => {
        if (active) setUsers(result);
      })
      .catch((requestError) => {
        if (active) {
          if (requestError.status === 403) {
            navigate("/unauthorized", { replace: true });
          } else {
            setError(requestError.message || "Could not load users.");
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <section>
      <p className="text-[10px] font-bold tracking-[.2em] text-[#55745f]">
        ADMINISTRATION
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
        Users
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Accounts registered with Papertrail.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {loading ? (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500"
        >
          Loading users…
        </div>
      ) : !error && users.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          No user accounts found.
        </div>
      ) : !error ? (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs font-semibold text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3">Name</th>
                <th scope="col" className="px-5 py-3">Email</th>
                <th scope="col" className="px-5 py-3">Role</th>
                <th scope="col" className="px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4 font-medium text-stone-800">
                    {user.full_name}
                  </td>
                  <td className="px-5 py-4 text-stone-600">{user.email}</td>
                  <td className="px-5 py-4 capitalize text-stone-600">
                    {user.role}
                  </td>
                  <td className="px-5 py-4 text-stone-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
