import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiShare2, FiCheck, FiAlertCircle } from "react-icons/fi";
import { getVideoReel } from "../services/api";
import { shareVideo, buildVideoShareUrl } from "../utils/shareVideo";

const SharedVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getVideoReel(id);
        if (!active) return;
        setVideo(res?.data?.videoReel || null);
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Could not load this video");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (video?.title) {
      document.title = `${video.title} — Shared Video`;
    }
  }, [video]);

  const handleShare = async () => {
    const result = await shareVideo(id, video?.title);
    if (result.ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
        <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold text-white mb-2">
          Video not available
        </h1>
        <p className="text-gray-400 mb-6 max-w-md">
          {error || "This shared video may have been removed or the link is invalid."}
        </p>
        <Link
          to="/projects"
          className="px-5 py-2.5 rounded-full border border-red-500/40 text-red-300 hover:bg-red-500/10 transition"
        >
          Browse all projects
        </Link>
      </div>
    );
  }

  const shareUrl = buildVideoShareUrl(id);

  return (
    <section className="min-h-screen bg-gray-950 pt-24 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111111] z-0" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 text-white/80 hover:bg-gray-700/40 border border-white/5 transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25 transition"
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4" />
                <span className="text-sm">Link copied</span>
              </>
            ) : (
              <>
                <FiShare2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </>
            )}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl"
        >
          <div className="w-full bg-black">
            <video
              ref={videoRef}
              className="w-full max-h-[75vh] object-contain bg-black"
              controls
              autoPlay
              playsInline
              poster={video.thumbnailUrl || undefined}
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-6 bg-gradient-to-b from-gray-900/70 to-gray-900/30">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {video.title}
              </h1>
              {video.category && (
                <span className="text-xs uppercase tracking-wider font-medium px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/20">
                  {video.category}
                </span>
              )}
            </div>

            {video.description && (
              <p className="text-gray-300 leading-relaxed mb-4">
                {video.description}
              </p>
            )}

            {Array.isArray(video.tags) && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {video.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-black/60 text-gray-300 border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-3 py-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 bg-transparent text-sm text-gray-300 outline-none"
              />
              <button
                onClick={handleShare}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SharedVideo;
