import React, { Suspense } from "react";
import LoadingSpinner from "../components/sections/LoadingSpinner";

const Hero = React.lazy(() => import("../components/sections/Hero"));
const About = React.lazy(() => import("../components/sections/About"));
const Services = React.lazy(() => import("../components/sections/Services"));
const Testimonials = React.lazy(() =>
  import("../components/sections/Testimonials")
);
const Contact = React.lazy(() => import("../components/sections/Contact"));
const EasterEgg = React.lazy(() => import("../components/sections/EasterEgg"));
const Showreel = React.lazy(() => import("../components/sections/Showreel"));

const Home = () => {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Hero />
        <About />
        <Showreel />
        <Services />
        <Testimonials />
        <Contact />
        <EasterEgg />
      </Suspense>
    </>
  );
};

export default Home;
