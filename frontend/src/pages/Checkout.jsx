// ==========================================
// Checkout Page — Premium Modern React UI
// ==========================================
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../store/slices/orderSlice";
import { clearCart, saveShippingAddress } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { FiMapPin, FiCreditCard, FiCheck, FiPackage, FiPhone } from "react-icons/fi";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.order);

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Must be "COD" or "Stripe" or "Razorpay"

  // Shipping Form State
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [stateName, setStateName] = useState(shippingAddress.state || "");
  const [pinCode, setPinCode] = useState(shippingAddress.pinCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "Pakistan");
  const [phone, setPhone] = useState(shippingAddress.phone || "");

  // Safe quantity getter (handles old localStorage formats)
  const getQty = (item) => item.quantity || item.qty || 1;

  // Price calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * getQty(item), 0) || 0;
  const shipping = subtotal > 1000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!address || !city || !stateName || !pinCode || !country || !phone) {
      toast.error("Please fill all shipping fields!");
      return;
    }
    dispatch(saveShippingAddress({ address, city, state: stateName, pinCode, country, phone }));
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      orderItems: cartItems.map((item) => ({
        title: item.title || item.name,
        quantity: getQty(item),
        image: item.image || "https://via.placeholder.com/400",
        price: item.price,
        product: item.product,
      })),
      shippingAddress: { 
        address, 
        city, 
        state: stateName, 
        pinCode, 
        country, 
        phone 
      },
      paymentMethod,
      totalPrice: total,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully! 🎉");
      navigate(`/order/${result.order._id}`);
    } catch (err) {
      toast.error(err || "Failed to place order!");
    }
  };

  const steps = [
    { num: 1, label: "Shipping", icon: FiMapPin },
    { num: 2, label: "Payment", icon: FiCreditCard },
    { num: 3, label: "Review", icon: FiCheck },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4 font-[Inter,sans-serif]">
      <div className="max-w-[1200px] mx-auto pt-20">
        
        {/* Modern Stepper */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                  step >= s.num
                    ? "bg-indigo-600 text-white shadow-indigo-200"
                    : "bg-white text-gray-400 border border-gray-200"
                }`}
              >
                <s.icon className="text-lg" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-10 md:w-20 h-1 mx-2 rounded-full transition-all duration-500 ${
                    step > s.num ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 animate-fade-in-up">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FiMapPin />
                  </div>
                  Shipping Details
                </h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">Full Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address, apartment, suite, etc."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">State / Province</label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="State"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Pin / Zip Code</label>
                      <input
                        type="text"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="Postal code"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-1.5 block">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Pakistan"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-1.5 block">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Mobile number"
                        className="w-full pl-10 bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 animate-fade-in-up">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FiCreditCard />
                  </div>
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  {[
                    { id: "COD", title: "Cash on Delivery", desc: "Pay when you receive the order" },
                    { id: "Stripe", title: "Online Payment (Stripe)", desc: "Pay securely via credit/debit card" }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        paymentMethod === method.id
                          ? "border-indigo-600 bg-indigo-50/50"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <div className="mt-1">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-5 h-5 accent-indigo-600"
                        />
                      </div>
                      <div>
                        <span className="block text-gray-900 font-bold mb-1">{method.title}</span>
                        <span className="block text-gray-500 text-sm">{method.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100 animate-fade-in-up">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FiPackage />
                  </div>
                  Order Review
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Shipping To</h3>
                    <p className="text-gray-900 font-medium">{address}</p>
                    <p className="text-gray-600 text-sm mt-1">{city}, {stateName} {pinCode}</p>
                    <p className="text-gray-600 text-sm">{country}</p>
                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-1"><FiPhone size={14}/> {phone}</p>
                  </div>

                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Payment Method</h3>
                    <p className="text-gray-900 font-medium">
                      {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment (Stripe)"}
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-gray-900 font-bold truncate">{item.title || item.name}</span>
                          <span className="text-gray-500 text-sm">Qty: {getQty(item)}</span>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-gray-900">Rs. {(getQty(item) * item.price).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FiCheck size={20} /> Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Price Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Price Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping Fee</span>
                  <span className={shipping === 0 ? "font-bold text-emerald-500" : "font-bold text-gray-900"}>
                    {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Tax (18% GST)</span>
                  <span className="font-bold text-gray-900">Rs. {tax.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-gray-900 font-bold">Total Pay</span>
                <span className="text-2xl font-black text-indigo-600">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
