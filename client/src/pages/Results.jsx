
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
    if (!eligible) return;

    const plan = plans.find(
      (p) => getPlanId(p) === selectedId
    );

    if (!plan) return;

    setSelectedPlan(plan);
    navigate("/checklist");
  };

  const priced = sortedPlans.map(getPlanPrice).filter((v) => v !== null);
  const maxPrice = priced.length ? Math.max(...priced) : 0;
  const minPrice = priced.length ? Math.min(...priced) : 0;

  const availStatus = String(availabilityResult?.status ?? "UNKNOWN").toUpperCase();
  const availColor = availStatus.includes("UNAVAILABLE") || availStatus.includes("NOT")
    ? "#d97706" : availStatus === "UNKNOWN" ? "#6c757d" : "#198754";

  const tone = eligible ? "ok" : status === "INELIGIBLE" ? "no" : "maybe";
  const iconColor = { ok: "#198754", no: "#d97706", maybe: "#0aa2c0" }[tone];
  const iconMark = { ok: "M18 33l9 9 19-20", no: "M22 22l20 20M42 22L22 42", maybe: "M32 20v14M32 42v1" }[tone];
  const headline = eligible ? "Good news, you may qualify" : status === "INELIGIBLE" ? "You may not qualify right now" : "We need a little more info";

  const nodes = [
    ["Eligibility", iconColor, eligible ? "✓" : status === "INELIGIBLE" ? "!" : "?"],
    ["Address", availColor, availStatus === "UNKNOWN" ? "?" : availColor === "#198754" ? "✓" : "!"],
    ["Plan", selectedId !== null ? "#198754" : "#9db8e0", selectedId !== null ? "✓" : "3"],
  ];

  return (
    <div className="container py-5">
      <h2 className="fade-up">Your internet options</h2>
      <p className="text-muted fade-up" style={{ "--d": ".05s" }}>
        Preliminary results for {formData.address}, Atlanta, GA {formData.zip}.
      </p>

      <div className="journey" aria-label="Your progress">
        {nodes.map(([label, color, mark], i) => (
          <div key={label} className="d-contents" style={{ display: "contents" }}>
            <div className="node">
              <div className="dot pop" style={{ background: color, animationDelay: `${i * 0.2}s` }}>{mark}</div>
              {label}
            </div>
            {i < nodes.length - 1 && <div className="line" />}
          </div>
        ))}
      </div>

      <div className={`status-card ${tone} fade-up mb-3`} style={{ "--d": ".1s" }}>
        <svg className="status-icon" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="29" fill="none" stroke={iconColor} strokeWidth="4" />
          <path d={iconMark} fill="none" stroke={iconColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="60" style={{ "--len": 60, animation: "draw .8s .3s ease both" }} />
        </svg>
        <div>
          <h4 className="mb-1">{headline}</h4>
          {eligibilityResult.reasons?.map((reason, i) => (
            <p key={i} className="mb-1">{reason}</p>
          ))}
          {eligibilityResult.missingInformation?.length > 0 && (
            <p className="mb-1">Still needed: {eligibilityResult.missingInformation.join(", ")}</p>
          )}
          <small className="text-muted">
            Based on the simplified Cox Connect2Compete demo rule. Not an official eligibility determination.
          </small>
        </div>
      </div>

      <div className="step-card mb-4 fade-up" style={{ "--d": ".2s", borderLeft: `6px solid ${availColor}` }}>
        <strong>Address availability: </strong>{availabilityResult?.status ?? "UNKNOWN"}
        <p className="mb-0 mt-1 text-muted">
          {availabilityResult?.explanation ?? "Provider coverage has not been verified."}
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <h4>Internet plans in our database</h4>
          <p className="small text-muted">
            These are catalog listings, not confirmed offers at your address. Prices do not include assumed subsidies or discounts.
          </p>

          {loading && <p>Loading plans...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && plans.length === 0 && <p>No plans are currently listed.</p>}

          {!eligible && (
            <div className="alert alert-info">
              {status === "NEEDS_MORE_INFO"
                ? "We need additional information before recommending a plan."
                : "You do not currently qualify for the affordable internet programs evaluated by ConnectATL."}
            </div>
          )}

          {eligible && sortedPlans.map((plan, i) => {
            const id = getPlanId(plan);
            const price = getPlanPrice(plan);
            const isSelected = id === selectedId;
            const pct = price !== null && maxPrice > 0 ? Math.max(8, (price / maxPrice) * 100) : 0;

            return (
              <div key={id} className={`card plan-card mb-3 fade-up ${isSelected ? "best border-primary" : ""}`}
                style={{ "--d": `${0.08 * i}s`, borderRadius: 16 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <h5 className="mb-1">
                        {getPlanName(plan)}
                        {price !== null && price === minPrice && priced.length > 1 && (
                          <span className="badge text-bg-success ms-2">Lowest price</span>
                        )}
                      </h5>
                      {plan.description && <p className="text-muted small mb-2">{plan.description}</p>}
                      <span className="badge text-bg-secondary">Availability unverified</span>
                    </div>
                    <div className="text-end">
                      {price !== null ? (
                        <>
                          <div className="fs-4 fw-bold">${price.toFixed(2)}/mo</div>
                          <div className="small text-muted">about ${(price * 12).toFixed(0)} a year</div>
                        </>
                      ) : <span>Price not listed</span>}
                    </div>
                  </div>

                  {price !== null && (
                    <div className="bar-track mt-3" aria-hidden="true">
                      <div className={`bar-fill ${price === minPrice ? "cheap" : ""}`} style={{ "--w": `${pct}%` }} />
                    </div>
                  )}

                  <button type="button" className={`btn btn-sm mt-3 ${isSelected ? "btn-primary" : "btn-outline-primary"}`}
                    aria-pressed={isSelected} onClick={() => choose(plan)}>
                    {isSelected ? "Selected ✓" : "Select plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-lg-4">
          <div className="step-card" style={{ position: "sticky", top: 16 }}>
            <h5>What this means</h5>
            <p>
              {eligible
                ? "Your answers satisfy the current demonstration eligibility rule."
                : status === "INELIGIBLE"
                  ? "Your answers do not satisfy the current demonstration eligibility rule."
                  : "More information is required to evaluate your eligibility."}
            </p>
            <p className="small text-muted">Eligibility does not guarantee that a provider serves your address.</p>

            <button type="button" className="btn btn-primary btn-lg w-100"
              disabled={!eligible || selectedId === null} onClick={goToChecklist}>
              Get my application checklist
            </button>
            {eligible && selectedId === null && (
              <p className="small text-muted mt-2 mb-0">Pick a plan to continue.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
