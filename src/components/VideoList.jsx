// List display for videos
import { motion } from "framer-motion";
import { FiVideo, FiEdit, FiTrash2 } from "react-icons/fi";

export default function VideoList({ videos, onEdit, onDelete }) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
          <FiVideo className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No videos yet
        </h3>
        <p className="text-gray-500">
          Get started by adding your first video reel
        </p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-gray-100">
      {videos.map((video) => (
        <motion.li
          key={video._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-5 py-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {video.thumbnailUrl && (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative flex-shrink-0"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-16 w-16 rounded-lg object-cover shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                    <FiVideo className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {video.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{video.category}</p>
              </div>
            </div>
            <div className="ml-2 flex-shrink-0 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(video)}
                className="inline-flex items-center px-3 py-1 border border-gray-200 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiEdit className="mr-1.5" />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(video._id)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                <FiTrash2 className="mr-1.5" />
                Delete
              </motion.button>
            </div>
          </div>
          <div className="mt-3 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-600">
                {video.description}
              </p>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                Tags: {video.tags.join(", ")}
              </span>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
