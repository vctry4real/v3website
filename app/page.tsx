import React from "react";
import { Hero } from "../components/sections/Hero";
import { Projects } from "../components/sections/Projects";
import { Blog } from "../components/sections/Blog";
import { Services } from "../components/sections/Services";
import Cta from "../components/sections/Cta"
import TrustedBy from "../components/sections/TrustedBy";
import Approach from "../components/sections/Approach";
import MarqueeTestimonials from "../components/sections/MarqueeTestimonials";
import { About } from "../components/sections/About";

export default function Home() {
  return (
    <>


      <Hero />
      <TrustedBy />
      <Services />
      <Projects />
      <Approach />
      <Blog />
      <MarqueeTestimonials />
      <About />
      <Cta />
    </>
  );
}
