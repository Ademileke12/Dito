export const MODULES = [
  {
    id: 1,
    title: "M1: The CodeXero Vision",
    subtitle: "Understand why CodeXero exists and the problem it solves.",
    problemLabel: "The Problem",
    problem: "Traditional Web3 development requires mastery of complex languages like Solidity or Rust, creating a \"technical gatekeeper\" effect.",
    benefit: "CodeXero removes the coding barrier, allowing creators, entrepreneurs, and visionaries to build directly on the blockchain.",
    action: "Follow CodeXero on X (@CodeXero_xyz) to understand their daily mission and join the community discussions.",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "What is the primary barrier to entry in traditional Web3 development?", options: ["High cost of hardware", "Lack of internet connection", "Complexity of languages like Solidity and Rust", "Not enough blockchains"], correctAnswer: 2 },
      { id: 2, text: "Who is the primary target audience for CodeXero?", options: ["Senior Rust Developers only", "Creators and Entrepreneurs without coding skills", "Bitcoin Miners", "Traditional Web2 server admins"], correctAnswer: 1 }
    ]
  },
  {
    id: 2,
    title: "M2: The No-Code Revolution",
    subtitle: "Learn the mechanics of \"visual programming\" for the blockchain.",
    problemLabel: "The Concept",
    problem: "Instead of writing lines of code, you use visual blocks and logic flows to define how your application behaves.",
    benefit: "Significant reduction in development time—what used to take months now takes days.",
    action: "Familiarize yourself with \"drag-and-drop\" logic by exploring the CodeXero dashboard (if available) or watching their interface walkthroughs.",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "How do you define application behavior in CodeXero?", options: ["Writing C++ code", "Using visual blocks and logic flows", "Hiring a developer", "Sending an email to support"], correctAnswer: 1 },
      { id: 2, text: "What is a major benefit of the no-code approach?", options: ["It makes the app slower", "It requires more servers", "Significant reduction in development time", "It costs more to deploy"], correctAnswer: 2 }
    ]
  },
  {
    id: 3,
    title: "M3: Architecture of a dApp",
    subtitle: "Identify the core components of a decentralized application.",
    problemLabel: "Components",
    problem: "Frontend (what users see), Smart Contracts (the logic), and the Blockchain (the database).",
    benefit: "CodeXero handles the \"middleware\"—the glue that connects your UI to the blockchain—automatically.",
    action: "Map out your dApp idea on paper: What is the user's first action? What happens to their data on the chain?",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "Which component represents the 'logic' of a dApp?", options: ["The Frontend", "The Smart Contracts", "The Graphics Card", "The Web Browser"], correctAnswer: 1 }
    ]
  },
  {
    id: 4,
    title: "M4: Smart Contracts without Solidity",
    subtitle: "Deploying functional on-chain logic using pre-verified templates.",
    problemLabel: "The Tool",
    problem: "CodeXero provides \"Lego blocks\" of smart contracts (e.g., minting, staking, or voting) that have already been audited.",
    benefit: "You get the security of professional-grade code without having to write a single line of Solidity.",
    action: "Select a \"Contract Template\" from the CodeXero library that matches your project needs (e.g., an NFT collection or a DAO).",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "How does CodeXero ensure smart contract security?", options: ["It doesn't", "By using pre-audited 'Lego block' templates", "By asking the user to check the code", "By running on a private server"], correctAnswer: 1 }
    ]
  },
  {
    id: 5,
    title: "M5: Wallet Integration & UX",
    subtitle: "Learning how to onboard users into your dApp seamlessly.",
    problemLabel: "The Use",
    problem: "Connecting wallets like MetaMask, Phantom, or Coinbase Wallet to your app.",
    benefit: "CodeXero simplifies the \"Connect Wallet\" flow, making it as easy as a \"Login with Google\" button.",
    action: "Use the CodeXero UI editor to place a connection button and configure which networks (Ethereum, Solana, etc.) you want to support.",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "What common Web2 feature is CodeXero's wallet connection compared to?", options: ["Blue Screen of Death", "Login with Google", "Captcha verification", "File upload"], correctAnswer: 1 }
    ]
  },
  {
    id: 6,
    title: "M6: Security and Auditing Basics",
    subtitle: "Ensuring your no-code dApp is safe for public use.",
    problemLabel: "The Use",
    problem: "Understanding how CodeXero minimizes \"Human Error\" bugs.",
    benefit: "Since you are using standardized templates, the risk of \"fat-finger\" coding errors that lead to hacks is greatly reduced.",
    action: "Always test your dApp on a Testnet (like Goerli or Sepolia) before moving to Mainnet to ensure the logic works as intended.",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "Where should you test your dApp before Mainnet?", options: ["On production immediately", "On a Testnet like Goerli or Sepolia", "Offline only", "On Bitcoin network"], correctAnswer: 1 }
    ]
  },
  {
    id: 7,
    title: "M7: The Cluster Protocol",
    subtitle: "Understanding how CodeXero leverages infrastructure for scalability.",
    problemLabel: "The Use",
    problem: "CodeXero often integrates with decentralized infrastructure like Cluster Protocol to handle heavy data or AI tasks.",
    benefit: "Your dApp isn't just a simple interface; it can tap into high-performance decentralized computing power.",
    action: "Research \"Cluster Protocol\" to see how decentralized AI and infrastructure can enhance your CodeXero project.",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "What is Cluster Protocol used for?", options: ["Sending emails", "Handling heavy data or AI tasks", "Generating logos", "Playing music"], correctAnswer: 1 }
    ]
  },
  {
    id: 8,
    title: "M8: Monetization & Tokenomics",
    subtitle: "Designing the economy of your application.",
    problemLabel: "The Use",
    problem: "Setting up transaction fees, token launches, or subscription models within your dApp.",
    benefit: "You can build revenue-generating products immediately without needing a finance or backend team.",
    action: "Define your \"Token Flow.\" Will users pay in SOL? ETH? Or your own custom token? Set these parameters in the CodeXero dashboard.",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "Which of these is a monetization method mentioned?", options: ["Selling user data", "Transaction fees or subscription models", "Display ads only", "Mining Bitcoin"], correctAnswer: 1 }
    ]
  },
  {
    id: 9,
    title: "M9: Community & Governance",
    subtitle: "Transitioning from a single creator to a community-led project.",
    problemLabel: "The Use",
    problem: "Using CodeXero to build Decentralized Autonomous Organizations (DAOs).",
    benefit: "Automated voting and treasury management mean your community can lead the project's future.",
    action: "Explore the \"Governance\" modules in CodeXero to set up a treasury where users can vote on how funds are spent.",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "What does DAO stand for?", options: ["Digital Asset Owner", "Decentralized Autonomous Organization", "Data Access Object", "Direct Administrative Order"], correctAnswer: 1 }
    ]
  },
  {
    id: 10,
    title: "M10: Scaling from MVP to Mainnet",
    subtitle: "The final steps to launching a professional Web3 product.",
    problemLabel: "The Use",
    problem: "Moving from a \"Minimum Viable Product\" (MVP) to a fully launched application.",
    benefit: "CodeXero’s infrastructure is built to scale; as your user base grows, the platform handles the increased traffic.",
    action: "Perform a final \"Beta Test\" with a small group of users, gather feedback, and hit \"Deploy to Mainnet.\"",
    progress: 0,
    locked: false,
    questions: [
      { id: 1, text: "What is the step before \"Deploy to Mainnet\"?", options: ["Beta Test with a small group", "Delete the codebase", "Change the project name", "Buy a new computer"], correctAnswer: 0 }
    ]
  }
];
