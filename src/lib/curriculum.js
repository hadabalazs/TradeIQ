// TradeIQ curriculum: 5 modules, each with topics (lesson + quiz).
// Focus: Coal and Sulphur commodity trading in Africa.
// Lesson content uses markdown. Quiz: array of { q, options[4], answer (index), explain }.
// Sources: Argus, S&P Global Platts, Reuters, USGS, ICE, RBCT data, OCP/Argus reports (2024-2026).

export const MODULES = [
  {
    id: "m1",
    title: "Foundations of Physical Commodity Trading",
    subtitle: "The building blocks of the physical trade",
    topics: [
      {
        id: "m1t1",
        title: "What is a Commodity?",
        lesson: `## What is a Commodity?

A **commodity** is a raw material or primary product that can be bought and sold — and crucially, is **fungible**: one unit is interchangeable with another of the same grade and specification. A tonne of API4-grade thermal coal from one South African producer is, for trading purposes, the same as a tonne from another, provided it meets the same calorific value, ash and sulphur specifications.

This contrasts with **financial instruments** (shares, bonds), which derive value from contractual or ownership rights rather than from a tangible, deliverable good.

### The commodities in focus: coal and sulphur
- **Thermal coal** — burned in power stations to generate electricity. South Africa is a major exporter, pricing off the **API4** benchmark (FOB Richards Bay).
- **Coking (metallurgical) coal** — used to make coke for steelmaking. Mozambique's Tete province is a key African source.
- **Sulphur** — a chemical commodity recovered as a **byproduct** of oil refining and metal smelting, essential for producing sulphuric acid used in phosphate fertiliser manufacturing.

### Why sulphur is a byproduct
Sulphur is rarely mined directly. It is **recovered** as a byproduct of:
1. **Oil refining** — removing sulphur from crude oil (desulphurisation) to meet fuel standards.
2. **Natural gas processing** — removing hydrogen sulphide (H₂S) from sour gas.
3. **Non-ferrous metal smelting** — sulphur is driven off when sulphide ores (such as copper or zinc) are processed.

Because supply is tied to refinery, gas plant and smelter activity rather than to sulphur demand itself, its price can be volatile and supply is relatively **inelastic** to sulphur price — a defining feature of this market.

{{diagram:commodity_types}}`,
        quiz: [
          {
            q: "What defining property makes a commodity interchangeable between suppliers, and why does it matter?",
            answerText: "Fungibility — one unit of a given grade is interchangeable with another of the same specification. This allows commodities to trade against standard benchmarks like API4, rather than each lot being priced individually.",
            explain: "Fungibility is the defining property that enables standardized commodity trading against benchmarks.",
            questionType: "flashcard"
          },
          {
            q: "Sulphur is primarily obtained as a byproduct of which processes?",
            options: ["Coal mining and gas flaring", "Oil refining, gas processing and metal smelting", "Iron ore sintering and cement production", "Phosphate mining and fertiliser production"],
            answer: 1,
            explain: "Sulphur is recovered when crude oil is desulphurised, when sour gas is processed, and when sulphide ores are smelted — making it a byproduct rather than a primary mined product."
          },
          {
            q: "A corporate _______ derives value from contractual rights to cash flows, not from a deliverable physical good, making it a financial instrument.",
            answerText: "bond",
            explain: "A bond derives value from contractual rights to cash flows, not from a deliverable physical good — it is a financial instrument.",
            questionType: "fill-in-the-blank"
          },
          {
            q: "Thermal coal is primarily used for:",
            options: ["Steelmaking", "Power generation (electricity)", "Fertiliser production", "Battery manufacturing"],
            answer: 1,
            explain: "Thermal coal is burned in power stations to generate electricity. Coking coal, by contrast, is used in steelmaking."
          }
        ]
      },
      {
        id: "m1t2",
        title: "How Commodity Markets Work",
        lesson: `## How Commodity Markets Work

Physical commodities trade across several overlapping market types.

### Spot, forward, futures
- **Spot market** — buy/sell for immediate (or near-immediate) delivery at today's price.
- **Forward contract** — a private (OTC) agreement to deliver a specific quantity at a future date and agreed price. Customisable, but carries counterparty risk.
- **Futures contract** — a standardised, exchange-traded forward (e.g. **API4 coal futures on ICE**). Cleared by the exchange, marked-to-market daily, used heavily for **price risk hedging**.

### Price benchmarks
Most physical trades are priced *against* a published benchmark rather than negotiated from scratch:
- **API2** — coal index for delivery into Amsterdam-Rotterdam-Antwerp (ARA). The key European thermal coal benchmark.
- **API4** — coal index for **FOB Richards Bay** (South Africa). Calculated as the average of the **Argus fob Richards Bay 6,000** assessment and the **McCloskey Richards Bay FOB marker**. API4 futures trade on **ICE Futures Europe**.
- **Platts / Argus sulphur assessments** — price assessments for sulphur in various forms (solid, molten) and locations (FOB Middle East, FOB Vancouver, CFR China, etc.).

### Who sets the price?
No single actor. Benchmarks aggregate reported deals and bids/offers; the physical price is usually **benchmark ± a premium/discount** reflecting quality, location and timing. For South African thermal coal, the API4 index is the reference point for most export trades out of Richards Bay.

{{diagram:market_types}}`,
        quiz: [
          {
            q: "Which benchmark refers to thermal coal FOB Richards Bay?",
            options: ["API2 — the benchmark for thermal coal delivered into Amsterdam-Rotterdam-Antwerp (ARA)", "API4 — the benchmark for thermal coal loaded FOB at Richards Bay, South Africa", "ICE Brent — the global crude oil futures benchmark traded on ICE Futures Europe", "API8 — the benchmark for thermal coal delivered CFR into South China"],
            answer: 1,
            explain: "API4 is the index for coal loaded FOB at Richards Bay, South Africa. API2 refers to coal delivered into ARA (Amsterdam-Rotterdam-Antwerp)."
          },
          {
            q: "The API4 index is calculated as the average of:",
            options: ["The LME copper price and Platts coal", "The Argus fob Richards Bay 6,000 assessment and the McCloskey Richards Bay FOB marker", "Two Platts sulphur assessments", "The ICE Brent and WTI crude prices"],
            answer: 1,
            explain: "API4 averages the Argus fob Richards Bay 6,000 assessment and the McCloskey Richards Bay FOB marker. API4 futures trade on ICE Futures Europe."
          },
          {
            q: "A key feature distinguishing a futures contract from a forward is that futures are:",
            options: ["Always physically delivered with no cash settlement option", "Standardised, exchange-traded and centrally cleared with daily mark-to-market", "Priced below the spot price to attract buyers in thin markets", "Free of counterparty risk because they are privately negotiated OTC"],
            answer: 1,
            explain: "Futures are standardised, exchange-traded and centrally cleared with daily mark-to-market, reducing counterparty risk compared with bilateral OTC forwards."
          },
          {
            q: "A physical cargo is most commonly priced as:",
            options: ["A fixed price unrelated to any index", "Benchmark price plus or minus a quality/location premium", "The exchange margin requirement", "Whatever the bank's LC states"],
            answer: 1,
            explain: "Physical deals are typically priced off a published benchmark with a premium or discount reflecting grade, location and timing."
          }
        ]
      },
      {
        id: "m1t3",
        title: "Key Players in the Supply Chain",
        lesson: `## Key Players in the Supply Chain

A physical commodity moves through many hands between mine and end-user.

- **Producers** — the mines and processors that bring raw material to market. For South African thermal coal: **Thungela Resources** (a leading pure-play thermal coal producer/exporter), **Exxaro Resources**, **Seriti Resources**, and **ARM Coal**. For Mozambique coking coal: **Vulcan** (which acquired Vale's Moatize mine in 2022).
- **Trading houses** — intermediaries that buy, finance, transport and sell commodities, taking ownership and price risk. The giants: **Glencore, Trafigura, Vitol, Mercuria**.
- **Offtakers** — industrial end-users who consume the material: **power utilities** (thermal coal, e.g. Eskom domestically and overseas power generators), **steel mills** (coking coal), **fertiliser plants** (sulphur for sulphuric acid).
- **Logistics providers** — **Transnet Freight Rail** moves coal from Mpumalanga mines to Richards Bay; shipping companies move bulk cargoes by sea.
- **Inspection firms** — independent surveyors who certify quantity and quality (**SGS, Intertek, Alex Stewart**), critical to triggering payment.
- **Banks** — provide **trade finance** (letters of credit, pre-export finance) that lets the cycle function.

Each party reduces a specific friction — price risk, logistics, quality verification, or financing.

{{diagram:supply_chain_flow}}`,
        quiz: [
          {
            q: "Which firms are well-known independent inspection/surveying companies?",
            options: ["Trafigura and Glencore — trading houses that buy and sell commodities", "SGS and Intertek — independent firms certifying cargo quantity and quality", "Vale and Vulcan — mining companies that extract and sell coal", "Exxaro and Seriti — South African coal producers operating mines"],
            answer: 1,
            explain: "SGS and Intertek are leading independent inspection firms that certify cargo quantity and quality, often a precondition for payment."
          },
          {
            q: "What distinguishes a broker from a trading house?",
            options: ["A broker takes ownership of the cargo and bears price risk like a trading house", "A broker only matches buyers and sellers for a fee without taking title", "A broker provides letters of credit and trade finance to counterparties", "A broker operates the mine and extracts the raw material directly"],
            answer: 1,
            explain: "Brokers facilitate deals for a commission but do not take ownership or price risk, unlike trading houses which take title and bear market risk."
          },
          {
            q: "Thungela Resources, Exxaro and Seriti are examples of:",
            options: ["Offtakers — industrial end-users consuming the commodity", "South African thermal coal producers operating mines in Mpumalanga", "Inspection firms certifying cargo quantity and quality at ports", "Shipping lines transporting bulk cargoes by sea"],
            answer: 1,
            explain: "These are major South African coal producers. Thungela is a leading pure-play thermal coal exporter; Exxaro and Seriti are also significant producers."
          },
          {
            q: "A fertiliser plant buying sulphur acts in the supply chain as a(n):",
            options: ["Producer — the mine or plant that extracts the raw material", "Offtaker — the industrial end-user consuming the commodity in production", "Broker — an intermediary matching buyers and sellers for a fee", "Inspection firm — an independent surveyor certifying quantity and quality"],
            answer: 1,
            explain: "An offtaker is the industrial end-user consuming the commodity — here, a fertiliser plant consuming sulphur to make sulphuric acid for phosphate processing."
          }
        ]
      },
      {
        id: "m1t4",
        title: "Incoterms in Commodity Trade",
        lesson: `## Incoterms in Commodity Trade

**Incoterms** (International Commercial Terms) define where risk, cost and responsibility pass from seller to buyer. They directly affect **when revenue is recognised** under IFRS 15, because they signal when *control* transfers.

### The key terms
- **FOB (Free on Board)** — seller delivers and loads the goods onto the vessel at the named port. **Risk transfers once goods are on board.** Buyer arranges and pays freight and insurance. This is the standard Incoterm for Richards Bay coal exports (FOB RBCT).
- **CFR (Cost and Freight)** — seller pays freight to destination, but risk still passes at the loading port (on board).
- **CIF (Cost, Insurance and Freight)** — like CFR, but seller also pays **insurance** to destination. Risk still passes at loading; cost passes at destination.
- **DAP (Delivered at Place)** — seller bears risk and cost all the way to the named destination.

### Why it matters for IFRS
Under IFRS 15, revenue is recognised when **control** passes. For FOB, control typically passes at the load port (revenue earlier). For DAP, control passes at destination (revenue later). The Incoterm is strong evidence — though not the sole determinant — of the transfer-of-control point.

For South African coal exports, most trades are **FOB Richards Bay**, meaning control and revenue recognition occur when the coal is loaded onto the vessel at RBCT.

{{diagram:incoterms_risk_transfer}}`,
        quiz: [
          {
            q: "Under FOB, risk transfers from seller to buyer:",
            options: ["When the LC is opened — at the moment the buyer's bank issues the letter of credit", "When goods are loaded on board the vessel at the named loading port", "On arrival at the destination port — when the cargo reaches the buyer's location", "When the invoice is issued — at the point the seller generates the commercial invoice"],
            answer: 1,
            explain: "FOB transfers risk once the goods are on board the vessel at the named loading port; the buyer then bears freight and insurance."
          },
          {
            q: "What does CIF add compared to CFR?",
            options: ["Seller arranges customs clearance at the destination port on behalf of the buyer", "Seller additionally pays insurance to the destination port on top of freight costs", "Risk transfers from seller to buyer at the destination port rather than at loading", "Buyer pays the ocean freight cost directly to the shipping carrier rather than the seller"],
            answer: 1,
            explain: "CIF = CFR plus insurance: the seller additionally pays insurance to the destination, though risk still passes at the loading port."
          },
          {
            q: "Arrange these Incoterms from the seller bearing the LEAST cost/risk to the MOST:",
            options: ["FOB (Free on Board)", "CFR (Cost and Freight)", "CIF (Cost, Insurance and Freight)", "DAP (Delivered at Place)"],
            answer: 0,
            explain: "FOB transfers risk at loading; CFR adds freight cost; CIF adds insurance; DAP means seller bears all risk and cost to destination.",
            questionType: "sorting"
          },
          {
            q: "Which Incoterm keeps risk and cost with the seller all the way to the buyer's location?",
            options: ["FOB", "CFR", "CIF", "DAP"],
            answer: 3,
            explain: "DAP (Delivered at Place) means the seller bears risk and cost until the goods reach the named destination."
          },
          {
            q: "Why do Incoterms matter for IFRS 15?",
            options: ["They set the applicable tax rate for the transaction — determining VAT or customs duty percentages on the sale", "They are strong evidence of when control transfers, affecting revenue recognition timing under IFRS 15", "They determine the hedge ratio — specifying the proportion of the cargo that must be hedged against price movements", "They fix the benchmark price — locking the published index value used for provisional pricing on the shipment date"],
            answer: 1,
            explain: "Incoterms indicate when control of the goods passes to the buyer, which under IFRS 15 drives the timing of revenue recognition."
          }
        ]
      },
      {
        id: "m1t5",
        title: "Trade Documentation",
        lesson: `## Trade Documentation

Physical trade runs on documents. Each one triggers a legal or financial consequence.

- **Bill of Lading (B/L)** — issued by the carrier; it is the *document of title*, a receipt for the goods and evidence of the contract of carriage. Whoever holds the original B/L controls the cargo. Its date often marks the shipment/delivery point — critical for FOB revenue recognition.
- **Certificate of Origin** — states the country where goods were produced; needed for customs, tariffs and compliance.
- **Quality Certificate (assay / analysis)** — independent lab confirmation of grade/specification (e.g. calorific value, ash content, sulphur content, volatile matter for coal; purity for sulphur). Triggers acceptance and final pricing.
- **Packing List** — itemises the cargo.
- **Commercial Invoice** — the seller's demand for payment, stating price and terms.
- **Letter of Credit (LC)** — a bank's conditional payment undertaking; pays the seller once *conforming documents* are presented.

Under a **documentary credit**, the bank pays against documents, not against the physical goods — so document accuracy is everything. A single discrepancy in the B/L or quality certificate can delay payment by weeks.

{{diagram:lc_payment_flow}}`,
        quiz: [
          {
            q: "Which document is the document of title that controls the cargo?",
            options: ["Commercial Invoice", "Bill of Lading", "Packing List", "Certificate of Origin"],
            answer: 1,
            explain: "The Bill of Lading is the document of title; whoever holds the original controls the goods. It is also a receipt and evidence of the carriage contract."
          },
          {
            q: "A coal quality certificate (assay) primarily confirms:",
            options: ["The vessel's seaworthiness", "The grade/specification such as calorific value, ash and sulphur content", "The buyer's creditworthiness", "The Incoterm used"],
            answer: 1,
            explain: "The assay is independent confirmation of quality/grade (CV, ash, sulphur, volatiles for coal), which triggers acceptance and often final pricing."
          },
          {
            q: "Under a letter of credit, the issuing bank pays against:",
            options: ["The physical inspection of goods at site", "Conforming documents presented", "The buyer's verbal confirmation", "The benchmark price on payment day"],
            answer: 1,
            explain: "A documentary credit pays against conforming documents, not the goods themselves — so document accuracy is critical."
          },
          {
            q: "Which document specifically supports customs treatment and tariff determination?",
            options: ["Packing List", "Certificate of Origin", "Commercial Invoice", "Bill of Lading"],
            answer: 1,
            explain: "The Certificate of Origin states where goods were produced, which is essential for customs, tariffs and trade-agreement compliance."
          }
        ]
      }
    ]
  },
  {
    id: "m2",
    title: "African Coal & Sulphur Markets",
    subtitle: "Where the world's raw materials come from",
    topics: [
      {
        id: "m2t1",
        title: "Africa's Role in Global Coal and Sulphur Supply",
        lesson: `## Africa's Role in Global Coal and Sulphur Supply

Africa is a significant player in both coal exports and the sulphur-fertiliser value chain.

### Coal
- **South Africa** — the world's **7th-largest coal producer** (approximately 2.6% of global production in 2024). The **Richards Bay Coal Terminal (RBCT)** is one of the largest coal export terminals in the world, exporting **52.1 million metric tons in 2024** (up from 47.2 million in 2023) and **57.66 million metric tons in 2025** — the highest in four years, driven by Transnet rail improvements.
- **Mozambique** — the **Tete province** produces **coking (metallurgical) coal** for steelmaking. Mozambique produced **16.3 million tonnes in 2024**, with **19 million tonnes forecast for 2025**.

### Sulphur and the fertiliser link
- **Morocco** — home to **OCP Group**, the world's largest phosphate producer, holding approximately **70% of the world's phosphate rock reserves**. OCP produces roughly **16 million tonnes of fertiliser annually**. Sulphur is essential: it is converted to **sulphuric acid**, which is used to dissolve phosphate rock.
- **Egypt, Algeria and Tunisia** — also have major phosphate industries, all linked to sulphur demand.

### Why these countries matter
A mix of **geology** (rich, accessible deposits), historical **mining investment**, and **export infrastructure** (RBCT, the Nacala and Beira corridors, Jorf Lasfar port). For coal, South Africa's Mpumalanga coalfields and Mozambique's Tete basin are geologically world-class. For sulphur, the demand pull comes from North and West African phosphate producers.`,
        quiz: [
          {
            q: "Approximately how much coal did the Richards Bay Coal Terminal export in 2025?",
            options: ["About 40 million metric tons", "About 52 million metric tons", "About 58 million metric tons", "About 70 million metric tons"],
            answer: 2,
            explain: "RBCT exported 57.66 million metric tons in 2025 — the highest in four years, up 11% from 2024, driven by Transnet rail improvements."
          },
          {
            q: "Mozambique's Tete province is best known for exporting:",
            options: ["Thermal coal", "Coking (metallurgical) coal", "Sulphur", "Phosphate rock"],
            answer: 1,
            explain: "Tete province is a major coking (metallurgical) coal region for steelmaking, with the Moatize mine as its flagship operation."
          },
          {
            q: "Why is sulphur demand strongly linked to Morocco?",
            options: ["Morocco refines crude oil", "Morocco's OCP Group produces phosphate fertiliser requiring sulphuric acid", "Morocco smelts copper", "Morocco exports thermal coal"],
            answer: 1,
            explain: "OCP Group is the world's largest phosphate producer. Sulphur is converted to sulphuric acid, which is used to process phosphate rock into fertiliser."
          },
          {
            q: "South Africa was ranked approximately what in global coal production in 2024?",
            options: ["1st — the world's largest coal producer, ahead of China and India", "3rd — behind only China and India in global production", "7th — producing approximately 2.6% of global output", "15th — a minor producer with less than 1% of global share"],
            answer: 2,
            explain: "South Africa was the 7th-largest coal producer in 2024, producing approximately 2.6% of global output."
          }
        ]
      },
      {
        id: "m2t2",
        title: "South African Thermal Coal Industry",
        lesson: `## South African Thermal Coal Industry

### The Richards Bay Coal Terminal (RBCT)
RBCT is South Africa's main coal export hub, located at the Port of Richards Bay in KwaZulu-Natal. It is one of the largest coal export terminals in the world, with a design capacity of **91 million tonnes per annum**. Coal arrives by rail from the Mpumalanga coalfields via the **Transnet Freight Rail** line — the efficiency of this corridor directly determines export volumes.

### Export volumes and trends
- **2024**: 52.1 million metric tons (up from 47.2 million in 2023)
- **2025**: 57.66 million metric tons — the highest in four years, an 11% increase driven by Transnet's recovery plan

### Who buys South African coal?
Demand has shifted east. **India is the single largest importer**, accounting for **25.75 million tons (45% of total RBCT shipments)** in 2025. **Pakistan** is the second-largest destination, though it has announced plans to phase out coal imports. Shipments to the **Middle East nearly doubled** to 3.54 million tons. **European demand is declining** due to decarbonisation and the EU's Carbon Border Adjustment Mechanism (CBAM).

### Major producers
- **Thungela Resources** — a leading pure-play producer and exporter of thermal coal, spun off from Anglo American in 2021.
- **Exxaro Resources** — a diversified coal producer supplying both export and domestic (Eskom) markets.
- **Seriti Resources** — a major coal mining company supplying Eskom and export markets.
- **ARM Coal** — a diversified mining investment company with coal interests.

### Pricing
South African thermal coal exports are priced off the **API4** benchmark (FOB Richards Bay). South African high-CV coal was trading near **$96/mt** in early 2026.`,
        quiz: [
          {
            q: "RBCT (Richards Bay Coal Terminal) is associated with which benchmark?",
            options: ["API2 — the benchmark for coal delivered into ARA European ports", "API4 — the benchmark for coal loaded FOB at Richards Bay", "ICE Brent — the crude oil futures benchmark on ICE Futures Europe", "API8 — the benchmark for coal delivered CFR into South China"],
            answer: 1,
            explain: "API4 is the FOB Richards Bay coal index — RBCT is South Africa's main coal export terminal."
          },
          {
            q: "Which country is the single largest importer of South African coal?",
            options: ["China — importing primarily from Indonesia and Australia, not RBCT", "India — importing 25.75 million tons (45% of RBCT shipments) in 2025", "Pakistan — the second-largest destination but phasing out coal imports", "South Korea — a smaller buyer focused on premium-grade thermal coal"],
            answer: 1,
            explain: "India imported 25.75 million tons from RBCT in 2025 — 45% of total shipments — making it the single largest buyer of South African coal."
          },
          {
            q: "Thungela Resources is best described as:",
            options: ["A coal trading house that buys and sells cargoes without owning mines", "A leading pure-play thermal coal producer and exporter, spun off from Anglo American in 2021", "A state-owned rail and port operator moving coal from mines to export terminals", "A fertiliser company consuming sulphur for phosphate production"],
            answer: 1,
            explain: "Thungela is a leading pure-play producer and exporter of thermal coal, spun off from Anglo American in 2021."
          },
          {
            q: "What infrastructure is critical for moving coal from Mpumalanga mines to RBCT?",
            options: ["The LME warehouse network", "Transnet Freight Rail", "The Suez Canal", "The Nacala Corridor"],
            answer: 1,
            explain: "Transnet Freight Rail moves coal from Mpumalanga coalfields to Richards Bay. Rail efficiency directly determines export throughput — its recovery drove the 2025 export increase."
          }
        ]
      },
      {
        id: "m2t3",
        title: "Mozambique Coking Coal",
        lesson: `## Mozambique Coking Coal

### The Tete province
The **Tete province** in central Mozambique contains one of the world's largest untapped coking coal reserves. The **Moatize basin** is the flagship coal region, producing **hard coking coal** for steelmaking.

### The Moatize mine
- Originally developed by **Vale** (Brazil), the Moatize mine was **sold to Vulcan** (a company of Indian businessman Naveen Jindal) in 2021–2022.
- Vulcan now holds **95% ownership**, with 5% held by Mozambique.
- Vulcan has produced **over 35 million tonnes of coal** in the three years since acquisition.
- In **December 2024**, the Tete Provincial Administrative Court ordered Vulcan to suspend extraction in part of the Moatize mine, highlighting ongoing regulatory and operational challenges.

### Production trajectory
- **2023**: 14.9 million tonnes
- **2024**: 16.3 million tonnes
- **2025 forecast**: 19 million tonnes
- **2026**: production set to soar ~15%

### Export corridors
Mozambique is landlocked, so coal must travel overland to a port:
- The **Nacala Corridor** — a rail line to the port of Nacala-a-Velha (Nacala Logistics Corridor), built to export Moatize coal.
- The **Beira Corridor** — the older Sena railway line to the port of Beira, limited in capacity.

### Other projects
**JSW Steel's Minas de Revuboe** project in Tete is a developing coal mine, reflecting continued interest in the region's coking coal potential.`,
        quiz: [
          {
            q: "Who currently owns the majority (95%) of the Moatize coal mine?",
            options: ["Vale", "Vulcan (Naveen Jindal's company)", "Glencore", "Anglo American"],
            answer: 1,
            explain: "Vulcan, a company of Indian businessman Naveen Jindal, acquired the Moatize mine from Vale in 2021–2022 and holds 95% ownership."
          },
          {
            q: "Mozambique's coal production in 2024 was approximately:",
            options: ["10 million tonnes", "16.3 million tonnes", "25 million tonnes", "40 million tonnes"],
            answer: 1,
            explain: "Mozambique produced 16.3 million tonnes of coal in 2024, up from 14.9 million in 2023, with 19 million tonnes forecast for 2025."
          },
          {
            q: "Which export corridor was built specifically to ship Moatize coal to a deep-water port?",
            options: ["The Suez Canal", "The Nacala Logistics Corridor", "The Transnet Freight Rail", "The Tete-Durban line"],
            answer: 1,
            explain: "The Nacala Logistics Corridor is a rail line to the deep-water port of Nacala-a-Velha, built to export Moatize coking coal."
          },
          {
            q: "Mozambique's Tete province mainly produces:",
            options: ["Thermal coal for power generation", "Coking (metallurgical) coal for steelmaking", "Sulphur for fertiliser", "Phosphate rock"],
            answer: 1,
            explain: "Tete is a coking (metallurgical) coal region serving steelmakers, with the Moatize mine as its flagship operation."
          }
        ]
      },
      {
        id: "m2t4",
        title: "Sulphur Trading",
        lesson: `## Sulphur Trading

### A byproduct market
Sulphur supply comes mainly from **oil refineries** (desulphurisation), **natural gas processing** (removing H₂S from sour gas), and **non-ferrous metal smelters**. Global sulphur production exceeds **70 million metric tons annually**, with approximately **60% recovered from fossil fuel refining**.

### Key supply regions
- **The Middle East** — accounts for approximately **24% of global sulphur production** (around 83.87 million metric tons including all forms) and roughly **50% of seaborne sulphur trade**. Major sources include Saudi Arabia, the UAE, and Qatar.
- **Kazakhstan** and other oil/gas-producing regions.
- The **Strait of Hormuz** is a critical chokepoint for sulphur shipping — disruption there can trigger global supply crises.

### Demand: phosphate fertiliser
The dominant demand is **phosphate fertiliser** production:
- **Morocco's OCP Group** — the world's largest phosphate player, holding ~70% of global phosphate rock reserves. Two new **sulphur burners** started at OCP's **Jorf Lasfar** hub in 2024.
- Morocco's sulphuric acid imports reached **2.01 million tonnes in 2024** (a three-year high).
- **Egypt, Algeria and Tunisia** also have major phosphate industries with plans to expand.

### Pricing and forms
- Priced in **USD per metric tonne (USD/MT)**, assessed by **Argus** and **S&P Global Platts**.
- **Liquid (molten) sulphur** — transported hot in specialised tankers; must stay above its melting point (~115°C).
- **Solid (formed / prilled / granular) sulphur** — solidified into manageable shapes for easier handling and shipping.

### Handling challenges
- **Flammability** and dust risk (solid sulphur is combustible).
- **Solidification risk** in transit for molten sulphur (must stay hot).
- **Corrosivity** of sulphuric acid and storage requirements.
These physical risks affect logistics cost and contract terms.`,
        quiz: [
          {
            q: "The dominant source of sulphur demand is:",
            options: ["Battery manufacturing — sulphur is used in lithium-ion battery electrolyte production for electric vehicles", "Phosphate fertiliser production — sulphur is converted to sulphuric acid to process phosphate rock into fertiliser", "Steelmaking — sulphur is added as a fluxing agent in blast furnaces during iron ore smelting", "Power generation — sulphur is burned as a fuel supplement in coal-fired and gas-fired power stations"],
            answer: 1,
            explain: "Phosphate fertiliser production (e.g. OCP Group in Morocco) is the largest demand source — sulphur becomes sulphuric acid used to process phosphate rock."
          },
          {
            q: "Approximately what share of global seaborne sulphur trade comes from the Middle East?",
            options: ["About 10%", "About 24%", "About 50%", "About 75%"],
            answer: 2,
            explain: "The Middle East accounts for roughly 50% of seaborne sulphur trade and about 24% of total global sulphur production."
          },
          {
            q: "Sulphur is typically priced in:",
            options: ["USD per pound", "USD per metric tonne", "Cents per MMBtu", "USD per barrel"],
            answer: 1,
            explain: "Sulphur trades in USD per metric tonne (USD/MT), commonly referencing Argus or S&P Global Platts assessments."
          },
          {
            q: "A key handling risk for molten (liquid) sulphur in transit is:",
            options: ["Evaporation — molten sulphur vapourises rapidly at transport temperatures, causing volume loss in transit", "Solidification if it cools below its melting point (~115°C), causing serious handling and discharge problems", "Radioactivity — naturally occurring radioactive isotopes in sulphur pose health hazards during transport", "Spontaneous fermentation — biological processes in molten sulphur generate dangerous gas build-up in tanks"],
            answer: 1,
            explain: "Molten sulphur must be kept above its melting point (~115°C); if it cools it solidifies, creating serious handling and discharge problems."
          },
          {
            q: "Why is sulphur supply relatively inelastic to its own price?",
            options: ["It is government controlled", "It is a byproduct of refining and smelting, driven by those activities", "It cannot be stored", "Demand is fixed by treaty"],
            answer: 1,
            explain: "Because sulphur is recovered as a byproduct, its supply depends on refinery, gas plant and smelter activity rather than on sulphur prices."
          },
          {
            q: "Molten sulphur must be kept above its melting point of approximately _______ °C during transit to prevent solidification.",
            answerText: "115",
            explain: "Molten sulphur must stay above ~115°C; if it cools it solidifies, creating serious handling and discharge problems in transit.",
            questionType: "fill-in-the-blank"
          }
        ]
      },
      {
        id: "m2t5",
        title: "Sanctions, Due Diligence & Compliance",
        lesson: `## Sanctions, Due Diligence & Compliance

Commodity trading — particularly cross-border coal and sulphur trades — carries heightened compliance obligations.

### Key frameworks
- **OECD Due Diligence Guidance** for Responsible Supply Chains — the global standard for risk-based supply-chain checks, including environmental and human-rights due diligence.
- **EU and UK sanctions** — restrictions on dealings with certain countries, entities or persons; coal trades involving Russia are subject to specific prohibitions.
- **US OFAC sanctions** — screening counterparties against the Specially Designated Nationals (SDN) list.

### Red flags in coal and sulphur sourcing
- **Opaque ownership** structures or shell companies hiding the **ultimate beneficial owner (UBO)**.
- **Politically exposed persons (PEPs)** in the ownership or management chain.
- **State-owned entities** — in South Africa, **Transnet** (rail/port) and **Eskom** (power utility) are state-owned; dealings require awareness of public-procurement rules and anti-corruption standards.
- **Payments to third-party jurisdictions** unrelated to the trade.
- **Price anomalies** — over- or under-invoicing that could indicate trade-based money laundering.

### AML & sanctions screening
- Screen counterparties against **OFAC (US), EU and UN** sanctions lists — at onboarding *and* per transaction.
- **AML** obligations: identify the **ultimate beneficial owner (UBO)**.
- A compliance-grade **KYC file** includes corporate registration, UBO chart, sanctions-screening evidence, source-of-funds, licences and certificates of origin.

### Environmental compliance
Coal trades increasingly require attention to **carbon disclosure** (CBAM for EU-bound goods) and **responsible sourcing** standards. Sulphur trades must address **handling safety** and environmental incident preparedness.`,
        quiz: [
          {
            q: "A 'PEP' in compliance terms is a:",
            options: ["Pre-export payment", "Politically exposed person", "Port entry permit", "Provisional export price"],
            answer: 1,
            explain: "A PEP is a politically exposed person, who carries elevated corruption/AML risk and requires enhanced due diligence."
          },
          {
            q: "Which is the global standard for risk-based supply-chain checks?",
            options: ["IMO 2020", "OECD Due Diligence Guidance", "Basel III", "IFRS 9"],
            answer: 1,
            explain: "The OECD Due Diligence Guidance for Responsible Supply Chains is the recognised global standard for risk-based checks."
          },
          {
            q: "Sanctions screening of counterparties should occur:",
            options: ["Only at onboarding", "Only when a regulator asks", "At onboarding and at the transaction level", "Once per year"],
            answer: 2,
            explain: "Effective screening checks counterparties against OFAC/EU/UN lists both at onboarding and at each transaction."
          },
          {
            q: "Transnet and Eskom are examples of:",
            options: ["Private coal trading houses", "South African state-owned entities in the coal value chain", "Inspection firms", "International sanctions bodies"],
            answer: 1,
            explain: "Transnet (rail and ports) and Eskom (power utility) are South African state-owned entities. Dealings with them require awareness of public-procurement and anti-corruption standards."
          }
        ]
      },
      {
        id: "m2t6",
        title: "Pricing Mechanisms in African Coal Trades",
        lesson: `## Pricing Mechanisms in African Coal Trades

### Fixed pricing
Many thermal coal trades use a simple **fixed price** — e.g. $96/MT FOB Richards Bay. The transaction price is known at shipment, so there is no variable consideration under IFRS 15.

### Provisional pricing
Some coal and sulphur trades use **provisional pricing**. The cargo ships now, but the **final price is fixed later** — typically the average benchmark over a defined future period.

### Quotational Period (QP)
The **QP** is the agreed averaging window. A common structure is **"M+1"** — the average benchmark (e.g. API4) in the **month following shipment**. So a March shipment might price off the **average April API4**.

### Price participation
Some contracts include **price participation clauses**, sharing upside (or downside) between producer and trader beyond a reference level.

### Why this matters for IFRS
Provisional pricing means the final transaction price is **unknown at shipment** — this is **variable consideration** under IFRS 15. The seller must **estimate** the price and, where required, **constrain** the estimate, then **remeasure** as the QP resolves. The embedded pricing link may also be an **embedded derivative** under IFRS 9 (covered later).

### Sulphur pricing
Sulphur is typically priced on a **fixed or formula basis** off Argus/Platts assessments. Because sulphur supply is inelastic (byproduct-driven), prices can spike sharply — as seen in 2026 when Strait of Hormuz disruption threatened global supply.

{{diagram:provisional_pricing_timeline}}`,
        quiz: [
          {
            q: "A QP of 'M+1' means the price is based on:",
            options: ["The spot price on the day of shipment — a single-day benchmark assessment at the loading port", "The average benchmark price in the month after shipment — the quotational period following loading", "The average benchmark price one month before shipment — the calendar month preceding the B/L date", "The LC issue date price — the benchmark assessment on the date the letter of credit was opened by the buyer's bank"],
            answer: 1,
            explain: "M+1 means the quotational period is the month following shipment, so pricing uses that month's average benchmark (e.g. API4)."
          },
          {
            q: "Under IFRS 15, provisional pricing creates:",
            options: ["A lease liability", "Variable consideration", "An onerous contract", "A right-of-use asset"],
            answer: 1,
            explain: "Because the final price is uncertain at shipment, provisional pricing is variable consideration that must be estimated and possibly constrained."
          },
          {
            q: "A March coal shipment with QP = M+1 will be finally priced using:",
            options: ["March API4 average", "April API4 average", "The March spot on B/L date", "February API4 average"],
            answer: 1,
            explain: "With M+1, the final price uses the average API4 in April — the month after the March shipment."
          },
          {
            q: "Why can sulphur prices spike sharply despite stable demand?",
            options: ["Because demand fluctuates wildly", "Because supply is inelastic (byproduct-driven) and concentrated in chokepoint regions", "Because it is government controlled", "Because it cannot be stored"],
            answer: 1,
            explain: "Sulphur supply depends on refinery/gas activity and is concentrated in the Middle East. Disruption to chokepoints like the Strait of Hormuz can cause sharp price spikes."
          }
        ]
      }
    ]
  },
  {
    id: "m3",
    title: "IFRS Foundations for Commodity Accountants",
    subtitle: "The standards that shape the numbers",
    topics: [
      {
        id: "m3t1",
        title: "Why IFRS Matters in Commodity Trading",
        lesson: `## Why IFRS Matters in Commodity Trading

**IFRS (International Financial Reporting Standards)** are applied by listed companies, banks and most non-US multinationals. Major trading houses (Glencore, Trafigura) report under IFRS or closely aligned local GAAP.

### IFRS vs. US GAAP (commodity context)
Both aim for faithful reporting, but differ in detail — e.g. inventory (US GAAP permits LIFO; IAS 2 bans LIFO entirely), and the treatment of certain commodity contracts and hedge accounting mechanics.

### The five standards that matter most
1. **IFRS 15** — Revenue from contracts with customers.
2. **IFRS 9** — Financial instruments (derivatives & hedging).
3. **IAS 2** — Inventories.
4. **IFRS 16** — Leases (storage, vessels, tanks).
5. **IAS 37** — Provisions and contingent liabilities (onerous contracts).

These five recur throughout live trading scenarios and form the backbone of Modules 3 and 4.`,
        quiz: [
          {
            q: "Which standard governs revenue recognition?",
            options: ["IAS 2 — Inventories, governing cost measurement and net realisable value", "IFRS 15 — Revenue from Contracts with Customers", "IFRS 16 — Leases, requiring right-of-use assets and lease liabilities", "IAS 37 — Provisions, Contingent Liabilities and Contingent Assets"],
            answer: 1,
            explain: "IFRS 15 'Revenue from Contracts with Customers' governs how and when revenue is recognised."
          },
          {
            q: "Which standard deals with inventories?",
            options: ["IAS 2 — Inventories, covering cost and net realisable value measurement", "IFRS 9 — Financial Instruments, covering derivatives and hedge accounting", "IFRS 16 — Leases, covering right-of-use assets and lease liabilities", "IFRS 15 — Revenue from Contracts with Customers"],
            answer: 0,
            explain: "IAS 2 covers measurement of inventories, including cost and net realisable value."
          },
          {
            q: "A key difference of IAS 2 versus US GAAP is that IAS 2:",
            options: ["Requires the use of LIFO for all inventory categories", "Prohibits the LIFO cost formula, permitting only FIFO and weighted average", "Bans the FIFO method in favour of specific identification only", "Ignores net realisable value in favour of replacement cost"],
            answer: 1,
            explain: "IAS 2 prohibits the LIFO cost formula, whereas US GAAP permits it."
          },
          {
            q: "Which standard would govern a chartered storage tank lease?",
            options: ["IFRS 15 — Revenue from Contracts with Customers", "IFRS 16 — Leases, covering storage tanks and vessel charters", "IAS 2 — Inventories, covering cost and NRV measurement", "IFRS 9 — Financial Instruments, covering derivatives and hedging"],
            answer: 1,
            explain: "IFRS 16 governs leases, including storage tanks, warehouses and certain vessel charters."
          }
        ]
      },
      {
        id: "m3t2",
        title: "IFRS 15 — Revenue from Contracts with Customers",
        lesson: `## IFRS 15 — Revenue from Contracts with Customers

### The 5-step model
1. **Identify the contract** with a customer.
2. **Identify the performance obligations** (distinct promises).
3. **Determine the transaction price** (including variable consideration).
4. **Allocate** the price to the performance obligations.
5. **Recognise revenue** when (or as) each obligation is satisfied.

### In commodity trading
There is usually a **single performance obligation**: deliver a quantity of goods. Revenue is recognised at the **point in time control transfers**.

### When does control transfer?
Link to **Incoterms**:
- **FOB** — control typically transfers at the **loading port** (revenue earlier). This is the standard for Richards Bay coal exports.
- **CIF** — control arguably transfers at **destination** (judgement required; the seller still bears risk in transit).

### Variable consideration
**Provisional pricing** creates **variable consideration**. The seller must **estimate** the price (expected value or most likely amount) and apply the **constraint** — only include amounts highly probable not to reverse — then **remeasure** each period until the price finalises.

{{diagram:ifrs15_steps}}`,
        quiz: [
          {
            q: "Arrange the five steps of the IFRS 15 revenue model in the correct order:",
            options: [
              "Identify the contract with the customer",
              "Identify the performance obligations in the contract",
              "Determine the transaction price",
              "Allocate the transaction price to the performance obligations",
              "Recognise revenue when (or as) each performance obligation is satisfied"
            ],
            explain: "IFRS 15 uses a 5-step model: identify the contract, identify performance obligations, determine the transaction price, allocate it to the obligations, and recognise revenue as each is satisfied.",
            questionType: "sorting"
          },
          {
            q: "In a typical commodity sale, the performance obligation is:",
            options: ["Providing financing — extending trade credit or pre-export finance to the buyer for the purchase", "Delivery of the goods — the single performance obligation is transferring the commodity to the customer", "Insuring the cargo — arranging and maintaining marine insurance coverage during the sea voyage", "Hedging the price — managing commodity price risk through futures or swaps on behalf of the counterparty"],
            answer: 1,
            explain: "The single performance obligation is usually the delivery of the commodity; revenue is recognised when control of the goods transfers."
          },
          {
            q: "The IFRS 15 'constraint' on variable consideration means you:",
            options: ["Recognise the maximum possible price", "Only include amounts highly probable not to reverse", "Defer all revenue until cash is received", "Ignore variable elements"],
            answer: 1,
            explain: "The constraint limits revenue to amounts that are highly probable not to result in a significant reversal."
          },
          {
            q: "For an FOB Richards Bay coal sale, control typically transfers:",
            options: ["At the destination port", "At the loading port when coal is on board", "When the LC is paid", "At contract signing"],
            answer: 1,
            explain: "Under FOB, control generally transfers at the loading port when goods are on board, so revenue is recognised at that point."
          }
        ]
      },
      {
        id: "m3t3",
        title: "IFRS 9 — Financial Instruments: Hedging & Derivatives",
        lesson: `## IFRS 9 — Financial Instruments

### Classification of financial assets
- **Amortised cost** — held to collect contractual cash flows that are solely principal and interest.
- **FVOCI** — fair value through other comprehensive income.
- **FVTPL** — fair value through profit or loss.

**Commodity derivatives** (API4 futures, sulphur swaps, options) are generally measured at **FVTPL** unless **hedge accounting** is applied.

### Hedge accounting
Two main types relevant here:
- **Fair value hedge** — hedging changes in the fair value of a recognised asset/firm commitment.
- **Cash flow hedge** — hedging variability in future cash flows (e.g. a forecast sale of coal). Effective portion goes to **OCI**, then reclassified to P&L when the hedged item hits profit.

IFRS 9 replaced the rigid **80–125% effectiveness test** with a more **qualitative, economic-relationship** assessment, plus documentation at inception.

### Embedded derivatives
If a coal offtake contract contains a pricing clause linked to an index (e.g. **API4**), that clause may be a **separable embedded derivative** requiring bifurcation — assessed under IFRS 9.

{{diagram:ifrs9_classification}}`,
        quiz: [
          {
            q: "Commodity derivatives are generally measured at:",
            options: ["Amortised cost — for assets held to collect contractual cash flows (principal and interest)", "FVOCI — fair value through other comprehensive income, with recycling", "FVTPL unless hedge accounting applies — fair value through profit or loss", "Historical cost less impairment — for long-term held non-trading assets"],
            answer: 2,
            explain: "Derivatives are measured at fair value through profit or loss (FVTPL) unless they are designated in a qualifying hedge relationship."
          },
          {
            q: "In a cash flow hedge, the effective portion of the gain/loss is initially recorded in:",
            options: ["Profit or loss immediately, matching the derivative's fair value change", "Other comprehensive income (OCI), reclassified to P&L when the hedged item affects profit", "Retained earnings directly, bypassing the income statement entirely", "Inventory cost, capitalised into the carrying amount of goods"],
            answer: 1,
            explain: "The effective portion of a cash flow hedge goes to OCI and is reclassified to P&L when the hedged item affects profit."
          },
          {
            q: "IFRS 9 replaced the old 80–125% effectiveness test with:",
            options: ["A stricter quantitative bright-line test of 90–110% effectiveness", "A qualitative economic-relationship assessment with documentation at inception", "No effectiveness assessment requirement at all under IFRS 9", "A purely cash-based test focused on settlement timing only"],
            answer: 1,
            explain: "IFRS 9 uses a more principles-based, qualitative assessment of the economic relationship rather than the bright-line 80–125% test."
          },
          {
            q: "A pricing clause in a coal supply contract linked to API4 may be:",
            options: ["A lease — a right-of-use arrangement giving the buyer control over identified coal supply capacity", "A separable embedded derivative — an index-linked pricing clause that may require bifurcation under IFRS 9", "Revenue — the pricing clause is recognised as revenue at the point of contract execution", "A provision — a liability of uncertain timing or amount arising from the pricing commitment"],
            answer: 1,
            explain: "An index-linked pricing clause in a non-financial host contract can be an embedded derivative that may require bifurcation under IFRS 9."
          }
        ]
      },
      {
        id: "m3t4",
        title: "IAS 2 — Inventories",
        lesson: `## IAS 2 — Inventories

### Cost measurement
Inventory cost = **purchase price + conversion costs + costs to bring inventory to its present location and condition** (e.g. transport, handling). Trade discounts are deducted.

### Net Realisable Value (NRV)
**NRV = estimated selling price − estimated costs to complete − estimated costs to sell.**
Inventory is carried at the **lower of cost and NRV**. If the price of coal or sulphur drops below cost, a **write-down to NRV** is recognised as an expense.

### Broker-trader exception
Under **IAS 2.3(b)**, **commodity broker-traders** may measure inventories at **fair value less costs to sell**, with changes recognised in profit or loss — reflecting that they buy to sell in the near term and profit from price movements.

### Cost formula
- **FIFO** or **weighted average cost** are permitted (LIFO is prohibited).
- Coal stockpiles often use **weighted average**; some businesses use FIFO or specific identification.

{{diagram:ias2_nrv}}`,
        quiz: [
          {
            q: "Inventory under IAS 2 is carried at:",
            options: ["Cost always — regardless of market conditions or obsolescence risk", "NRV always — writing inventory up or down to market selling price", "The lower of cost and net realisable value (NRV)", "Fair value always — marking to market each reporting period"],
            answer: 2,
            explain: "IAS 2 requires inventory to be measured at the lower of cost and net realisable value."
          },
          {
            q: "NRV is calculated as:",
            options: ["Cost plus a standard profit margin — the original purchase cost plus an assumed industry profit percentage", "Selling price minus estimated costs to complete and estimated costs to sell", "Replacement cost — the current market price to acquire equivalent inventory at the reporting date", "Purchase price plus transport — the original acquisition cost including freight and handling charges to the warehouse"],
            answer: 1,
            explain: "NRV = estimated selling price − estimated costs to complete − estimated costs to sell."
          },
          {
            q: "Which cost formula is prohibited by IAS 2?",
            options: ["FIFO (first-in, first-out) — permitted under IAS 2 for most inventories", "Weighted average cost — permitted under IAS 2, common for bulk stockpiles", "LIFO (last-in, first-out) — prohibited under IAS 2, though permitted under US GAAP", "Specific identification — permitted for items not ordinarily interchangeable"],
            answer: 2,
            explain: "IAS 2 prohibits LIFO; FIFO and weighted average cost are permitted."
          },
          {
            q: "The IAS 2.3 broker-trader exception allows measurement at:",
            options: ["Amortised cost — the cost-based method for held-to-collect items", "Fair value less costs to sell, with changes through profit or loss", "Replacement cost — the price to acquire equivalent inventory at reporting date", "Lower of cost and market only — the standard IAS 2 rule without exception"],
            answer: 1,
            explain: "Commodity broker-traders may measure inventory at fair value less costs to sell, with changes through profit or loss."
          }
        ]
      },
      {
        id: "m3t5",
        title: "IFRS 16 — Leases in Trading Operations",
        lesson: `## IFRS 16 — Leases in Trading Operations

IFRS 16 brought most leases **onto the balance sheet** for lessees: recognise a **right-of-use (ROU) asset** and a corresponding **lease liability**.

### Common commodity-trading leases
- **Storage tanks** at ports (e.g. for sulphur or liquid fuel products).
- **Warehouse space** for coal stockpiles and solid sulphur.
- **Chartered vessels** — a **time charter** may contain a lease of an identified asset.
- **Pipeline access** and dedicated rail capacity.

### Key exemptions and judgements
- **Short-term lease exemption** — leases of **12 months or less** can be expensed straight-line (no balance-sheet recognition).
- **Low-value asset exemption**.
- **Variable lease payments** that depend on usage (e.g. **storage fees based on tonnage throughput**) are **not** included in the lease liability — they are expensed as incurred.
- Whether a charter is a **lease vs. a service** depends on whether there is an **identified asset** and who **controls its use**.`,
        quiz: [
          {
            q: "Under IFRS 16, a lessee recognises:",
            options: ["Only an expense", "A right-of-use asset and a lease liability", "Revenue and a receivable", "A provision"],
            answer: 1,
            explain: "IFRS 16 requires lessees to recognise a right-of-use asset and a lease liability for most leases."
          },
          {
            q: "Variable lease payments based on tonnage throughput are:",
            options: ["Capitalised in the lease liability — included in the ROU asset and lease liability at present value", "Expensed as incurred, not included in the lease liability — recognised in P&L when the payment obligation arises", "Ignored entirely — variable lease payments are excluded from all accounting records as immaterial", "Treated as revenue — variable lease payments received from sub-lessees are recognised as rental income"],
            answer: 1,
            explain: "Usage-based variable payments are excluded from the lease liability and expensed as incurred."
          },
          {
            q: "The short-term lease exemption applies to leases of:",
            options: ["24 months or less — biennial leases qualify for the short-term exemption under IFRS 16", "12 months or less — the short-term lease exemption applies and the lease can be expensed straight-line", "Any length if low value — the short-term exemption applies regardless of duration for low-value assets", "Over 5 years — the exemption applies only to long-duration leases exceeding five years"],
            answer: 1,
            explain: "Leases of 12 months or less can use the short-term exemption and be expensed straight-line."
          },
          {
            q: "Whether a time charter is a lease depends mainly on:",
            options: ["The freight rate — the daily or voyage charter price determines whether the arrangement is a lease", "Whether there is an identified asset and who controls its use during the charter period", "The flag state — the vessel's country of registration determines the applicable accounting treatment", "The cargo type — the commodity being transported determines whether the charter qualifies as a lease"],
            answer: 1,
            explain: "A lease exists if there is an identified asset and the customer controls its use; otherwise it may be a service contract."
          }
        ]
      },
      {
        id: "m3t6",
        title: "IAS 37 — Provisions and Contingent Liabilities",
        lesson: `## IAS 37 — Provisions and Contingent Liabilities

A **provision** is a liability of uncertain timing or amount, recognised when: (1) there is a **present obligation** from a past event, (2) an **outflow** of resources is **probable**, and (3) the amount can be **reliably estimated**.

### Onerous contracts
A contract is **onerous** when the **unavoidable costs of meeting the obligations exceed the expected economic benefits**. The unavoidable cost is the **lower of** the cost of fulfilling and any compensation/penalty for failing to fulfil.

**Example trigger:** a trader holds a **fixed-price supply (purchase) contract** for coal and the market price falls below the contracted price — fulfilling the contract now generates a loss, so a provision is recognised.

### Environmental provisions
For entities with mining exposure, provisions may be needed for **mine rehabilitation** and **site restoration**, recognised as the obligation arises. Coal mining operations in South Africa and Mozambique carry significant rehabilitation obligations.

### Contingent liabilities
Possible obligations (or present obligations not meeting recognition criteria) are **disclosed**, not recognised.`,
        quiz: [
          {
            q: "A contract is onerous when:",
            options: ["It is denominated in USD", "Unavoidable costs exceed expected economic benefits", "It contains a hedge", "It is short-term"],
            answer: 1,
            explain: "An onerous contract is one where the unavoidable costs of meeting the obligations exceed the benefits expected from it."
          },
          {
            q: "The unavoidable cost of an onerous contract is the lower of:",
            options: ["Cost to fulfil and the penalty to exit", "Cost and NRV", "Fair value and amortised cost", "Spot and forward price"],
            answer: 0,
            explain: "IAS 37 measures the unavoidable cost as the lower of the cost of fulfilling the contract and the compensation/penalty for not fulfilling it."
          },
          {
            q: "A provision is recognised only if an outflow of resources is:",
            options: ["Remotely possible — the outflow is unlikely to occur", "Probable — more likely than not to occur", "Certain — the outflow is guaranteed and amount is fixed", "Irrelevant — the probability of outflow does not affect recognition"],
            answer: 1,
            explain: "Recognition requires a present obligation, a probable outflow, and a reliable estimate of the amount."
          },
          {
            q: "A possible obligation that does not meet recognition criteria is:",
            options: ["Recognised as a provision", "Disclosed as a contingent liability", "Recorded as revenue", "Capitalised"],
            answer: 1,
            explain: "Contingent liabilities are disclosed in the notes rather than recognised on the balance sheet."
          }
        ]
      }
    ]
  },
  {
    id: "m4",
    title: "IFRS Applied to Live Trading Scenarios",
    subtitle: "Working the numbers on real trades",
    topics: [
      {
        id: "m4t1",
        title: "Revenue Recognition on a Coal Shipment",
        lesson: `## Revenue Recognition on a Coal Shipment

### Scenario
A South African coal trader sells a **Panamax cargo of 75,000 MT** of thermal coal to an Indian buyer, **FOB Richards Bay**, at **$96/MT**. The **Bill of Lading is dated 15 March**.

### Analysis
- **Transaction price** = 75,000 MT × $96 = **$7,200,000** (fixed price, so no variable consideration here).
- **Performance obligation** = deliver the coal.
- **Control transfer** — under **FOB**, control passes when the coal is **loaded on board** at Richards Bay. The B/L date (**15 March**) is strong evidence of that point.
- **Revenue recognised** = $7.2m on **15 March** (point in time).

{{diagram:revenue_recognition_timeline}}

### Disclosures
- Revenue recognised at a point in time and the judgement that control transfers on loading (FOB).
- Nature of goods, and any significant financing component (none here — payment is near shipment).
- If priced provisionally, variable-consideration disclosures (not applicable here).`,
        quiz: [
          {
            q: "What is the transaction price for the cargo?",
            options: ["$7,200,000", "$9,000,000", "$96,000", "$6,250,000"],
            answer: 0,
            explain: "75,000 MT × $96/MT = $7,200,000. The price is fixed, so there is no variable consideration."
          },
          {
            q: "When is revenue recognised?",
            options: ["When the buyer resells the coal to a downstream customer in the destination market", "On 15 March when loaded FOB (control transfers) — the B/L date is strong evidence of control transfer", "When cash is received from the buyer's bank under the letter of credit at the destination port", "At the end of the financial quarter when the cargo is included in periodic revenue reporting"],
            answer: 1,
            explain: "Under FOB, control passes on loading; the B/L date of 15 March is strong evidence, so revenue is recognised then."
          },
          {
            q: "Because the price is fixed, this sale has:",
            options: ["Significant variable consideration", "No variable consideration", "An embedded lease", "A cash flow hedge"],
            answer: 1,
            explain: "A fixed $96/MT price means the transaction price is certain — there is no variable consideration to estimate or constrain."
          },
          {
            q: "The Incoterm here points to revenue being recognised:",
            options: ["At a point in time on loading", "Over time during the voyage", "At destination in India", "Only after the assay"],
            answer: 0,
            explain: "FOB indicates control transfers at the load port, so revenue is recognised at a point in time upon loading."
          }
        ]
      },
      {
        id: "m4t2",
        title: "Provisional Pricing and Variable Consideration",
        lesson: `## Provisional Pricing and Variable Consideration

### Scenario
A South African coal trader sells **50,000 MT of thermal coal**, shipped in **March**, at a **provisional price of $90/MT**. Final price = **average API4 in April** (QP = M+1).

### Recognition in March
Control transfers in March (assume on shipment). Recognise revenue using the **best estimate** of the transaction price — here the provisional $90/MT, subject to the **constraint**.
- Revenue (March) = 50,000 × $90 = **$4,500,000**, with a receivable that is, in substance, **measured at fair value** because it embeds an API4-linked feature (a provisionally priced receivable is remeasured through P&L under IFRS 9).

### Remeasurement in April
Suppose the average April API4 settles at **$96/MT**.
- Final value = 50,000 × $96 = **$4,800,000**.
- Uplift = **$300,000** recognised (typically within revenue/other income) when the QP resolves.

**Illustrative entries**
- March: Dr Receivable 4,500,000 / Cr Revenue 4,500,000.
- April: Dr Receivable 300,000 / Cr Revenue (mark-to-market) 300,000; then Dr Cash 4,800,000 / Cr Receivable 4,800,000.

The **constraint** ensures you don't book amounts highly likely to reverse; the provisionally priced receivable is then remeasured each period until settlement.`,
        quiz: [
          {
            q: "What revenue is initially recognised in March?",
            options: ["$4,800,000", "$4,500,000", "$90,000", "$300,000"],
            answer: 1,
            explain: "50,000 MT × $90/MT provisional price = $4,500,000 recognised in March, using the best estimate subject to the constraint."
          },
          {
            q: "If average April API4 is $96/MT, the remeasurement adjustment is:",
            options: ["A $300,000 increase", "A $300,000 decrease", "Zero", "$4,800,000"],
            answer: 0,
            explain: "Final value 50,000 × $96 = $4,800,000 versus $4,500,000 booked — a $300,000 favourable adjustment when the QP resolves."
          },
          {
            q: "A provisionally priced receivable is subsequently:",
            options: ["Held at original cost", "Remeasured to fair value through P&L until settlement", "Recognised in OCI only", "Written off"],
            answer: 1,
            explain: "The API4-linked receivable is remeasured through profit or loss each period until the quotational period finalises the price."
          },
          {
            q: "The IFRS 15 constraint is applied to ensure:",
            options: ["Maximum revenue is booked", "Only amounts highly probable not to reverse are recognised", "No revenue is recognised until cash", "Revenue equals the LC value"],
            answer: 1,
            explain: "The constraint limits initially recognised variable consideration to amounts that are highly probable not to significantly reverse."
          }
        ]
      },
      {
        id: "m4t3",
        title: "Embedded Derivatives in Offtake Agreements",
        lesson: `## Embedded Derivatives in Offtake Agreements

### Scenario
A coal offtake contract contains a price clause linked to the **API4 index**. The **host contract** is a supply contract (a non-financial item — "own use").

### Is the clause an embedded derivative?
Assess under IFRS 9. An embedded derivative is **separated (bifurcated)** from a non-financial host when **all** are true:
1. Its economic characteristics are **not closely related** to the host.
2. A separate instrument with the same terms **would meet the definition of a derivative**.
3. The hybrid is **not** already measured at fair value through P&L.

### Application
- A pricing link to the **commodity that is actually being delivered** (coal priced off API4 coal index) is usually considered **closely related** → **not** bifurcated.
- A pricing link to an **unrelated** index or **foreign currency** that isn't the functional/standard currency of either party may be **not closely related** → potentially **bifurcated** and measured at **FVTPL**.

So a coal price linked to API4 typically stays embedded; a clause linked to, say, an unrelated commodity index or exotic currency could require separation.`,
        quiz: [
          {
            q: "An embedded derivative is bifurcated from a non-financial host only if it is:",
            options: ["Closely related to the host contract — the embedded feature shares economic characteristics with the host", "Not closely related to the host contract — the embedded feature's economics differ from the host", "Denominated in a currency other than USD — foreign currency links always require bifurcation regardless of relevance", "Short-term in duration — embedded derivatives in contracts under 12 months are automatically separated"],
            answer: 1,
            explain: "Bifurcation requires the embedded feature to be NOT closely related to the host (plus it meets the derivative definition and the hybrid isn't at FVTPL)."
          },
          {
            q: "A coal supply contract priced off API4 is generally:",
            options: ["Bifurcated as an embedded derivative — the API4 link must be separated and measured at FVTPL", "Closely related to the host, so not bifurcated — pricing off the delivered commodity's own index stays embedded", "Treated as a lease — the pricing clause constitutes a right-of-use arrangement over coal supply capacity", "Recognised as revenue immediately — the index-linked component is recorded as revenue at contract inception"],
            answer: 1,
            explain: "Pricing the delivered commodity off its own index is usually closely related to the host, so no separation is required."
          },
          {
            q: "If bifurcated, the embedded derivative is measured at:",
            options: ["Amortised cost — held to collect contractual cash flows using the effective interest method", "FVTPL — fair value through profit or loss, with changes recognised in the income statement each period", "FVOCI — fair value through other comprehensive income, with recycling to P&L on disposal", "Cost less impairment — carried at historical cost less an expected credit loss provision"],
            answer: 1,
            explain: "A separated embedded derivative is measured at fair value through profit or loss."
          },
          {
            q: "Which pricing link is most likely to require bifurcation?",
            options: ["Coal priced off API4 — the pricing references the same commodity being delivered in the supply contract", "Sulphur priced off Argus sulphur — the pricing references the same commodity being delivered in the contract", "Coal priced off an unrelated exotic metal index or unrelated foreign currency — not closely related to the host", "Coal priced off API2 (ARA-delivered coal benchmark) — a closely related coal market benchmark to the delivered commodity"],
            answer: 2,
            explain: "A price link unrelated to the delivered commodity (or an unrelated currency/index) may be not closely related, triggering separation."
          }
        ]
      },
      {
        id: "m4t4",
        title: "Hedge Accounting for a Coal Trader",
        lesson: `## Hedge Accounting for a Coal Trader

### Scenario
A Mozambique coal exporter expects to sell **3 cargoes in Q3** and uses **API4 futures** to hedge the price risk of these **highly probable forecast sales**. This is a **cash flow hedge**.

### Steps
1. **Designate** the hedging relationship (hedged item = forecast sales; hedging instrument = API4 futures).
2. **Document** at inception: risk management objective, the economic relationship, and how effectiveness will be assessed.
3. **Assess effectiveness** — qualitative under IFRS 9 (economic relationship, no dominant credit-risk effect, appropriate hedge ratio).
4. **Apply cash flow hedge accounting** — the **effective portion** of the futures' fair-value change goes to **OCI** (cash flow hedge reserve); any **ineffective portion** goes straight to **P&L**.
5. **Reclassify** the amount in OCI to **P&L** when the **forecast sale** is recognised (matching the hedge to the hedged revenue).

### De-designation
If the hedge is de-designated but the forecast sale is still expected, amounts already in OCI **remain there** until the sale affects P&L. If the forecast transaction is **no longer expected**, the accumulated OCI is **reclassified to P&L immediately**.

{{diagram:cash_flow_hedge_flow}}`,
        quiz: [
          {
            q: "Hedging highly probable forecast sales is which type of hedge?",
            options: ["Fair value hedge — hedging changes in the fair value of a recognised asset or firm commitment", "Cash flow hedge — hedging variability in future cash flows from forecast sales of coal", "Net investment hedge — hedging foreign currency exposure of a net investment in a foreign operation", "Not a hedge — the futures position is speculative and does not qualify for hedge accounting treatment"],
            answer: 1,
            explain: "Hedging variability in future cash flows from forecast transactions is a cash flow hedge."
          },
          {
            q: "The effective portion of a cash flow hedge is recognised in:",
            options: ["P&L immediately — the full effective portion is recognised in profit or loss in the current period", "OCI (cash flow hedge reserve) — reclassified to P&L when the hedged forecast sale is recognised", "Inventory — capitalised into the carrying amount of the physical coal stockpile held in storage", "Goodwill — recorded as an intangible asset on the balance sheet from the hedging relationship"],
            answer: 1,
            explain: "The effective portion goes to OCI and is later reclassified to P&L when the hedged item affects profit."
          },
          {
            q: "When is the OCI amount reclassified to P&L?",
            options: ["At hedge inception — when the hedging relationship is initially documented and designated", "When the forecast sale is recognised in profit — matching the hedge gain/loss to the hedged revenue", "Never — amounts in OCI remain there permanently and are never reclassified to P&L", "When the futures contracts are opened and the initial margin is posted to the clearing exchange"],
            answer: 1,
            explain: "Amounts in OCI are reclassified to P&L when the hedged forecast sale is recognised, matching hedge and hedged item."
          },
          {
            q: "If the forecast transaction is no longer expected to occur, accumulated OCI is:",
            options: ["Kept in OCI indefinitely — the accumulated amount remains in the cash flow hedge reserve permanently", "Reclassified to P&L immediately — the accumulated cash flow hedge reserve is moved to profit or loss at once", "Added to inventory — the hedge reserve is capitalised into the carrying amount of related inventory on hand", "Written to goodwill — the accumulated OCI balance is recognised as an intangible asset on the balance sheet"],
            answer: 1,
            explain: "If the forecast transaction is no longer expected, the accumulated cash flow hedge reserve is immediately reclassified to profit or loss."
          }
        ]
      },
      {
        id: "m4t5",
        title: "Inventory Write-Down Scenario",
        lesson: `## Inventory Write-Down Scenario

### Scenario
A sulphur trader holds **20,000 MT of formed sulphur** in a Moroccan port warehouse.
- **Purchase cost** = $180/MT.
- Current market price (**Argus**) = **$155/MT**.
- Estimated **selling costs** = $8/MT.

### Calculate NRV
NRV per MT = selling price − costs to sell = $155 − $8 = **$147/MT**.
- Cost per MT = $180 → **NRV ($147) < cost ($180)**, so write down to NRV.

### Write-down
Per MT write-down = $180 − $147 = **$33/MT**.
Total = 20,000 × $33 = **$660,000**.

**Entry:** Dr Cost of sales / inventory write-down expense $660,000 / Cr Inventory (provision) $660,000.
Carrying amount becomes 20,000 × $147 = **$2,940,000**.

### Following quarter — price recovers
IAS 2 permits a **reversal** of a previous write-down (up to the original cost) if NRV increases. If next quarter NRV rises to, say, $175/MT, you reverse the write-down so inventory is carried at the **lower of original cost ($180) and new NRV ($175)** = **$175/MT** — recognising income for the reversal, capped so you never exceed original cost.`,
        quiz: [
          {
            q: "What is the NRV per MT?",
            options: ["$180", "$155", "$147", "$163"],
            answer: 2,
            explain: "NRV = selling price $155 − selling costs $8 = $147/MT."
          },
          {
            q: "What is the total write-down?",
            options: ["$660,000", "$500,000", "$3,600,000", "$160,000"],
            answer: 0,
            explain: "Write-down per MT = $180 − $147 = $33; × 20,000 MT = $660,000."
          },
          {
            q: "If NRV later rises to $175/MT, inventory is carried at:",
            options: ["$147", "$175", "$180", "$200"],
            answer: 1,
            explain: "On reversal, inventory is the lower of original cost ($180) and new NRV ($175) = $175/MT; the reversal is capped at original cost."
          },
          {
            q: "A reversal of a prior inventory write-down under IAS 2 is:",
            options: ["Prohibited", "Permitted up to the original cost", "Recognised in OCI", "Unlimited"],
            answer: 1,
            explain: "IAS 2 permits reversing a write-down when NRV recovers, but the carrying amount cannot exceed the original cost."
          }
        ]
      },
      {
        id: "m4t6",
        title: "Onerous Contract Provision",
        lesson: `## Onerous Contract Provision

### Scenario
A coal trader signed a **fixed-price purchase contract** to buy **100,000 MT at $130/MT**. Market price has since fallen to **$105/MT**. The contract **cannot be cancelled** without a **$500,000 penalty**.

### Is it onerous?
Yes — the unavoidable cost of fulfilling exceeds the benefit. Buying at $130 when the market is $105 implies a loss of **$25/MT**.

### Calculate the provision
- **Cost of fulfilling** the loss = 100,000 × ($130 − $105) = **$2,500,000**.
- **Cost of exiting** = penalty = **$500,000**.
- Provision = **lower of** the two = **$500,000** (the trader would rationally pay the penalty rather than absorb a $2.5m loss).

**Entry:** Dr Onerous contract expense $500,000 / Cr Provision $500,000.

### Interaction with inventory
IAS 37 requires that, before recognising a separate onerous-contract provision, you first **recognise any impairment loss on assets dedicated to the contract** (e.g. related inventory on hand written down to NRV under IAS 2). The onerous provision then covers the **remaining** unavoidable loss not already captured by the inventory write-down.

{{diagram:onerous_contract}}`,
        quiz: [
          {
            q: "What is the cost of fulfilling the contract (loss)?",
            options: ["$500,000", "$2,500,000", "$13,000,000", "$25,000"],
            answer: 1,
            explain: "100,000 MT × ($130 − $105) = $2,500,000 loss from fulfilling the purchase at above-market prices."
          },
          {
            q: "What provision is recognised?",
            options: ["$2,500,000", "$500,000", "$3,000,000", "Zero"],
            answer: 1,
            explain: "The provision is the lower of the cost to fulfil ($2.5m) and the exit penalty ($0.5m) = $500,000."
          },
          {
            q: "Before booking an onerous-contract provision, IAS 37 requires you to first:",
            options: ["Recognise revenue from the contract — accelerate revenue recognition to offset the onerous position", "Recognise impairment on assets dedicated to the contract, such as related inventory written down to NRV under IAS 2", "Open a new hedge relationship — designate a derivative to offset the onerous contract's market exposure", "Reverse the inventory — unwind the existing inventory carrying amount to original purchase cost"],
            answer: 1,
            explain: "Any impairment on dedicated assets (e.g. related inventory written down to NRV) is recognised first; the provision covers the remaining loss."
          },
          {
            q: "The contract is onerous because:",
            options: ["It is long-term — contracts exceeding 12 months in duration are automatically classified as onerous", "Unavoidable costs of fulfilling the contract exceed the expected economic benefits from it", "It is hedged — any contract designated in a hedge accounting relationship is treated as onerous", "It is priced in USD — contracts denominated in foreign currency are deemed onerous under IAS 37"],
            answer: 1,
            explain: "Fulfilling at $130 when market is $105 means unavoidable costs exceed the benefit — the IAS 37 definition of onerous."
          }
        ]
      }
    ]
  },
  {
    id: "m5",
    title: "Trade Finance, Compliance & Capstone",
    subtitle: "Financing, controls and the full trade cycle",
    topics: [
      {
        id: "m5t1",
        title: "Trade Finance Instruments",
        lesson: `## Trade Finance Instruments

Trade finance bridges the gap between shipping goods and getting paid.

### Letter of Credit (LC)
A bank's undertaking to pay the seller once **conforming documents** are presented.
- **Sight LC** — payment on presentation of compliant documents.
- **Usance (deferred) LC** — payment at a later fixed date, giving the buyer credit.

### Other instruments
- **Standby LC (SBLC)** — a **performance guarantee**; only drawn if the other party defaults.
- **Documentary Collection** — bank handles documents but does **not** guarantee payment: **D/P** (documents against payment) and **D/A** (documents against acceptance).
- **Bank Payment Obligation (BPO)** — an irrevocable inter-bank payment undertaking based on electronic data matching.
- **Pre-export finance (PXF)** — lending against **confirmed offtake contracts** (repaid from sale proceeds).
- **Borrowing Base facilities** — revolving credit secured against a fluctuating pool of **inventory and receivables**, common for trading houses.`,
        quiz: [
          {
            q: "A sight LC is paid:",
            options: ["At a later fixed date", "On presentation of conforming documents", "Only if the seller defaults", "When the goods are resold"],
            answer: 1,
            explain: "A sight LC pays immediately upon presentation of compliant (conforming) documents."
          },
          {
            q: "An SBLC primarily functions as a:",
            options: ["Primary payment method — pays the seller on presentation of documents", "Performance guarantee drawn only on default of the counterparty", "Lease — a right-of-use arrangement for equipment or storage", "Hedge — a derivative instrument to manage price risk"],
            answer: 1,
            explain: "A standby LC is a guarantee that is only drawn if the counterparty fails to perform."
          },
          {
            q: "A borrowing base facility is secured against:",
            options: ["Fixed assets only — secured solely against property, plant, and equipment on the balance sheet", "A fluctuating pool of inventory and receivables — the eligible collateral changes as stock and sales evolve", "The LC — secured against the letter of credit issued by the buyer's bank for a specific shipment", "Future profits — lending is secured against projected earnings from forthcoming commodity sales"],
            answer: 1,
            explain: "Borrowing base facilities lend against a changing pool of eligible inventory and receivables, common for commodity traders."
          },
          {
            q: "In a documentary collection, the bank:",
            options: ["Guarantees payment upon presentation of conforming documents", "Handles documents but does not guarantee payment to the seller", "Issues a standby letter of credit as a performance guarantee", "Provides pre-export finance against confirmed offtake contracts"],
            answer: 1,
            explain: "A documentary collection (D/P or D/A) means the bank handles the documents but does not guarantee payment, unlike an LC."
          }
        ]
      },
      {
        id: "m5t2",
        title: "AML and Sanctions in African Commodity Trade",
        lesson: `## AML and Sanctions in African Commodity Trade

Commodity trade is high-risk for **money laundering** because of large values, cross-border flows and complex documentation.

### Trade-based money laundering (TBML)
Common techniques:
- **Over- / under-invoicing** — mispricing goods to move value across borders.
- **Phantom shipments** — invoicing for goods that don't exist.
- **Multiple invoicing** for a single shipment.

### Red flags in coal and sulphur sourcing
- **PEPs** (politically exposed persons) in the ownership chain.
- **State-owned entities** — e.g. **Transnet** (rail/ports) and **Eskom** (power utility) in South Africa.
- **Opaque ownership** / shell structures hiding the **UBO**.
- Payments to third-party jurisdictions unrelated to the trade.

### What a trader must do
- **UBO checks** — identify the ultimate beneficial owner.
- **Sanctions screening** at **onboarding and per transaction** (OFAC, EU, UN).
- **Transaction monitoring** for patterns inconsistent with the customer profile.
- Maintain a documented, risk-based AML programme.

### Russia coal sanctions
EU and UK sanctions prohibit or restrict the import, purchase, and transport of Russian coal. Traders must verify the **origin** of coal cargoes to ensure compliance — a Certificate of Origin and supply-chain traceability are essential.`,
        quiz: [
          {
            q: "Over-invoicing and phantom shipments are techniques of:",
            options: ["Hedge accounting — a method of aligning gains and losses on derivatives with hedged items under IFRS 9", "Trade-based money laundering (TBML) — moving illicit value through mis-invoicing and phantom shipments", "Pre-export finance — lending against confirmed offtake contracts repaid from sale proceeds", "Provisional pricing — setting a cargo's final price using a quotational period average benchmark"],
            answer: 1,
            explain: "These are classic TBML techniques used to move illicit value through trade transactions."
          },
          {
            q: "A 'UBO' check identifies the:",
            options: ["Usual bank operator — the primary banking relationship manager handling the counterparty's accounts", "Ultimate beneficial owner — the natural person(s) who ultimately own or control the counterparty entity", "Unit base order — the minimum transaction quantity used as the baseline for bulk commodity pricing", "Underlying bond obligation — the debt instrument securing the counterparty's financial obligations"],
            answer: 1,
            explain: "UBO = ultimate beneficial owner — the natural person(s) who ultimately own or control the counterparty."
          },
          {
            q: "Sanctions screening should be performed:",
            options: ["Once at onboarding only", "At onboarding and at each transaction", "Only for EU clients", "Only above $10m"],
            answer: 1,
            explain: "Robust programmes screen against OFAC/EU/UN lists at onboarding and at the transaction level."
          },
          {
            q: "EU and UK sanctions on Russian coal mean traders must:",
            options: ["Ignore the origin of coal — sanctions do not require any specific verification of cargo provenance for compliance", "Verify the origin of coal cargoes through certificates of origin and supply-chain traceability documentation", "Only buy from South Africa — EU and UK sanctions mandate sourcing coal exclusively from non-Russian origin countries", "Pay in rubles — sanctions compliance is achieved by settling all transactions in Russian currency"],
            answer: 1,
            explain: "Sanctions prohibit/restrict Russian coal, so traders must verify cargo origin through certificates of origin and supply-chain traceability."
          }
        ]
      },
      {
        id: "m5t3",
        title: "Carbon and Environmental Accounting",
        lesson: `## Carbon and Environmental Accounting

### Coal and carbon
The big issue for coal traders is **Scope 3 emissions** — the downstream **combustion** of the coal they sell, which dwarfs their own operational footprint.

### Disclosure frameworks
- **TCFD** — climate-related financial disclosures (governance, strategy, risk, metrics).
- **ISSB IFRS S2** — climate-related disclosures standard (building on TCFD), effective **2024**, increasingly mandated.
- **CBAM** — the EU **Carbon Border Adjustment Mechanism** prices the carbon embedded in certain imports, raising the landed cost of carbon-intensive goods in Europe. This is reducing European demand for South African and Mozambican coal.

### Impacts on African coal
- Pressure on **coal offtake pricing** and the **residual value of coal assets** (stranded-asset risk).
- Shorter contract tenors and a demand shift away from Europe toward **India, Pakistan and the Middle East**.
- The **African Climate Foundation** and others have raised concerns about CBAM's impact on African export competitiveness.

### Sulphur and shipping
**IMO 2020** capped the **sulphur content of marine fuel** at 0.5% (from 3.5%), reshaping bunker fuel demand and boosting scrubber use — relevant to anyone moving bulk coal or sulphur cargoes by sea.`,
        quiz: [
          {
            q: "For coal traders, the most significant emissions category is:",
            options: ["Scope 1 only — direct emissions from the trader's own operations, vehicles, and owned facilities", "Scope 2 only — indirect emissions from purchased electricity and energy used in the trader's offices and warehouses", "Scope 3 (downstream combustion) — emissions from burning the sold coal at power stations by end-users", "None — coal trading is classified as carbon-neutral under international greenhouse gas accounting standards"],
            answer: 2,
            explain: "Scope 3 downstream combustion of sold coal dominates a coal trader's carbon footprint."
          },
          {
            q: "ISSB IFRS S2 deals with:",
            options: ["Inventory costing — the standard governing measurement of stock at lower of cost and NRV under IAS 2", "Climate-related disclosures — the ISSB standard building on TCFD, effective 2024, for sustainability reporting", "Lease accounting — the standard requiring right-of-use assets and lease liabilities under IFRS 16", "Revenue recognition — the 5-step model standard governing when revenue is recognised under IFRS 15"],
            answer: 1,
            explain: "IFRS S2 is the ISSB climate-related disclosures standard, building on the TCFD framework, effective 2024."
          },
          {
            q: "CBAM is best described as:",
            options: ["A coal benchmark — a price index for thermal coal delivered into European ARA ports similar to API2", "An EU carbon border adjustment on imports — pricing carbon embedded in goods entering the EU market", "A shipping route — a maritime passage for bulk commodity transport between Europe and Africa", "A sanctions list — an OFAC-style registry restricting trade with carbon-intensive commodity producers"],
            answer: 1,
            explain: "CBAM prices the carbon embedded in certain imports into the EU, raising the cost of carbon-intensive goods and reducing European coal demand."
          },
          {
            q: "IMO 2020 capped marine fuel sulphur content at:",
            options: ["3.5%", "1.0%", "0.5%", "0.1%"],
            answer: 2,
            explain: "IMO 2020 reduced the marine fuel sulphur cap to 0.5%, down from the previous 3.5%."
          }
        ]
      },
      {
        id: "m5t4",
        title: "Capstone Case Study — Full Trade Cycle",
        lesson: `## Capstone Case Study — Full Trade Cycle

### The deal: AfriCoal Trading Ltd
- **Buys** 50,000 MT thermal coal from a Mozambican producer — **FOB Beira, $115/MT**, B/L **10 April**.
- **Sells** to a Pakistani power utility — **CIF Karachi, $128/MT**, estimated freight + insurance **$6/MT**.
- **Hedged** price risk with **API4 futures**.
- Payment secured by a **confirmed LC** from the buyer's bank.

### Work it through
**(a) Incoterm implications** — On the **buy**, AfriCoal takes control FOB Beira (on loading, 10 April). On the **sell** (CIF Karachi), AfriCoal arranges and pays freight + insurance; control/revenue judgement points to recognition at **loading** for the sale leg in most CIF cases (seller bears risk in transit but the obligation is the goods).

**(b) Gross margin** — Revenue $128 − cost $115 − freight/insurance $6 = **$7/MT**. × 50,000 = **$350,000** gross margin.

**(c) Revenue timing (IFRS 15)** — Recognise sale revenue when **control transfers** (loading for CIF, per the contract analysis); the freight/insurance is a fulfilment cost the seller bears to destination.

**(d) Embedded derivative** — Coal priced at a fixed $128 (not index-linked) → **no embedded derivative**. (If it were API4-linked, assess closely-related.)

**(e) Hedge accounting** — API4 futures hedging the price of a forecast/committed sale → **cash flow hedge**; effective portion to **OCI**, reclassified to P&L when the sale is recognised.

**(f) Documents to trigger LC payment** — Bill of Lading, Commercial Invoice, Certificate of Origin, Quality Certificate (assay), Packing List, and **insurance certificate** (because CIF).`,
        quiz: [
          {
            q: "What is the gross margin per MT?",
            options: ["$13/MT", "$7/MT", "$6/MT", "$128/MT"],
            answer: 1,
            explain: "Revenue $128 − cost $115 − freight/insurance $6 = $7/MT gross margin."
          },
          {
            q: "Total gross margin on the 50,000 MT cargo is:",
            options: ["$650,000", "$350,000", "$300,000", "$700,000"],
            answer: 1,
            explain: "$7/MT × 50,000 MT = $350,000 total gross margin."
          },
          {
            q: "The API4 futures hedge is accounted for as a:",
            options: ["Fair value hedge", "Cash flow hedge with effective portion in OCI", "Embedded derivative", "Provision"],
            answer: 1,
            explain: "Hedging the price of a forecast/committed sale is a cash flow hedge; the effective portion sits in OCI until the sale hits P&L."
          },
          {
            q: "Because the sale is CIF, the LC document set notably must include:",
            options: ["A lease agreement", "An insurance certificate", "A hedge designation memo", "A sanctions report"],
            answer: 1,
            explain: "Under CIF the seller arranges insurance, so an insurance certificate is part of the conforming documents required to draw the LC."
          },
          {
            q: "Is there an embedded derivative in this sale?",
            options: ["Yes — linked to API4", "No — the sale price is fixed at $128/MT", "Yes — the LC is a derivative", "Yes — freight is a derivative"],
            answer: 1,
            explain: "The sale is at a fixed $128/MT with no index link, so there is no separable embedded derivative."
          }
        ]
      }
    ]
  }
];

