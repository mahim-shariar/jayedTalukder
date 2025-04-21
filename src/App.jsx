import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCursor from "./ui/CustomCursor";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Showreel from "./components/sections/Showreel";

// import "./App.css";

function App() {
  return (
    <div className="app">
      <CustomCursor />

      <Hero />
      <About />
      <Showreel />
    </div>
  );
}

export default App;
