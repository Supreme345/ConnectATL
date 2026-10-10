import { Navigate } from 'react-router-dom'

// SAMPLE: the LLM will generate this later via Spring Boot
const SAMPLE_STEPS = [
  'Gather a government-issued photo ID.',
  'Get your SNAP benefit letter (proof of enrollment).',
  'Bring proof of your address (a bill or lease).',
  'Apply for Lifeline at the official Lifeline site, or ask your provider.',
  'Call or visit the provider to start service on your chosen plan.',
]

export default function Checklist({ formData, selectedPlan }) {
  if (!formData) return <Navigate to="/check" />

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2>Your application checklist</h2>
      <p className="text-muted">
        For {formData.address}. Estimates only, not a final decision.
      </p>
      {selectedPlan && (
        <p className="fw-semibold">
          Selected plan: {selectedPlan.provider}, {selectedPlan.name} ($
          {selectedPlan.final.toFixed(2)}/mo)
        </p>
      )}
      <ul className="list-group mb-4">
        {SAMPLE_STEPS.map((s) => (
          <li key={s} className="list-group-item d-flex gap-3">
            <input type="checkbox" className="form-check-input" /> <span>{s}</span>
          </li>
        ))}
      </ul>
      <button
        className="btn btn-outline-primary d-print-none"
        onClick={() => window.print()}
      >
        Print / Save as PDF
      </button>
    </div>
  )
}