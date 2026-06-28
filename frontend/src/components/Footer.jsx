// ==========================================
// Footer Component — Shopify Minimalist UI
// ==========================================
import { FiTwitter, FiInstagram, FiFacebook, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 font-[Inter,sans-serif]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-5 lg:col-span-4">
            <span className="text-2xl font-bold text-gray-900 tracking-tight block mb-6">
              E-Commerce.
            </span>
            <p className="text-gray-600 text-sm mb-6 max-w-sm leading-relaxed">
              Subscribe to our emails to be the first to know about new releases, special offers, and store updates.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.target.reset();
                import("react-hot-toast").then((module) => {
                  module.default.success("Thanks for subscribing! 🎉");
                });
              }}
              className="flex border border-gray-300 focus-within:border-gray-900 transition-colors max-w-md rounded-xl overflow-hidden shadow-sm"
            >
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-3 text-sm focus:outline-none bg-gray-50/50"
                required
              />
              <button type="submit" className="px-6 py-3 bg-gray-900 text-white hover:bg-indigo-600 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </form>
          </div>
          
          <div className="md:col-span-1 lg:col-span-2 hidden md:block"></div>
          
          {/* Links Section 1 */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-gray-900 text-sm font-medium tracking-wide uppercase mb-6">Shop</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">All Products</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">Best Sellers</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-gray-900 transition-colors">Collections</Link></li>
            </ul>
          </div>
          
          {/* Links Section 2 */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-gray-900 text-sm font-medium tracking-wide uppercase mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link></li>
              <li><Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/myorders" className="text-gray-600 hover:text-gray-900 transition-colors">Track Order</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FiInstagram size={20} strokeWidth={1.5} /></a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FiFacebook size={20} strokeWidth={1.5} /></a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FiTwitter size={20} strokeWidth={1.5} /></a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><FiYoutube size={20} strokeWidth={1.5} /></a>
          </div>
          
          <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-4 text-xs text-gray-500">
              <Link to="/" className="hover:underline">Privacy Policy</Link>
              <Link to="/" className="hover:underline">Terms of Service</Link>
            </div>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()}, <Link to="/" className="hover:underline">E-Commerce</Link>. Powered by MERN
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