export const FINAL_ASSESSMENT = [
  { q: "Fungibility means that a commodity unit is:", options: ["Unique and non-tradable", "Interchangeable with another of the same grade", "Always physically delivered", "Priced in local currency"], answer: 1, explain: "Fungibility means interchangeability of units of the same grade." },
  { q: "API4 references coal:", options: ["Delivered into ARA", "FOB Richards Bay", "FOB Beira", "CIF Karachi"], answer: 1, explain: "API4 is the FOB Richards Bay coal index, averaging Argus and McCloskey assessments." },
  { q: "Under FOB, risk transfers:", options: ["At destination", "On loading at the load port", "At LC issuance", "On invoice"], answer: 1, explain: "FOB transfers risk when goods are on board at the load port." },
  { q: "RBCT exported approximately how much coal in 2025?", options: ["40 million MT", "52 million MT", "58 million MT", "70 million MT"], answer: 2, explain: "RBCT exported 57.66 million metric tons in 2025 — the highest in four years." },
  { q: "Which country is the largest buyer of South African coal?", options: ["China", "India", "Pakistan", "Germany"], answer: 1, explain: "India imported 25.75 million tons (45% of RBCT shipments) in 2025." },
  { q: "Provisional pricing creates, under IFRS 15:", options: ["A lease", "Variable consideration", "An onerous contract", "Goodwill"], answer: 1, explain: "Provisional pricing produces variable consideration to estimate and constrain." },
  { q: "A QP of M+1 prices off:", options: ["Shipment-day spot", "The month after shipment's average", "The prior month", "LC date"], answer: 1, explain: "M+1 uses the average benchmark in the month after shipment." },
  { q: "Commodity derivatives are generally measured at:", options: ["Amortised cost", "FVTPL unless hedged", "FVOCI", "Cost"], answer: 1, explain: "Derivatives are at FVTPL unless designated in a qualifying hedge." },
  { q: "The effective portion of a cash flow hedge goes to:", options: ["P&L", "OCI", "Inventory", "Goodwill"], answer: 1, explain: "It goes to OCI and is reclassified to P&L later." },
  { q: "IAS 2 measures inventory at:", options: ["Cost", "NRV", "Lower of cost and NRV", "Fair value always"], answer: 2, explain: "Lower of cost and net realisable value." },
  { q: "NRV equals:", options: ["Cost + margin", "Selling price − costs to complete and sell", "Replacement cost", "Spot price"], answer: 1, explain: "NRV = selling price − costs to complete − costs to sell." },
  { q: "IFRS 16 requires a lessee to recognise:", options: ["Only an expense", "ROU asset and lease liability", "Revenue", "A provision"], answer: 1, explain: "A right-of-use asset and lease liability." },
  { q: "Usage-based variable lease payments are:", options: ["In the lease liability", "Expensed as incurred", "Ignored", "Revenue"], answer: 1, explain: "They are excluded from the liability and expensed as incurred." },
  { q: "An onerous contract provision is the lower of:", options: ["Cost to fulfil and exit penalty", "Cost and NRV", "Spot and forward", "FV and cost"], answer: 0, explain: "Lower of cost to fulfil and the penalty to exit." },
  { q: "A sight LC pays:", options: ["At a future date", "On presentation of conforming documents", "Only on default", "On resale"], answer: 1, explain: "Sight LCs pay on presentation of compliant documents." },
  { q: "An SBLC is:", options: ["A primary payment tool", "A performance guarantee", "A hedge", "A lease"], answer: 1, explain: "A standby LC is a guarantee drawn only on default." },
  { q: "For coal traders, dominant emissions are:", options: ["Scope 1", "Scope 2", "Scope 3 combustion", "Zero"], answer: 2, explain: "Scope 3 downstream combustion dominates." },
  { q: "An embedded derivative is bifurcated when it is:", options: ["Closely related to host", "Not closely related to host", "In USD", "Short-term"], answer: 1, explain: "Bifurcation requires it to be not closely related (and meet other criteria)." },
  { q: "A coal contract priced off API4 is typically:", options: ["Bifurcated", "Closely related, not bifurcated", "A lease", "Revenue"], answer: 1, explain: "Pricing the delivered commodity off its own index is closely related." },
  { q: "IMO 2020 capped marine fuel sulphur at:", options: ["3.5%", "1.0%", "0.5%", "0.1%"], answer: 2, explain: "The marine fuel sulphur cap was reduced to 0.5%." },
  { q: "The Middle East accounts for roughly what share of seaborne sulphur trade?", options: ["10%", "24%", "50%", "75%"], answer: 2, explain: "The Middle East accounts for about 50% of seaborne sulphur trade and 24% of total production." },
  { q: "Mozambique's Moatize mine is majority-owned by:", options: ["Vale", "Vulcan", "Glencore", "Anglo American"], answer: 1, explain: "Vulcan (Naveen Jindal's company) acquired Moatize from Vale and holds 95%." }
];

