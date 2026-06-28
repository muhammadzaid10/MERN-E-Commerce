// ==========================================
// Admin Products Page — Product management CRUD
// ==========================================
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearProductError,
  clearProductMessage,
} from "../store/slices/productSlice";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiImage, FiArrowLeft } from "react-icons/fi";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, message } = useSelector((state) => state.product);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]); // Multiple files

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProductError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearProductMessage());
      setIsOpen(false);
      resetForm();
      dispatch(fetchProducts({}));
    }
  }, [error, message, dispatch]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("");
    setImages([]);
    setEditingId(null);
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setStock(p.stock);
    setCategory(p.category);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !price || !stock || !category) {
      toast.error("All details are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category", category);

    // Images append karo (if any)
    images.forEach((img) => {
      formData.append("files", img);
    });

    if (editingId) {
      dispatch(updateProduct({ id: editingId, formData }));
    } else {
      if (images.length === 0) {
        toast.error("Kam se kam ek image upload karein!");
        return;
      }
      dispatch(createProduct(formData));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white rounded-full flex items-center justify-center transition-all">
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Manage Products</h1>
              <p className="text-gray-400 text-sm mt-1">Add, update, or delete products</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Products Table/Grid */}
        {loading && !isOpen ? (
          <Loading />
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-gray-300 text-sm font-medium">
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 text-sm">
                  {products?.map((p) => (
                    <tr key={p._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <img
                          src={p.images?.[0]?.url || "/placeholder-image.png"}
                          alt={p.title}
                          className="w-12 h-12 object-cover rounded-lg border border-white/10"
                        />
                      </td>
                      <td className="p-4 font-semibold text-white max-w-[200px] truncate">
                        {p.title}
                      </td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4 font-bold text-indigo-400">₹{p.price}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.stock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} In Stock` : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {/* Modal Body */}
            <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white p-2 rounded-lg bg-white/5 transition-all"
              >
                <FiX />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">
                {editingId ? "Update Product" : "Create New Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Product Title"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product details"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Price */}
                  <div>
                    <label className="text-sm text-gray-300 mb-1 block">Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="999"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="text-sm text-gray-300 mb-1 block">Stock Count</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="50"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm text-gray-300 mb-1 block">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Shoes, Watches"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Images Upload */}
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Upload Images</label>
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-indigo-500/50 transition-all relative cursor-pointer bg-white/5">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FiUpload className="text-3xl text-gray-400" />
                      <span className="text-sm text-gray-300 font-semibold">
                        Click to upload images
                      </span>
                      <span className="text-xs text-gray-500">Supports JPG, PNG, WEBP</span>
                    </div>
                  </div>
                  {/* Images selected preview names */}
                  {images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 bg-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-lg border border-white/5"
                        >
                          <FiImage /> {img.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : editingId ? (
                    "Update Product Details"
                  ) : (
                    "Publish Product"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
