// ==========================================
// Contact Us Page — Shopify Minimalist + Animated UI
// ==========================================
import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-[Inter,sans-serif] relative overflow-hidden z-0">
      
      {/* Soft Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[150px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-[800px] mx-auto bg-white/60 backdrop-blur-xl p-8 sm:p-14 border border-white/40 shadow-2xl shadow-indigo-100/50">
        <div className="text-center mb-16 relative group cursor-default">
          <h1 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">
            Contact Us<span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">.</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Have a question, feedback, or need help with your order? Our team is always here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 relative">
          <div className="p-6 bg-white/50 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-medium text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">📍</span> 
              Our Store
            </h3>
            <p className="text-gray-600 leading-relaxed pl-10">
              123 E-Commerce Blvd, <br />
              Tech District, NY 10001 <br />
              United States
            </p>
          </div>

          <div className="p-6 bg-white/50 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-medium text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">📞</span>
              Contact Info
            </h3>
            <div className="pl-10 space-y-2">
              <p className="text-gray-600 leading-relaxed">support@ecommerce.com</p>
              <p className="text-gray-600 leading-relaxed">+1 (800) 123-4567</p>
              <p className="text-gray-500 text-sm mt-2">Mon-Fri, 9am - 6pm EST</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">Drop us a line</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="block w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="block w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Phone number (optional)"
                className="block w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Message"
                className="block w-full px-4 py-3.5 bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 resize-none"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden px-10 py-4 text-sm font-bold text-white bg-gray-900 focus:outline-none transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest group shadow-lg shadow-gray-900/20"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10">{loading ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
