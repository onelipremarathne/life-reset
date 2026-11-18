import { useLocation, useNavigate } from "react-router-dom";
import RubberSegment from "./RubberSegment";

const ITEMS = [
  { value: "/", label: "Dashboard" },
  { value: "/habits", label: "Habits" },
  { value: "/journal", label: "Journal" },
  { value: "/progress", label: "Progress" },
];

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = ITEMS.some((i) => i.value === pathname) ? pathname : "/";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Life <span className="brand-accent">Reset</span>
      </div>
      <RubberSegment
        items={ITEMS}
        value={current}
        onChange={(path) => navigate(path)}
        trackColor="var(--surface-inset)"
        thumbColor="var(--primary)"
        textColor="var(--text-secondary)"
        activeTextColor="var(--primary-text)"
        radius={999}
        equalSlots={false}
        className="navbar-segment"
        aria-label="Main navigation"
      />
    </nav>
  );
}

export default Navbar;
