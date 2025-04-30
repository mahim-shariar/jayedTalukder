import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiVideo,
  FiStar,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiUpload,
  FiArrowLeft,
  FiUser,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import {
  getVideoReels,
  createVideoReel,
  updateVideoReel,
  deleteVideoReel,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  uploadFile,
} from "../services/api";

// Categories data
const categories = [
  { id: "wedding", name: "Wedding Films" },
  { id: "commercial", name: "Commercial" },
  { id: "travel", name: "Travel" },
  { id: "shortfilm", name: "Short Films" },
  { id: "islamic", name: "Islamic" },
  { id: "podcast", name: "Podcast" },
  { id: "myFirstEdit", name: "My First Edit" },
  { id: "mySelfIntro", name: "My Self Introduction" },
  { id: "behindTheScenes", name: "Behind The Scenes" },
  { id: "bloopers", name: "Bloopers" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [uploading, setUploading] = useState({
    video: false,
    thumbnail: false,
    screenshot: false,
  });
  const [submitting, setSubmitting] = useState({
    video: false,
    review: false,
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "",
    tags: "",
  });

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    content: "",
    rating: 5,
    screenshot: "",
    userName: "",
  });

  // Helper function to get category name
  const getCategoryName = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : id;
  };

  // Animation variants
  const tabContentVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "videos") {
          const res = await getVideoReels();
          setVideos(res.data.videoReels);
        } else {
          const res = await getReviews();
          setReviews(res.data.reviews);
        }
      } catch (err) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Handle video form changes
  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoForm({
      ...videoForm,
      [name]: value,
    });
  };

  // Handle review form changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: value,
    });
  };

  // Handle file uploads with loading states
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading({ ...uploading, [type]: true });

      const toastId = toast.loading(`Uploading ${type}...`, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      });

      const res = await uploadFile(file);

      if (type === "video") {
        setVideoForm({
          ...videoForm,
          videoUrl: res.url,
        });
      } else if (type === "thumbnail") {
        setVideoForm({
          ...videoForm,
          thumbnailUrl: res.url,
        });
      } else if (type === "screenshot") {
        setReviewForm({
          ...reviewForm,
          screenshot: res.url,
        });
      }

      toast.update(toastId, {
        render: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } uploaded successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  // Submit video form with loading state
  const submitVideoForm = async (e) => {
    e.preventDefault();
    try {
      setSubmitting({ ...submitting, video: true });

      const toastId = toast.loading(
        editingVideo ? "Updating video..." : "Adding video...",
        {
          position: "top-right",
          autoClose: false,
        }
      );

      const tags = videoForm.tags.split(",").map((tag) => tag.trim());
      const payload = { ...videoForm, tags };

      if (editingVideo) {
        await updateVideoReel(editingVideo._id, payload);
        toast.update(toastId, {
          render: "Video updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await createVideoReel(payload);
        toast.update(toastId, {
          render: "Video added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      setShowVideoModal(false);
      setVideoForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        category: "",
        tags: "",
      });
      setEditingVideo(null);

      // Refresh videos list
      const res = await getVideoReels();
      setVideos(res.data.videoReels);
    } catch (err) {
      toast.error(err.message || "Failed to save video");
    } finally {
      setSubmitting({ ...submitting, video: false });
    }
  };

  // Submit review form with loading state
  const submitReviewForm = async (e) => {
    e.preventDefault();
    try {
      setSubmitting({ ...submitting, review: true });

      const toastId = toast.loading(
        editingReview ? "Updating review..." : "Adding review...",
        {
          position: "top-right",
          autoClose: false,
        }
      );

      if (editingReview) {
        await updateReview(editingReview._id, reviewForm);
        toast.update(toastId, {
          render: "Review updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await createReview(reviewForm);
        toast.update(toastId, {
          render: "Review added successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      setShowReviewModal(false);
      setReviewForm({
        content: "",
        rating: 5,
        screenshot: "",
        userName: "",
      });
      setEditingReview(null);

      // Refresh reviews list
      const res = await getReviews();
      setReviews(res.data.reviews);
    } catch (err) {
      toast.error(err.message || "Failed to save review");
    } finally {
      setSubmitting({ ...submitting, review: false });
    }
  };

  // Edit video
  const editVideo = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category || "",
      tags: video.tags.join(", "),
    });
    setShowVideoModal(true);
  };

  // Edit review
  const editReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      content: review.content,
      rating: review.rating,
      screenshot: review.screenshot,
      userName: review.userName || "",
    });
    setShowReviewModal(true);
  };

  // Delete video
  const deleteVideo = async (id) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await deleteVideoReel(id);
      toast.success("Video deleted successfully");
      setVideos(videos.filter((video) => video._id !== id));
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  // Delete review
  const deleteReviewItem = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(id);
      toast.success("Review deleted successfully");
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex items-center">
          <motion.button
            onClick={() => navigate("/")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800">
            Video Editor Dashboard
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
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
          </nav>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {/* Add New Button */}
          <div className="flex justify-end mb-6">
            {activeTab === "videos" ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditingVideo(null);
                  setVideoForm({
                    title: "",
                    description: "",
                    videoUrl: "",
                    thumbnailUrl: "",
                    category: "",
                    tags: "",
                  });
                  setShowVideoModal(true);
                }}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <FiPlus className="mr-2" />
                Add New Video
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEditingReview(null);
                  setReviewForm({
                    content: "",
                    rating: 5,
                    screenshot: "",
                    userName: "",
                  });
                  setShowReviewModal(true);
                }}
                className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <FiPlus className="mr-2" />
                Add New Review
              </motion.button>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"
              ></motion.div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* Videos Tab */}
              {activeTab === "videos" && (
                <motion.div
                  key="videos"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={tabContentVariants}
                  className="bg-white shadow-sm rounded-xl overflow-hidden"
                >
                  {videos.length === 0 ? (
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
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {videos.map((video) => (
                        <motion.li
                          key={video._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
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
                                  <p className="text-xs text-gray-500 mt-1">
                                    {getCategoryName(video.category)}
                                  </p>
                                </div>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => editVideo(video)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-200 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                >
                                  <FiEdit className="mr-1.5" />
                                  Edit
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => deleteVideo(video._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
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
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={tabContentVariants}
                  className="bg-white shadow-sm rounded-xl overflow-hidden"
                >
                  {reviews.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <FiStar className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No reviews yet
                      </h3>
                      <p className="text-gray-500">
                        Get started by adding your first review
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {reviews.map((review) => (
                        <motion.li
                          key={review._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {review.screenshot && (
                                  <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="relative flex-shrink-0"
                                  >
                                    <img
                                      src={review.screenshot}
                                      alt="Review screenshot"
                                      className="h-16 w-16 rounded-lg object-cover shadow-sm"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                      <FiStar className="h-6 w-6 text-white" />
                                    </div>
                                  </motion.div>
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {review.userName}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                        fill={
                                          i < review.rating
                                            ? "currentColor"
                                            : "none"
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => editReview(review)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-200 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                >
                                  <FiEdit className="mr-1.5" />
                                  Edit
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => deleteReviewItem(review._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                >
                                  <FiTrash2 className="mr-1.5" />
                                  Delete
                                </motion.button>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-700">
                                {review.content}
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <motion.div
              className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white px-6 py-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingVideo ? "Edit Video Reel" : "Add New Video Reel"}
                  </h3>
                  <form onSubmit={submitVideoForm} className="space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <option key={category.id} value={category.id}>
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
                              aria-hidden="true"
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

                    <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowVideoModal(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: submitting.video ? 1 : 1.02 }}
                        whileTap={{ scale: submitting.video ? 1 : 0.98 }}
                        className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center ${
                          submitting.video
                            ? "opacity-75 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={submitting.video}
                      >
                        {submitting.video ? (
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
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <motion.div
              className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white px-6 py-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingReview ? "Edit Review" : "Add New Review"}
                  </h3>
                  <form onSubmit={submitReviewForm} className="space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              onChange={(e) =>
                                handleFileUpload(e, "screenshot")
                              }
                              disabled={uploading.screenshot}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowReviewModal(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: submitting.review ? 1 : 1.02 }}
                        whileTap={{ scale: submitting.review ? 1 : 0.98 }}
                        className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center ${
                          submitting.review
                            ? "opacity-75 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={submitting.review}
                      >
                        {submitting.review ? (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
