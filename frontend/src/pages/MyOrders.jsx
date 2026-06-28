// ==========================================
// My Orders Page — User ke saare orders
// ==========================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/slices/orderSlice";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { FiPackage, FiEye, FiClock, FiTruck, FiCheck } from "react-icons/fi";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <Loading />;

  const statusColors = {
    Processing: "text-amber-400 bg-amber-500/10",
    Shipped: "text-blue-400 bg-blue-500/10",
    Delivered: "text-emerald-400 bg-emerald-500/10",
    Cancelled: "text-red-400 bg-red-500/10",
  };

  const statusIcons = {
    Processing: FiClock,
    Shipped: FiTruck,
    Delivered: FiCheck,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <FiPackage className="text-indigo-400" /> My Orders
        </h1>

        {(!orders || orders.length === 0) ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiPackage className="text-4xl text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No orders found!</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || FiClock;
              return (
                <div
                  key={order._id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs font-mono mb-1">#{order._id}</p>
                      <p className="text-white font-medium">
                        {order.orderItems?.length} item(s) • ₹{order.totalPrice}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Status + View */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                          statusColors[order.status] || "text-gray-400 bg-white/10"
                        }`}
                      >
                        <StatusIcon className="text-sm" /> {order.status}
                      </span>
                      <Link
                        to={`/order/${order._id}`}
                        className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-500/20 transition-all"
                      >
                        <FiEye /> View
                      </Link>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {order.orderItems?.slice(0, 4).map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg border border-white/10"
                      />
                    ))}
                    {order.orderItems?.length > 4 && (
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        +{order.orderItems.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
