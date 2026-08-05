import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getPackages, createPackage, updatePackage, deletePackage } from "../services/api";
import PackageModal from "../components/PackageModal";

export default function DashboardPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ features: [] });
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getPackages({ sort: "sortOrder" });
      setPackages(res.data.packages || res.packages || []);
    } catch (err) {
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", price: 0, currency: "USD", billingType: "one-time", description: "", features: [], isPopular: false, isFeatured: false, isActive: true, sortOrder: 0 });
    setShowModal(true);
  };

  const openEdit = (pkg) => {
    setEditing(pkg);
    setForm({ ...pkg });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const toastId = toast.loading(editing ? "Updating package..." : "Creating package...");
      if (editing) {
        await updatePackage(editing.slug, form);
        toast.update(toastId, { render: "Package updated", type: "success", isLoading: false, autoClose: 2000 });
      } else {
        await createPackage(form);
        toast.update(toastId, { render: "Package created", type: "success", isLoading: false, autoClose: 2000 });
      }
      setShowModal(false);
      await fetch();
    } catch (err) {
      toast.error(err.message || "Failed to save package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Delete this package?")) return;
    try {
      await deletePackage(slug);
      toast.success("Package deleted");
      setPackages((p) => p.filter((x) => x.slug !== slug));
    } catch (err) {
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/10" style={{
        background: "rgba(10, 10, 10, 0.8)",
        backdropFilter: "blur(20px) saturate(180%)",
      }}>
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </motion.button>
            </Link>
            <div className="w-px h-6 bg-white/10" />
            <h1 className="text-2xl font-bold text-white">Package Management</h1>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={openCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              + Add Package
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 animate-spin" />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{
            background: "rgba(20, 20, 20, 0.5)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}>
            <ul className="divide-y divide-white/5">
              {packages.map((pkg) => (
                <li key={pkg._id} className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors duration-300">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-white">{pkg.name}</p>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">{pkg.slug}</span>
                      {pkg.isPopular && (
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                      {pkg.features?.slice(0, 4).map((feature, idx) => (
                        <span key={idx} className="bg-white/5 px-2 py-0.5 rounded-full">
                          {feature}
                        </span>
                      ))}
                      {pkg.features?.length > 4 && (
                        <span className="text-gray-600">+{pkg.features.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="text-sm text-white font-medium">
                      {pkg.price} {pkg.currency}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEdit(pkg)}
                      className="px-3 py-1.5 border border-white/10 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(pkg.slug)}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all duration-300 border border-red-500/20"
                    >
                      Delete
                    </motion.button>
                  </div>
                </li>
              ))}
              {packages.length === 0 && (
                <li className="px-4 py-12 text-center text-gray-500">
                  <p className="text-gray-400">No packages found</p>
                  <button
                    onClick={openCreate}
                    className="mt-4 text-red-400 hover:text-red-300 transition-colors duration-300"
                  >
                    Create your first package →
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && (
          <PackageModal
            show={showModal}
            onClose={() => setShowModal(false)}
            form={form}
            setForm={setForm}
            submitting={submitting}
            onSubmit={handleSubmit}
            editing={!!editing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}