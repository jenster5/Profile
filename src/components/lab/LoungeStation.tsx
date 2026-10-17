import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, ExternalLink } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import MobileStationPanel, { MOBILE_PANEL_POSITION, MOBILE_PANEL_SIZE } from "./MobileStationPanel";

type Phase = "brewing" | "reveal";

interface Publication {
  title: string;
  journal: string;
  date: string;
  preview: string;
  abstract: string;
  link?: string;
}

interface LoungeStationProps {
  onClose: () => void;
}

const publications: Publication[] = [
  {
    title: "Ribosome biogenesis during cell cycle arrest fuels EMT in development and disease",
    journal: "Nature Communications",
    date: "May 8, 2019",
    preview: "Ribosome biogenesis is a canonical hallmark of cell growth and proliferation. Here we show that execution of Epithelial-to-Mesenchymal Transition (EMT), a migratory cellular program associated with development and tumor metastasis, is fueled by upregulation of ribosome biogenesis during G1/S arrest.",
    abstract: "Ribosome biogenesis is a canonical hallmark of cell growth and proliferation. Here we show that execution of Epithelial-to-Mesenchymal Transition (EMT), a migratory cellular program associated with development and tumor metastasis, is fueled by upregulation of ribosome biogenesis during G1/S arrest. This unexpected EMT feature is independent of species and initiating signal, and is accompanied by release of the repressive nucleolar chromatin remodeling complex (NoRC) from rDNA, together with recruitment of the EMT-driving transcription factor Snai1 (Snail1), RNA Polymerase I (Pol I) and the Upstream Binding Factor (UBF). EMT-associated ribosome biogenesis is also coincident with increased nucleolar recruitment of Rictor, an essential component of the EMT-promoting mammalian target of rapamycin complex 2 (mTORC2). Inhibition of rRNA synthesis in vivo differentiates primary tumors to a benign, Estrogen Receptor-alpha (ERα) positive, Rictor-negative phenotype and reduces metastasis. These findings implicate the EMT-associated ribosome biogenesis program with cellular plasticity, de-differentiation, cancer progression and metastatic disease.",
    link: "https://pubmed.ncbi.nlm.nih.gov/31068593/",
  },
  {
    title: "LHX2 Mediates the FGF-to-SHH Regulatory Loop during Limb Development",
    journal: "J Dev Biology",
    date: "Jun 15, 2018",
    preview: "During limb development, fibroblast growth factors (Fgfs) govern proximal–distal outgrowth and patterning. FGFs also synchronize developmental patterning between the proximal–distal and anterior–posterior axes by maintaining Sonic hedgehog (Shh) expression.",
    abstract: "During limb development, fibroblast growth factors (Fgfs) govern proximal–distal outgrowth and patterning. FGFs also synchronize developmental patterning between the proximal–distal and anterior–posterior axes by maintaining Sonic hedgehog (Shh) expression in cells of the zone of polarizing activity (ZPA) in the distal posterior mesoderm. Shh, in turn, maintains Fgfs in the apical ectodermal ridge (AER) that caps the distal tip of the limb bud. Crosstalk between Fgf and Shh signaling is critical for patterned limb development, but the mechanisms underlying this feedback loop are not well-characterized. Implantation of Fgf beads in the proximal posterior limb bud can maintain SHH expression in the former ZPA domain (evident 3 h after application), while prolonged exposure (24 h) can induce SHH outside of this domain. Although temporally and spatially disparate, comparative analysis of transcriptome data from these different populations accentuated genes involved in SHH regulation. Comparative analysis identified 25 candidates common to both treatments, with eight linked to SHH expression or function. Furthermore, we demonstrated that LHX2, a LIM Homeodomain transcription factor, is an intermediate in the FGF-mediated regulation of SHH. Our data suggest that LHX2 acts as a competency factor maintaining distal posterior SHH expression subjacent to the AER.",
    link: "https://pubmed.ncbi.nlm.nih.gov/29914077/",
  },
  {
    title: "Face morphogenesis is promoted by Pbx-dependent EMT via regulation of Snail1 during frontonasal prominence fusion",
    journal: "Development",
    date: "Mar 1, 2018",
    preview: "Human cleft lip with or without cleft palate (CL/P) is a common craniofacial abnormality caused by impaired fusion of the facial prominences. We have previously reported that epithelial apoptosis mediates fusion at the seam where the prominences coalesce.",
    abstract: "Human cleft lip with or without cleft palate (CL/P) is a common craniofacial abnormality caused by impaired fusion of the facial prominences. We have previously reported that, in the mouse embryo, epithelial apoptosis mediates fusion at the seam where the prominences coalesce. Here, we show that apoptosis alone is not sufficient to remove the epithelial layers. We observed morphological changes in the seam epithelia, intermingling of cells of epithelial descent into the mesenchyme and molecular signatures of epithelial-mesenchymal transition (EMT). Utilizing mouse lines with cephalic epithelium-specific Pbx loss exhibiting CL/P, we demonstrate that these cellular behaviors are Pbx dependent, as is the transcriptional regulation of the EMT driver Snail1. Furthermore, in the embryo, the majority of epithelial cells expressing high levels of Snail1 do not undergo apoptosis. Pbx1 loss- and gain-of-function in a tractable epithelial culture system revealed that Pbx1 is both necessary and sufficient for EMT induction. This study establishes that Pbx-dependent EMT programs mediate murine upper lip/primary palate morphogenesis and fusion via regulation of Snail1. Of note, the EMT signatures observed in the embryo are mirrored in the epithelial culture system.",
    link: "https://pubmed.ncbi.nlm.nih.gov/29437830/",
  },
  {
    title: "Lmx1b-targeted cis-regulatory modules involved in limb dorsalization",
    journal: "Development",
    date: "Jun 1, 2017",
    preview: "Lmx1b is a homeodomain transcription factor responsible for limb dorsalization. Despite striking double-ventral (loss-of-function) and double-dorsal (gain-of-function) limb phenotypes, no direct gene targets in the limb have been confirmed.",
    abstract: "Lmx1b is a homeodomain transcription factor responsible for limb dorsalization. Despite striking double-ventral (loss-of-function) and double-dorsal (gain-of-function) limb phenotypes, no direct gene targets in the limb have been confirmed. To determine direct targets, we performed a chromatin immunoprecipitation against Lmx1b in mouse limbs at embryonic day 12.5 followed by next-generation sequencing (ChIP-seq). Nearly 84% (n=617) of the Lmx1b-bound genomic intervals (LBIs) identified overlap with chromatin regulatory marks indicative of potential cis-regulatory modules (PCRMs). In addition, 73 LBIs mapped to CRMs that are known to be active during limb development. We compared Lmx1b-bound PCRMs with genes regulated by Lmx1b and found 292 PCRMs within 1 Mb of 254 Lmx1b-regulated genes. Gene ontological analysis suggests that Lmx1b targets extracellular matrix production, bone/joint formation, axonal guidance, vascular development, cell proliferation and cell movement. We validated the functional activity of a PCRM associated with joint-related Gdf5 that provides a mechanism for Lmx1b-mediated joint modification and a PCRM associated with Lmx1b that suggests a role in autoregulation. This is the first report to describe genome-wide Lmx1b binding during limb development, directly linking Lmx1b to targets that accomplish limb dorsalization.",
    link: "https://pubmed.ncbi.nlm.nih.gov/28455377/",
  },
  {
    title: "Membrane-Depolarizing Channel Blockers Induce Selective Glioma Cell Death by Impairing Nutrient Transport and Unfolded Protein/Amino Acid Responses",
    journal: "Cancer Research",
    date: "Jan 13, 2017",
    preview: "Glioma-initiating cells (GIC) are considered the underlying cause of recurrences of aggressive glioblastomas, replenishing the tumor population and undermining the efficacy of conventional chemotherapy.",
    abstract: "Glioma-initiating cells (GIC) are considered the underlying cause of recurrences of aggressive glioblastomas, replenishing the tumor population and undermining the efficacy of conventional chemotherapy. Here we report the discovery that inhibiting T-type voltage-gated Ca2+ and KCa channels can effectively induce selective cell death of GIC and increase host survival in an orthotopic mouse model of human glioma. At present, the precise cellular pathways affected by the drugs affecting these channels are unknown. However, using cell-based assays and integrated proteomics, phosphoproteomics, and transcriptomics analyses, we identified the downstream signaling events these drugs affect. Changes in plasma membrane depolarization and elevated intracellular Na+, which compromised Na+-dependent nutrient transport, were documented. Deficits in nutrient deficit acted in turn to trigger the unfolded protein response and the amino acid response, leading ultimately to nutrient starvation and GIC cell death. Our results suggest new therapeutic targets to attack aggressive gliomas.",
    link: "https://pubmed.ncbi.nlm.nih.gov/28087597/",
  },
  {
    title: "Wnt5a Signals through DVL1 to Repress Ribosomal DNA Transcription by RNA Polymerase I",
    journal: "PLoS Genetics",
    date: "Aug 8, 2016",
    preview: "Ribosome biogenesis is essential for cell growth and proliferation and is commonly elevated in cancer. Accordingly, numerous oncogene and tumor suppressor signaling pathways target rRNA synthesis.",
    abstract: "Ribosome biogenesis is essential for cell growth and proliferation and is commonly elevated in cancer. Accordingly, numerous oncogene and tumor suppressor signaling pathways target rRNA synthesis. In breast cancer, non-canonical Wnt signaling by Wnt5a has been reported to antagonize tumor growth. Here, we show that Wnt5a rapidly represses rDNA gene transcription in breast cancer cells and generates a chromatin state with reduced transcription of rDNA by RNA polymerase I (Pol I). These effects were specifically dependent on Dishevelled1 (DVL1), which accumulates in nucleolar organizer regions (NORs) and binds to rDNA regions of the chromosome. Upon DVL1 binding, the Pol I transcription activator and deacetylase Sirtuin 7 (SIRT7) releases from rDNA loci, concomitant with disassembly of Pol I transcription machinery at the rDNA promoter. These findings reveal that Wnt5a signals through DVL1 to suppress rRNA transcription. This provides a novel mechanism for how Wnt5a exerts tumor suppressive effects and why disruption of Wnt5a signaling enhances mammary tumor growth in vivo.",
    link: "https://pubmed.ncbi.nlm.nih.gov/27500936/",
  },
  {
    title: "ESCRT-II/Vps25 constrains digit number by endosome-mediated selective modulation of FGF-SHH signaling",
    journal: "Cell Reports",
    date: "Oct 23, 2014",
    preview: "Sorting and degradation of receptors and associated signaling molecules maintain homeostasis of conserved signaling pathways during cell specification and tissue development.",
    abstract: "Sorting and degradation of receptors and associated signaling molecules maintain homeostasis of conserved signaling pathways during cell specification and tissue development. Yet, whether machineries that sort signaling proteins act preferentially on different receptors and ligands in different contexts remains mysterious. Here, we show that Vacuolar protein sorting 25, Vps25, a component of ESCRT-II (Endosomal Sorting Complex Required for Transport II), directs preferential endosome-mediated modulation of FGF signaling in limbs. By ENU-induced mutagenesis, we isolated a polydactylous mouse line carrying a hypomorphic mutation of Vps25 (Vps25(ENU)). Unlike Vps25-null embryos we generated, Vps25(ENU/ENU) mutants survive until late gestation. Their limbs display FGF signaling enhancement and consequent hyperactivation of the FGF-SHH feedback loop causing polydactyly, whereas WNT and BMP signaling remain unperturbed. Notably, Vps25(ENU/ENU) Mouse Embryonic Fibroblasts exhibit aberrant FGFR trafficking and degradation; however, SHH signaling is unperturbed. These studies establish that the ESCRT-II machinery selectively limits FGF signaling in vertebrate skeletal patterning.",
    link: "https://pubmed.ncbi.nlm.nih.gov/25373905/",
  },
  {
    title: "Detection of genes regulated by Lmx1b during limb dorsalization",
    journal: "Development, Growth & Differentiation",
    date: "Mar 15, 2012",
    preview: "Lmx1b is a homeodomain transcription factor that regulates dorsal identity during limb development. Lmx1b knockout (KO) mice develop distal ventral-ventral limbs.",
    abstract: "Lmx1b is a homeodomain transcription factor that regulates dorsal identity during limb development. Lmx1b knockout (KO) mice develop distal ventral-ventral limbs.",
    link: "https://pubmed.ncbi.nlm.nih.gov/22417325/",
  },
];

