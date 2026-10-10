import { useState } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import EligibilityForm from './pages/EligibilityForm'
import Results from './pages/Results'
import Checklist from './pages/Checklist'

export default function App() {
  // Shared state so every page can read it
  const [formData, setFormData] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <nav className="navbar navbar-dark brand-bg d-print-none">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold" to="/">ConnectATL</Link>
          {location.pathname !== '/' && (
            <button
              type="button"
              className="btn btn-outline-light btn-sm px-3 back-btn"
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
          element={<EligibilityForm formData={formData} setFormData={setFormData} />}
        />
        <Route
          path="/results"
          element={
            <Results
              formData={formData}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
          }
        />
        <Route
          path="/checklist"
          element={<Checklist formData={formData} selectedPlan={selectedPlan} />}
        />
      </Routes>
    </>
  )
}