export const GLOSSARY = [
  { term: "API2", def: "Coal price index for material delivered into Amsterdam-Rotterdam-Antwerp (ARA). A key European thermal coal benchmark used widely for pricing and hedging." },
  { term: "API4", def: "Coal price index for material loaded FOB Richards Bay, South Africa. Calculated as the average of the Argus fob Richards Bay 6,000 assessment and the McCloskey Richards Bay FOB marker. The reference benchmark for South African thermal coal exports." },
  { term: "Argus", def: "A leading provider of price assessments across energy, metals and chemicals including coal and sulphur. Co-publishes the API4 index with McCloskey." },
  { term: "Bill of Lading", def: "A carrier-issued document of title, receipt for goods and evidence of the carriage contract. Whoever holds the original controls the cargo." },
  { term: "Cash Flow Hedge", def: "A hedge of variability in future cash flows (e.g. a forecast sale). The effective portion is recorded in OCI and reclassified to P&L when the hedged item affects profit." },
  { term: "CBAM", def: "The EU Carbon Border Adjustment Mechanism — prices the carbon embedded in certain imports into the EU, raising the cost of carbon-intensive goods and reducing European demand for coal." },
  { term: "CIF", def: "Cost, Insurance and Freight. The seller pays freight and insurance to destination, though risk typically passes at the loading port." },
  { term: "Coking Coal", def: "Metallurgical coal used to make coke for steelmaking. Mozambique's Tete province is a notable African source, with the Moatize mine as its flagship." },
  { term: "Commodity", def: "A fungible raw material or primary product (energy, metals, chemicals) that is interchangeable by grade and traded against standard benchmarks." },
  { term: "Embedded Derivative", def: "A derivative-like feature within a host contract. It is separated (bifurcated) and measured at FVTPL when not closely related to the host and other IFRS 9 criteria are met." },
  { term: "Eskom", def: "South Africa's state-owned power utility and the largest domestic consumer of thermal coal. Dealings require awareness of public-procurement and anti-corruption standards." },
  { term: "Exxaro Resources", def: "A major South African diversified coal producer supplying both export and domestic (Eskom) markets." },
  { term: "Fair Value", def: "The price to sell an asset or transfer a liability in an orderly transaction between market participants at the measurement date." },
  { term: "FOB", def: "Free on Board. The seller loads goods onto the vessel; risk transfers once the goods are on board at the named loading port. Standard for Richards Bay coal exports." },
  { term: "Forward Contract", def: "A customisable OTC agreement to deliver a quantity at a future date and agreed price. Carries counterparty risk." },
  { term: "Futures Contract", def: "A standardised, exchange-traded and centrally cleared forward, marked-to-market daily and widely used for hedging. API4 futures trade on ICE Futures Europe." },
  { term: "Hedge Accounting", def: "An optional IFRS 9 treatment aligning the timing of gains/losses on a hedging instrument with the hedged item to reduce P&L volatility." },
  { term: "IAS 2", def: "The inventories standard. Inventory is held at the lower of cost and net realisable value; broker-traders may use fair value less costs to sell." },
  { term: "IAS 37", def: "The standard for provisions and contingent liabilities, including onerous contracts and environmental/restoration provisions." },
  { term: "IFRS 9", def: "The financial instruments standard covering classification, measurement, derivatives, hedge accounting and embedded derivatives." },
  { term: "IFRS 15", def: "The revenue standard with a 5-step model; revenue is recognised when control of goods transfers to the customer." },
  { term: "IFRS 16", def: "The leases standard requiring lessees to recognise a right-of-use asset and lease liability for most leases." },
  { term: "IMO 2020", def: "International Maritime Organization regulation capping the sulphur content of marine fuel at 0.5% (from 3.5%), reshaping bunker fuel demand and boosting scrubber use." },
  { term: "Incoterms", def: "Standard trade terms (FOB, CIF, CFR, DAP) defining where risk, cost and responsibility pass between seller and buyer." },
  { term: "Jorf Lasfar", def: "Morocco's main phosphate processing hub, where OCP Group operates sulphur burners. Two new sulphur burners started there in 2024." },
  { term: "KYC", def: "Know Your Customer — the process of identifying and verifying a counterparty, including UBO and sanctions checks." },
  { term: "LC (Letter of Credit)", def: "A bank's conditional undertaking to pay the seller once conforming documents are presented. Sight or usance (deferred)." },
  { term: "Mark-to-Market", def: "Revaluing a position to its current market price, recognising unrealised gains/losses." },
  { term: "Moatize", def: "Mozambique's flagship coking coal mine in Tete province, now 95% owned by Vulcan (Naveen Jindal's company) after Vale's 2021–2022 divestment." },
  { term: "Nacala Corridor", def: "A rail line and logistics corridor from Moatize to the deep-water port of Nacala-a-Velha, built to export Mozambican coking coal." },
  { term: "NRV", def: "Net Realisable Value — estimated selling price less costs to complete and sell. Used to test inventory carrying value under IAS 2." },
  { term: "OCP Group", def: "Morocco's state-owned phosphate company, the world's largest phosphate producer holding ~70% of global phosphate rock reserves. A major sulphur consumer." },
  { term: "Offtake Agreement", def: "A contract to buy/sell future production, often used to underpin financing such as pre-export finance." },
  { term: "OFAC", def: "The US Office of Foreign Assets Control, which administers and enforces US sanctions programmes." },
  { term: "OCI", def: "Other Comprehensive Income — equity section where certain items (e.g. effective cash flow hedge gains/losses) are recorded before reclassification to P&L." },
  { term: "Onerous Contract", def: "A contract where unavoidable costs of meeting obligations exceed expected benefits, requiring a provision under IAS 37." },
  { term: "PEP", def: "Politically Exposed Person — an individual with prominent public functions, carrying elevated corruption/AML risk." },
  { term: "Platts", def: "S&P Global Platts — a leading provider of price assessments across energy, metals and chemicals including sulphur." },
  { term: "Provisional Pricing", def: "Pricing where the final price is fixed later (e.g. average API4 over a quotational period), creating variable consideration under IFRS 15." },
  { term: "QP (Quotational Period)", def: "The averaging window used to set a provisional price, e.g. M+1 (the month after shipment)." },
  { term: "RBCT", def: "Richards Bay Coal Terminal — South Africa's main coal export hub, one of the largest in the world. Exported 57.66 million MT in 2025." },
  { term: "Right-of-Use Asset", def: "The asset a lessee recognises under IFRS 16 representing its right to use a leased item over the lease term." },
  { term: "Sanctions", def: "Government/international restrictions (OFAC, EU, UN) on dealings with certain countries, entities or persons; screened at onboarding and per transaction." },
  { term: "Seriti Resources", def: "A major South African coal mining company supplying Eskom and export markets." },
  { term: "Spot Price", def: "The price for immediate or near-immediate delivery of a commodity." },
  { term: "Sulphur", def: "A chemical commodity recovered as a byproduct of oil refining, gas processing and metal smelting; key feedstock for sulphuric acid and phosphate fertilisers." },
  { term: "Sulphuric Acid", def: "H₂SO₄ — the world's most-used industrial chemical, produced from sulphur. Essential for processing phosphate rock into fertiliser." },
  { term: "TBML", def: "Trade-Based Money Laundering — moving illicit value through trade via mis-invoicing, phantom shipments and similar techniques." },
  { term: "Thermal Coal", def: "Coal burned for power generation, priced off indices such as API2 (ARA) and API4 (Richards Bay)." },
  { term: "Thungela Resources", def: "A leading South African pure-play producer and exporter of thermal coal, spun off from Anglo American in 2021." },
  { term: "Transfer of Control", def: "The point at which the customer obtains control of goods, driving revenue recognition timing under IFRS 15." },
  { term: "Transnet", def: "South Africa's state-owned rail and port operator. Transnet Freight Rail moves coal from Mpumalanga to Richards Bay; its efficiency directly determines export volumes." },
  { term: "UBO", def: "Ultimate Beneficial Owner — the natural person(s) who ultimately own or control a counterparty; a core KYC/AML check." },
  { term: "Variable Consideration", def: "Consideration that varies in amount (e.g. from provisional pricing), estimated and constrained under IFRS 15." },
  { term: "Vulcan", def: "An Indian company (Naveen Jindal) that acquired the Moatize coal mine from Vale in 2021–2022, holding 95% ownership." }
];

