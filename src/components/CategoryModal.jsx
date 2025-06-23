import { motion } from "framer-motion";
import { FiUpload, FiCheckCircle, FiLoader, FiX, FiGrid } from "react-icons/fi";

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

export default function CategoryModal({
  show,
  onClose,
  categoryForm,
  setCategoryForm,
  submitting,
  onSubmit,
  editingCategory,
}) {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
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
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-200"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="bg-white px-6 py-6 sm:p-8">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category Name*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={categoryForm.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400 transition-all duration-200 shadow-sm"
                    placeholder="Enter category name"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiGrid className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Show in category list */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isShownInCategory"
                  id="isShownInCategory"
                  checked={categoryForm.isShownInCategory || false}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="isShownInCategory"
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  Show in category list
                </label>
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
                  disabled={submitting || !categoryForm.name}
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      {editingCategory ? "Updating..." : "Creating..."}
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
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
