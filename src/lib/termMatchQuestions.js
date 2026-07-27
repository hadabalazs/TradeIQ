// Term Match questions for both courses, keyed by topic ID.
// Each question has pairs with term + definition in the correct matching order.
// The TermMatchQuestion component shuffles both columns independently at render time.
// These are merged into topic quiz arrays at runtime via courses.js.
// One Term Match question per topic across all modules — 53 questions total (27 IFRS, 26 Open Finance).

export const IFRS_TERM_MATCH_QUESTIONS = {
  "m1t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Fungibility",
          "definition": "The property that makes individual units of a commodity interchangeable with one another"
        },
        {
          "term": "Byproduct",
          "definition": "A secondary output generated from producing a different, primary product — e.g. sulphur from oil refining"
        },
        {
          "term": "Energy Commodity",
          "definition": "A category of commodity burned or consumed for power, such as coal"
        },
        {
          "term": "Chemical Commodity",
          "definition": "A category of commodity such as sulphur, often recovered rather than mined"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m1t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Spot Market",
          "definition": "A market where commodities are bought and sold for immediate delivery at today's price"
        },
        {
          "term": "Forward Contract",
          "definition": "A customisable, privately negotiated agreement to buy or sell at a future date"
        },
        {
          "term": "Futures Contract",
          "definition": "A standardised, exchange-traded and centrally cleared agreement for future delivery"
        },
        {
          "term": "Benchmark Price",
          "definition": "A published reference price, such as API4, that the market uses to price individual deals"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m1t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Trading House",
          "definition": "A party that takes ownership of cargo and finances it to reduce price risk"
        },
        {
          "term": "Offtaker",
          "definition": "The end buyer, such as a steel mill or power utility, that ultimately consumes the commodity"
        },
        {
          "term": "Inspection Firm",
          "definition": "An independent party, such as SGS or Intertek, that certifies cargo quantity and quality"
        },
        {
          "term": "Broker",
          "definition": "A party that arranges a deal between buyer and seller without taking ownership of the goods"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m1t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "FOB",
          "definition": "Free on Board — the buyer arranges and pays for freight and insurance from the port of loading"
        },
        {
          "term": "CIF",
          "definition": "Cost, Insurance and Freight — the seller pays freight and insurance to the destination port"
        },
        {
          "term": "CFR",
          "definition": "Cost and Freight — the seller pays freight to destination but not insurance"
        },
        {
          "term": "DAP",
          "definition": "Delivered at Place — the seller bears risk and cost until the goods reach the named destination"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m1t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Bill of Lading",
          "definition": "The document establishing legal title to and control of a cargo"
        },
        {
          "term": "Certificate of Origin",
          "definition": "The document confirming where the goods were produced, used for customs and tariffs"
        },
        {
          "term": "Quality Certificate",
          "definition": "An independent assay confirming the goods meet the agreed grade or specification"
        },
        {
          "term": "Letter of Credit",
          "definition": "A bank's conditional undertaking to pay against conforming trade documents"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m2t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "RBCT",
          "definition": "Richards Bay Coal Terminal — South Africa's main thermal coal export hub"
        },
        {
          "term": "Nacala Corridor",
          "definition": "A key export route used for Mozambican coking coal"
        },
        {
          "term": "Jorf Lasfar",
          "definition": "A Moroccan port linked to OCP Group's phosphate and sulphuric acid operations"
        },
        {
          "term": "Coking Coal",
          "definition": "A grade of coal used specifically in steelmaking, distinct from thermal coal"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m2t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Thermal Coal",
          "definition": "Coal burned by power utilities such as Eskom to generate electricity"
        },
        {
          "term": "Eskom",
          "definition": "South Africa's state-owned power utility, a major domestic coal consumer"
        },
        {
          "term": "Transnet",
          "definition": "South Africa's state logistics operator responsible for rail infrastructure feeding RBCT"
        },
        {
          "term": "API4",
          "definition": "The benchmark price index for South African export thermal coal"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m2t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Moatize",
          "definition": "A major coking coal mine in Mozambique's Tete province"
        },
        {
          "term": "Vulcan",
          "definition": "The company that acquired the Moatize mine from Vale in 2021–2022"
        },
        {
          "term": "Tete Province",
          "definition": "The region of Mozambique where the country's major coking coal deposits are located"
        },
        {
          "term": "Vale",
          "definition": "The Brazilian company that originally developed the Moatize mine"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m2t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Molten Sulphur",
          "definition": "Liquid sulphur that must be kept above roughly 115°C to avoid solidifying in transit"
        },
        {
          "term": "Formed Sulphur",
          "definition": "Solid sulphur processed into prilled or granular form for easier handling"
        },
        {
          "term": "OCP Group",
          "definition": "Morocco's phosphate producer, the major demand source for imported sulphur"
        },
        {
          "term": "Sulphuric Acid",
          "definition": "The stable downstream chemical product made by further processing sulphur"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m2t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "UBO",
          "definition": "Ultimate Beneficial Owner — the individual who actually owns or controls a counterparty"
        },
        {
          "term": "PEP",
          "definition": "Politically Exposed Person — an individual whose position creates higher money-laundering risk"
        },
        {
          "term": "OFAC",
          "definition": "The US body maintaining sanctions lists that counterparties must be screened against"
        },
        {
          "term": "KYC",
          "definition": "Know Your Customer — the due diligence process of verifying a counterparty's identity and ownership"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m2t6": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Provisional Pricing",
          "definition": "A pricing method where a price is fixed at shipment but finalised later against an index"
        },
        {
          "term": "Quotational Period (QP)",
          "definition": "The future window over which the final settlement price is averaged"
        },
        {
          "term": "Price Participation Clause",
          "definition": "A clause sharing additional upside or downside beyond a reference price level"
        },
        {
          "term": "Variable Consideration",
          "definition": "The IFRS 15 term for a transaction price that is not fixed at the point of sale"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m3t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "IFRS 15",
          "definition": "The standard governing revenue from contracts with customers"
        },
        {
          "term": "IFRS 9",
          "definition": "The standard governing financial instruments, including hedge accounting"
        },
        {
          "term": "IAS 2",
          "definition": "The standard governing the measurement of inventories"
        },
        {
          "term": "IFRS 16",
          "definition": "The standard governing the accounting for leases"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m3t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Performance Obligation",
          "definition": "A promise in a contract to transfer a distinct good or service to the customer"
        },
        {
          "term": "Transfer of Control",
          "definition": "The point at which the customer obtains the ability to direct the use of the goods"
        },
        {
          "term": "Transaction Price",
          "definition": "The amount of consideration an entity expects to be entitled to in exchange for goods"
        },
        {
          "term": "Constraint (on variable consideration)",
          "definition": "The IFRS 15 requirement to only include variable amounts highly probable not to reverse"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m3t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "FVTPL",
          "definition": "Fair Value Through Profit or Loss — the default measurement category for commodity derivatives"
        },
        {
          "term": "Cash Flow Hedge",
          "definition": "A hedge accounting designation used to manage variability in future cash flows"
        },
        {
          "term": "Embedded Derivative",
          "definition": "A derivative feature contained within a non-derivative host contract"
        },
        {
          "term": "Closely Related Test",
          "definition": "The assessment of whether an embedded feature's risks align with those of its host contract"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m3t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "NRV",
          "definition": "Net Realisable Value — estimated selling price less costs to complete and sell"
        },
        {
          "term": "Conversion Costs",
          "definition": "Costs incurred in processing raw material inventory into its saleable form"
        },
        {
          "term": "Broker-Trader Exception",
          "definition": "The IAS 2.3(b) provision allowing fair value less costs to sell for certain commodity inventories"
        },
        {
          "term": "Lower of Cost and NRV",
          "definition": "The standard IAS 2 measurement basis applied to inventory outside the broker-trader exception"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m3t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Right-of-Use Asset",
          "definition": "The balance sheet asset recognised by a lessee representing its right to use a leased item"
        },
        {
          "term": "Short-Term Lease Exemption",
          "definition": "The IFRS 16 exemption available for leases with a term of 12 months or less"
        },
        {
          "term": "Time Charter",
          "definition": "An arrangement to use a vessel for a period, which may qualify as a lease under IFRS 16"
        },
        {
          "term": "Identified Asset",
          "definition": "A specific, distinguishable asset required for an arrangement to be classified as a lease"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m3t6": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Onerous Contract",
          "definition": "A contract where the unavoidable costs of fulfilling it exceed the expected economic benefits"
        },
        {
          "term": "Provision",
          "definition": "A liability of uncertain timing or amount, recognised when a present obligation exists"
        },
        {
          "term": "Contingent Liability",
          "definition": "A possible obligation that is disclosed rather than recognised on the balance sheet"
        },
        {
          "term": "Rehabilitation Provision",
          "definition": "A provision for future site restoration or environmental remediation obligations"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m4t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Panamax",
          "definition": "A vessel size class referenced in the worked coal shipment revenue recognition example"
        },
        {
          "term": "Significant Financing Component",
          "definition": "An element of a contract assessed to determine if payment timing implies embedded financing"
        },
        {
          "term": "Fixed-Price Sale",
          "definition": "A sale with no variable consideration, since the transaction price is known at the outset"
        },
        {
          "term": "Bill of Lading Date",
          "definition": "The date used as evidence of when loading, and therefore control transfer, occurred under FOB"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m4t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Provisional Price",
          "definition": "The initial estimated price used to recognise revenue before the QP resolves"
        },
        {
          "term": "Remeasurement",
          "definition": "The process of updating a provisionally priced receivable through profit or loss over time"
        },
        {
          "term": "Final Settlement",
          "definition": "The point at which the QP resolves and the transaction price is definitively fixed"
        },
        {
          "term": "Mark-to-Market Adjustment",
          "definition": "The journal entry recognising the change in value of a provisionally priced position"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m4t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Bifurcation",
          "definition": "The process of separating an embedded derivative from its host contract for accounting purposes"
        },
        {
          "term": "Host Contract",
          "definition": "The main, non-derivative contract that an embedded derivative feature is contained within"
        },
        {
          "term": "Hybrid Instrument",
          "definition": "A contract combining a host instrument with an embedded derivative feature"
        },
        {
          "term": "API2",
          "definition": "A related coal benchmark referenced when assessing whether a pricing clause stays embedded"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m4t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Hedge Designation",
          "definition": "The formal act of identifying a hedging relationship between an instrument and a hedged item"
        },
        {
          "term": "Hedge Documentation",
          "definition": "The formal record, made at inception, of the risk management objective and strategy for a hedge"
        },
        {
          "term": "Effectiveness Assessment",
          "definition": "The ongoing qualitative test confirming a hedge continues to offset the hedged risk"
        },
        {
          "term": "De-designation",
          "definition": "The act of discontinuing hedge accounting for a previously designated hedging relationship"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m4t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Write-Down",
          "definition": "The reduction of inventory's carrying value to NRV when NRV falls below cost"
        },
        {
          "term": "Platts Assessment",
          "definition": "A published price assessment used as a market reference for commodities such as sulphur"
        },
        {
          "term": "Reversal",
          "definition": "The partial recovery of a previous write-down, capped at original cost, when NRV later rises"
        },
        {
          "term": "Carrying Value",
          "definition": "The amount at which inventory is recognised on the balance sheet"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m4t6": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Cost to Fulfil",
          "definition": "The cost of completing a contract's obligations, compared against the cost to exit"
        },
        {
          "term": "Cost to Exit",
          "definition": "The penalty or cost of terminating a contract early, compared against the cost to fulfil"
        },
        {
          "term": "Unavoidable Costs",
          "definition": "The costs a contract cannot escape, whether by fulfilling it or exiting it"
        },
        {
          "term": "Dedicated Asset Impairment",
          "definition": "An impairment on assets tied to a contract, recognised before any onerous contract provision"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m5t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "SBLC",
          "definition": "Standby Letter of Credit — a performance guarantee only drawn upon default"
        },
        {
          "term": "Documentary Collection",
          "definition": "A payment method where the bank handles documents but does not guarantee payment"
        },
        {
          "term": "Pre-Export Finance (PXF)",
          "definition": "Lending against a confirmed offtake contract, repaid from the resulting sale proceeds"
        },
        {
          "term": "Borrowing Base Facility",
          "definition": "A revolving credit facility secured against a fluctuating pool of inventory and receivables"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m5t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "TBML",
          "definition": "Trade-Based Money Laundering — using trade transactions to disguise the movement of illicit funds"
        },
        {
          "term": "Over-Invoicing",
          "definition": "A TBML technique that mispricing goods to move value across borders"
        },
        {
          "term": "Phantom Shipment",
          "definition": "A TBML technique involving invoicing for goods that do not actually exist"
        },
        {
          "term": "Transaction-Level Screening",
          "definition": "Ongoing sanctions screening applied to every trade with a counterparty, not just at onboarding"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m5t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Scope 1 Emissions",
          "definition": "Direct greenhouse gas emissions from a company's own operations"
        },
        {
          "term": "Scope 3 Emissions",
          "definition": "Indirect emissions occurring downstream, such as the combustion of coal sold to customers"
        },
        {
          "term": "CBAM",
          "definition": "The EU's Carbon Border Adjustment Mechanism, pricing carbon embedded in certain imports"
        },
        {
          "term": "TCFD",
          "definition": "A disclosure framework for climate-related financial risk"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "m5t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Gross Margin",
          "definition": "The difference between sale revenue and the combined purchase cost and freight/insurance"
        },
        {
          "term": "Beira",
          "definition": "The Mozambican port referenced as the FOB loading point in the capstone case study"
        },
        {
          "term": "Karachi",
          "definition": "The Pakistani destination port referenced as the CIF delivery point in the capstone case study"
        },
        {
          "term": "Insurance Certificate",
          "definition": "A required trade document under CIF terms, needed to draw payment under the LC"
        }
      ],
      "questionType": "term-match"
    }
  ]
};

