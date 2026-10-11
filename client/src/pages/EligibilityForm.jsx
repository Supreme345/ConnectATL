
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EligibilityForm.css";

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

  const [step, setStep] = useState(1);
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

  function update(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function toggleBenefit(benefit) {
    setForm((previous) => ({
      ...previous,
      benefits: previous.benefits.includes(benefit)
        ? previous.benefits.filter((item) => item !== benefit)
        : [...previous.benefits, benefit],
    }));
  }

  function nextStep() {
    console.log("NEXT clicked, current step:", step);
    setError("");

    if (step === 1) {
      if (!form.address.trim()) {
        setError("Please enter your street address.");
        return;
      }

      if (!/^\d{5}$/.test(form.zip)) {
        setError("Please enter a valid five-digit ZIP code.");
        return;
      }
    }

    if (step === 2) {
      const size = Number(form.householdSize);

      if (!Number.isInteger(size) || size < 1 || size > 12) {
        setError("Household size must be between 1 and 12.");
        return;
      }

      if (!form.income) {
        setError("Please select an income range.");
        return;
      }

      if (!["yes", "no"].includes(form.hasK12Student)) {
        setError("Please answer the K–12 student question.");
        return;
      }
    }

    setStep((current) => Math.min(current + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("FORM SUBMITTED, current step:", step);
    if (step !== 3 || loading) return;

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
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="elig-page">
      <div className="elig-container">
        <div className="elig-progress">
          <div className="elig-progress-label">
            <span>Step {step} of 3</span>
            <span>
              {step === 1
                ? "Your location"
                : step === 2
                ? "Your household"
                : "Final step"}
            </span>
          </div>

          <div
            className="elig-progress-track"
            role="progressbar"
            aria-label="Form progress"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={step}
          >
            <div
              className="elig-progress-fill"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <form
          className="elig-card"
          onSubmit={handleSubmit}
          noValidate
        >
          {step === 1 && (
            <section className="elig-step">
              <div className="elig-step-tag">GETTING STARTED</div>
              <h1>Where do you live?</h1>
              <p className="elig-description">
                Enter your address to begin exploring affordable
                internet options in your area.
              </p>

              <div className="elig-field">
                <label htmlFor="elig-address">Street address</label>
                <input
                  id="elig-address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="123 Peachtree St NE"
                  value={form.address}
                  onChange={(event) =>
                    update("address", event.target.value)
                  }
                />
              </div>

              <div className="elig-field">
                <label htmlFor="elig-zip">ZIP code</label>
                <input
                  id="elig-zip"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  placeholder="30303"
                  value={form.zip}
                  onChange={(event) =>
                    update(
                      "zip",
                      event.target.value.replace(/\D/g, "")
                    )
                  }
                />
              </div>

              <div className="elig-info-box">
                <span aria-hidden="true">ⓘ</span>
                <p>
                  Your address helps us identify your area.
                  Exact internet service availability must
                  be confirmed with the provider.
                </p>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="elig-step">
              <div className="elig-step-tag">ABOUT YOUR HOME</div>
              <h1>Household information</h1>
              <p className="elig-description">
                Tell us a little more about your household.
              </p>

              <div className="elig-field">
                <label htmlFor="elig-household-size">
                  How many people live in your household?
                </label>
                <input
                  id="elig-household-size"
                  type="number"
                  min="1"
                  max="12"
                  value={form.householdSize}
                  onChange={(event) =>
                    update(
                      "householdSize",
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value)
                    )
                  }
                />
              </div>

              <div className="elig-field">
                <label htmlFor="elig-income">
                  What is your annual household income
                  (before taxes)?
                </label>
                <select
                  id="elig-income"
                  value={form.income}
                  onChange={(event) =>
                    update("income", event.target.value)
                  }
                >
                  <option value="">Choose an income range</option>
                  {INCOME_RANGES.map((range) => (
                    <option value={range} key={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="elig-field elig-fieldset">
                <legend>
                  Does your household have a K–12 student?
                </legend>
                <p className="elig-field-hint">
                  Include any child enrolled in kindergarten
                  through 12th grade.
                </p>

                <div className="elig-choice-grid">
                  {[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ].map((choice) => (
                    <label
                      key={choice.value}
                      className={`elig-choice ${
                        form.hasK12Student === choice.value
                          ? "is-selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="elig-k12"
                        value={choice.value}
                        checked={
                          form.hasK12Student === choice.value
                        }
                        onChange={() =>
                          update("hasK12Student", choice.value)
                        }
                      />
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="elig-info-box">
                <span aria-hidden="true">ⓘ</span>
                <p>
                  K–12 student status helps determine preliminary
                  eligibility. Income and household size are
                  collected for future program matching.
                </p>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="elig-step">
              <div className="elig-step-tag">ALMOST FINISHED</div>
              <h1>Benefits and language</h1>
              <p className="elig-description">
                Does anyone at home receive any of these
                benefits? Select all that apply, or none.
              </p>

              <div className="elig-benefit-grid">
                {BENEFITS.map((benefit) => (
                  <label
                    key={benefit}
                    className={`elig-benefit ${
                      form.benefits.includes(benefit)
                        ? "is-selected"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.benefits.includes(benefit)}
                      onChange={() => toggleBenefit(benefit)}
                    />
                    <span>{benefit}</span>
                  </label>
                ))}
              </div>

              <p className="elig-field-hint elig-benefit-note">
                For this simplified demonstration, selecting
                any listed benefit counts as assistance.
                Official programs may have different requirements.
              </p>

              <div className="elig-field">
                <label htmlFor="elig-language">
                  Language for results
                </label>
                <select
                  id="elig-language"
                  value={form.language}
                  onChange={(event) =>
                    update("language", event.target.value)
                  }
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
                <p className="elig-field-hint">
                  Spanish translations for the results page
                  are not yet implemented.
                </p>
              </div>
            </section>
          )}

          {error && (
            <div className="elig-error" role="alert">
              {error}
            </div>
          )}

          <div className="elig-actions">
            {step > 1 && (
              <button
                type="button"
                className="elig-back-button"
                onClick={previousStep}
                disabled={loading}
              >
                Back
              </button>
            )}

            {step < 3 && (
              <button
                key="next-button"
                type="button"
                className="elig-next-button"
                onClick={nextStep}
              >
                Next <span aria-hidden="true">→</span>
              </button>
            )}

            {step === 3 && (
              <button
                key="submit-button"
                type="submit"
                className="elig-next-button"
                disabled={loading}
              >
                {loading ? "Checking..." : "See my options"}
              </button>
            )}
          </div>

          <p className="elig-disclaimer">
            Results are preliminary estimates based on
            demonstration rules, not official eligibility decisions.
          </p>
        </form>
      </div>
    </main>
  );
}