export const PASS_THRESHOLD = 70;
export const FINAL_PASS_THRESHOLD = 75;
export const XP_PER_CORRECT = 10;
export const XP_FIRST_PASS_BONUS = 25;
export const DAILY_XP_BONUS = 15;

export const EXPERT_QUESTIONS = [
// Expert-level questions: scenario-based, testing deep application of principles
  {
    q: "A coal trader sells FOB Richards Bay with provisional pricing at QP M+1. The B/L is dated 28 March. Which month's average API4 sets the final price, and what IFRS 15 concept does this trigger?",
    options: [
      "March average — fixed consideration",
      "April average — variable consideration requiring estimation and constraint",
      "May average — a lease liability",
      "March spot price — an onerous contract",
    ],
    answer: 1,
    explain:
      "M+1 means the quotational period is the month after shipment (April). The final price is unknown at shipment, creating variable consideration under IFRS 15 that must be estimated, constrained, and remeasured.",
  },
  {
    q: "A coal offtake contract is priced 50% off API4 and 50% at a fixed USD amount. Under IFRS 9, does the API4-linked portion require bifurcation as an embedded derivative?",
    options: [
      "Yes — any index link requires bifurcation",
      "No — it is closely related because the pricing references the same commodity being delivered",
      "Yes — because 50% is a significant portion",
      "No — because the contract is in USD",
    ],
    answer: 1,
    explain:
      "A pricing clause linked to the commodity actually being delivered (coal off API4) is generally considered closely related to the host supply contract and does not require bifurcation.",
  },
  {
    q: "A registered commodity broker-trader holds sulphur inventory purchased at $180/MT. Argus drops to $155/MT with $8/MT selling costs. Under IAS 2.3(b), at what value is the inventory carried?",
    options: [
      "$180/MT — original cost (lower of cost and NRV)",
      "$147/MT — fair value less costs to sell (broker-trader exception)",
      "$155/MT — current Argus price",
      "$172/MT — cost less a 5% provision",
    ],
    answer: 1,
    explain:
      "The IAS 2.3(b) broker-trader exception allows measurement at fair value less costs to sell: $155 − $8 = $147/MT, with changes through P&L. This overrides the normal lower-of-cost-and-NRV rule.",
  },
  {
    q: "A time charter contains a fixed daily rate of $20,000/day plus $5,000/day when the vessel is actively used. Under IFRS 16, what amount is included in the lease liability?",
    options: [
      "$25,000/day — the full combined rate",
      "$20,000/day — only the fixed in-substance fixed payments; usage-based variable payments are expensed as incurred",
      "$5,000/day — only the variable portion",
      "Zero — time charters are never leases",
    ],
    answer: 1,
    explain:
      "IFRS 16 includes only fixed payments (or in-substance fixed) in the lease liability. Variable payments based on usage are excluded and expensed as incurred.",
  },
  {
    q: "A trader has a fixed-price purchase contract: 100,000 MT coal at $130/MT. Market falls to $105/MT. The cancellation penalty is $500,000. What onerous contract provision is recognised under IAS 37?",
    options: [
      "$2,500,000 — the full loss from fulfilling",
      "$500,000 — the lower of cost to fulfil ($2.5m) and exit penalty ($500k)",
      "$13,000,000 — the contract value",
      "Zero — the trader can simply walk away",
    ],
    answer: 1,
    explain:
      "IAS 37 measures the onerous provision as the lower of the cost of fulfilling (100,000 × $25 = $2,500,000) and the penalty to exit ($500,000). The rational trader pays the penalty, so $500,000 is recognised.",
  },
  {
    q: "A coal trader's cash flow hedge is de-designated, but the forecast sale is still highly probable. What happens to the accumulated amount in OCI?",
    options: [
      "Reclassified to P&L immediately",
      "Remains in OCI until the forecast sale affects P&L",
      "Transferred to inventory",
      "Written off as an ineffective hedge",
    ],
    answer: 1,
    explain:
      "If the hedge is de-designated but the forecast transaction is still expected, amounts remain in the cash flow hedge reserve (OCI) and are reclassified to P&L when the hedged sale is recognised.",
  },
  {
    q: "Under a CIF Karachi sale, the seller arranges and pays freight and insurance to destination. For IFRS 15 revenue recognition, when does control typically transfer?",
    options: [
      "At destination when the goods arrive in Karachi",
      "At the loading port when goods are on board (risk passes at loading under CIF)",
      "When the buyer pays the LC",
      "When the insurance certificate is issued",
    ],
    answer: 1,
    explain:
      "Under CIF, although the seller pays freight and insurance to destination, risk typically passes at the loading port when goods are on board. This is strong evidence that control transfers at loading for IFRS 15.",
  },
  {
    q: "A provisionally priced coal receivable (QP M+1) is outstanding at period-end. Under IFRS 9, how is this receivable subsequently measured?",
    options: [
      "At original cost until cash is received",
      "At fair value through P&L until the quotational period finalises",
      "At amortised cost using the effective interest method",
      "In OCI until settlement",
    ],
    answer: 1,
    explain:
      "A provisionally priced receivable embeds a commodity-linked feature. Under IFRS 9 it is remeasured at fair value through P&L each period until the QP finalises the price.",
  },
  {
    q: "A trader buys coal FOB Beira at $115/MT and sells CIF Karachi at $128/MT with $6/MT freight and insurance. Under IFRS 15, is the freight a separate performance obligation?",
    options: [
      "Yes — freight is a distinct service",
      "No — it is a fulfilment cost the seller bears to deliver the goods; the single obligation is delivering the coal",
      "Yes — because the seller arranges it separately",
      "Only if the freight exceeds 10% of the price",
    ],
    answer: 1,
    explain:
      "The freight and insurance under CIF are costs to fulfil the single performance obligation (delivering the goods). They are not a separate obligation; they reduce the seller's gross margin.",
  },
  {
    q: "Sulphur inventory was written down from $180/MT cost to $147/MT NRV. The following quarter, NRV recovers to $175/MT. Under IAS 2, what is the reversal?",
    options: [
      "No reversal is permitted under IAS 2",
      "Reverse to $175/MT (capped at original cost $180); recognise $28/MT as income",
      "Reverse to the original $180/MT cost",
      "Reverse only 50% of the write-down",
    ],
    answer: 1,
    explain:
      "IAS 2 permits reversing a write-down when NRV recovers, but the carrying amount cannot exceed original cost. New carrying amount = lower of cost ($180) and new NRV ($175) = $175/MT, a $28/MT reversal recognised as income.",
  },
  {
    q: "A coal trade involves Transnet as the rail operator. Which compliance consideration is most relevant?",
    options: [
      "Quality assay verification",
      "Transnet is a state-owned entity — PEP and anti-corruption due diligence is required",
      "FIFO calculation and NRV test",
      "Incoterm selection",
    ],
    answer: 1,
    explain:
      "Transnet is a South African state-owned entity. Dealings with state-owned entities require PEP screening, anti-corruption due diligence, and awareness of public-procurement rules.",
  },
  {
    q: "A trader designates a hedge with a hedge ratio of 1.2:1 (120% of exposure). Under IFRS 9, what is the likely consequence?",
    options: [
      "No issue — IFRS 9 allows any ratio",
      "The excess 20% creates hedge ineffectiveness recognised in P&L; the ratio must reflect the economic relationship",
      "The entire hedge is disqualified",
      "Only the 100% portion qualifies; the rest is ignored",
    ],
    answer: 1,
    explain:
      "IFRS 9 requires the hedge ratio to reflect the actual economic relationship. An over-hedged ratio (1.2:1) means the excess portion causes ineffectiveness, recognised directly in P&L.",
  },
  {
    q: "A March coal shipment (50,000 MT) is provisionally priced at $90/MT with QP M+1. April API4 averages $96/MT. What is the remeasurement adjustment?",
    options: [
      "$300,000 increase — Dr Receivable 300,000 / Cr Revenue (MTM) 300,000",
      "$300,000 decrease — a loss provision",
      "$4,800,000 — the full final value",
      "Zero — the price was fixed at $90",
    ],
    answer: 0,
    explain:
      "Final value = 50,000 × $96 = $4,800,000 vs. $4,500,000 booked. The $300,000 uplift (50,000 × $6) is recognised: Dr Receivable 300,000 / Cr Revenue (mark-to-market) 300,000.",
  },
  {
    q: "A trader currently uses FIFO for coal stockpiles. Under IAS 2, can they switch to weighted average cost next year?",
    options: [
      "No — once chosen, the cost formula is fixed",
      "Yes — IAS 2 permits both FIFO and weighted average; a change is allowed if it provides reliable and more relevant information (IAS 8 policy change)",
      "Only with regulator approval",
      "No — IAS 2 requires LIFO for coal",
    ],
    answer: 1,
    explain:
      "IAS 2 permits FIFO and weighted average (LIFO is banned). Switching between them is a change in accounting policy under IAS 8, permitted if the new policy provides reliable and more relevant information, applied retrospectively.",
  },
  {
    q: "Before recognising an onerous contract provision under IAS 37, what must be done first?",
    options: [
      "Recognise revenue from the contract",
      "Recognise any impairment loss on assets dedicated to the contract (e.g., related inventory written down to NRV under IAS 2)",
      "Open a new hedge relationship",
      "Obtain buyer approval",
    ],
    answer: 1,
    explain:
      "IAS 37 requires recognising impairment on dedicated assets first (e.g., inventory write-down to NRV). The onerous provision then covers only the remaining unavoidable loss not already captured.",
  },
  {
    q: "A Mozambican coal exporter sells thermal coal to India. Does the EU CBAM (Carbon Border Adjustment Mechanism) apply to this trade?",
    options: [
      "Yes — CBAM applies to all coal trades globally",
      "No — CBAM applies to imports into the EU, not exports from Mozambique to India",
      "Yes — because the seller is in a developing country",
      "Only if the coal transits through an EU port",
    ],
    answer: 1,
    explain:
      "CBAM prices carbon embedded in goods imported into the EU. A Mozambique-to-India coal trade is outside CBAM's scope because neither the import nor the destination is the EU.",
  },
  {
    q: "A cash flow hedge has an effective portion of $200,000 and an ineffective portion of $50,000. Where is each portion recognised?",
    options: [
      "Both in P&L immediately",
      "Effective $200,000 in OCI; ineffective $50,000 in P&L immediately",
      "Both in OCI",
      "Effective in P&L; ineffective in OCI",
    ],
    answer: 1,
    explain:
      "Under IFRS 9 cash flow hedge accounting, the effective portion goes to OCI (cash flow hedge reserve) and is reclassified later. The ineffective portion is recognised in P&L immediately.",
  },
  {
    q: "A coal supply contract is priced off an unrelated metal index (not API4). Under IFRS 9, is this likely to require bifurcation?",
    options: [
      "No — any commodity index is closely related",
      "Yes — pricing off an unrelated commodity is not closely related to the host contract",
      "No — because both are commodities",
      "Only if the index price exceeds $10,000/MT",
    ],
    answer: 1,
    explain:
      "A pricing link to a commodity different from the one being delivered (a metal index for a coal contract) is generally not closely related to the host supply contract, potentially requiring bifurcation and FVTPL measurement.",
  },
  {
    q: "A trader signs a 10-month storage tank lease for sulphur with no purchase option. Under IFRS 16, can they use the short-term lease exemption?",
    options: [
      "No — only leases under 6 months qualify",
      "Yes — the short-term exemption applies to leases of 12 months or less, so the 10-month lease qualifies and can be expensed straight-line",
      "No — storage tanks are always on balance sheet",
      "Only if the monthly rent is below a threshold",
    ],
    answer: 1,
    explain:
      "IFRS 16's short-term lease exemption applies to leases of 12 months or less. A 10-month tank lease qualifies and can be expensed on a straight-line basis with no ROU asset or lease liability recognised.",
  },
  {
    q: "A trader's hedged forecast coal sale is no longer highly probable. Under IFRS 9, what must happen to the cash flow hedge?",
    options: [
      "Nothing — the hedge continues automatically",
      "De-designate the hedge; if the forecast transaction is no longer expected, reclassify accumulated OCI to P&L immediately",
      "Transfer the OCI amount to inventory",
      "Keep the hedge but freeze the OCI balance permanently",
    ],
    answer: 1,
    explain:
      "If the forecast transaction is no longer highly probable, the hedge relationship must be de-designated. If the transaction is no longer expected at all, the accumulated cash flow hedge reserve in OCI is reclassified to P&L immediately.",
  },
];

export const DIFFICULTY_LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    desc: "Foundations & market basics (Modules 1–2)",
    moduleRange: [0, 2],
  },
  {
    id: "intermediate",
    label: "Intermediate",
    desc: "Through IFRS foundations (Modules 1–3)",
    moduleRange: [0, 3],
  },
  {
    id: "advanced",
    label: "Advanced",
    desc: "All modules including applied scenarios",
    moduleRange: [0, 5],
  },
  {
    id: "expert",
    label: "Expert",
    desc: "Deep application & professional judgement",
    moduleRange: null,
  },
];