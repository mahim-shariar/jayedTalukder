import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getVideoReels,
  createVideoReel,
  updateVideoReel,
  deleteVideoReel,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadFile,
} from "../services/api";
import TabNavigation from "../components/TabNavigation";
import VideoList from "../components/VideoList";
import ReviewList from "../components/ReviewList";
import CategoryList from "../components/CategoryList";
import VideoModal from "../components/VideoModal";
import ReviewModal from "../components/ReviewModal";
import CategoryModal from "../components/CategoryModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("videos");
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyBest, setShowOnlyBest] = useState(false);
  const [showOnlyBestReviews, setShowOnlyBestReviews] = useState(false); // New state for review filtering

  // Modal states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Editing states
  const [editingVideo, setEditingVideo] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Loading states
  const [uploading, setUploading] = useState({
    video: false,
    thumbnail: false,
    screenshot: false,
    categoryThumbnail: false,
  });
  const [submitting, setSubmitting] = useState({
    video: false,
    review: false,
    category: false,
  });

  // Form states
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    videoCloudId: "",
    thumbnailUrl: "",
    thumbnailCloudId: "",
    category: "",
    tags: "",
    isBest: false,
  });

  const [reviewForm, setReviewForm] = useState({
    content: "",
    rating: 5,
    screenshot: "",
    screenshotId: "",
    userName: "",
    isBest: false, // Added isBest field
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    isShownInCategory: true,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.categories);
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  // Function to fetch videos with optional filter
  const fetchVideos = async (filterBest = false) => {
    try {
      setLoading(true);
      let query = "";
      if (filterBest) {
        query = { isBest: true };
      }
      const res = await getVideoReels(query);
      setVideos(res.data.videoReels);
    } catch (err) {
      toast.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch reviews with optional filter
  const fetchReviews = async (filterBest = false) => {
    try {
      setLoading(true);
      let query = "";
      if (filterBest) {
        query = { isBest: true };
      }
      const res = await getReviews(query);
      setReviews(res.data.reviews);
    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "videos") {
      fetchVideos(showOnlyBest);
    } else if (activeTab === "reviews") {
      fetchReviews(showOnlyBestReviews);
    }
  }, [activeTab, showOnlyBest, showOnlyBestReviews]);

  // Handle file uploads
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading({ ...uploading, [type]: true });
      const toastId = toast.loading(
        `Uploading ${type.replace("category", "")}...`
      );
      const res = await uploadFile(file);

      if (type === "video") {
        setVideoForm((prev) => ({
          ...prev,
          videoUrl: res.url,
          videoCloudId: res.public_id,
        }));
      } else if (type === "thumbnail") {
        setVideoForm((prev) => ({
          ...prev,
          thumbnailUrl: res.url,
          thumbnailCloudId: res.public_id,
        }));
      } else if (type === "screenshot") {
        setReviewForm((prev) => ({
          ...prev,
          screenshot: res.url,
          screenshotId: res.public_id,
        }));
      }

      toast.update(toastId, {
        render: `${
          type.charAt(0).toUpperCase() + type.slice(1).replace("category", "")
        } uploaded!`,
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

  // Video handlers
  const handleVideoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVideoForm({
      ...videoForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitVideoForm = async (e) => {
    e.preventDefault();
    try {
      setSubmitting({ ...submitting, video: true });
      const toastId = toast.loading(
        editingVideo ? "Updating video..." : "Adding video..."
      );

      const tags = videoForm.tags.split(",").map((tag) => tag.trim());
      const payload = { ...videoForm, tags };

      if (editingVideo) {
        await updateVideoReel(editingVideo._id, payload);
        toast.update(toastId, {
          render: "Video updated!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await createVideoReel(payload);
        toast.update(toastId, {
          render: "Video added!",
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
        videoCloudId: "",
        thumbnailUrl: "",
        thumbnailCloudId: "",
        category: "",
        tags: "",
        isBest: false,
      });
      setEditingVideo(null);
      await fetchVideos(showOnlyBest);
    } catch (err) {
      toast.error(err.message || "Failed to save video");
    } finally {
      setSubmitting({ ...submitting, video: false });
    }
  };

  const editVideo = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      videoCloudId: video.videoCloudId,
      thumbnailCloudId: video.thumbnailCloudId,
      category: video.category || "",
      tags: video.tags?.join(", ") || "",
      isBest: video.isBest || false,
    });
    setShowVideoModal(true);
  };

  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await deleteVideoReel(id);
      toast.success("Video deleted");
      setVideos((prev) => prev.filter((video) => video._id !== id));
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  // Review handlers
  const handleReviewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitReviewForm = async (e) => {
    e.preventDefault();
    try {
      setSubmitting({ ...submitting, review: true });
      const toastId = toast.loading(
        editingReview ? "Updating review..." : "Adding review..."
      );

      if (editingReview) {
        await updateReview(editingReview._id, reviewForm);
        toast.update(toastId, {
          render: "Review updated!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await createReview(reviewForm);
        toast.update(toastId, {
          render: "Review added!",
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
        screenshotId: "",
        userName: "",
        isBest: false,
      });
      setEditingReview(null);
      await fetchReviews(showOnlyBestReviews);
    } catch (err) {
      toast.error(err.message || "Failed to save review");
    } finally {
      setSubmitting({ ...submitting, review: false });
    }
  };

  const editReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      content: review.content,
      rating: review.rating,
      screenshot: review.screenshot,
      screenshotId: review.screenshotId,
      userName: review.userName || "",
      isBest: review.isBest || false,
    });
    setShowReviewModal(true);
  };

  const deleteReviewItem = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  // Category handlers
  const handleCategoryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitCategoryForm = async (e) => {
    e.preventDefault();
    try {
      setSubmitting({ ...submitting, category: true });
      const toastId = toast.loading(
        editingCategory ? "Updating category..." : "Creating category..."
      );

      if (editingCategory) {
        await updateCategory(editingCategory.slug, categoryForm);
        toast.update(toastId, {
          render: "Category updated!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        await createCategory(categoryForm);
        toast.update(toastId, {
          render: "Category created!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      setShowCategoryModal(false);
      setCategoryForm({
        name: "",
        isShownInCategory: true,
      });
      setEditingCategory(null);
      const res = await getCategories();
      setCategories(res.data.categories);
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setSubmitting({ ...submitting, category: false });
    }
  };

  const editCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      isShownInCategory: category.isShownInCategory,
    });
    setShowCategoryModal(true);
  };

  const deleteCategoryItem = async (id, slug) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(slug);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  // Render add button based on active tab
  const renderAddButton = () => {
    switch (activeTab) {
      case "videos":
        return (
          <div className="flex items-center space-x-4">
            {/* Filter button for featured videos */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowOnlyBest(!showOnlyBest)}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg shadow-sm ${
                showOnlyBest
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {showOnlyBest ? "Show All Videos" : "Show Featured Only"}
              {showOnlyBest && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {videos.filter((video) => video.isBest).length}
                </span>
              )}
            </motion.button>

            {/* Add video button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingVideo(null);
                setVideoForm({
                  title: "",
                  description: "",
                  videoUrl: "",
                  videoCloudId: "",
                  thumbnailUrl: "",
                  thumbnailCloudId: "",
                  category: "",
                  tags: "",
                  isBest: false,
                });
                setShowVideoModal(true);
              }}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              + Add New Video
            </motion.button>
          </div>
        );
      case "reviews":
        return (
          <div className="flex items-center space-x-4">
            {/* Filter button for best reviews */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowOnlyBestReviews(!showOnlyBestReviews);
                fetchReviews(!showOnlyBestReviews);
              }}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg shadow-sm ${
                showOnlyBestReviews
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {showOnlyBestReviews ? "Show All Reviews" : "Show Best Only"}
              {showOnlyBestReviews && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {reviews.filter((review) => review.isBest).length}
                </span>
              )}
            </motion.button>

            {/* Add review button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingReview(null);
                setReviewForm({
                  content: "",
                  rating: 5,
                  screenshot: "",
                  screenshotId: "",
                  userName: "",
                  isBest: false,
                });
                setShowReviewModal(true);
              }}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              + Add New Review
            </motion.button>
          </div>
        );
      case "categories":
        return (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setEditingCategory(null);
              setCategoryForm({
                name: "",
                isShownInCategory: true,
              });
              setShowCategoryModal(true);
            }}
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            + Add New Category
          </motion.button>
        );
      default:
        return null;
    }
  };

  // Render content based on active tab
  const renderContent = () => {
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

    switch (activeTab) {
      case "videos":
        return (
          <VideoList
            videos={videos}
            onEdit={editVideo}
            onDelete={deleteVideo}
            showOnlyBest={showOnlyBest}
          />
        );
      case "reviews":
        return (
          <ReviewList
            reviews={reviews}
            onEdit={editReview}
            onDelete={deleteReviewItem}
            showOnlyBest={showOnlyBestReviews}
          />
        );
      case "categories":
        return (
          <CategoryList
            categories={categories}
            onEdit={editCategory}
            onDelete={deleteCategoryItem}
          />
        );
      default:
        return null;
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
            ←
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          <div className="flex justify-end mb-6">{renderAddButton()}</div>

          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showVideoModal && (
          <VideoModal
            show={showVideoModal}
            onClose={() => setShowVideoModal(false)}
            videoForm={videoForm}
            setVideoForm={setVideoForm}
            submitting={submitting.video}
            uploading={uploading}
            handleVideoChange={handleVideoChange}
            handleFileUpload={handleFileUpload}
            submitVideoForm={submitVideoForm}
            editingVideo={editingVideo}
            categories={categories}
          />
        )}
        {showReviewModal && (
          <ReviewModal
            show={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            submitting={submitting.review}
            uploading={uploading}
            handleReviewChange={handleReviewChange}
            handleFileUpload={handleFileUpload}
            submitReviewForm={submitReviewForm}
            editingReview={editingReview}
          />
        )}
        {showCategoryModal && (
          <CategoryModal
            show={showCategoryModal}
            onClose={() => setShowCategoryModal(false)}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            onSubmit={submitCategoryForm}
            submitting={submitting.category}
            uploading={uploading}
            handleChange={handleCategoryChange}
            editingCategory={editingCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
