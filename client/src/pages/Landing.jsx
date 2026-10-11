import { Link } from "react-router-dom";

const STEPS = [
  ["1", "Enter your address", "Tell us where you want internet service."],
  ["2", "Answer a few questions", "Three short screens about your household."],
  ["3", "See your options", "Get plans and a simple checklist to apply."],
];

const NEED = ["Your street address", "How many people live with you", "Any benefits you receive (like SNAP)"];

export default function Landing() {
  return (
    <>
      <section className="hero text-center">
        <span className="ring" /><span className="ring" /><span className="ring" />
        <div className="container">
          <h1 className="display-5 fw-bold fade-up">
            Find affordable internet at your address
          </h1>
          <p className="lead my-4 fade-up" style={{ "--d": ".15s" }}>
            Answer a few easy questions and see which programs you may qualify for.
          </p>
          <div className="fade-up" style={{ "--d": ".3s" }}>
            <Link to="/check" className="btn btn-light btn-lg fw-semibold px-5">
              Check my options
            </Link>
            <p className="small mt-3 mb-0 opacity-75">
              Takes about 2 minutes. No account needed.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {STEPS.map(([n, title, text], i) => (
            <div className="col-md-4 fade-up" key={n} style={{ "--d": `${0.1 * i}s` }}>
              <div className="step-card text-center">
                <div className="step-num">{n}</div>
                <h5>{title}</h5>
                <p className="text-muted mb-0">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <div className="step-card" style={{ background: "var(--soft)" }}>
          <h5 className="mb-3">Have these ready</h5>
          <div className="row g-2">
            {NEED.map((item) => (
              <div className="col-md-4" key={item}>
                <span className="text-success fw-bold me-2" aria-hidden="true">✓</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <h3 className="text-center mb-2">Internet access gaps across Atlanta</h3>
        <p className="text-center text-muted mb-4">
          Explore broadband access and affordability across Atlanta neighborhoods.
        </p>
        <div
          id="map-container"
          className="map-placeholder d-flex flex-column align-items-center justify-content-center text-center"
          style={{ minHeight: 320 }}
        >
          <h5>Atlanta Broadband Access Map</h5>
          <p className="text-muted px-3">
            Geographic visualization coming next. FCC coverage and
            neighborhood-level data have not yet been connected.
          </p>
        </div>
      </section>
    </>
  );
}
