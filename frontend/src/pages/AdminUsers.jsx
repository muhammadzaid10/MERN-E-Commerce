// ==========================================
// Admin Users Page — User management & role assignment
// ==========================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  updateUserRole,
  clearError,
  clearMessage,
} from "../store/slices/authSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiUsers, FiShield, FiUser, FiArrowLeft } from "react-icons/fi";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers, loading, error, message, user: currentUser } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      dispatch(fetchAllUsers()); // Refresh users list
    }
  }, [error, message, dispatch]);

  const handleRoleChange = (userId) => {
    if (userId === currentUser._id) {
      toast.error("You cannot change your own role!");
      return;
    }
    dispatch(updateUserRole(userId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white rounded-full flex items-center justify-center transition-all">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FiUsers className="text-indigo-400" /> Manage Users
          </h1>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-300 text-sm font-medium">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
                  {allUsers?.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono text-xs text-white max-w-[150px] truncate">
                        #{u._id}
                      </td>
                      <td className="p-4 font-semibold text-white">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${
                            u.role === "admin"
                              ? "bg-indigo-500/10 text-indigo-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {u.role === "admin" ? <FiShield /> : <FiUser />}
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleRoleChange(u._id)}
                            disabled={u._id === currentUser._id}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                              u._id === currentUser._id
                                ? "bg-white/5 text-gray-600 cursor-not-allowed"
                                : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                            }`}
                          >
                            Change Role to {u.role === "admin" ? "User" : "Admin"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
