import { motion } from "framer-motion";
import {
  FiEdit,
  FiLoader,
  FiUpload,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";

const modalVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function VideoModal({
  show,
  onClose,
  videoForm,
  setVideoForm,
  submitting,
  uploading,
  handleVideoChange,
  handleFileUpload,
  submitVideoForm,
  editingVideo,
  categories,
}) {
  if (!show) return null;

  // Handle form submission to prevent default behavior
  const handleSubmit = (e) => {
    e.preventDefault();
    submitVideoForm(e);
  };

  // Handle checkbox change specifically
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setVideoForm({
      ...videoForm,
      [name]: checked,
    });
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <motion.div
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-gray-200"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="bg-white px-6 py-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingVideo ? "Edit Video Reel" : "Add New Video Reel"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={videoForm.title}
                    onChange={handleVideoChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                    placeholder="Enter video title"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiEdit className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={videoForm.description}
                  onChange={handleVideoChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                  placeholder="Enter video description"
                />
              </div>

              {/* Video & Thumbnail Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video */}
                <div>
                  <label
                    htmlFor="videoUrl"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Video URL*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="videoUrl"
                      id="videoUrl"
                      required
                      value={videoForm.videoUrl}
                      onChange={handleVideoChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                      placeholder="Paste video URL"
                    />
                    <label className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                      {uploading.video ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <FiLoader className="h-5 w-5 text-red-500" />
                        </motion.div>
                      ) : videoForm.videoUrl ? (
                        <FiCheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <FiUpload className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "video")}
                        disabled={uploading.video}
                      />
                    </label>
                  </div>
                </div>
                {/* Thumbnail */}
                <div>
                  <label
                    htmlFor="thumbnailUrl"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Thumbnail URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="thumbnailUrl"
                      id="thumbnailUrl"
                      value={videoForm.thumbnailUrl}
                      onChange={handleVideoChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                      placeholder="Paste thumbnail URL"
                    />
                    <label className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                      {uploading.thumbnail ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <FiLoader className="h-5 w-5 text-red-500" />
                        </motion.div>
                      ) : videoForm.thumbnailUrl ? (
                        <FiCheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <FiUpload className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "thumbnail")}
                        disabled={uploading.thumbnail}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category*
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      id="category"
                      required
                      value={videoForm.category}
                      onChange={handleVideoChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white pr-10 transition-all duration-200 shadow-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tags (comma separated)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={videoForm.tags}
                      onChange={handleVideoChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Video Checkbox */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isBest"
                      checked={videoForm.isBest}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                    <div
                      className={`block w-10 h-6 rounded-full transition-colors ${
                        videoForm.isBest ? "bg-red-500" : "bg-gray-300"
                      }`}
                    />
                    <div
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        videoForm.isBest ? "transform translate-x-4" : ""
                      }`}
                    />
                  </div>
                  <div className="ml-3 flex items-center">
                    <FiStar
                      className={`h-5 w-5 mr-2 ${
                        videoForm.isBest ? "text-yellow-400" : "text-gray-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Mark as featured video
                    </span>
                    {videoForm.isBest && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-13">
                  Featured videos will be highlighted and can be filtered in the
                  dashboard.
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center ${
                    submitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      {editingVideo ? "Updating..." : "Adding..."}
                    </>
                  ) : editingVideo ? (
                    "Update Video"
                  ) : (
                    "Add Video"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
