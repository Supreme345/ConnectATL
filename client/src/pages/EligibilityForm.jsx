import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Keep these in sync with Ichi's rules engine!
const INCOME_RANGES = [
  'Under $20,000',
  '$20,000 - $30,000',
  '$30,000 - $40,000',
  '$40,000 - $60,000',
  'Over $60,000',
]
const BENEFITS = [
  'SNAP',
  'Medicaid',
  'SSI',
  'WIC',
  'Federal Public Housing',
  'Veterans Pension',
  'Free/Reduced School Lunch',
  'Pell Grant',
]

export default function EligibilityForm({ formData, setFormData }) {
  const navigate = useNavigate()

  // Start from saved answers if the user comes back to this page
  const [form, setForm] = useState(
    formData ?? {
      address: '',
      zip: '',
      householdSize: 1,
      income: '',
      benefits: [],
      language: 'en',
    }
  )

  const update = (field, value) => setForm({ ...form, [field]: value })

  const toggleBenefit = (b) =>
    update(
      'benefits',
      form.benefits.includes(b)
        ? form.benefits.filter((x) => x !== b)
        : [...form.benefits, b]
    )

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormData(form)
    navigate('/results')
  }

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <h2 className="mb-4">Tell us a little about your household</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Street address</label>
          <input
            className="form-control"
            required
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder="123 Peachtree St NE"
          />
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label">ZIP code</label>
            <input
              className="form-control"
              required
              pattern="[0-9]{5}"
              value={form.zip}
              onChange={(e) => update('zip', e.target.value)}
            />
          </div>
          <div className="col-6">
            <label className="form-label">People in household</label>
            <input
              type="number"
              min="1"
              max="12"
              className="form-control"
              required
              value={form.householdSize}
              onChange={(e) => update('householdSize', Number(e.target.value))}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Yearly household income</label>
          <select
            className="form-select"
            required
            value={form.income}
            onChange={(e) => update('income', e.target.value)}
          >
            <option value="">Choose one...</option>
            {INCOME_RANGES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">
            Does anyone in your household get any of these?
          </label>
          {BENEFITS.map((b) => (
            <div className="form-check" key={b}>
              <input
                className="form-check-input"
                type="checkbox"
                id={b}
                checked={form.benefits.includes(b)}
                onChange={() => toggleBenefit(b)}
              />
              <label className="form-check-label" htmlFor={b}>
                {b}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="form-label">Language for results</label>
          <select
            className="form-select"
            value={form.language}
            onChange={(e) => update('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <button className="btn btn-primary btn-lg w-100">See my options</button>
        <p className="small text-muted mt-3">
          Results are estimates, not final eligibility decisions.
        </p>
      </form>
    </div>
  )
}