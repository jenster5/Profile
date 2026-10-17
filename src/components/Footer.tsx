import { Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="py-20 border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Contact</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          I'm always open to new opportunities, collaborations, or just a friendly chat about tech and science.
        </p>

        <a
          href="mailto:jennifer.feenstra.arengard@gmail.com"
          className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-teal-strong mb-10"
        >
          Say Hello
        </a>

        <div className="flex items-center justify-center gap-5 mb-10">
          <a href="https://www.linkedin.com/in/jennifer-feenstra-arengard/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="mailto:jennifer.feenstra.arengard@gmail.com" aria-label="Email"
            className="text-muted-foreground hover:text-primary transition-colors">
            <Mail size={20} />
          </a>
        </div>

        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} Jennifer Feenstra-Arengård. Built with React & Tailwind.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
