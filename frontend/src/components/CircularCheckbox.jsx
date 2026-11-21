import { AnimatePresence, motion } from "motion/react";

function CircularCheckbox({ checked, onChange,disabled = false }) {
  return (
    <motion.button
      type="button"
      className={`circular-checkbox ${checked ? "checked" : ""}`}
      onClick={onChange}
      disabled={disabled}
      aria-pressed={checked}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
      whileTap={{ scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
    >
      <AnimatePresence initial={false}>
      {checked && (
        <motion.svg key="check"
            viewBox="0 0 16 16"
            width="10"
            height="10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}>
          <motion.path
           d="M2 8l4 4 8-8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.25 }}
          />
          
        </motion.svg>
      )}
      </AnimatePresence>
    </motion.button>
  );
}

export default CircularCheckbox;
