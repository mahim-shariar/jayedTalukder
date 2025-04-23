import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomCursor from "./ui/CustomCursor";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Showreel from "./components/sections/Showreel";
import Projects from "./components/sections/Projects";
import Services from "./components/sections/Services";
import Testimonials from "./components/sections/Testimonials";
import Contact from "./components/sections/Contact";
import EasterEgg from "./components/sections/EasterEgg";
import Footer from "./components/sections/Footer";
import Navbar from "./components/sections/Navber";

// import "./App.css";

function App() {
  return (
    <div className="app">
      <CustomCursor />
      <Navbar />

      <Hero />
      <About />
      <Showreel />
      {/* <Projects /> */}
      <Services />
      <Testimonials />
      <Contact />
      <EasterEgg />
      <Footer />
    </div>
  );
}

export default App;
