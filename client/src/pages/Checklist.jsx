
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";

const COX_APPLICATION_URL =
  "https://www.cox.com/residential/internet/connect2compete.html";

export default function Checklist({
  formData,
  selectedPlan,
  eligibilityResult,
}) {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function askAssistant(event) {
    event.preventDefault();

    if (!question.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("The AI assistant is temporarily unavailable.");
      }

      const data = await response.json();
      setAnswer(data.answer || "No answer was returned.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

      {/* Gemini AI Assistant */}
      <div className="card shadow-sm mb-4 d-print-none">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h4 className="mb-0">AI Application Assistant</h4>
            <span className="badge bg-primary">Powered by Gemini</span>
          </div>

          <p className="text-muted small">
            Have questions about eligibility or applying?
            Ask our AI assistant in English or Spanish.
          </p>

          <form onSubmit={askAssistant}>
            <label
              htmlFor="assistant-language"
              className="form-label fw-semibold"
            >
              Response language
            </label>

            <select
              id="assistant-language"
              className="form-select mb-3"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="English">English</option>
              <option value="Spanish">Español</option>
            </select>

            <label
              htmlFor="assistant-question"
              className="form-label fw-semibold"
            >
              Your question
            </label>

            <textarea
              id="assistant-question"
              className="form-control mb-3"
              rows={3}
              maxLength={1000}
              placeholder="What documents might I need to apply?"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              required
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !question.trim()}
            >
              {loading ? "Generating answer..." : "Ask assistant"}
            </button>
          </form>

          {loading && (
            <div className="mt-3 text-muted" role="status">
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
              Gemini is preparing your answer...
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}

          {answer && (
            <div className="alert alert-light border mt-3 mb-0">
              <h6 className="fw-bold">Assistant response</h6>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {answer}
              </div>
              <p className="small text-muted mt-3 mb-0">
                AI-generated guidance may be inaccurate.
                Confirm requirements with the provider.
              </p>
            </div>
          )}
        </div>
      </div>

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
