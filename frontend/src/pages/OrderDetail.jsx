// ==========================================
// Order Detail Page — Premium Modern SaaS UI
// ==========================================
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetail } from "../store/slices/orderSlice";
import Loading from "../components/Loading";
import { FiPackage, FiMapPin, FiCreditCard, FiCheck, FiClock, FiTruck, FiPhone, FiArrowLeft } from "react-icons/fi";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderDetail(id));
  }, [dispatch, id]);

  if (loading || !order) return <Loading />;

  const statusColors = {
    Processing: "text-amber-600 bg-amber-50 border-amber-200",
    Shipped: "text-blue-600 bg-blue-50 border-blue-200",
    Delivered: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Cancelled: "text-red-600 bg-red-50 border-red-200",
  };

  const statusIcons = {
    Processing: FiClock,
    Shipped: FiTruck,
    Delivered: FiCheck,
  };

  const StatusIcon = statusIcons[order.status] || FiClock; // Note: using order.status instead of orderStatus

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 font-[Inter,sans-serif]">
      <div className="max-w-[1200px] mx-auto pt-20">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium">
          <FiArrowLeft /> Go Back
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-3">
              <FiPackage /> Order Confirmed
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Order Details
            </h1>
            <p className="text-gray-500 mt-1">
              Order ID: <span className="font-mono text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">#{order._id}</span>
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border ${
                statusColors[order.status] || "text-gray-600 bg-gray-50 border-gray-200"
              }`}
            >
              <StatusIcon size={16} /> {order.status}
            </span>
            <p className="text-gray-400 text-xs mt-2 font-medium">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            
            {/* Order Items */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <FiPackage />
                </div>
                Items Ordered
              </h2>
              
              <div className="space-y-4">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <p className="text-gray-500 text-sm mt-1">
                        Qty: <span className="font-bold text-gray-700">{item.quantity}</span> × Rs. {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right sm:text-left mt-2 sm:mt-0">
                      <span className="block font-black text-gray-900 text-lg">
                        Rs. {(item.quantity * item.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Payment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <FiMapPin />
                  </div>
                  Shipping Address
                </h2>
                <div className="text-gray-600 space-y-1">
                  <p className="font-bold text-gray-900">{order.user?.name}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <FiPhone /> {order.shippingAddress?.phone}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <FiCreditCard />
                  </div>
                  Payment Info
                </h2>
                <div className="text-gray-600 space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Method</p>
                    <p className="font-bold text-gray-900">{order.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold border ${
                        order.isPaid
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {order.isPaid ? <><FiCheck /> Paid</> : <><FiClock /> Pending</>}
                    </span>
                  </div>

                  {order.paidAt && (
                    <p className="text-xs text-gray-400 font-medium mt-2">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Price Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Total Items</span>
                  <span className="font-bold text-gray-900">
                    {order.orderItems?.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                
                <div className="h-px bg-gray-100 w-full my-2"></div>
                
                <div className="flex justify-between text-gray-900 items-center">
                  <span className="font-bold">Total Paid</span>
                  <span className="text-2xl font-black text-indigo-600">
                    Rs. {order.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Status Banner */}
              <div className={`mt-8 p-5 rounded-2xl border ${
                  order.isDelivered ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${order.isDelivered ? "text-emerald-600" : "text-blue-600"}`}>
                    {order.isDelivered ? <FiCheck size={20} /> : <FiTruck size={20} />}
                  </div>
                  <div>
                    <h3 className={`font-bold ${order.isDelivered ? "text-emerald-900" : "text-blue-900"}`}>
                      {order.isDelivered ? "Delivered" : "On the way"}
                    </h3>
                    <p className={`text-sm mt-1 font-medium ${order.isDelivered ? "text-emerald-700" : "text-blue-700"}`}>
                      {order.isDelivered
                        ? `Package was delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                        : "Your package is currently being processed and will be shipped soon."}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
