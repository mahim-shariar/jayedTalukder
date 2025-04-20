import { useState, useRef } from "react";
import { motion } from "framer-motion";
import VideoPlayer from "../ui/VideoPlayer";

const categories = [
  { id: "all", name: "All Work" },
  { id: "wedding", name: "Wedding Films" },
  { id: "commercial", name: "Commercial" },
  { id: "travel", name: "Travel" },
  { id: "shortfilm", name: "Short Films" },
];

const videos = [
  {
    id: 1,
    title: "Luxury Wedding in Italy",
    category: "wedding",
    url: "/videos/wedding1.mp4",
  },
  {
    id: 2,
    title: "Nike Commercial",
    category: "commercial",
    url: "/videos/commercial1.mp4",
  },
  {
    id: 3,
    title: "Japan Travel Diary",
    category: "travel",
    url: "/videos/travel1.mp4",
  },
  {
    id: 4,
    title: "The Last Sunset",
    category: "shortfilm",
    url: "/videos/shortfilm1.mp4",
  },
  {
    id: 5,
    title: "Beach Wedding",
    category: "wedding",
    url: "/videos/wedding2.mp4",
  },
];

export default function Showreel() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const sectionRef = useRef();

  const filteredVideos =
    activeCategory === "all"
      ? videos
      : videos.filter((video) => video.category === activeCategory);

  return (
    <section ref={sectionRef} className="showreel-section bg-black/50 py-16">
      <div className="container mx-auto">
        <h2 className="text-4xl mb-4 text-center">My Showreel</h2>
        <p className="text-center mb-12 text-white/70">
          Select a category to view my work
        </p>

        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full text-sm transition-all ${
                activeCategory === category.id
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="aspect-w-16 aspect-h-9 bg-black/50 rounded-lg overflow-hidden">
                <VideoPlayer
                  src={video.url}
                  thumbnail={`/images/thumbnails/${video.id}.jpg`}
                  className="w-full h-full object-cover"
                  muted
                  loop
                />
              </div>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-medium">{video.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-6 right-6 text-white text-2xl z-10"
            onClick={() => setSelectedVideo(null)}
          >
            ✕
          </button>
          <div className="w-full max-w-4xl relative">
            <VideoPlayer
              src={selectedVideo.url}
              controls
              autoPlay
              className="w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}
