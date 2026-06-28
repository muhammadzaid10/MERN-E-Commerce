// ==========================================
// ProductCard Component — Premium Modern React UI
// ==========================================
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { FiShoppingCart, FiStar } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(
      addToCart({
        product: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0]?.url || "",
        stock: product.stock,
        quantity: 1,
      })
    );
    toast.success("Added to cart!");
  };

  return (
    <Link to={`/product/${product._id}`} className="group block h-full">
      <div className="bg-white rounded-[2rem] p-3 border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.12)] hover:-translate-y-2 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
        
        {/* Badges */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          {product.stock === 0 ? (
            <span className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-red-500/30 border border-red-400/50">
              Sold Out
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/30 border border-amber-400/50">
              {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Image Container */}
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50/50">
          <img
            src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          
          {/* Quick Add Button Overlay */}
          {product.stock > 0 && (
            <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <button
                onClick={handleAddToCart}
                className="translate-y-10 group-hover:translate-y-0 transition-transform duration-500 bg-white/95 backdrop-blur-md text-gray-900 px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-gray-900 hover:text-white"
              >
                <FiShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="p-4 flex flex-col flex-grow mt-2">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
            {product.category}
          </p>
          <h3 className="text-base font-extrabold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
          
          <div className="mt-auto">
            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={14}
                    className={i < Math.round(product.ratings || 0) ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-400">
                ({product.numReviews || 0})
              </span>
            </div>

            {/* Price Row */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-gray-900">
                Rs. {product.price?.toLocaleString()}
              </span>
              
              {/* Mobile cart button */}
              {product.stock > 0 && (
                <button
                  onClick={handleAddToCart}
                  className="md:hidden w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  <FiShoppingCart size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
