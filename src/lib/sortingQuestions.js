// Sorting questions for both courses, keyed by topic ID.
// Each question has options in the correct order; the SortingQuestion component shuffles them.
// Only questions with a genuine sequence, chronological order, cause-effect chain, or gradient
// are included — no "arrange in the order they are listed" questions.

export const IFRS_SORTING_QUESTIONS = {
  "m1t1": [
    {
      q: "Arrange these process steps in the order sulphur is recovered as a byproduct, from source activity to the resulting sulphur:",
      options: [
        "Crude oil enters a refinery for processing",
        "Desulphurisation removes sulphur to meet fuel standards",
        "Recovered elemental sulphur is stored or shipped as a commodity",
      ],
      explain: "Sulphur is not mined directly — it is recovered when crude oil is desulphurised at a refinery, and the recovered sulphur then becomes a tradeable commodity in its own right.",
      questionType: "sorting",
    },
  ],
  "m1t2": [
    {
      q: "Arrange these contract types from LEAST standardised/most customisable to MOST standardised/exchange-traded:",
      options: [
        "Spot market — an immediate, one-off deal at today's price",
        "Forward contract — a customisable private OTC agreement for future delivery",
        "Futures contract — a standardised, exchange-traded and centrally cleared agreement",
      ],
      explain: "Spot deals are one-off and immediate. Forwards are customisable OTC agreements. Futures are the most standardised, being exchange-traded and centrally cleared.",
      questionType: "sorting",
    },
    {
      q: "Arrange the steps in how a physical cargo's price is typically determined, from broadest reference point to final agreed price:",
      options: [
        "A published benchmark (e.g. API4) aggregates reported deals and bids/offers",
        "A premium or discount is applied reflecting quality, location and timing",
        "The final physical price is agreed as benchmark plus or minus that adjustment",
      ],
      explain: "No single actor sets commodity prices — benchmarks aggregate market activity, and the final physical price layers a quality/location/timing adjustment on top of that reference point.",
      questionType: "sorting",
    },
  ],
  "m1t3": [
    {
      q: "Arrange these parties in the order a coal cargo's quality and payment are typically confirmed, from physical loading to funds release:",
      options: [
        "The producer loads coal at the mine/terminal",
        "An inspection firm certifies the quantity and quality of the cargo",
        "The bank releases payment against the certified, conforming documents",
      ],
      explain: "After the producer loads the cargo, an independent inspection firm (e.g. SGS, Intertek) certifies quantity and quality — this certification is typically a precondition before the bank will release payment.",
      questionType: "sorting",
    },
    {
      q: "Arrange these supply chain roles in the order a commodity typically flows from origin to end-user:",
      options: [
        "Producer (mine) — extracts and brings raw material to market",
        "Trading house — buys, finances, transports and sells the commodity",
        "Offtaker (industrial end-user) — consumes the commodity in production",
        "Inspection firm — certifies quantity and quality at handover points",
      ],
      explain: "The commodity flows from the producer (mine) to a trading house (which finances and transports), then to the offtaker (end-user). Inspection firms certify quality at key handover points.",
      questionType: "sorting",
    },
  ],
  "m1t4": [
    {
      q: "Arrange these Incoterms by how much freight cost the SELLER bears, from none to full cost to destination:",
      options: [
        "FOB — buyer arranges and pays freight and insurance",
        "CFR — seller pays freight to destination, but not insurance",
        "CIF — seller pays both freight and insurance to destination",
      ],
      explain: "Under FOB the buyer bears freight entirely. CFR shifts freight cost to the seller. CIF goes further, adding insurance cost on top of freight — though risk still passes at loading under both CFR and CIF.",
      questionType: "sorting",
    },
    {
      q: "Arrange the reasoning steps connecting an Incoterm choice to IFRS 15 revenue timing, from the trade term to the accounting outcome:",
      options: [
        "The Incoterm (e.g. FOB or DAP) is agreed between buyer and seller",
        "The Incoterm indicates the point at which control of the goods passes",
        "Revenue is recognised under IFRS 15 at that point of control transfer",
      ],
      explain: "Incoterms are not an accounting standard themselves, but they are strong evidence of when control passes — and control transfer is the trigger for revenue recognition under IFRS 15.",
      questionType: "sorting",
    },
  ],
  "m1t5": [
    {
      q: "Arrange these consequences in the order they would occur if a Bill of Lading contained a discrepancy versus the Letter of Credit terms:",
      options: [
        "The discrepancy is identified when documents are presented to the bank",
        "The bank treats the documents as non-conforming",
        "Payment under the Letter of Credit is delayed until the discrepancy is resolved",
      ],
      explain: "Because a documentary credit pays against documents (not goods), even a small discrepancy in the Bill of Lading is flagged at presentation and can delay payment for weeks until resolved.",
      questionType: "sorting",
    },
    {
      q: "Arrange these trade documents in the typical order they are generated in a documentary credit transaction:",
      options: [
        "Commercial Invoice — the seller's demand for payment stating price and terms",
        "Bill of Lading — issued by the carrier when goods are loaded on board",
        "Quality Certificate — independent assay confirming grade after loading",
        "Letter of Credit payment — bank pays the seller against conforming documents",
      ],
      explain: "The invoice is issued as the demand for payment. The B/L is issued when goods are loaded. The quality certificate (assay) confirms grade after loading. Finally, the bank pays under the LC when all conforming documents are presented.",
      questionType: "sorting",
    },
  ],
  "m2t2": [
    {
      q: "Arrange these RBCT export volumes from earliest year to most recent:",
      options: [
        "2023 — 47.2 million metric tons",
        "2024 — 52.1 million metric tons",
        "2025 — 57.66 million metric tons",
      ],
      explain: "RBCT's export volumes grew year over year: 47.2 million MT in 2023, 52.1 million MT in 2024, and 57.66 million MT in 2025 — the highest in four years, driven by Transnet's recovery plan.",
      questionType: "sorting",
    },
    {
      q: "Arrange these South African coal buyers from the largest destination by volume to a smaller, fast-growing destination:",
      options: [
        "India — the single largest importer at 45% of RBCT shipments in 2025",
        "Pakistan — the second-largest destination",
        "Middle East — a smaller but nearly-doubled destination in 2025",
      ],
      explain: "India is by far the largest buyer of South African coal, followed by Pakistan as the second-largest, while Middle East shipments — though smaller in absolute terms — nearly doubled in 2025.",
      questionType: "sorting",
    },
    {
      q: "Arrange the steps in the South African coal export supply chain from mine to international buyer:",
      options: [
        "Extraction at Mpumalanga coalfields",
        "Rail transport via Transnet Freight Rail",
        "Stockpiling and vessel loading at RBCT (Richards Bay)",
        "Ocean freight to destination (e.g. India)",
      ],
      explain: "Coal is extracted at Mpumalanga mines, railed by Transnet to RBCT, stockpiled and loaded onto vessels at Richards Bay, then shipped by sea to international buyers like India.",
      questionType: "sorting",
    },
  ],
  "m2t3": [
    {
      q: "Arrange these events in the ownership and production history of the Moatize mine in chronological order:",
      options: [
        "Vale (Brazil) originally develops the Moatize mine",
        "Vulcan (Naveen Jindal's company) acquires the mine from Vale in 2021–2022",
        "A Tete Provincial Administrative Court orders a partial suspension of extraction in December 2024",
      ],
      explain: "Moatize was originally developed by Vale, sold to Vulcan in 2021–2022, and later faced a court-ordered partial suspension in December 2024 — illustrating the mine's ownership and regulatory history in order.",
      questionType: "sorting",
    },
    {
      q: "Arrange Mozambique's annual coal production figures from earliest to most recent:",
      options: [
        "2023 — 14.9 million tonnes",
        "2024 — 16.3 million tonnes",
        "2025 forecast — 19 million tonnes",
      ],
      explain: "Mozambique's coal production has grown steadily: 14.9 million tonnes in 2023, 16.3 million tonnes in 2024, with 19 million tonnes forecast for 2025.",
      questionType: "sorting",
    },
  ],
  "m2t4": [
    {
      q: "Arrange these sulphur forms and handling considerations from the state requiring the most active temperature management to the most stable for storage:",
      options: [
        "Liquid (molten) sulphur — must stay above ~115°C to avoid solidifying in transit",
        "Solid (formed/prilled/granular) sulphur — solidified into manageable shapes for handling",
        "Sulphuric acid (H₂SO₄) — the stable downstream chemical product used in fertiliser manufacturing",
      ],
      explain: "Molten sulphur requires constant temperature management to avoid solidifying; solid sulphur is deliberately solidified for easier handling; and sulphuric acid is the stable end-product once sulphur is processed further.",
      questionType: "sorting",
    },
    {
      q: "Arrange the sulphur value chain from recovery to end-use in fertiliser:",
      options: [
        "Recovery as byproduct at oil refinery or gas processing plant",
        "Transport (molten or solid) to a processing facility",
        "Conversion to sulphuric acid (H₂SO₄) by burning sulphur",
        "Processing of phosphate rock into fertiliser using the acid",
      ],
      explain: "Sulphur is recovered as a byproduct of refining/gas processing, transported to processing facilities, converted to sulphuric acid, which is then used to dissolve phosphate rock into fertiliser.",
      questionType: "sorting",
    },
  ],
  "m2t5": [
    {
      q: "Arrange these steps in a compliance-grade KYC process in a logical sequence, from identifying who owns a counterparty to ongoing monitoring:",
      options: [
        "Identify the counterparty's ultimate beneficial owner (UBO)",
        "Screen the counterparty against OFAC, EU and UN sanctions lists",
        "Conduct ongoing transaction-level screening for each subsequent trade",
      ],
      explain: "A robust compliance programme starts by identifying who ultimately owns and controls a counterparty, screens that party against sanctions lists, and then continues screening at the transaction level for every future trade — not just once at onboarding.",
      questionType: "sorting",
    },
  ],
  "m2t6": [
    {
      q: "Arrange these pricing approaches from the one creating NO variable consideration to the one creating THE MOST uncertainty at shipment:",
      options: [
        "Fixed pricing — the transaction price is known at shipment",
        "Provisional pricing with a QP — final price is set later based on a future averaging window",
        "Provisional pricing with a price participation clause — upside/downside is additionally shared beyond a reference level",
      ],
      explain: "Fixed pricing carries no variable consideration since the price is known upfront. Provisional pricing with a QP introduces uncertainty resolved later. Adding a price participation clause on top introduces further shared variability.",
      questionType: "sorting",
    },
    {
      q: "Arrange the sulphur price shock scenario described in the lesson in cause-and-effect order:",
      options: [
        "Sulphur supply is inelastic because it is a byproduct of refining and smelting activity, not driven by sulphur demand itself",
        "A disruption occurs at a chokepoint region such as the Strait of Hormuz",
        "Sulphur prices can spike sharply because supply cannot quickly respond to the disruption",
      ],
      explain: "Because sulphur supply is inelastic (tied to refinery/smelter activity rather than sulphur price), a disruption at a concentrated chokepoint like the Strait of Hormuz can cause a sharp price spike, since supply cannot quickly adjust.",
      questionType: "sorting",
    },
  ],
  "m3t1": [
    {
      q: "Arrange these entities from the lesson from those most likely to report under IFRS to those governed by a different regime:",
      options: [
        "Major trading houses such as Glencore and Trafigura, which report under IFRS or closely aligned local GAAP",
        "Most non-US multinationals, which generally apply IFRS",
        "US-domiciled companies, which apply US GAAP rather than IFRS",
      ],
      explain: "IFRS is applied by listed companies, banks, and most non-US multinationals including major trading houses — while US-domiciled companies apply US GAAP, which differs in areas like inventory costing.",
      questionType: "sorting",
    },
  ],
  "m3t2": [
    {
      q: "Arrange these events in the FOB Richards Bay revenue recognition example from contract to recognition, based on the lesson's description of when control transfers:",
      options: [
        "A sale contract for coal FOB Richards Bay is agreed with the buyer",
        "The coal is loaded on board the vessel at Richards Bay",
        "Revenue is recognised at that point, as control has transferred",
      ],
      explain: "Under FOB, control transfers when goods are on board the vessel at the loading port — so revenue recognition follows directly from that loading event, not from contract signing or later events.",
      questionType: "sorting",
    },
    {
      q: "Arrange the treatment of provisionally priced revenue in the order it occurs across time, from initial recognition to final settlement:",
      options: [
        "Revenue is initially recognised using the best estimate of the transaction price, subject to the constraint",
        "The provisionally priced receivable is remeasured through profit or loss as new pricing information becomes available",
        "The final price is fixed when the quotational period resolves, and revenue is trued up accordingly",
      ],
      explain: "Provisionally priced revenue starts as a constrained best estimate, is remeasured through P&L as the quotational period progresses, and is finally trued up once the QP resolves and the price is fixed.",
      questionType: "sorting",
    },
  ],
  "m3t3": [
    {
      q: "Arrange the assessment of whether a coal pricing clause is a separable embedded derivative, from the general question to the specific application:",
      options: [
        "Ask whether the clause's economic characteristics are closely related to the host contract",
        "Note that a price link to the same commodity being delivered (e.g. coal priced off API4 coal index) is usually closely related",
        "Conclude that such a clause is therefore not bifurcated, and stays embedded in the host",
      ],
      explain: "The embedded derivative assessment starts with the closely-related test; because coal priced off its own coal index is usually closely related to the host supply contract, the pricing clause typically remains embedded rather than being separated.",
      questionType: "sorting",
    },
  ],
  "m3t4": [
    {
      q: "Arrange these components in the order they are added to build up inventory cost under IAS 2:",
      options: [
        "Purchase price of the raw material",
        "Conversion costs incurred in processing",
        "Costs to bring inventory to its present location and condition, such as transport and handling",
      ],
      explain: "Inventory cost under IAS 2 is built up from the purchase price, plus conversion costs, plus the costs needed to bring the inventory to its present location and condition — such as transport and handling.",
      questionType: "sorting",
    },
    {
      q: "Arrange these steps in calculating Net Realisable Value (NRV) from the lesson's formula, from starting point to final figure:",
      options: [
        "Start with the estimated selling price",
        "Subtract the estimated costs to complete",
        "Subtract the estimated costs to sell, arriving at NRV",
      ],
      explain: "NRV = estimated selling price − estimated costs to complete − estimated costs to sell. Each deduction step brings the figure closer to the true net amount recoverable from selling the inventory.",
      questionType: "sorting",
    },
  ],
  "m3t5": [
    {
      q: "Arrange these commodity-trading lease examples from the lesson from a fixed physical structure to a moving asset:",
      options: [
        "Storage tanks at ports — used for sulphur or liquid fuel products",
        "Warehouse space — used for coal stockpiles and solid sulphur",
        "Chartered vessels — a time charter that may contain a lease of an identified asset",
      ],
      explain: "The lesson's examples of commodity-trading leases range from fixed port infrastructure like storage tanks, to warehouse space, through to a moving asset — a chartered vessel under a time charter.",
      questionType: "sorting",
    },
    {
      q: "Arrange the reasoning steps for assessing whether a time charter is a lease under IFRS 16, from the first question asked to the resulting classification:",
      options: [
        "Determine whether there is an identified asset in the arrangement",
        "Determine who controls the use of that asset during the charter period",
        "Classify the arrangement as a lease (if both are met) or as a service contract (if not)",
      ],
      explain: "Whether a time charter is a lease under IFRS 16 depends on first identifying whether there's a specific identified asset, then determining who controls its use — only then can the arrangement be classified as a lease or a service.",
      questionType: "sorting",
    },
  ],
  "m3t6": [
    {
      q: "Arrange these onerous contract calculation elements in the order the lesson uses to determine the provision, from identifying the loss to booking the entry:",
      options: [
        "Calculate the cost of fulfilling the contract at a loss",
        "Calculate the cost/penalty of exiting the contract instead",
        "Recognise the lower of the two amounts as the provision",
      ],
      explain: "IAS 37 measures the unavoidable cost of an onerous contract as the lower of the cost to fulfil and the cost to exit — so both must be calculated before the lower (and thus the provision) can be determined.",
      questionType: "sorting",
    },
    {
      q: "Arrange the IAS 37 criteria for recognising a provision in the correct assessment order:",
      options: [
        "Identify a present obligation arising from a past event",
        "Assess whether outflow of resources is probable",
        "Determine if the amount can be reliably estimated",
        "Recognise the provision on the balance sheet",
      ],
      explain: "IAS 37 requires: (1) a present obligation from a past event, (2) probable outflow of resources, (3) a reliable estimate of the amount — only then is a provision recognised.",
      questionType: "sorting",
    },
  ],
  "m4t1": [
    {
      q: "Arrange these steps in calculating the transaction price for the 75,000 MT Panamax cargo example, from the given inputs to the final figure:",
      options: [
        "Identify the quantity — 75,000 MT",
        "Identify the fixed price per tonne — $96/MT",
        "Multiply quantity by price to arrive at the $7,200,000 transaction price",
      ],
      explain: "The transaction price in this fixed-price example is simply quantity multiplied by the agreed rate: 75,000 MT × $96/MT = $7,200,000, with no variable consideration since the price is fixed.",
      questionType: "sorting",
    },
  ],
  "m4t2": [
    {
      q: "Arrange these figures from the provisional pricing worked example in the order they are calculated, from initial booking to final settlement:",
      options: [
        "March revenue recognised at the $90/MT provisional price — $4,500,000",
        "April final value at the $96/MT settled API4 average — $4,800,000",
        "The remeasurement uplift recognised when the QP resolves — $300,000",
      ],
      explain: "The example first books $4,500,000 using the provisional price in March, then calculates the final $4,800,000 value once April API4 settles, with the $300,000 difference recognised as a remeasurement uplift.",
      questionType: "sorting",
    },
    {
      q: "Arrange these illustrative journal entries from the lesson in the order they occur:",
      options: [
        "March: Dr Receivable / Cr Revenue for $4,500,000",
        "April: Dr Receivable / Cr Revenue (mark-to-market) for the $300,000 remeasurement",
        "April: Dr Cash / Cr Receivable for $4,800,000 on final settlement",
      ],
      explain: "The journal entries follow the timeline: initial provisional revenue booking in March, the remeasurement adjustment in April as the QP resolves, and finally the cash settlement entry once payment is received.",
      questionType: "sorting",
    },
    {
      q: "Arrange the provisional pricing process for a coal shipment with QP M+1 in chronological order:",
      options: [
        "Coal is shipped and control transfers to the buyer (March)",
        "Provisional revenue recognised using the best estimate ($90/MT)",
        "Average API4 for April (the quotational period) is calculated",
        "Remeasurement adjustment recognised when the QP finalises",
      ],
      explain: "The cargo ships in March with revenue recognised at the provisional price. The QP month (April) then determines the final average API4. When the QP resolves, the remeasurement adjustment is recognised in revenue.",
      questionType: "sorting",
    },
  ],
  "m4t3": [
    {
      q: "Arrange these pricing link examples from the lesson from most likely to stay embedded to most likely to require bifurcation:",
      options: [
        "Coal priced off API4 — the same coal index as the commodity being delivered",
        "Coal priced off API2 — a related coal market benchmark",
        "Coal priced off an unrelated exotic metal index or unrelated foreign currency",
      ],
      explain: "A pricing link to the delivered commodity's own index (API4) is closely related and stays embedded. A related coal benchmark like API2 is still coal-related. An unrelated index or currency is the case most likely to require separation.",
      questionType: "sorting",
    },
  ],
  "m4t4": [
    {
      q: "Arrange these hedge accounting steps from the lesson in the order they must occur for the Mozambique coal exporter's Q3 hedge:",
      options: [
        "Designate the hedging relationship between the forecast sales and the API4 futures",
        "Document the risk management objective and how effectiveness will be assessed at inception",
        "Assess effectiveness on an ongoing qualitative basis under IFRS 9",
      ],
      explain: "Hedge accounting requires designation of the relationship first, formal documentation at inception, and then ongoing qualitative effectiveness assessment — in that order, not retroactively.",
      questionType: "sorting",
    },
    {
      q: "Arrange these outcomes based on the lesson's de-designation guidance, from the forecast sale still being expected to no longer being expected:",
      options: [
        "The hedge is de-designated but the forecast sale is still expected — amounts in OCI remain there",
        "The forecast sale occurs and is recognised in profit — the OCI amount is reclassified to P&L to match it",
        "The forecast transaction is no longer expected to occur at all — the accumulated OCI is reclassified to P&L immediately",
      ],
      explain: "The lesson's de-designation guidance covers three distinct outcomes: OCI amounts stay parked if the sale is still expected, get reclassified to match the sale when it happens, or get reclassified immediately if the sale is no longer expected at all.",
      questionType: "sorting",
    },
  ],
  "m4t5": [
    {
      q: "Arrange these steps in calculating the sulphur inventory write-down from the lesson, from the raw inputs to the final total:",
      options: [
        "Calculate NRV per MT: selling price $155 minus selling costs $8, equalling $147/MT",
        "Calculate the per-MT write-down: cost $180 minus NRV $147, equalling $33/MT",
        "Calculate the total write-down: $33/MT multiplied by 20,000 MT, equalling $660,000",
      ],
      explain: "The write-down calculation flows from NRV per MT, to the per-MT write-down amount, to the total write-down across the full 20,000 MT holding — each step building on the previous one.",
      questionType: "sorting",
    },
    {
      q: "Arrange these events in the sulphur write-down and reversal scenario in chronological order:",
      options: [
        "Sulphur is purchased at a cost of $180/MT",
        "Market price falls and the inventory is written down to an NRV of $147/MT",
        "The following quarter, NRV recovers to $175/MT and a partial reversal is recognised, capped at original cost",
      ],
      explain: "The scenario moves through time from the original purchase, to a write-down when price falls below cost, to a partial reversal (capped at original cost, never exceeding it) when price later recovers.",
      questionType: "sorting",
    },
  ],
  "m4t6": [
    {
      q: "Arrange these figures from the onerous contract worked example in the order they are calculated:",
      options: [
        "Cost of fulfilling the contract at a loss: 100,000 MT × ($130 − $105) = $2,500,000",
        "Cost of exiting the contract (the penalty): $500,000",
        "The provision recognised: the lower of the two, $500,000",
      ],
      explain: "The example first calculates the fulfilment loss ($2.5m), then the exit penalty ($0.5m), and finally recognises the lower of the two as the provision — since the trader would rationally choose the cheaper option.",
      questionType: "sorting",
    },
    {
      q: "Arrange these steps in the required IAS 37 sequence when both inventory and an onerous contract are involved, from asset impairment to the remaining provision:",
      options: [
        "First recognise any impairment loss on assets dedicated to the contract, such as related inventory written down to NRV under IAS 2",
        "Determine the remaining unavoidable loss not already captured by that inventory write-down",
        "Recognise an onerous contract provision for that remaining amount",
      ],
      explain: "IAS 37 requires dedicated-asset impairment (like an IAS 2 inventory write-down) to be recognised first; only the remaining unavoidable loss not already captured by that write-down is then covered by a separate onerous contract provision.",
      questionType: "sorting",
    },
    {
      q: "Arrange the steps to calculate and recognise an onerous contract provision under IAS 37:",
      options: [
        "Identify that unavoidable costs exceed expected economic benefits",
        "Calculate the cost of fulfilling the contract",
        "Calculate the penalty or cost to exit the contract",
        "Recognise the lower of the two amounts as the provision",
      ],
      explain: "First identify the contract is onerous (costs exceed benefits). Then calculate the cost to fulfil and the cost to exit. The provision recognised is the lower of these two amounts.",
      questionType: "sorting",
    },
  ],
  "m5t1": [
    {
      q: "Arrange these trade finance instruments from the lesson from the one offering the strongest payment guarantee to the one offering the least:",
      options: [
        "Letter of Credit (LC) — a bank's conditional undertaking to pay against conforming documents",
        "Standby Letter of Credit (SBLC) — a performance guarantee only drawn on default",
        "Documentary Collection — the bank handles documents but does not guarantee payment",
      ],
      explain: "An LC provides a direct payment undertaking against documents. An SBLC only pays out if something goes wrong (a guarantee, not a primary payment method). A documentary collection offers the least protection, since the bank merely handles documents without guaranteeing payment.",
      questionType: "sorting",
    },
    {
      q: "Arrange these financing instruments from the lesson from financing a single future shipment to financing a revolving pool of assets:",
      options: [
        "Pre-export finance (PXF) — lending against a confirmed offtake contract, repaid from sale proceeds",
        "Borrowing Base facility — revolving credit secured against a fluctuating pool of inventory and receivables",
      ],
      explain: "Pre-export finance is tied to a specific confirmed offtake contract and repaid from those proceeds, while a borrowing base facility is broader — a revolving facility secured against a constantly changing pool of inventory and receivables.",
      questionType: "sorting",
    },
    {
      q: "Arrange the documentary credit (LC) payment process in chronological order:",
      options: [
        "Buyer's bank issues the Letter of Credit",
        "Seller ships the goods and obtains the Bill of Lading",
        "Seller presents conforming documents to the bank",
        "Bank pays the seller against conforming documents",
      ],
      explain: "The buyer's bank issues the LC first. The seller then ships goods and obtains the B/L and other documents. The seller presents conforming documents to the bank, which then pays the seller.",
      questionType: "sorting",
    },
  ],
  "m5t2": [
    {
      q: "Arrange these compliance actions from the lesson in the order a trader should perform them relative to a new counterparty relationship:",
      options: [
        "Identify the ultimate beneficial owner (UBO) at onboarding",
        "Screen the counterparty against OFAC, EU and UN sanctions lists at onboarding",
        "Continue sanctions screening at the transaction level for every subsequent trade",
      ],
      explain: "UBO identification and sanctions screening both happen at onboarding, but screening doesn't stop there — it must continue at the transaction level for every subsequent trade with that counterparty.",
      questionType: "sorting",
    },
  ],
  "m5t3": [
    {
      q: "Arrange these greenhouse gas emission scopes from the lesson from most directly controlled by the trader to least directly controlled:",
      options: [
        "Scope 1 — direct emissions from owned operations",
        "Scope 2 — indirect emissions from purchased electricity",
        "Scope 3 — downstream combustion of the coal they sell",
      ],
      explain: "Scope 1 covers direct emissions from a trader's own operations, Scope 2 covers indirect emissions from purchased energy, and Scope 3 — the dominant category for coal traders — covers downstream combustion by end-users, which is the least directly controlled.",
      questionType: "sorting",
    },
    {
      q: "Arrange these effects of CBAM on African coal exports in the causal order described in the lesson:",
      options: [
        "CBAM prices the carbon embedded in certain imports into the EU",
        "This raises the landed cost of carbon-intensive goods like coal in Europe",
        "European demand for South African and Mozambican coal declines, shifting trade toward India, Pakistan and the Middle East",
      ],
      explain: "CBAM's carbon pricing raises the effective cost of importing coal into Europe, which in turn reduces European demand and shifts export volumes toward alternative markets like India, Pakistan, and the Middle East.",
      questionType: "sorting",
    },
  ],
  "m5t4": [
    {
      q: "Arrange these steps in calculating AfriCoal Trading Ltd's gross margin per MT, from the individual inputs to the final figure:",
      options: [
        "Start with the sale revenue: $128/MT (CIF Karachi)",
        "Subtract the purchase cost: $115/MT (FOB Beira)",
        "Subtract freight and insurance: $6/MT, arriving at $7/MT gross margin",
      ],
      explain: "Gross margin per MT is built by starting with sale revenue, subtracting the purchase cost, and then subtracting the freight/insurance the seller bears under CIF — arriving at the $7/MT margin in the capstone example.",
      questionType: "sorting",
    },
  ],
};

