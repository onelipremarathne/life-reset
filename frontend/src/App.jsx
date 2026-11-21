import { BrowserRouter, Routes, Route, useLocation  } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "motion/react";

import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import Progress from "./pages/Progress";
import { Toaster } from "sonner";
import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/habits" element={<PageTransition><Habits /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
        <Route path="/progress" element={<PageTransition><Progress /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Navbar />
        <main className="page-content">
          <AnimatedRoutes />
        </main>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;