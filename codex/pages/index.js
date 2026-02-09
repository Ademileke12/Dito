import Head from "next/head";
import { useMemo, useState } from "react";

const modules = [
  {
    id: "m1",
    short: "M1 Vision",
    title: "Module 1: The CodeXero Vision – Decentralization for All",
    objective: "Understand why CodeXero exists and the problem it solves in the current Web3 landscape.",
    problem:
      "Traditional Web3 development requires mastery of complex languages like Solidity or Rust, creating a technical gatekeeper effect.",
    benefit:
      "CodeXero removes the coding barrier, allowing creators, entrepreneurs, and visionaries to build directly on the blockchain.",
    start: "Follow CodeXero on X (@CodeXero_xyz) to understand their daily mission and join the community discussions."
  },
  {
    id: "m2",
    short: "M2 No-Code",
    title: "Module 2: The No-Code Revolution",
    objective: "Learn the mechanics of visual programming for the blockchain.",
    problem:
      "Instead of writing lines of code, you use visual blocks and logic flows to define how your application behaves.",
    benefit:
      "Significant reduction in development time—what used to take months now takes days.",
    start:
      "Familiarize yourself with drag-and-drop logic by exploring the CodeXero dashboard or watching their interface walkthroughs."
  },
  {
    id: "m3",
    short: "M3 Architecture",
    title: "Module 3: Architecture of a dApp",
    objective: "Identify the core components of a decentralized application built on CodeXero.",
    problem:
      "Frontend, smart contracts, and the blockchain database must connect seamlessly for users to trust your app.",
    benefit:
      "CodeXero handles the middleware—the glue that connects your UI to the blockchain—automatically.",
    start:
      "Map out your dApp idea on paper: what is the user's first action, and what happens to their data on-chain?"
  },
  {
    id: "m4",
    short: "M4 Templates",
    title: "Module 4: Smart Contracts without Solidity",
    objective: "Deploy functional on-chain logic using pre-verified templates.",
    problem:
      "Writing and auditing smart contracts can stall teams before launch.",
    benefit:
      "You get the security of professional-grade code without writing a single line of Solidity.",
    start:
      "Select a contract template from the CodeXero library that matches your project needs, like an NFT collection or DAO."
  },
  {
    id: "m5",
    short: "M5 Wallets",
    title: "Module 5: Wallet Integration & User Experience",
    objective: "Learn how to onboard users into your dApp seamlessly.",
    problem:
      "Wallet onboarding can be confusing and introduces friction in the first user journey.",
    benefit:
      "CodeXero simplifies the connect wallet flow, making it as easy as a login with Google button.",
    start:
      "Use the CodeXero UI editor to place a connection button and configure supported networks."
  },
  {
    id: "m6",
    short: "M6 Security",
    title: "Module 6: Security and Auditing Basics",
    objective: "Ensure your no-code dApp is safe for public use.",
    problem:
      "Human error bugs in smart contract code can lead to catastrophic losses.",
    benefit:
      "Standardized templates reduce fat-finger errors and harden your app by default.",
    start:
      "Always test your dApp on a testnet like Goerli or Sepolia before moving to mainnet."
  },
  {
    id: "m7",
    short: "M7 Cluster Protocol",
    title: "Module 7: The Cluster Protocol Connection",
    objective: "Understand how CodeXero leverages infrastructure for scalability.",
    problem:
      "Heavy data or AI tasks can overwhelm basic Web3 infrastructure.",
    benefit:
      "Your dApp can tap into high-performance decentralized computing power.",
    start:
      "Research Cluster Protocol to see how decentralized AI and infrastructure can enhance your project."
  },
  {
    id: "m8",
    short: "M8 Tokenomics",
    title: "Module 8: Monetization & Tokenomics",
    objective: "Design the economy of your application.",
    problem:
      "Token flows and pricing models often require dedicated finance and backend teams.",
    benefit:
      "You can build revenue-generating products immediately without needing a finance or backend team.",
    start:
      "Define your token flow—will users pay in SOL, ETH, or your own custom token?"
  },
  {
    id: "m9",
    short: "M9 DAOs",
    title: "Module 9: Community & Governance (DAOs)",
    objective: "Transition from a single creator to a community-led project.",
    problem:
      "Centralized control slows momentum and limits community ownership.",
    benefit:
      "Automated voting and treasury management mean your community can lead the project's future.",
    start:
      "Explore Governance modules in CodeXero to set up a treasury and voting system."
  },
  {
    id: "m10",
    short: "M10 Mainnet",
    title: "Module 10: Scaling from MVP to Mainnet",
    objective: "Finalize the steps to launching a professional Web3 product.",
    problem:
      "Moving from MVP to production can overwhelm small teams.",
    benefit:
      "CodeXero infrastructure is built to scale as your user base grows.",
    start:
      "Perform a final beta test, gather feedback, and hit deploy to mainnet."
  }
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = modules[activeIndex];
  const next = useMemo(() => modules[(activeIndex + 1) % modules.length], [activeIndex]);

  return (
    <>
      <Head>
        <title>CodeXero Academy — Dual Mode Learning Path</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="page">
        <nav className="navbar" aria-label="Primary">
          <div className="brand" aria-label="CodeXero Academy">
            CodeXero <span>Academy</span>
          </div>
          <div className="nav-links" role="navigation">
            <a href="#path">Path</a>
            <a href="#modules">Modules</a>
            <a href="#community">Community</a>
          </div>
          <div className="nav-actions">
            <button
              className="toggle"
              type="button"
              aria-pressed="true"
              aria-label="Dual mode split view is active"
            >
              <span aria-hidden="true">☾</span>
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
              <span aria-hidden="true">☀</span>
            </button>
            <button className="btn-primary" type="button">
              Connect Wallet
            </button>
          </div>
        </nav>

        <section className="hero" id="path">
          <h1>CodeXero Learning Path</h1>
          <p>
            From Web3 Enthusiast to Confident dApp Architect using the No-Code Ecosystem.
          </p>
          <div className="progress">
            <div className="progress-label">0% Complete — 10 Modules defined</div>
            <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
              <span />
            </div>
          </div>
        </section>

        <section className="content" id="modules">
          <div className="carousel" aria-live="polite">
            <div className="active-card" role="region" aria-label="Active module">
              <div className="card-left">
                <div className="card-title">{active.title}</div>
                <div className="problem">
                  <p>
                    <strong>The Problem:</strong> {active.problem}
                  </p>
                </div>
                <p>{active.objective}</p>
                <button className="cta" type="button">
                  Start Mission &amp; Join X Community
                </button>
              </div>
              <div className="card-right">
                <div className="card-title light-text">{active.title}</div>
                <div className="benefit">
                  <p>
                    <strong>The Benefit:</strong> {active.benefit}
                  </p>
                </div>
                <p>{active.start}</p>
              </div>
            </div>

            <div className="peek" aria-label="Next module preview">
              <div className="peek-title">{next.title}</div>
              <p className="peek-copy">Visual logic flows, triggers, and wallet-ready templates.</p>
              <div className="peek-blocks" aria-hidden="true">
                <span className="block" style={{ width: "80%" }} />
                <span className="block" style={{ width: "65%" }} />
                <span className="block" style={{ width: "90%" }} />
                <span className="block" style={{ width: "55%" }} />
              </div>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setActiveIndex((value) => (value + 1) % modules.length)}
              >
                Next Module
              </button>
            </div>
          </div>

          <div className="dock" aria-label="Module navigation">
            <div className="dock-line" aria-hidden="true" />
            <div className="nodes">
              {modules.map((module, index) => (
                <button
                  key={module.id}
                  type="button"
                  className={`node ${index === activeIndex ? "active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={index === activeIndex}
                >
                  <span className="dot" aria-hidden="true" />
                  <span>{module.short}</span>
                </button>
              ))}
            </div>
            <div className="split-labels">
              <span>Dark Mode</span>
              <span>Light Mode</span>
            </div>
          </div>
        </section>

        <section className="modules-list" id="community">
          <h2>Welcome to the CodeXero Learning Path</h2>
          <p>
            This series is designed to take you from a Web3 enthusiast to a confident decentralized
            application (dApp) architect using the CodeXero no-code ecosystem.
          </p>
          <div className="module-grid">
            {modules.map((module, index) => (
              <article className="module-card" key={`${module.id}-full`}>
                <header>
                  <span className="module-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{module.title}</h3>
                </header>
                <p className="module-label">Objective</p>
                <p>{module.objective}</p>
                <p className="module-label">Key Points</p>
                <p>{module.problem}</p>
                <p>{module.benefit}</p>
                <p className="module-label">How to Get Started</p>
                <p>{module.start}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div>
            <h4>CodeXero Academy</h4>
            <p>Advanced no-code Web3 education for senior builders and visionary founders.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#path">Learning Path</a>
            <a href="#modules">Modules</a>
            <a href="#community">Community</a>
          </div>
          <div>
            <h4>Stay Connected</h4>
            <button className="ghost-button" type="button">Join Newsletter</button>
            <button className="ghost-button" type="button">Open Discord</button>
          </div>
        </footer>
      </main>
    </>
  );
}
