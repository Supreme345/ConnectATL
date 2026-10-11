
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
            onChange={(e) => update("address", e.target.value)}
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
              onChange={(e) => update("zip", e.target.value)}
              placeholder="30303"
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
              onChange={(e) =>
                update("householdSize", Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Yearly household income</label>
          <select
            className="form-select"
            required
            value={form.income}
            onChange={(e) => update("income", e.target.value)}
          >
            <option value="">Choose one...</option>
            {INCOME_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
          <div className="form-text">
            Income is collected for future program matching. The current
            demo eligibility rule does not use it.
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Does your household have a K–12 student?
          </label>
          <select
            className="form-select"
            required
            value={form.hasK12Student}
            onChange={(e) => update("hasK12Student", e.target.value)}
          >
            <option value="">Choose one...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">
            Does anyone in your household receive any of these benefits?
          </label>

          {BENEFITS.map((benefit) => (
            <div className="form-check" key={benefit}>
              <input
                className="form-check-input"
                type="checkbox"
                id={benefit}
                checked={form.benefits.includes(benefit)}
                onChange={() => toggleBenefit(benefit)}
              />
              <label className="form-check-label" htmlFor={benefit}>
                {benefit}
              </label>
            </div>
          ))}

          <div className="form-text">
            For this simplified demonstration, selecting any listed
            benefit counts as assistance. Official programs may have
            different requirements.
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Language for results</label>
          <select
            className="form-select"
            value={form.language}
            onChange={(e) => update("language", e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <div className="form-text">
            Spanish translations are not yet implemented.
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg w-100"
          disabled={loading}
        >
          {loading ? "Checking..." : "See my options"}
        </button>

        <p className="small text-muted mt-3">
          Results are preliminary estimates based on demonstration rules,
          not official eligibility decisions.
        </p>
      </form>
    </div>
  );
}