export const OPENFINANCE_SORTING_QUESTIONS = {
  "of_m1t1": [
    {
      q: "Arrange these approaches to sharing financial data with a third party from least secure/legacy to most secure/modern:",
      options: [
        "Manual PDF export — customer downloads and shares statements",
        "Screen scraping — customer shares banking credentials directly with a third party",
        "Standardised, consent-based APIs — the third party receives only authorised data via a secure token",
      ],
      explain: "The lesson contrasts manual export and insecure screen scraping (which requires sharing raw credentials) with the modern API-based, consent-driven model that Open Banking introduces as the secure replacement.",
      questionType: "sorting",
    },
  ],
  "of_m1t2": [
    {
      q: "Arrange these product categories from the narrowest scope (Open Banking) to items that only appear once you reach Open Finance's broader scope:",
      options: [
        "Current accounts and debit/credit card accounts — covered under Open Banking",
        "Mortgages and personal loans — covered under Open Finance's broader banking scope",
        "Insurance and pension products — covered only once the scope expands to Open Finance",
      ],
      explain: "Open Banking's narrow scope covers payment accounts and cards. Open Finance broadens this to include mortgages and loans, and further still to insurance and pensions — products entirely outside Open Banking's original scope.",
      questionType: "sorting",
    },
    {
      q: "Arrange these permissioned data sharing scopes from narrowest to broadest:",
      options: [
        "Open Banking — payment accounts only (current accounts, cards)",
        "Open Finance — banking, investments, insurance, pensions, loans",
        "Open Data — telecoms, energy, utilities, and government data",
      ],
      explain: "Open Banking is the narrowest (payment accounts only), Open Finance extends to all financial products, and Open Data extends beyond financial services to all sectors of the economy.",
      questionType: "sorting",
    },
  ],
  "of_m1t3": [
    {
      q: "Arrange these ecosystem parties from the lesson from the entity that owns the data to the entity that governs the whole system:",
      options: [
        "The customer — the data owner whose consent is required for anything to happen",
        "TPPs and LFIs — the parties that exchange data and services with that consent",
        "The CBUAE — the regulator that licenses and supervises all participants",
      ],
      explain: "The customer sits at the centre as the data owner. TPPs and LFIs are the operational parties exchanging data and services under the customer's consent. The CBUAE sits above both, licensing and supervising the entire ecosystem.",
      questionType: "sorting",
    },
  ],
  "of_m1t4": [
    {
      q: "Arrange these Open Banking/Open Finance milestones from the lesson in chronological order:",
      options: [
        "EU — PSD2 introduced in 2018",
        "UK — CMA Order also in 2018, ordering the nine largest banks (CMA9) to implement Open Banking",
        "Australia — Consumer Data Right (CDR) introduced in 2019",
        "UAE — Open Finance Regulation issued in 2024, updated in 2025",
      ],
      explain: "The lesson traces the global timeline from the EU's PSD2 and the UK's CMA Order in 2018, to Australia's CDR in 2019, through to the UAE's more recent and more ambitious Open Finance Regulation in 2024–2025.",
      questionType: "sorting",
    },
    {
      q: "Arrange these jurisdictions from the lesson from the narrowest initial scope to the broadest scope from the outset:",
      options: [
        "EU (PSD2) — focused on payment accounts",
        "Australia (CDR) — an economy-wide framework starting with banking, then energy, then telecoms",
        "UAE (Open Finance) — Open Finance plus insurance plus service initiation from the very start",
      ],
      explain: "PSD2 began narrowly with payment accounts. Australia's CDR was designed to expand economy-wide but started with banking. The UAE, by contrast, launched with the broadest scope of the three from day one — Open Finance, insurance, and service initiation together.",
      questionType: "sorting",
    },
  ],
  "of_m1t5": [
    {
      q: "Arrange these economic impact points from the lesson from the general benefit to the specific quantified figure:",
      options: [
        "Open Finance drives competition and lowers barriers to entry",
        "This fosters an innovation-friendly fintech ecosystem",
        "McKinsey estimated this could add 1.5% to UAE GDP by 2030",
      ],
      explain: "The lesson builds from the general economic benefits of competition and innovation to a specific, quantified outcome: McKinsey's estimate that Open Finance could add 1.5% to UAE GDP by 2030.",
      questionType: "sorting",
    },
  ],
  "of_m2t2": [
    {
      q: "Arrange these Open Finance Regulation timeline events in chronological order:",
      options: [
        "2023 — CBUAE issues Circular 7 of 2023, mandating the Open Finance framework",
        "April 2024 — published in the Official Gazette",
        "27 June 2024 — officially issued",
        "10 July 2025 — updated by Circular 3 of 2025, coming into force",
      ],
      explain: "The regulation's timeline runs from the initial 2023 mandating circular, through Official Gazette publication and official issuance in 2024, to the Circular 3 of 2025 update coming into force in July 2025.",
      questionType: "sorting",
    },
    {
      q: "Arrange these licensing categories from the lesson from an entity automatically covered to one that must actively apply:",
      options: [
        "Deemed licensees — already CBUAE-licensed entities such as banks, deemed to hold an Open Finance Licence",
        "New entrants — persons or entities not currently licensed by the CBUAE",
        "Free zone entities (ADGM/DIFC) wishing to operate onshore — must apply for an Open Finance Licence",
      ],
      explain: "Deemed licensees are automatically covered by virtue of their existing CBUAE licence (though still needing approval to go live). New entrants must apply from scratch. Free zone entities sit outside the onshore framework entirely unless they specifically apply.",
      questionType: "sorting",
    },
  ],
  "of_m2t3": [
    {
      q: "Arrange these architectural models from the lesson from the fragmented approach to the UAE's centralised alternative:",
      options: [
        "EU/UK model — each bank builds its own separate Open Banking API",
        "Resulting fragmentation — TPPs must integrate with dozens of different implementations",
        "UAE model — all participants connect once to a single centralised API Hub managed by Nebras",
      ],
      explain: "The lesson contrasts the EU/UK's bank-by-bank API model, which creates fragmentation for TPPs integrating with many different implementations, with the UAE's centralised Hub model that solves this with a single connection point.",
      questionType: "sorting",
    },
    {
      q: "Arrange the API request flow through the UAE's centralised API Hub in the correct order:",
      options: [
        "TPP sends an API request to the Hub",
        "Hub validates the TPP's credentials and consent",
        "Hub routes the request to the appropriate LFI",
        "LFI returns the data through the Hub back to the TPP",
      ],
      explain: "The TPP sends the request to the Hub, which validates credentials and consent before routing to the correct LFI. The LFI responds through the Hub back to the TPP — the Hub is the single intermediary.",
      questionType: "sorting",
    },
  ],
  "of_m2t4": [
    {
      q: "Arrange these service initiation examples from the lesson from the narrowest (payments only) to the broadest scope:",
      options: [
        "Payment Initiation (PISP) — triggering payments from a customer's bank account, as in PSD2/UK",
        "UAE Service Initiation — also includes investment orders and insurance applications",
        "UAE Service Initiation — also includes loan applications and savings automation",
      ],
      explain: "Standard payment initiation is limited to triggering payments. The UAE's service initiation goes further, additionally covering investment orders and insurance applications, and further still to loan applications and automated savings.",
      questionType: "sorting",
    },
  ],
  "of_m2t5": [
    {
      q: "Arrange these approval requirements from the lesson in the order a deemed licensee must satisfy them before going live:",
      options: [
        "Hold an existing CBUAE licence, which confers deemed Open Finance Licence status",
        "Obtain specific CBUAE approval to conduct Open Finance activities",
        "Meet governance, control, capital, and insurance requirements as part of that approval",
      ],
      explain: "Being a deemed licensee is only the starting point — the entity must still obtain specific CBUAE approval before going live, and that approval itself depends on meeting governance, control, capital, and insurance requirements.",
      questionType: "sorting",
    },
  ],
  "of_m3t1": [
    {
      q: "Arrange the steps in a typical Open Finance API call in the correct order:",
      options: [
        "Authentication — TPP presents an access token",
        "Consent check — Hub verifies the customer has consented",
        "Request — TPP calls the API endpoint (e.g. GET /transactions)",
        "Response — LFI returns JSON data to the TPP",
        "Logging — the request and response are logged for audit",
      ],
      explain: "The API call flow: authenticate with a token, verify consent, make the request, receive the response, and log everything for audit and regulatory purposes.",
      questionType: "sorting",
    },
  ],
  "of_m3t2": [
    {
      q: "Arrange these data model standards from the lesson from an industry-led standard to a regulator-mandated one:",
      options: [
        "FDX — an industry-led standard used in North America and increasingly globally",
        "Berlin Group NextGenPSD2 — the EU standard for PSD2 compliance",
        "UAE Open Finance Standards — a regulator-mandated standard using a centralised hub model",
      ],
      explain: "The lesson contrasts FDX as an industry-led standard with the EU's Berlin Group standard and the UAE's own regulator-mandated Open Finance Standards, which incorporate FDX principles but adapt them for a centralised hub.",
      questionType: "sorting",
    },
    {
      q: "Arrange these reasons FDX matters from the lesson in the order they are presented, from the problem it solves to the resulting scale:",
      options: [
        "Before FDX, each institution built its own API with different field names and structures",
        "FDX provides a common specification so a TPP implements once and connects to all compliant institutions",
        "As a result, over 32 million consumer accounts now use the FDX API",
      ],
      explain: "The lesson explains FDX's value by first describing the fragmentation problem it solves, then the common-specification solution, and finally the resulting adoption scale of over 32 million consumer accounts.",
      questionType: "sorting",
    },
  ],
  "of_m3t3": [
    {
      q: "Arrange these OAuth 2.0 token concepts from the lesson from the shortest-lived to the mechanism that avoids re-authentication:",
      options: [
        "Access token — short-lived, typically minutes to hours",
        "Refresh token — allows obtaining new access tokens without re-authenticating the customer",
        "Token revocation — the customer or LFI can revoke tokens at any time",
      ],
      explain: "Access tokens are deliberately short-lived. Refresh tokens extend usability without requiring the customer to re-authenticate each time. Revocation sits above both, allowing either party to end access entirely at any point.",
      questionType: "sorting",
    },
  ],
  "of_m3t6": [
    {
      q: "Arrange these outcomes from the lesson's 'before and after standardisation' comparison, from the fragmented state to the standardised solution:",
      options: [
        "Before: Bank A calls a field 'amount', Bank B calls it 'value', Bank C calls it 'amt'",
        "Before: a TPP integrating with 10 banks needs 10 different parsers",
        "After: every bank returns 'amount' consistently, and a TPP writes one parser that works with all of them",
      ],
      explain: "The lesson illustrates the standardisation problem first — inconsistent field names forcing many separate parsers — and then the standardised outcome, where consistent naming lets a single parser work across all compliant banks.",
      questionType: "sorting",
    },
  ],
  "of_m4t1": [
    {
      q: "Arrange the consent lifecycle in Open Finance in the correct order:",
      options: [
        "Request — TPP requests access to specific data (defined by scopes)",
        "Authentication — customer authenticates with their bank (SCA)",
        "Grant — customer approves or denies the request",
        "Token issuance — TPP receives an access token with granted scopes",
        "Expiry/revocation — consent expires or customer revokes it",
      ],
      explain: "The consent lifecycle: TPP requests access, customer authenticates via SCA, customer grants or denies, a token is issued, the TPP uses it, and eventually the consent expires or is revoked.",
      questionType: "sorting",
    },
  ],
  "of_m4t2": [
    {
      q: "Arrange these data protection regimes from the lesson from the federal baseline to the stricter free zone regimes:",
      options: [
        "The federal PDPL — Federal Decree-Law No. 45 of 2021",
        "DIFC Data Protection Law — DIFC Law No. 5 of 2020, aligned with GDPR",
        "ADGM Data Protection Regulations — 2021, also aligned with GDPR",
      ],
      explain: "The lesson describes the federal PDPL as the baseline, with the DIFC and ADGM free zones each maintaining their own, generally stricter, GDPR-aligned data protection regimes on top of it.",
      questionType: "sorting",
    },
  ],
  "of_m4t5": [
    {
      q: "Arrange the incident response lifecycle in the correct order:",
      options: [
        "Detection — identify that an incident has occurred",
        "Containment — limit the damage (revoke tokens, disconnect TPPs)",
        "Assessment — determine scope and severity of the breach",
        "Notification — inform the CBUAE and affected customers",
        "Remediation — fix the vulnerability and restore services",
      ],
      explain: "The incident response lifecycle: detect → contain → assess → notify → remediate → (and later) post-incident review. Each step must be completed before moving to the next.",
      questionType: "sorting",
    },
  ],
  "of_m5t1": [
    {
      q: "Arrange these customer experiences from the lesson from the pre-Open Finance problem to the Open Finance solution:",
      options: [
        "Before: log in to each bank's app separately",
        "Before: manually compile a holistic view of finances, or use insecure screen scraping",
        "After: a single app shows a complete financial picture, updated in real time",
      ],
      explain: "The lesson contrasts the fragmented pre-Open Finance experience — separate logins and manual compilation or insecure scraping — with the Open Finance outcome of a single, real-time aggregated view.",
      questionType: "sorting",
    },
  ],
  "of_m5t2": [
    {
      q: "Arrange these steps in how payment initiation works at checkout from the lesson, in the order they occur:",
      options: [
        "Checkout — the customer selects 'Pay by bank' at a merchant",
        "Bank selection — the customer selects their bank",
        "Redirect — the customer is redirected to their bank's authentication flow (SCA)",
      ],
      explain: "The lesson describes the payment initiation flow starting with the customer's checkout selection, then bank selection, and then redirection to the bank's own SCA flow — before consent, payment, and confirmation follow.",
      questionType: "sorting",
    },
    {
      q: "Arrange the payment initiation flow at checkout in the correct order:",
      options: [
        "Customer selects 'Pay by bank' at the merchant checkout",
        "Customer is redirected to their bank for strong authentication (SCA)",
        "Customer reviews the payee, amount, and grants consent",
        "Bank initiates the transfer from the customer's account",
        "Merchant and customer receive payment confirmation",
      ],
      explain: "Payment initiation: customer selects pay-by-bank, is redirected to their bank for SCA, reviews and consents to the specific payee and amount, the bank initiates the transfer, and both parties receive confirmation.",
      questionType: "sorting",
    },
  ],
  "of_m5t5": [
    {
      q: "Arrange these six capstone strategy steps from the lesson in the order they are presented:",
      options: [
        "Step 1: Define your value proposition",
        "Step 2: Regulatory compliance",
        "Step 3: Technical architecture",
        "Step 4: Security measures",
        "Step 5: Go-to-market",
        "Step 6: Risk management",
      ],
      explain: "The capstone walks through building an Open Finance strategy in exactly this sequence: value proposition first, then regulatory compliance, technical architecture, security, go-to-market, and finally risk management.",
      questionType: "sorting",
    },
  ],
};