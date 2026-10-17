import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import jenniferPortrait from "@/assets/jennifer-portrait.jpeg";

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">About</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-8">
            From the Lab to the Browser
          </h2>

          <div className="grid md:grid-cols-5 gap-10 items-start">
            {/* Photo placeholder */}
            <div className="md:col-span-2 flex justify-center">
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-border glow-teal">
                <img
                  src={jenniferPortrait}
                  alt="Jennifer Feenstra Arengård portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-5">
              <p className="text-muted-foreground leading-relaxed">
                I'm a full-stack developer with a background in developmental and cancer biology. Before moving into tech, I spent several years in academic research, earning a PhD in developmental biology in California and later working as a postdoctoral researcher at Weill Cornell Medical College and the Karolinska Institutet.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As it turns out, careers don't always follow a straight line. During a break from research, I started learning programming and quickly realized how much I enjoyed building things with code. That curiosity eventually led me to transition into software development, starting with an intensive full-stack bootcamp at Technigo.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Since then, I've worked on internships, startup projects, and independent development work. Being part of small teams has also meant wearing many hats — from building applications to helping market products and supporting early fundraising efforts.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                My background in science still shapes how I work today. Research taught me how to approach complex problems patiently and methodically, and how important collaboration is when tackling difficult challenges.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
