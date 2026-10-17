import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Partnex",
    description:
      "Website for a Swedish construction company specializing in residential developments and total contracting. Built with Next.js, React, and TypeScript with a focus on performance and clear information architecture.",
    tech: ["Next.js", "React", "TypeScript"],
    demo: "https://partnex.se",
  },
  {
    title: "Floccs",
    description:
      "Frontend development for Floccs, a growing horse marketplace in the Nordics. Developed responsive pages and reusable React components with a focus on performance and scalability.",
    tech: ["Web Development", "React", "Startup"],
    demo: "https://floccs.com",
  },
  {
    title: "CVOOM",
    description:
      "Developed a mobile app with React Native for a startup focused on modernizing the job search process. The app helps candidates introduce themselves to employers through short video interviews, making applications more personal and engaging.",
    tech: ["React Native", "Mobile Development", "Startup"],
  },
];

const Projects = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Work</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">
            Selected Work
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:glow-teal transition-all duration-300"
              >
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink size={14} /> Visit
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
