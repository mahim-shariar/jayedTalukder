import React from "react";

const Hero = React.lazy(() => import("../components/sections/Hero"));
const About = React.lazy(() => import("../components/sections/About"));
const Services = React.lazy(() => import("../components/sections/Services"));
const Testimonials = React.lazy(() =>
  import("../components/sections/Testimonials")
);
const Contact = React.lazy(() => import("../components/sections/Contact"));
const EasterEgg = React.lazy(() => import("../components/sections/EasterEgg"));
const Showreel = React.lazy(() => import("../components/sections/Showreel"));
const PricingSection = React.lazy(() => import("../components/sections/Pricing"));

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Showreel />
      <PricingSection />
      <Services />
      <Testimonials />
      <Contact />
      <EasterEgg />
    </>
  );
};

export default Home;
