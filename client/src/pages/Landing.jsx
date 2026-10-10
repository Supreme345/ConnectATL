import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <>
      <section className="hero text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">Find affordable internet at your address</h1>
          <p className="lead my-4">
            Answer a few quick questions. We'll show the plans available where you live
            and the discounts you may qualify for, in English or Spanish.
          </p>
          <Link to="/check" className="btn btn-light btn-lg fw-semibold">Check my options</Link>
          <p className="small mt-3 mb-0 opacity-75">Takes about 2 minutes. No account needed.</p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row text-center g-4">
          {[
            ['1. Enter your address', 'We find the providers that serve your home.'],
            ['2. Answer a few questions', 'We check which discounts you may qualify for.'],
            ['3. Get your plan and checklist', 'See the cheapest options and print what you need to apply.'],
          ].map(([title, text]) => (
            <div className="col-md-4" key={title}>
              <h5>{title}</h5>
              <p className="text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}