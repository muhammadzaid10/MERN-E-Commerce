// ==========================================
// Home Page — Premium Modern React/SaaS UI
// ==========================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiTrendingUp, FiPackage } from "react-icons/fi";

const Home = () => {
  const dispatch = useDispatch();
  const { newProducts, categories, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen font-[Inter,sans-serif] bg-[#fafafa]">
      
      {/* Modern SaaS Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-4">
        {/* Glow Backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/40 to-pink-100/40 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-600 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Premium Collection 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1]">
            Shop the future with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500">
              seamless experience.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover a curated collection of premium products. Elevate your everyday lifestyle with our top-tier fashion, electronics, and exclusive deals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white bg-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              Start Shopping <FiArrowRight />
            </Link>
            <Link to="/categories" className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-gray-700 bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Features Grid */}
      <section className="py-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: <FiTruck />, title: "Free Shipping", desc: "On orders over $50", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: <FiShield />, title: "Secure Checkout", desc: "256-bit encryption", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: <FiRefreshCw />, title: "Easy Returns", desc: "30-day money back", color: "text-violet-600", bg: "bg-violet-50" },
            { icon: <FiHeadphones />, title: "24/7 Support", desc: "Live chat available", color: "text-rose-600", bg: "bg-rose-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-md border border-white p-6 rounded-3xl shadow-lg shadow-gray-200/40 hover:-translate-y-1 transition-transform duration-300">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Trending / New Arrivals */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-2">
                <FiTrendingUp /> <span>Trending Now</span>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">New Arrivals</h2>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 font-semibold text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-sm w-full sm:w-auto justify-center">
              View Collection <FiArrowRight />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {newProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500">Products are currently being updated. Please check back later.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Modern Categories Pills */}
      {categories.length > 0 && (
        <section className="pb-24">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <Link 
                  key={cat} 
                  to={`/products?category=${cat}`} 
                  className="px-6 py-3 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 rounded-2xl text-gray-700 font-semibold capitalize hover:-translate-y-1 hover:text-indigo-600 transition-all duration-300"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
};

export default Home;
