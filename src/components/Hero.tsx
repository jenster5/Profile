import { motion } from "framer-motion";
import { Linkedin, Mail, FlaskConical } from "lucide-react";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/jennifer-feenstra-arengard/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:jennifer.feenstra.arengard@gmail.com", label: "Email" },
];

interface HeroProps {
  onEnterLab?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnterLab }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">
            Hello, I'm
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Jennifer
            <br />
            <span className="text-gradient">Feenstra-Arengård</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Full-stack Developer & Biomedical Scientist
          </p>
          <p className="text-base text-muted-foreground/70 max-w-xl mx-auto mb-10">
            From cancer biology labs to full-stack development — bringing scientific
            rigor and curiosity to every line of code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Enter the Lab CTA */}
          {onEnterLab && (
            <button
              onClick={onEnterLab}
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-primary bg-primary/10 hover:bg-primary/20 glow-teal hover:glow-teal-strong transition-all duration-300 font-display text-sm tracking-wide text-primary"
            >
              <FlaskConical className="w-5 h-5 group-hover:animate-float" />
              Explore the Lab
              <span className="text-xs text-muted-foreground font-mono">(interactive)</span>
            </button>
          )}

          {/* Social links */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="group p-3 rounded-full border border-border bg-card/50 hover:border-primary hover:glow-teal transition-all duration-300"
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
