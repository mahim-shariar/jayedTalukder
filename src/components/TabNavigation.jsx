// Tab navigation between Video Reels & Reviews
import { FiVideo, FiStar, FiCamera } from "react-icons/fi";

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab("videos")}
          className={`${
            activeTab === "videos"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
        >
          <FiVideo className="inline mr-2" />
          Video Reels
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`${
            activeTab === "reviews"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
        >
          <FiStar className="inline mr-2" />
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`${
            activeTab === "categories"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
        >
          <FiCamera className="inline mr-2" />
          Categories
        </button>
      </nav>
    </div>
  );
}
