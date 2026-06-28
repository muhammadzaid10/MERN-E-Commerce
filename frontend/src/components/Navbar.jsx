// ==========================================
// Navbar Component — Premium Modern React/SaaS UI
// ==========================================
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import { useState, useEffect } from "react";
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiSettings, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/");
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="fixed w-full top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-500 font-[Inter,sans-serif]">
      <nav className={`mx-auto max-w-7xl transition-all duration-500 rounded-2xl md:rounded-full border ${scrolled ? 'bg-white/80 backdrop-blur-lg border-white/50 shadow-2xl shadow-indigo-900/5' : 'bg-white/50 backdrop-blur-md border-white/40 shadow-xl shadow-gray-200/50'}`}>
        <div className="px-6 h-16 md:h-20 flex justify-between items-center">
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -ml-2 text-gray-700 hover:text-indigo-600 transition-colors bg-white/50 rounded-full">
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl leading-none">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                Store
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-1">
            {["Home", "Products", "Categories", "Contact"].map((item) => (
              <Link 
                key={item} 
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full transition-all duration-300"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center justify-end gap-3">
            {/* Search Bar */}
            <div className="relative hidden sm:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center animate-in fade-in slide-in-from-right-4 duration-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    autoFocus
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                    className="w-48 lg:w-64 px-4 py-2 bg-white/90 backdrop-blur-md border border-indigo-100 rounded-full text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all text-gray-800 placeholder-gray-400"
                  />
                  <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <FiX size={16} />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-gray-600 hover:text-indigo-600 hover:bg-white/80 rounded-full transition-all shadow-sm border border-transparent hover:border-gray-100"
                >
                  <FiSearch size={20} />
                </button>
              )}
            </div>
            
            {/* Account Dropdown (Desktop Only) */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2.5 text-gray-600 hover:text-indigo-600 bg-white/50 hover:bg-white rounded-full transition-all shadow-sm border border-gray-100"
                >
                  <FiUser size={20} />
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl shadow-indigo-900/10 py-2 z-50 rounded-2xl transform opacity-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-5 py-4 border-b border-gray-100/50 mb-2">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                    </div>
                    
                    <div className="px-2 space-y-1">
                      <Link onClick={() => setDropdownOpen(false)} to="/myorders" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                        <FiPackage size={18} className="text-indigo-400" /> My Orders
                      </Link>
                      {user?.role === "admin" && (
                        <Link onClick={() => setDropdownOpen(false)} to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                          <FiSettings size={18} className="text-purple-400" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-2">
                        <FiLogOut size={18} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-white bg-gray-900 hover:bg-indigo-600 rounded-full transition-all shadow-md hover:shadow-lg hidden md:block">
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-indigo-600 bg-white/50 hover:bg-white rounded-full transition-all shadow-sm border border-gray-100 group">
              <FiShoppingBag size={20} className="group-hover:scale-110 transition-transform duration-300" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm shadow-indigo-500/40 border-2 border-white">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <div className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${menuOpen ? 'max-h-[500px] border-t border-gray-100/50' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-2 bg-white/50">
            
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4 mx-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-300 shadow-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </form>

            {["Home", "Products", "Categories", "Contact"].map((item) => (
              <Link 
                key={item} 
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                onClick={() => setMenuOpen(false)} 
                className="block py-3 px-4 rounded-xl text-base font-semibold text-gray-700 hover:bg-white hover:text-indigo-600 transition-colors shadow-sm border border-transparent hover:border-gray-100"
              >
                {item}
              </Link>
            ))}
            
            <div className="h-px bg-gray-200/50 my-2 mx-4"></div>
            
            {!isAuthenticated ? (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 px-4 mx-2 rounded-xl text-base font-bold text-white bg-indigo-600 text-center shadow-md mt-2">
                Sign In
              </Link>
            ) : (
              <div className="space-y-2 mt-2 mx-2">
                <Link to="/myorders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  <FiPackage size={18} className="text-indigo-400" /> My Orders
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                    <FiSettings size={18} className="text-purple-400" /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-base font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md mt-4">
                  <FiLogOut size={18} /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
