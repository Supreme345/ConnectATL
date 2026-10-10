import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

// SAMPLE DATA: replace with the Spring Boot response once Sultan's API is ready
const SAMPLE_PLANS = [
  { id: 1, provider: 'Cox', name: 'Low-income plan (sample)', price: 30, subsidy: 9.25, down: 100, tech: 'Cable' },
  { id: 2, provider: 'AT&T', name: 'Internet 300 (sample)', price: 55, subsidy: 9.25, down: 300, tech: 'Fiber' },
  { id: 3, provider: 'Comcast', name: 'Basic (sample)', price: 40, subsidy: 9.25, down: 150, tech: 'Cable' },
]
const SAMPLE_REASONS = {
  qualifies: ['You receive SNAP, which qualifies you for Lifeline.'],
  missing: ['Proof of SNAP enrollment (benefit letter).'],
}

export default function Results({ formData, selectedPlan, setSelectedPlan }) {
  const navigate = useNavigate()

  const plans = SAMPLE_PLANS
    .map((p) => ({ ...p, final: Math.max(p.price - p.subsidy, 0) }))
    .sort((a, b) => a.final - b.final)

  // Default to the cheapest plan until the user picks another
  const [selectedId, setSelectedId] = useState(selectedPlan?.id ?? plans[0].id)

  if (!formData) return <Navigate to="/check" />

  const choose = (plan) => {
    setSelectedId(plan.id)
    setSelectedPlan(plan)
  }

  const goToChecklist = () => {
    setSelectedPlan(plans.find((p) => p.id === selectedId))
    navigate('/checklist')
  }

  return (
    <div className="container py-5">
      <h2>Your options</h2>
      <p className="text-muted">
        Plans available near {formData.address}, ranked by price after discounts.
        Click a plan to select it. Sample data, estimates only.
      </p>

      <div className="row g-4">
        <div className="col-lg-8">
          {plans.map((p, i) => {
            const isSelected = p.id === selectedId
            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => choose(p)}
                onKeyDown={(e) =>
                  (e.key === 'Enter' || e.key === ' ') && choose(p)
                }
                className={`card plan-card mb-3 ${isSelected ? 'best' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    {i === 0 && (
                      <span className="badge text-bg-primary mb-2">
                        Lowest price
                      </span>
                    )}
                    <h5 className="mb-1">
                      {p.provider}: {p.name}
                    </h5>
                    <div className="text-muted small">
                      {p.down} Mbps down · {p.tech}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fs-4 fw-bold">${p.final.toFixed(2)}/mo</div>
                    <div className="small text-muted text-decoration-line-through">
                      ${p.price}/mo
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5>Why you may qualify</h5>
              <ul>
                {SAMPLE_REASONS.qualifies.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <h6>What's missing</h6>
              <ul>
                {SAMPLE_REASONS.missing.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <button className="btn btn-primary w-100" onClick={goToChecklist}>
                Get my application checklist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}