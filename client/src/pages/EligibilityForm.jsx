
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const INCOME_RANGES = [
  "Under $20,000",
  "$20,000 - $30,000",
  "$30,000 - $40,000",
  "$40,000 - $60,000",
  "Over $60,000",
];

const BENEFITS = [
  "SNAP",
  "Medicaid",
  "SSI",
  "WIC",
  "Federal Public Housing",
  "Veterans Pension",
  "Free/Reduced School Lunch",
  "Pell Grant",
];

export default function EligibilityForm({
  formData,
  setFormData,
  setEligibilityResult,
  setAvailabilityResult,
  setSelectedPlan,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState(
    formData ?? {
      address: "",
      zip: "",
      householdSize: 1,
      income: "",
      benefits: [],
      hasK12Student: "",
      language: "en",
    }
  );

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  const toggleBenefit = (benefit) =>
    setForm((previous) => ({
      ...previous,
      benefits: previous.benefits.includes(benefit)
        ? previous.benefits.filter((b) => b !== benefit)
        : [...previous.benefits, benefit],
    }));

  async function handleSubmit(event) {
    event.preventDefault();
    if (step < 2) return;
    setLoading(true);
    setError("");

    try {
      const eligibilityResponse = await fetch(
        "/api/eligibility/check",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programId: 1,
            streetAddress: form.address,
            city: "Atlanta",
            state: "GA",
            zipCode: form.zip,
            householdSize: Number(form.householdSize),
            hasK12Student: form.hasK12Student === "yes",
            receivesQualifyingAssistance: form.benefits.length > 0,
            assistancePrograms: form.benefits,
          }),
        }
      );

      if (!eligibilityResponse.ok) {
        throw new Error("Could not check eligibility.");
      }

      const eligibilityData = await eligibilityResponse.json();

      // Availability is separate from program eligibility.
      let availabilityData = {
        status: "UNKNOWN",
        explanation: "Address availability has not been verified.",
      };

      try {
        const availabilityResponse = await fetch(
          "/api/availability/check",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              streetAddress: form.address,
              city: "Atlanta",
              state: "GA",
              zipCode: form.zip,
            }),
          }
        );

        if (availabilityResponse.ok) {
          availabilityData = await availabilityResponse.json();
        }
      } catch {
        // Eligibility can still be shown if availability fails.
      }

      setFormData(form);
      setEligibilityResult(eligibilityData);
      setAvailabilityResult(availabilityData);
      setSelectedPlan(null);
      navigate("/results");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const valid = [
    form.address.trim() !== "" && /^[0-9]{5}$/.test(form.zip),
    form.income !== "" && form.hasK12Student !== "",
    true,
  ][step];
  const TITLES = ["Where do you live?", "Tell us about your household", "Benefits and language"];

  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <p className="mb-1 text-muted">Step {step + 1} of 3</p>
      <div className="progress-track mb-4" role="progressbar" aria-valuemin={0} aria-valuemax={3} aria-valuenow={step + 1}>
        <div className="progress-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      <form className="wizard page-enter" key={step} onSubmit={handleSubmit}>
        <h2 className="mb-4">{TITLES[step]}</h2>

        {step === 0 && (
          <>
            <label className="form-label fw-semibold" htmlFor="addr">Street address</label>
            <input id="addr" className="form-control big-input mb-3" autoFocus value={form.address}
              onChange={(e) => update("address", e.target.value)} placeholder="123 Peachtree St NE" />
            <label className="form-label fw-semibold" htmlFor="zip">ZIP code</label>
            <input id="zip" className="form-control big-input" inputMode="numeric" maxLength={5} value={form.zip}
              onChange={(e) => update("zip", e.target.value)} placeholder="30303" />
            {form.zip && !/^[0-9]{5}$/.test(form.zip) && (
              <div className="form-text">Please enter 5 digits.</div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <p className="fw-semibold mb-2">How many people live in your home?</p>
            <div className="stepper mb-4">
              <button type="button" className="btn btn-outline-primary" aria-label="One fewer person"
                onClick={() => update("householdSize", Math.max(1, form.householdSize - 1))}>−</button>
              <output aria-live="polite">{form.householdSize}</output>
              <button type="button" className="btn btn-outline-primary" aria-label="One more person"
                onClick={() => update("householdSize", Math.min(12, form.householdSize + 1))}>+</button>
            </div>

            <p className="fw-semibold mb-2">Is there a K–12 student in your home?</p>
            <div className="row g-2 mb-4">
              {[["yes", "Yes"], ["no", "No"]].map(([v, label]) => (
                <div className="col-6" key={v}>
                  <button type="button" className={`tile justify-content-center ${form.hasK12Student === v ? "on" : ""}`}
                    aria-pressed={form.hasK12Student === v} onClick={() => update("hasK12Student", v)}>{label}</button>
                </div>
              ))}
            </div>

            <label className="form-label fw-semibold" htmlFor="inc">Yearly household income</label>
            <select id="inc" className="form-select big-input" value={form.income}
              onChange={(e) => update("income", e.target.value)}>
              <option value="">Choose one...</option>
              {INCOME_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="form-text">
              Saved for future program matching. The current demo rule does not use it.
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="fw-semibold mb-2">Does anyone at home get any of these? (pick any, or none)</p>
            <div className="row g-2 mb-2">
              {BENEFITS.map((b) => {
                const on = form.benefits.includes(b);
                return (
                  <div className="col-sm-6" key={b}>
                    <button type="button" className={`tile ${on ? "on" : ""}`} aria-pressed={on} onClick={() => toggleBenefit(b)}>
                      <span className="box" aria-hidden="true">{on && "✓"}</span>{b}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="form-text mb-4">
              For this demo, any listed benefit counts as assistance. Official programs may differ.
            </div>

            <label className="form-label fw-semibold" htmlFor="lang">Language for results</label>
            <select id="lang" className="form-select" value={form.language}
              onChange={(e) => update("language", e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <div className="form-text">Spanish translations are not yet implemented.</div>
          </>
        )}

        {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}

        <div className="d-flex gap-2 mt-4">
          {step > 0 && (
            <button type="button" className="btn btn-outline-secondary btn-lg" onClick={() => setStep(step - 1)}>Back</button>
          )}
          {step < 2 ? (
            <button type="button" className="btn btn-primary btn-lg flex-grow-1" disabled={!valid}
              onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button type="submit" className="btn btn-primary btn-lg flex-grow-1" disabled={loading}>
              {loading ? "Checking..." : "See my options"}
            </button>
          )}
        </div>

        <p className="small text-muted mt-3 mb-0">
          Results are preliminary estimates based on demonstration rules, not official decisions.
        </p>
      </form>
    </div>
  );
}
