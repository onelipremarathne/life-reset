import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";

export default function CountUp({ value, suffix = "", duration = 0.8 }) {
  const ref = useRef(null);
  const from = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = `${value}${suffix}`;
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    from.current = value;
    return () => controls.stop();
  }, [value, suffix, duration, reduce]);

  return <span ref={ref}>0{suffix}</span>;
}
