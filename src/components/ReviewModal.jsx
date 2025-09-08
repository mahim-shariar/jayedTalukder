import { motion } from "framer-motion";
import {
  FiUser,
  FiStar,
  FiLoader,
  FiUpload,
  FiCheckCircle,
  FiAward,
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

export default function ReviewModal({
  show,
  onClose,
  reviewForm,
  setReviewForm,
  submitting,
  uploading,
  handleReviewChange,
  handleFileUpload,
  submitReviewForm,
  editingReview,
}) {
  if (!show) return null;

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
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-200"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="bg-white px-6 py-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingReview ? "Edit Review" : "Add New Review"}
            </h3>
            <form onSubmit={submitReviewForm} className="space-y-6">
              {/* User Name */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User/Brand Name*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    required
                    value={reviewForm.userName}
                    onChange={handleReviewChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                    placeholder="Enter user or brand name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content*
                </label>
                <textarea
                  name="content"
                  id="content"
                  required
                  rows={4}
                  value={reviewForm.content}
                  onChange={handleReviewChange}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                  placeholder="Write your review here..."
                />
              </div>

              {/* Rating & Screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rating */}
                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Rating*
                  </label>
                  <div className="relative">
                    <select
                      name="rating"
                      id="rating"
                      required
                      value={reviewForm.rating}
                      onChange={handleReviewChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white pr-10 transition-all duration-200 shadow-sm"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "star" : "stars"}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <FiStar className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                </div>
                {/* Screenshot */}
                <div>
                  <label
                    htmlFor="screenshot"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Screenshot URL*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="screenshot"
                      id="screenshot"
                      required
                      value={reviewForm.screenshot}
                      onChange={handleReviewChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                      placeholder="Paste screenshot URL"
                    />
                    <label className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                      {uploading.screenshot ? (
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
                      ) : reviewForm.screenshot ? (
                        <FiCheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <FiUpload className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "screenshot")}
                        disabled={uploading.screenshot}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Is Best Checkbox */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center h-5">
                  <input
                    id="isBest"
                    name="isBest"
                    type="checkbox"
                    checked={reviewForm.isBest}
                    onChange={handleReviewChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 flex items-center">
                  <FiAward className="h-5 w-5 text-red-500 mr-2" />
                  <label
                    htmlFor="isBest"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mark as Best Review
                  </label>
                </div>
                {reviewForm.isBest && (
                  <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
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
                      {editingReview ? "Updating..." : "Adding..."}
                    </>
                  ) : editingReview ? (
                    "Update Review"
                  ) : (
                    "Add Review"
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
