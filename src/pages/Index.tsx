import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import LabGame from "@/components/lab/LabGame";

const Index = () => {
  const [labMode, setLabMode] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompted, setPrompted] = useState(false);

  const handleScroll = useCallback(
    (e: WheelEvent) => {
      if (!labMode && !prompted && e.deltaY > 0) {
        e.preventDefault();
        setShowPrompt(true);
        setPrompted(true);
      }
    },
    [labMode, prompted]
  );

  useEffect(() => {
    if (!labMode && !prompted) {
      window.addEventListener("wheel", handleScroll, { passive: false });
      return () => window.removeEventListener("wheel", handleScroll);
    }
  }, [labMode, prompted, handleScroll]);

  const handlePlayGame = () => {
    setShowPrompt(false);
    setLabMode(true);
  };

  const handleSkipToPortfolio = () => {
    setShowPrompt(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AnimatePresence mode="wait">
        {labMode ? (
          <LabGame key="lab" onExit={() => setLabMode(false)} />
        ) : (
          <div key="portfolio">
            <Hero onEnterLab={() => setLabMode(true)} />
            <About />
            <Skills />
            <Projects />
            <Footer />
          </div>
        )}
      </AnimatePresence>

      {/* Scroll prompt overlay */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full mx-4 rounded-xl border border-border bg-card p-8 shadow-2xl text-center"
            >
              <FlaskConical className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Wait — want to explore?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                You can walk around the interactive lab to discover my work, or skip straight to the traditional portfolio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handlePlayGame}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                >
                  <FlaskConical className="w-4 h-4" />
                  Explore the Lab
                </button>
                <button
                  onClick={handleSkipToPortfolio}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  Just read the portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
