import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Frontend & Full-stack",
    skills: ["JavaScript", "TypeScript", "React", "HTML5", "CSS3", "Tailwind CSS", "Node.js", "Git"],
  },
  {
    title: "Toolbox",
    skills: ["VS Code", "Figma", "GitHub", "Netlify", "Vite", "REST APIs", "npm"],
  },
  {
    title: "Laboratory",
    skills: ["Cell Biology", "Molecular Biology", "Data Analysis", "Scientific Writing", "PCR", "Microscopy"],
  },
  {
    title: "Learning",
    skills: ["Next.js", "Python", "Docker", "PostgreSQL", "AI/ML Fundamentals"],
  },
];

const Skills = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 md:py-32 bg-gradient-section">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">Skills</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-12">
            Tech & Expertise
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((cat, catIdx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {cat.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
