// ==========================================
// Categories Page — Premium UI
// ==========================================
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import { Link } from "react-router-dom";
import { FiGrid } from "react-icons/fi";
import Loading from "../components/Loading";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.product);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, categories.length]);

  if (loading && categories.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-20 px-4 font-[Inter,sans-serif]">
      <div className="max-w-[1400px] mx-auto text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <FiGrid size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Explore Categories
        </h1>
        <p className="text-gray-500 mb-16 max-w-2xl mx-auto text-lg leading-relaxed">
          Browse through our wide range of premium collections. We have carefully curated these categories to help you find exactly what you're looking for.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="group relative h-56 bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.12)] hover:-translate-y-2 transition-all duration-500 flex items-center justify-center p-6"
            >
              {/* Subtle Gradient Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white/0 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-500 shadow-sm">
                  <span className="font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 capitalize group-hover:text-indigo-600 transition-colors">
                  {cat}
                </h3>
                <p className="text-sm font-semibold text-indigo-500 mt-3 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Shop Collection <span>→</span>
                </p>
              </div>
            </Link>
          ))}
          
          {categories.length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg">No categories available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
