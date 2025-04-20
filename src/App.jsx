import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCursor from "./ui/CustomCursor";
import Hero from "./components/sections/Hero";

// import "./App.css";

function App() {
  return (
    <div className="app">
      <CustomCursor />

      <Hero />
    </div>
  );
}

export default App;
