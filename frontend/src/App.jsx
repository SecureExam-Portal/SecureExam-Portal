
import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/home/Navbar";
import HeroSection from "./components/home/HeroSection";
import FeaturesSection from "./components/home/FeaturesSection";
import HowItWorks from "./components/home/HowItWorks";
import StatsSection from "./components/home/StatsSection";
import Footer from "./components/home/Footer";

function App() {
  return (
    <BrowserRouter>
      <main id="home">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <StatsSection />
        <Footer />
      </main>
    </BrowserRouter>
  );
}

export default App;