export const OPENFINANCE_TERM_MATCH_QUESTIONS = {
  "of_m1t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Screen Scraping",
          "definition": "A legacy, less secure method of data sharing requiring the customer's raw banking credentials"
        },
        {
          "term": "Consent-Based API",
          "definition": "A secure, standardised method of data sharing authorised via a token rather than credentials"
        },
        {
          "term": "Payment Initiation",
          "definition": "A pillar of Open Banking allowing a third party to trigger payments on the customer's behalf"
        },
        {
          "term": "Product Information",
          "definition": "A pillar of Open Banking involving banks publishing standardised product details for comparison"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m1t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Open Banking",
          "definition": "The narrower scope covering deposits, payment accounts, cards, and loans"
        },
        {
          "term": "Open Finance",
          "definition": "The broader scope adding mortgages, insurance, and pensions on top of Open Banking"
        },
        {
          "term": "Open Insurance",
          "definition": "The category within Open Finance covering life and general insurance products"
        },
        {
          "term": "Service Initiation",
          "definition": "The UAE-specific scope allowing non-bank players to trigger financial services directly"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m1t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "AISP",
          "definition": "Account Information Service Provider — reads account data with the customer's consent"
        },
        {
          "term": "PISP",
          "definition": "Payment Initiation Service Provider — initiates payments on the customer's behalf"
        },
        {
          "term": "PIISP",
          "definition": "Payment Instrument Issuer Service Provider — confirms fund availability before a payment"
        },
        {
          "term": "CBUAE",
          "definition": "The regulator that licenses and supervises all Open Finance ecosystem participants"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m1t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "PSD2",
          "definition": "The EU's 2018 directive that introduced Open Banking, focused on payment accounts"
        },
        {
          "term": "CMA Order",
          "definition": "The 2018 UK order requiring the nine largest banks to implement Open Banking"
        },
        {
          "term": "CDR",
          "definition": "Australia's Consumer Data Right, an economy-wide open data framework introduced in 2019"
        },
        {
          "term": "CMA9",
          "definition": "The group of nine largest UK banks mandated to implement Open Banking under the CMA Order"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m1t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Embedded Finance",
          "definition": "Financial services integrated directly into non-financial products or platforms"
        },
        {
          "term": "Churn Reduction",
          "definition": "A bank-side benefit of Open Finance, arising from partnership and integration opportunities"
        },
        {
          "term": "Financial Inclusion",
          "definition": "A broader economic benefit of Open Finance, expanding access to financial services"
        },
        {
          "term": "GDP Impact Estimate",
          "definition": "McKinsey's estimate that Open Finance could add 1.5% to UAE GDP by 2030"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m2t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "FIT Programme",
          "definition": "The CBUAE's broader Financial Infrastructure Transformation programme, encompassing nine initiatives"
        },
        {
          "term": "Aani",
          "definition": "The instant payment platform operated by Al Etihad Payments under the FIT Programme"
        },
        {
          "term": "Al Etihad Payments",
          "definition": "The CBUAE subsidiary operating the Aani instant payment platform"
        },
        {
          "term": "Strategic Objective",
          "definition": "A goal of the FIT Programme such as empowering consumers with control over their financial data"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m2t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Circular 7 of 2023",
          "definition": "The initial CBUAE circular mandating the Open Finance framework"
        },
        {
          "term": "Circular 3 of 2025",
          "definition": "The circular that updated the Open Finance Regulation, coming into force in July 2025"
        },
        {
          "term": "Deemed Licensee",
          "definition": "An entity, such as an existing CBUAE-licensed bank, automatically holding Open Finance Licensee status"
        },
        {
          "term": "New Entrant",
          "definition": "A person or entity not currently licensed by the CBUAE, requiring a full Open Finance Licence application"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m2t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Nebras",
          "definition": "The entity managing the UAE's centralised Open Finance API Hub"
        },
        {
          "term": "Trust Framework",
          "definition": "The system providing participant validation, identity verification, and data security centrally"
        },
        {
          "term": "API Hub",
          "definition": "The single centralised connection point all UAE Open Finance participants integrate with"
        },
        {
          "term": "Fragmentation",
          "definition": "The problem of TPPs needing many different integrations, avoided by the UAE's centralised model"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m2t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Service Initiation",
          "definition": "The UAE framework allowing TPPs to trigger non-payment financial services such as loan applications"
        },
        {
          "term": "Investment Order Initiation",
          "definition": "A UAE-specific service initiation capability beyond standard payment initiation"
        },
        {
          "term": "Explicit Authorisation",
          "definition": "The safeguard requiring customers to specifically approve any service a TPP initiates"
        },
        {
          "term": "Consent Revocation",
          "definition": "The customer's right to withdraw authorisation for service initiation at any time"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m2t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Phased Rollout",
          "definition": "The gradual approach to onboarding participants and expanding product coverage"
        },
        {
          "term": "Governance Requirements",
          "definition": "Standards around control and oversight that a deemed licensee must meet before going live"
        },
        {
          "term": "Specific CBUAE Approval",
          "definition": "The additional approval a deemed licensee must obtain before conducting live Open Finance activity"
        },
        {
          "term": "Capital Requirements",
          "definition": "Financial resource standards forming part of the approval criteria for Open Finance activity"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m3t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Account Information API",
          "definition": "An API category used to read balances, transactions, and account details"
        },
        {
          "term": "Payment Initiation API",
          "definition": "An API category used to initiate payments and fund transfers"
        },
        {
          "term": "RESTful",
          "definition": "An architectural style where each resource has its own URL and standard HTTP methods apply"
        },
        {
          "term": "Stateless",
          "definition": "A REST API property where each request contains all necessary information, with no stored session"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m3t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "FDX",
          "definition": "An industry-led data-sharing API standard widely used in North America and increasingly globally"
        },
        {
          "term": "Berlin Group NextGenPSD2",
          "definition": "The EU's data model standard used for PSD2 compliance"
        },
        {
          "term": "Common Specification",
          "definition": "The shared data format FDX provides so a TPP can integrate once and connect to many institutions"
        },
        {
          "term": "UAE Open Finance Standards",
          "definition": "The UAE's own regulator-mandated data standards, adapted for a centralised hub model"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m3t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Access Token",
          "definition": "A short-lived credential, typically valid for minutes to hours, used to authorise API calls"
        },
        {
          "term": "Refresh Token",
          "definition": "A credential allowing new access tokens to be obtained without re-authenticating the customer"
        },
        {
          "term": "ID Token",
          "definition": "An OpenID Connect addition that proves the customer's identity"
        },
        {
          "term": "Userinfo Endpoint",
          "definition": "An OpenID Connect endpoint returning profile information about the authenticated user"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m3t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "FAPI",
          "definition": "Financial-Grade API — a stricter security profile built on top of OAuth 2.0 and OpenID Connect"
        },
        {
          "term": "mTLS",
          "definition": "Mutual TLS — a method where both client and server authenticate each other using certificates"
        },
        {
          "term": "Sender-Constrained Token",
          "definition": "A token bound to the specific client that requested it, preventing replay if stolen"
        },
        {
          "term": "Mix-Up Attack",
          "definition": "A threat FAPI defends against, involving confusion between different authorisation servers"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m3t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Proxy Payment",
          "definition": "A payment made using a mobile number or email instead of a full IBAN"
        },
        {
          "term": "Request to Pay",
          "definition": "An Aani capability allowing a party to formally request payment from another"
        },
        {
          "term": "Instant Transfer",
          "definition": "A core Aani feature providing funds availability in seconds, 24/7/365"
        },
        {
          "term": "AED 50,000 Limit",
          "definition": "The transaction limit associated with Aani payments"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m3t6": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Data Model",
          "definition": "A definition of the fields, types, and relationships that structure shared data"
        },
        {
          "term": "Field",
          "definition": "A specific data element within a data model, such as account number or balance"
        },
        {
          "term": "Schema Standardisation",
          "definition": "The practice of ensuring every institution names and formats data consistently"
        },
        {
          "term": "Parser",
          "definition": "The integration logic a TPP writes to interpret data returned from an API"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m4t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Explicit Consent",
          "definition": "Consent that requires the customer to actively approve, not passively accept"
        },
        {
          "term": "Informed Consent",
          "definition": "Consent given with the customer understanding what data is shared, with whom, and why"
        },
        {
          "term": "Consent Dashboard",
          "definition": "A customer-facing view showing all active consents and allowing revocation at any time"
        },
        {
          "term": "Time-Limited Consent",
          "definition": "A consent principle requiring authorisation to expire rather than remain indefinite"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m4t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "PDPL",
          "definition": "The UAE's federal data protection law, Federal Decree-Law No. 45 of 2021"
        },
        {
          "term": "Purpose Limitation",
          "definition": "The principle that data collected for one purpose cannot be used for another without consent"
        },
        {
          "term": "Data Minimisation",
          "definition": "The principle of collecting only the data necessary for the stated purpose"
        },
        {
          "term": "DIFC Data Protection Law",
          "definition": "A free zone data protection regime aligned with GDPR, distinct from the federal PDPL"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m4t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "SCA",
          "definition": "Strong Customer Authentication — requiring two or more independent verification factors"
        },
        {
          "term": "Knowledge Factor",
          "definition": "An SCA factor category such as a password, PIN, or security question"
        },
        {
          "term": "Possession Factor",
          "definition": "An SCA factor category such as a phone or hardware token"
        },
        {
          "term": "Inherence Factor",
          "definition": "An SCA factor category such as fingerprint or facial recognition"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m4t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Consent Fatigue",
          "definition": "A fraud risk where customers grant consent without properly reading what they're authorising"
        },
        {
          "term": "Phishing",
          "definition": "A fraud risk involving tricking customers into granting consent to a malicious TPP"
        },
        {
          "term": "Token Theft",
          "definition": "A fraud risk mitigated by FAPI's sender-constrained token requirement"
        },
        {
          "term": "Data Minimisation (TPP Duty)",
          "definition": "A TPP responsibility requiring only the data needed for the stated purpose be requested"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m4t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Instant Token Revocation",
          "definition": "A rapid-response capability allowing tokens to be revoked centrally through the API Hub"
        },
        {
          "term": "TPP Disconnection",
          "definition": "A rapid-response capability allowing a compromised TPP to be cut off from the Hub immediately"
        },
        {
          "term": "Centralised Audit Logs",
          "definition": "A capability providing forensic evidence to support incident investigation"
        },
        {
          "term": "Breach Notification",
          "definition": "The formal process of reporting a data breach to the regulator and affected parties"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m5t1": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Account Aggregation",
          "definition": "Combining data from multiple institutions into a single, unified financial view"
        },
        {
          "term": "Net Worth Tracking",
          "definition": "A PFM capability calculating assets minus liabilities across institutions"
        },
        {
          "term": "Spending Analysis",
          "definition": "A PFM capability categorising transactions to show where money is being spent"
        },
        {
          "term": "PFM",
          "definition": "Personal Finance Management — apps that help customers understand and manage their finances"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m5t2": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Pay by Bank",
          "definition": "A checkout option allowing payment directly from a bank account via payment initiation"
        },
        {
          "term": "Interchange Fee",
          "definition": "A cost typically charged by card networks, avoided when using payment initiation instead"
        },
        {
          "term": "SCA Redirect",
          "definition": "The step in a payment initiation flow where the customer authenticates directly with their bank"
        },
        {
          "term": "Embedded Finance",
          "definition": "Financial services, including payments, integrated directly into a non-financial product"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m5t3": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Alternative Credit Data",
          "definition": "Financial data, such as income and spending patterns, used to assess creditworthiness beyond a credit bureau score"
        },
        {
          "term": "BNPL",
          "definition": "Buy Now, Pay Later — a lending product enabled by real-time affordability data from Open Finance"
        },
        {
          "term": "Income Verification",
          "definition": "Using Open Finance data to directly confirm salary credits and income stability"
        },
        {
          "term": "Debt Obligations Data",
          "definition": "Data on a customer's existing loan repayments across all institutions, visible with consent"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m5t4": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Open Insurance",
          "definition": "The application of Open Finance principles to sharing and using insurance policy data"
        },
        {
          "term": "Underwriting",
          "definition": "The process of assessing risk to price an insurance policy, improved using financial data"
        },
        {
          "term": "Claims Simplification",
          "definition": "Sharing policy data directly with a repair provider or medical facility to speed up claims"
        },
        {
          "term": "Automated Investment Plan",
          "definition": "A recurring investment contribution set up using service initiation capabilities"
        }
      ],
      "questionType": "term-match"
    }
  ],
  "of_m5t5": [
    {
      "q": "Match each term to its correct definition.",
      "pairs": [
        {
          "term": "Value Proposition",
          "definition": "The first step of the capstone strategy framework, defining what the product offers customers"
        },
        {
          "term": "Go-to-Market",
          "definition": "The step of the capstone strategy framework covering how the product will be launched and acquired"
        },
        {
          "term": "Technical Architecture",
          "definition": "The step of the capstone strategy framework covering how the product will be built and integrated"
        },
        {
          "term": "Credit Health Monitoring",
          "definition": "A value proposition element in the FinSmart UAE capstone example"
        }
      ],
      "questionType": "term-match"
    }
  ]
};
