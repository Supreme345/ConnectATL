
import { useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Landing from "./pages/Landing";
import EligibilityForm from "./pages/EligibilityForm";
import Results from "./pages/Results";
import Checklist from "./pages/Checklist";

function BrandLogo() {
  return (
    <span className="atl-brand">
      <span className="atl-brand-text">
        Connect<span>ATL</span>
      </span>

      <svg
        className="atl-brand-skyline"
        viewBox="0 0 130 36"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 32H18V25H23V32H29V12Q32 3 35 12V32H42V19Q45 13 48 19V32H55V6Q59 -1 63 6V32H70V22Q73 16 76 22V32H83V10Q87 4 91 10V32H99V24H104V32H128"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function App() {
  const [formData, setFormData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [availabilityResult, setAvailabilityResult] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <nav className="atl-navbar d-print-none">
        <div className="container atl-navbar-inner">
          <Link to="/" className="atl-brand-link">
            <BrandLogo />
          </Link>

          {location.pathname !== "/" && (
            <button
              type="button"
              className="atl-back-button"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/check"
          element={
            <EligibilityForm
              formData={formData}
              setFormData={setFormData}
              setEligibilityResult={setEligibilityResult}
              setAvailabilityResult={setAvailabilityResult}
              setSelectedPlan={setSelectedPlan}
            />
          }
        />

        <Route
          path="/results"
          element={
            <Results
              formData={formData}
              eligibilityResult={eligibilityResult}
              availabilityResult={availabilityResult}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          }
        />

        <Route
          path="/checklist"
          element={
            <Checklist
              formData={formData}
              selectedPlan={selectedPlan}
              eligibilityResult={eligibilityResult}
            />
          }
        />
      </Routes>

      <footer className="atl-footer d-print-none">
        <div className="container atl-footer-inner">
          <p>
            © {new Date().getFullYear()} ConnectATL.
            All rights reserved.
          </p>

          <Link to="/" className="atl-brand-link">
            <BrandLogo />
          </Link>
        </div>
      </footer>
    </>
  );
}