const LoungeStation: React.FC<LoungeStationProps> = ({ onClose }) => {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>("brewing");
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);

  useEffect(() => {
    if (phase === "brewing") {
      const t = setTimeout(() => setPhase("reveal"), 1800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedPub) {
          setSelectedPub(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, selectedPub]);

  return (
    <MobileStationPanel>
    <motion.div
      className={isMobile ? "fixed inset-0 z-[100] flex items-center justify-center" : "absolute inset-0 z-40 flex items-center justify-center"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className={isMobile ? "fixed z-[110] rounded-lg border border-border bg-card shadow-2xl overflow-hidden flex flex-col" : "relative z-50 w-[90%] max-w-2xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden"}
        style={isMobile ? { ...MOBILE_PANEL_POSITION, ...MOBILE_PANEL_SIZE } : undefined}
        initial={{ scale: 0.7, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.7, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="flex shrink-0 items-center gap-2 px-4 py-2.5 bg-secondary border-b border-border">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-muted-foreground">The Bookcase</span>
          <button
            onClick={onClose}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={isMobile ? "p-5 flex-1 min-h-0 overflow-y-auto" : "p-5 max-h-[70vh] overflow-y-auto"}>
          <AnimatePresence mode="wait">
            {phase === "brewing" && (
              <motion.div
                key="brewing"
                className="flex flex-col items-center justify-center py-12"
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="relative text-6xl mb-4">
                  <span>📚</span>
                </motion.div>
                <p className="text-sm text-muted-foreground font-mono animate-pulse">
                  Flipping through pages...
                </p>
              </motion.div>
            )}

            {phase === "reveal" && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-5">
                  <BookOpen className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-display text-xl font-bold text-foreground mt-2">
                    Scientific Publications
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Read on if you dare...
                  </p>
                </div>

                <div className="space-y-3">
                  {publications.map((pub, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => setSelectedPub(pub)}
                      className="block w-full text-left rounded-lg border border-border bg-secondary/30 p-3 hover:border-primary/50 transition-colors group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.06, duration: 0.3 }}
                    >
                      <h4 className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {pub.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground/70 font-mono mt-1">
                        {pub.journal} · {pub.date}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                        {pub.preview}
                      </p>
                      <span className="text-[10px] text-primary font-mono mt-1 inline-block">
                        more...
                      </span>
                    </motion.button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground/50 text-center mt-5 font-mono">
                  ESC or click outside to close
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Publication detail popup */}
      <AnimatePresence>
        {selectedPub && (
          <motion.div
            className="absolute inset-0 z-[60] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
              onClick={() => setSelectedPub(null)}
            />
            <motion.div
              className={isMobile ? "fixed z-[120] rounded-lg border border-border bg-card shadow-2xl overflow-hidden flex flex-col" : "relative z-[70] w-[85%] max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden"}
        style={isMobile ? { ...MOBILE_PANEL_POSITION, ...MOBILE_PANEL_SIZE } : undefined}
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
            >
              <div className="flex shrink-0 items-center gap-2 px-4 py-2.5 bg-secondary border-b border-border">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground truncate flex-1">
                  {selectedPub.journal}
                </span>
                <button
                  onClick={() => setSelectedPub(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className={isMobile ? "p-5 flex-1 min-h-0 overflow-y-auto" : "p-5 max-h-[60vh] overflow-y-auto"}>
                <h3 className="font-display text-sm font-bold text-foreground leading-snug mb-1">
                  {selectedPub.title}
                </h3>
                <p className="text-[10px] text-muted-foreground/70 font-mono mb-4">
                  {selectedPub.journal} · {selectedPub.date}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedPub.abstract}
                </p>
                <a
                  href={selectedPub.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-primary font-mono mt-3 hover:underline"
                >
                  View publication <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-[10px] text-muted-foreground/50 text-center mt-4 font-mono">
                  ESC or click outside to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </MobileStationPanel>
  );
};

export default LoungeStation;
