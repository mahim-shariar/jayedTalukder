import { motion } from "framer-motion";
import { toast } from "react-toastify";

const CategoryList = ({ categories, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"
        />
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <motion.li
            key={category._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 py-4 sm:px-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className={`inline-block h-3 w-3 rounded-full mr-3 ${
                    category.isShownInCategory ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(category)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(category._id, category.slug)}
                  className="px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
