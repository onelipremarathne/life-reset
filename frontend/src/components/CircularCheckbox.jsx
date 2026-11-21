function CircularCheckbox({ checked, onChange,disabled = false }) {
  return (
    <button
      type="button"
      className={`circular-checkbox ${checked ? "checked" : ""}`}
      onClick={onChange}
      disabled={disabled}
      aria-pressed={checked}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
    >
      {checked && (
        <svg viewBox="0 0 16 16" width="10" height="10">
          <path
            d="M2 8l4 4 8-8"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default CircularCheckbox;
