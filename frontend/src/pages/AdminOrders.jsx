// ==========================================
// Admin Orders Page — Full Order History
// ==========================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
  clearOrderError,
  clearOrderMessage,
} from "../store/slices/orderSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { FiEye, FiPackage, FiSearch, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allOrders: orders, loading, error, message } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearOrderMessage());
      dispatch(fetchAllOrders());
    }
  }, [error, message, dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const statusColors = {
    Processing: "text-amber-600 bg-amber-50 border-amber-200",
    Shipped: "text-blue-600 bg-blue-50 border-blue-200",
    Delivered: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Cancelled: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 font-[Inter,sans-serif]">
      <div className="max-w-[1400px] mx-auto pt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-full flex items-center justify-center transition-all">
              <FiArrowLeft size={20} />
            </button>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <FiPackage size={24} />
            </div>
            Order History
          </h1>
          
          <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm w-full md:w-auto min-w-[300px]">
            <FiSearch className="text-gray-400" />
            <input type="text" placeholder="Search by Order ID..." className="bg-transparent focus:outline-none text-sm w-full font-medium" />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="p-5">Order ID</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Total Price</th>
                    <th className="p-5">Payment</th>
                    <th className="p-5">Delivery Status</th>
                    <th className="p-5 text-center">Change Status</th>
                    <th className="p-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders?.map((o) => (
                    <tr key={o._id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="p-5 font-mono text-xs font-bold text-indigo-600">
                        #{o._id}
                      </td>
                      <td className="p-5 text-sm font-medium text-gray-600">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5 font-extrabold text-gray-900">Rs. {o.totalPrice?.toLocaleString()}</td>
                      <td className="p-5">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold border ${
                            o.isPaid
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          {o.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                            statusColors[o.status] || "text-gray-600 bg-gray-50 border-gray-200"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-bold py-2 px-4 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center">
                          <Link
                            to={`/order/${o._id}`}
                            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all text-sm flex items-center gap-2 font-bold shadow-sm"
                          >
                            <FiEye /> View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders?.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-10 text-center text-gray-500 font-medium">No orders found in the history.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
