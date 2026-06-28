// ==========================================
// Cart Page — Shopping cart with items list
// ==========================================
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, clearCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiShoppingCart } from "react-icons/fi";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Total items aur total price calculate karo
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart!");
  };

  const handleQuantityChange = (id, qty, stock) => {
    if (qty < 1) return;
    if (qty > stock) {
      toast.error(`Only ${stock} available!`);
      return;
    }
    dispatch(updateQuantity({ id, qty }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  // Agar cart empty hai
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart className="text-4xl text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Cart is empty!</h2>
          <p className="text-gray-400 mb-6">Add some products to your cart.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
          >
            <FiShoppingBag /> View Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <FiShoppingCart className="text-indigo-400" />
          Shopping Cart
          <span className="text-sm bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full">
            {totalItems} items
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-4 hover:border-white/20 transition-all"
              >
                {/* Image */}
                <Link to={`/product/${item.product}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product}`}
                    className="text-white font-semibold hover:text-indigo-400 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-indigo-400 font-bold text-lg mt-1">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product, item.quantity - 1, item.stock)
                      }
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <FiMinus className="text-sm" />
                    </button>
                    <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.product, item.quantity + 1, item.stock)
                      }
                      className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <FiPlus className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Item Total + Remove */}
                <div className="flex flex-col items-end justify-between">
                  <p className="text-white font-bold">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => handleRemove(item.product)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => {
                dispatch(clearCart());
                toast.success("Cart cleared successfully!");
              }}
              className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 mt-2"
            >
              <FiTrash2 /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-400" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {subtotal < 1000 && (
                <p className="text-xs text-amber-400 mt-3">
                  Add ₹{1000 - subtotal} more for free shipping!
                </p>
              )}

              <button
                onClick={handleCheckout}
                id="checkout-btn"
                className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                Checkout <FiArrowRight />
              </button>

              <Link
                to="/products"
                className="block text-center text-indigo-400 hover:text-indigo-300 text-sm mt-3 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
