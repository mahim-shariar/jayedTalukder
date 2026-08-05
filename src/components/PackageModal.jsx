import { motion } from "framer-motion";
import { FiX, FiLoader, FiPlus, FiTrash2 } from "react-icons/fi";

const modalVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
};

export default function PackageModal({ show, onClose, form, setForm, submitting, onSubmit, editing }) {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const addFeature = () => setForm({ ...form, features: [...(form.features || []), ""] });
  const updateFeature = (idx, value) => {
    const next = [...(form.features || [])];
    next[idx] = value;
    setForm({ ...form, features: next });
  };
  const removeFeature = (idx) => {
    const next = [...(form.features || [])];
    next.splice(idx, 1);
    setForm({ ...form, features: next });
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <motion.div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center" variants={{}} initial="initial" animate="animate" exit="exit">
        <motion.div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full border border-gray-200" variants={modalVariants} initial="initial" animate="animate" exit="exit">
          <div className="bg-white px-6 py-6 sm:p-8">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{editing ? "Edit Package" : "Add Package"}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500"><FiX className="h-6 w-6" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name*</label>
                <input name="name" value={form.name || ""} onChange={handleChange} required className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price*</label>
                  <input name="price" value={form.price || 0} onChange={handleChange} type="number" required className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <input name="currency" value={form.currency || "USD"} onChange={handleChange} className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Billing Type</label>
                <select name="billingType" value={form.billingType || "one-time"} onChange={handleChange} className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500">
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea name="description" value={form.description || ""} onChange={handleChange} rows={3} className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Features</label>
                  <button type="button" onClick={addFeature} className="inline-flex items-center px-3 py-1 text-sm rounded bg-gray-100">
                    <FiPlus className="mr-2" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {(form.features || []).map((f, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input value={f} onChange={(e) => updateFeature(idx, e.target.value)} className="flex-1 px-3 py-2 rounded border border-gray-300" />
                      <button type="button" onClick={() => removeFeature(idx)} className="p-2 rounded bg-red-50 text-red-600"><FiTrash2 /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-2"><input type="checkbox" name="isPopular" checked={form.isPopular || false} onChange={handleChange} className="h-4 w-4" /> <span className="text-sm">Popular</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" name="isFeatured" checked={form.isFeatured || false} onChange={handleChange} className="h-4 w-4" /> <span className="text-sm">Featured</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" name="isActive" checked={form.isActive !== false} onChange={handleChange} className="h-4 w-4" /> <span className="text-sm">Active</span></label>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300">Cancel</button>
                <button type="submit" disabled={submitting} className={`px-4 py-2 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 ${submitting? 'opacity-70 cursor-not-allowed':''}`}>
                  {submitting ? (<><FiLoader className="animate-spin mr-2 inline"/> Saving...</>) : (editing ? 'Update Package':'Create Package')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
