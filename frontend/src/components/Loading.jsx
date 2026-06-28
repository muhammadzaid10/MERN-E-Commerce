// ==========================================
// Loading Component — Spinner dikhao jab data load ho raha ho
// ==========================================
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
        <p className="mt-4 text-gray-500 text-sm text-center">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
