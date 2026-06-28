// ==========================================
// Product Detail Page — Ek product ki poori detail
// ==========================================
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleProduct, addReview } from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { FiStar, FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from "react-icons/fi";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, relatedProducts, loading } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product.stock === 0) return toast.error("Out of stock!");
    dispatch(addToCart({
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0]?.url || "",
      stock: product.stock,
      quantity,
    }));
    toast.success("Added to cart!");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please write a comment!");
    
    try {
      await dispatch(addReview({ id, rating, comment })).unwrap();
      setComment("");
      setRating(5);
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(error || "Failed to submit review. You might have already reviewed this product.");
    }
  };

  if (loading || !product) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium">
          <FiArrowLeft /> Go Back
        </button>

        {/* Product Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <div className="bg-gray-50 rounded-2xl overflow-hidden h-80 md:h-96 mb-4">
                <img
                  src={product.images?.[selectedImage]?.url || "https://via.placeholder.com/500"}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-indigo-500" : "border-gray-200"}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="text-sm text-indigo-600 font-medium uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={18} className={i < Math.round(product.ratings || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-gray-500">({product.numReviews || 0} reviews)</span>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-4">Rs. {product.price?.toLocaleString()}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Stock Status */}
              <p className={`font-medium mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : "❌ Out of Stock"}
              </p>

              {/* Quantity + Add to Cart */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-200 rounded-xl">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50"><FiMinus /></button>
                    <span className="px-4 font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-50"><FiPlus /></button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <FiShoppingCart /> Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Reviews ({product.reviews?.length || 0})</h2>

          {/* Add Review Form */}
          {isAuthenticated && (
            <form onSubmit={handleReview} className="mb-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium mb-3">Write your review:</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <FiStar size={20} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your comment here..." rows={3}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 mb-3" />
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors">Submit Review</button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {product.reviews?.map((review, i) => (
              <div key={i} className="p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium text-sm">
                    {review.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">{review.name}</span>
                  <div className="flex ml-auto">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} size={14} className={j < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
            {(!product.reviews || product.reviews.length === 0) && (
              <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
