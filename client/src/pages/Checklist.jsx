
import { Navigate, Link } from "react-router-dom";

const COX_APPLICATION_URL =
  "https://www.cox.com/residential/internet/connect2compete.html";

export default function Checklist({
  formData,
  selectedPlan,
  eligibilityResult,
}) {
  if (!formData || !eligibilityResult) {
    return <Navigate to="/check" replace />;
  }

  if (!selectedPlan) {
    return <Navigate to="/results" replace />;
  }

  const planName =
    selectedPlan.planName ??
    selectedPlan.name ??
    "Selected internet plan";

  const steps = [
    "Review the program's official eligibility requirements.",
    "Confirm that the internet provider serves your address.",
    "Gather identification and proof of your address if requested.",
    "Gather documentation supporting your household's eligibility if requested.",
    "Visit the provider's official application page.",
    "Confirm the final price and complete the provider's application.",
  ];

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2>Your application checklist</h2>

      <p className="text-muted">
        Household: {formData.address}, Atlanta, GA {formData.zip}
      </p>

      <div className="card mb-4">
        <div className="card-body">
          <h5>Selected plan</h5>
          <p className="fw-semibold mb-2">{planName}</p>

          <p className="mb-1">
            Demo eligibility result:{" "}
            <strong>{eligibilityResult.status}</strong>
          </p>

          <p className="small text-muted mb-0">
            Eligibility and address availability require official
            confirmation before enrollment.
          </p>
        </div>
      </div>

      <h4>Next steps</h4>

      <ul className="list-group mb-4">
        {steps.map((step) => (
          <li
            key={step}
            className="list-group-item d-flex gap-3"
          >
            <input
              type="checkbox"
              className="form-check-input"
              aria-label={step}
            />
            <span>{step}</span>
          </li>
        ))}
      </ul>

      <p className="small text-muted">
        This is a general preparation checklist, not an official
        provider document. Requirements may differ by program.
      </p>

      <div className="d-flex gap-2 flex-wrap d-print-none">
        <a
          className="btn btn-primary"
          href={COX_APPLICATION_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Cox program requirements
        </a>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>

        <Link to="/results" className="btn btn-outline-secondary">
          Back to results
        </Link>
      </div>
    </div>
  );
}
