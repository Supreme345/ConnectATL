
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Results({
  formData,
  eligibilityResult,
  availabilityResult,
  selectedPlan,
  setSelectedPlan,
}) {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(
    selectedPlan?.planId ?? selectedPlan?.id ?? null
  );

  useEffect(() => {
    let active = true;

    async function loadPlans() {
      try {
        const response = await fetch("/api/plans");

        if (!response.ok) {
          throw new Error("Could not load internet plans.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected plans response.");
        }

        if (active) setPlans(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPlans();

    return () => {
      active = false;
    };
  }, []);

  if (!formData || !eligibilityResult) {
    return <Navigate to="/check" replace />;
  }

  const status = eligibilityResult.status;
  const eligible = status === "ELIGIBLE";

  const statusClass =
    status === "ELIGIBLE"
      ? "alert-success"
      : status === "INELIGIBLE"
        ? "alert-warning"
        : "alert-info";

  const getPlanId = (plan) => plan.planId ?? plan.id;

  const getPlanName = (plan) =>
    plan.planName ?? plan.name ?? "Internet plan";

  const getPlanPrice = (plan) => {
    const value =
      plan.monthlyPrice ??
      plan.priceMonthly ??
      plan.baseMonthlyPrice ??
      plan.price ??
      null;

    if (value === null || value === "") return null;

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };

  const sortedPlans = [...plans].sort((a, b) => {
    const aPrice = getPlanPrice(a);
    const bPrice = getPlanPrice(b);

    if (aPrice === null) return 1;
    if (bPrice === null) return -1;

    return aPrice - bPrice;
  });

  const choose = (plan) => {
    setSelectedId(getPlanId(plan));
    setSelectedPlan(plan);
  };

  const goToChecklist = () => {
    const plan = plans.find(
      (p) => getPlanId(p) === selectedId
    );

    if (!plan) return;

    setSelectedPlan(plan);
    navigate("/checklist");
  };

  return (
    <div className="container py-5">
      <h2>Your internet options</h2>
      <p className="text-muted">
        Preliminary results for {formData.address},
        Atlanta, GA {formData.zip}.
      </p>

      <div className={`alert ${statusClass}`}>
        <h4 className="alert-heading">
          Eligibility: {status.replaceAll("_", " ")}
        </h4>

        {eligibilityResult.reasons?.map((reason, i) => (
          <p key={i} className="mb-1">
            {reason}
          </p>
        ))}

        {eligibilityResult.missingInformation?.length > 0 && (
          <p className="mt-2">
            Additional information needed:{" "}
            {eligibilityResult.missingInformation.join(", ")}
          </p>
        )}

        <small>
          Based on the simplified Cox Connect2Compete demo rule.
          This is not an official eligibility determination.
        </small>
      </div>

      <div className="alert alert-secondary">
        <strong>Address availability: </strong>
        {availabilityResult?.status ?? "UNKNOWN"}
        <p className="mb-0 mt-2">
          {availabilityResult?.explanation ??
            "Provider coverage has not been verified."}
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <h4>Internet plans in our database</h4>

          <p className="small text-muted">
            These are catalog listings, not confirmed offers
            at your address. Prices do not include assumed
            subsidies or discounts.
          </p>

          {loading && <p>Loading plans...</p>}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {!loading && !error && plans.length === 0 && (
            <p>No plans are currently listed.</p>
          )}

          {sortedPlans.map((plan) => {
            const id = getPlanId(plan);
            const price = getPlanPrice(plan);
            const isSelected = id === selectedId;

            return (
              <div
                key={id}
                className={`card plan-card mb-3 ${
                  isSelected ? "best border-primary" : ""
                }`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <h5>{getPlanName(plan)}</h5>
                      

                      {plan.description && (
                        <p className="text-muted small">
                          {plan.description}
                        </p>
                      )}

                      <span className="badge text-bg-secondary">
                        Availability unverified
                      </span>
                    </div>

                    <div className="text-end">
                      {price !== null ? (
                        <div className="fs-4 fw-bold">
                          ${price.toFixed(2)}/mo
                        </div>
                      ) : (
                        <span>Price not listed</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`btn btn-sm mt-3 ${
                      isSelected
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => choose(plan)}
                  >
                    {isSelected ? "Selected" : "Select plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5>What this means</h5>

              {eligible ? (
                <p>
                  Your answers satisfy the current demonstration
                  eligibility rule.
                </p>
              ) : status === "INELIGIBLE" ? (
                <p>
                  Your answers do not satisfy the current
                  demonstration eligibility rule.
                </p>
              ) : (
                <p>
                  More information is required to evaluate
                  your eligibility.
                </p>
              )}

              <p className="small text-muted">
                Eligibility does not guarantee that a provider
                serves your address.
              </p>

              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={selectedId === null}
                onClick={goToChecklist}
              >
                Get my application checklist
              </button>

              {selectedId === null && (
                <p className="small text-muted mt-2">
                  Select a plan to continue.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
