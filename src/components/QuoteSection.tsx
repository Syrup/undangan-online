import { motion } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";
import weddingData from "../data/weddingData.json";

export function QuoteSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 px-4 relative z-10" id="quote-section">
      <div className="max-w-md mx-auto">
        <motion.div
          className="card bg-base-100/90 shadow-xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="card-body text-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="text-6xl text-primary mb-4">🤲</div>
              <blockquote className="text-lg italic text-neutral leading-relaxed mb-4">
                "{weddingData.quote.text}"
              </blockquote>
              <cite className="text-primary font-medium">{weddingData.quote.source}</cite>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
