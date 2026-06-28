// ==========================================
// Products Page — Sab products with search/filter/sort
// ==========================================
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import { FiSearch, FiFilter } from "react-icons/fi";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, categories, totalPages, currentPage, loading } = useSelector((state) => state.product);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortByPrice, setSortByPrice] = useState("");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Sync state if URL search query changes (e.g. from Navbar search)
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchProducts({ search, category, page, sortByPrice }));
  }, [dispatch, search, category, page, sortByPrice]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchProducts({ search, category, page: 1, sortByPrice }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </form>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white capitalize"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">Sort: Newest</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found 😔</p>
                <button onClick={() => { setSearch(""); setCategory(""); }} className="mt-4 text-indigo-600 hover:underline">
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                      page === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
