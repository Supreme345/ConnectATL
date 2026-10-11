
import { Link } from "react-router-dom";
import BroadbandMap from "../components/BroadbandMap";

const steps = [
  {
    number: "01",
    title: "Enter your address",
    description: "Tell us where you are looking for internet service.",
    icon: "location",
  },
  {
    number: "02",
    title: "Answer a few questions",
    description: "Check your household against our demo eligibility rules.",
    icon: "document",
  },
  {
    number: "03",
    title: "Explore plans and next steps",
    description: "Review program information and prepare to apply.",
    icon: "wifi",
  },
];

function StepIcon({ type }) {
  if (type === "location") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (type === "document") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h9l4 4v16H6z" />
        <path d="M15 2v5h4M9 12h7M9 16h7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8a16 16 0 0 1 20 0" />
      <path d="M5 12a11 11 0 0 1 14 0" />
      <path d="M8.5 16a6 6 0 0 1 7 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Landing() {
  return (
    <main className="landing-page">
      <section className="atl-hero">
        <div className="atl-hero-overlay" />

        <div className="atl-hero-content container">
          <div className="atl-hero-eyebrow">
            CONNECTING ATLANTA
          </div>

          <h1>
            Find <span>affordable</span> internet
            <br className="d-none d-md-block" />
            {" "}at your address
          </h1>

          <p>
            Answer a few quick questions to explore affordable
            internet programs and check preliminary eligibility.
          </p>

          <Link to="/check" className="atl-primary-button">
            Check my options
            <span aria-hidden="true">→</span>
          </Link>

          <div className="atl-hero-note">
            Takes about 2 minutes. No account needed.
          </div>
        </div>
      </section>

      <section className="atl-steps-section">
        <div className="container">
          <div className="row g-4 atl-steps-row">
            {steps.map((step) => (
              <div className="col-lg-4" key={step.number}>
                <div className="atl-step-card">
                  <div className="atl-step-icon">
                    <StepIcon type={step.icon} />
                  </div>

                  <div className="atl-step-content">
                    <div className="atl-step-number">
                      STEP {step.number}
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="atl-map-section" id="explore">
        <div className="container">
          <div className="atl-section-heading">
            <div className="atl-section-eyebrow">
              EXPLORE THE DATA
            </div>

            <h2>Explore broadband options in Atlanta</h2>

            <p>
              Click the highlighted area to compare reported
              providers, technologies, and maximum speeds.
            </p>
          </div>

          <div id="map-container">
            <BroadbandMap />
          </div>
        </div>
      </section>
    </main>
  );
}

