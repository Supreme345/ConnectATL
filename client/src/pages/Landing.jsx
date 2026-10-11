import BroadbandMap from "../components/BroadbandMap";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">
            Find affordable internet at your address
          </h1>

          <p className="lead my-4">
            Answer a few quick questions to explore affordable
            internet programs and check preliminary eligibility.
          </p>

          <Link
            to="/check"
            className="btn btn-light btn-lg fw-semibold"
          >
            Check my options
          </Link>

          <p className="small mt-3 mb-0 opacity-75">
            Takes about 2 minutes. No account needed.
          </p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row text-center g-4">
          {[
            [
              "1. Enter your address",
              "Tell us where you are looking for internet service.",
            ],
            [
              "2. Answer a few questions",
              "Check your household against our demo eligibility rules.",
            ],
            [
              "3. Explore plans and next steps",
              "Review program information and prepare to apply.",
            ],
          ].map(([title, description]) => (
            <div className="col-md-4" key={title}>
              <h5>{title}</h5>
              <p className="text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <h3 className="text-center mb-2">
          Internet access gaps across Atlanta
        </h3>

        <p className="text-center text-muted mb-4">
          Explore broadband access and affordability across
          Atlanta neighborhoods.
        </p>

        
        <div id="map-container">
          <BroadbandMap />
        </div>
      </section>
    </>
  );
}
