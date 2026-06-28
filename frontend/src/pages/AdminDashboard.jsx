// ==========================================
// Admin Dashboard Page — Premium SaaS Admin
// ==========================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllOrders } from "../store/slices/orderSlice";
import { fetchProducts } from "../store/slices/productSlice";
import { fetchAllUsers } from "../store/slices/authSlice";
import Loading from "../components/Loading";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { allOrders: orders, totalRevenue, loading: ordersLoading } = useSelector((state) => state.order);
  const { products, loading: productsLoading } = useSelector((state) => state.product);
  const { allUsers, loading: usersLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts({}));
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (ordersLoading || productsLoading || usersLoading) return <Loading />;

  // Calculate statistics
  const totalOrders = orders ? orders.length : 0;
  const totalProducts = products ? products.length : 0;
  const totalUsers = allUsers ? allUsers.length : 0;

  // Stats Card Component
  const StatCard = ({ title, value, icon: Icon, color, link, linkText }) => (
    <div className="bg-white rounded-[2rem] p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-4xl font-extrabold text-gray-900">{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
          <Icon className="text-3xl" />
        </div>
      </div>
      <Link
        to={link}
        className={`text-sm font-semibold text-${color}-600 hover:text-${color}-700 transition-colors flex items-center gap-1`}
      >
        {linkText} <FiTrendingUp size={14} />
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 font-[Inter,sans-serif]">
      <div className="max-w-[1400px] mx-auto pt-20">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <FiLayers size={24} />
          </div>
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${totalRevenue.toLocaleString()}`}
            icon={FiDollarSign}
            color="emerald"
            link="/admin/orders"
            linkText="View Orders"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={FiShoppingBag}
            color="indigo"
            link="/admin/orders"
            linkText="Manage Orders"
          />
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={FiLayers}
            color="purple"
            link="/admin/products"
            linkText="Manage Products"
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={FiUsers}
            color="amber"
            link="/admin/users"
            linkText="Manage Users"
          />
        </div>

        {/* Shortcuts / Quick Actions */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              to="/admin/products"
              className="bg-gray-900 text-white p-5 rounded-2xl font-bold hover:bg-indigo-600 transition-all text-center shadow-lg hover:shadow-indigo-500/20"
            >
              + Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="bg-gray-50 border border-gray-200 text-gray-900 p-5 rounded-2xl font-bold hover:bg-gray-100 transition-all text-center"
            >
              Review Pending Orders
            </Link>
            <Link
              to="/admin/users"
              className="bg-gray-50 border border-gray-200 text-gray-900 p-5 rounded-2xl font-bold hover:bg-gray-100 transition-all text-center"
            >
              Manage Roles & Permissions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
