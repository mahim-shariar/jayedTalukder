import React from "react";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Services from "../components/sections/Services";
import Testimonials from "../components/sections/Testimonials";
import Contact from "../components/sections/Contact";
import EasterEgg from "../components/sections/EasterEgg";
import Showreel from "../components/sections/Showreel";

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Showreel />

      <Services />
      <Testimonials />
      <Contact />
      <EasterEgg />
    </>
  );
};

export default Home;
