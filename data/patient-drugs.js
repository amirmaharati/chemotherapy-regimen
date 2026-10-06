/*
 * Plain-language information about each drug, for patients.
 * Fields: name (optional patient-friendly name), what (what it does), effects (keys in ONCO.patientContent.sideEffects),
 *         tips (things to know), diet (food and drink advice specific to this drug)
 */
ONCO.patientDrugs = {
  "arsenic-trioxide": {
    what: "Helps the leukaemia cells in APL grow up into normal cells and die. Very effective for this type of leukaemia.",
    effects: ["differentiation", "heart-rhythm", "headache", "nausea", "fatigue", "liver", "neuropathy"],
    tips: ["You will have regular heart tracings (ECGs) and blood tests for salts (potassium, magnesium).", "Tell your team about every other medicine — some affect the heart rhythm."],
  },
  atezolizumab: {
    what: "An immunotherapy. It helps your own immune system recognise and attack cancer cells.",
    effects: ["immune", "fatigue", "rash"],
    tips: ["Side effects can start months after treatment. Carry your immunotherapy alert card."],
  },
  azacitidine: {
    what: "Helps 'switch back on' genes that control abnormal blood cells, so the bone marrow works better.",
    effects: ["infection", "bleeding", "nausea", "constipation", "injection-site", "fatigue"],
    tips: ["Given as injections under the skin for 7 days every 4 weeks.", "It often takes 4–6 cycles before it starts to work — blood counts may drop first."],
  },
  bendamustine: {
    what: "A chemotherapy that damages the DNA of cancer cells so they cannot divide.",
    effects: ["infection", "nausea", "rash", "fatigue", "shingles"],
    tips: ["Your immune system stays weak for months: keep taking antiviral and antibiotic tablets if prescribed.", "If you ever need a blood transfusion, tell the hospital you had bendamustine (you need 'irradiated' blood)."],
  },
  bleomycin: {
    what: "A chemotherapy antibiotic that damages cancer cell DNA.",
    effects: ["flu-like", "lungs", "rash", "nails"],
    tips: ["Your breathing will be checked before each dose.", "**For the rest of your life**, tell any doctor or anaesthetist that you had bleomycin — high oxygen levels can damage the lungs.", "Do not smoke."],
  },
  bortezomib: {
    what: "Blocks a 'recycling system' inside myeloma cells so they die.",
    effects: ["neuropathy", "shingles", "dizziness", "infection", "bleeding", "fatigue", "diarrhoea"],
    tips: ["Given as a small injection under the skin.", "Take your antiviral tablets every day to prevent shingles.", "Tell your team about numbness or tingling early."],
    diet: ["Drink enough fluid to avoid dizziness."],
  },
  capecitabine: {
    what: "A chemotherapy tablet that turns into 5-FU inside the body and stops cancer cells copying their DNA.",
    effects: ["hand-foot", "diarrhoea", "mouth", "nausea", "fatigue", "sun"],
    tips: ["Take twice a day, within 30 minutes after breakfast and your evening meal, with water.", "If you miss a dose, skip it — never take a double dose.", "**Stop the tablets and call** if you have 4 or more extra stools a day, painful mouth ulcers, painful red or peeling hands/feet, fever or chest pain.", "Tell your team if you take warfarin."],
    diet: ["Take after food."],
  },
  carboplatin: {
    what: "A platinum chemotherapy that damages cancer cell DNA.",
    effects: ["infection", "bleeding", "anaemia", "nausea", "fatigue", "allergy"],
    tips: ["Allergic reactions are more likely after many cycles — tell the nurse at once if you feel flushed or itchy during the drip."],
  },
  cisplatin: {
    what: "A platinum chemotherapy that damages cancer cell DNA.",
    effects: ["nausea", "kidney", "hearing", "neuropathy", "infection", "taste", "fatigue"],
    tips: ["You will have fluids through the drip before and after to protect your kidneys.", "Sickness can come 2–5 days later — keep taking anti-sickness medicines."],
    diet: ["Drink 2–3 litres a day for 2–3 days after each treatment."],
  },
  cyclophosphamide: {
    what: "A chemotherapy that damages cancer cell DNA so the cells cannot divide.",
    effects: ["infection", "nausea", "hair-loss", "bladder", "fatigue"],
    tips: ["A stuffy nose or strange taste during the drip is common and passes."],
    diet: ["Drink plenty and pass urine often for 1–2 days to protect your bladder."],
  },
  cytarabine: {
    what: "A chemotherapy that stops leukaemia and lymphoma cells copying their DNA.",
    effects: ["infection", "bleeding", "nausea", "mouth", "diarrhoea", "eyes", "confusion", "rash", "flu-like"],
    tips: ["High doses: use your steroid eye drops as told, and staff will check your balance and handwriting before each dose."],
  },
  dacarbazine: {
    what: "A chemotherapy that damages cancer cell DNA.",
    effects: ["nausea", "infection", "flu-like", "sun"],
    tips: ["The drip bag is covered to protect it from light.", "Tell the nurse if your arm aches along the vein during the drip."],
  },
  daunorubicin: {
    what: "A strong chemotherapy (anthracycline) that damages DNA in leukaemia cells.",
    effects: ["infection", "bleeding", "nausea", "hair-loss", "mouth", "red-urine", "heart", "drip-site"],
    tips: ["Your heart is checked with a scan before treatment."],
  },
  dexamethasone: {
    name: "Dexamethasone (steroid)",
    what: "A steroid. In your treatment it prevents sickness and allergic reactions, or helps kill lymphoma/leukaemia cells.",
    effects: ["steroid-effects", "blood-sugar"],
    tips: ["Take in the morning with food (second dose early afternoon) to help sleep.", "Do not stop high-dose steroid courses early without asking."],
    diet: ["Take with food. Limit sugary drinks and sweets while on steroids."],
  },
  docetaxel: {
    what: "A chemotherapy (taxane) that stops cancer cells dividing.",
    effects: ["infection", "hair-loss", "fluid", "nails", "neuropathy", "mouth", "diarrhoea", "allergy", "fatigue"],
    tips: ["Take your steroid tablets the day before, the day of and the day after treatment — they prevent reactions and swelling.", "Frozen gloves and socks during the drip may protect your nails."],
  },
  doxorubicin: {
    what: "A strong chemotherapy (anthracycline) that damages cancer cell DNA.",
    effects: ["infection", "nausea", "hair-loss", "mouth", "red-urine", "heart", "drip-site", "fatigue"],
    tips: ["Your heart is checked with a scan before (and sometimes during) treatment.", "Red urine for 1–2 days is normal."],
  },
  durvalumab: {
    what: "An immunotherapy. It helps your own immune system recognise and attack cancer cells.",
    effects: ["immune", "fatigue", "rash"],
    tips: ["Side effects can start months after treatment. Carry your immunotherapy alert card."],
  },
  etoposide: {
    what: "A chemotherapy that stops cancer cells repairing and copying their DNA.",
    effects: ["infection", "hair-loss", "nausea", "fatigue", "dizziness"],
    tips: ["Given slowly to avoid a drop in blood pressure."],
  },
  filgrastim: {
    name: "Growth-factor injection (filgrastim / pegfilgrastim)",
    what: "Not chemotherapy. It helps your bone marrow make white blood cells faster, so you are less likely to get an infection.",
    effects: ["aches"],
    tips: ["Given as an injection under the skin (you or a nurse can do it at home).", "Bone or back pain for a few days is common — paracetamol or loratadine helps.", "Call if you have pain in the upper left tummy or left shoulder tip."],
  },
  fludarabine: {
    what: "A chemotherapy that stops leukaemia cells copying their DNA.",
    effects: ["infection", "bleeding", "fatigue", "nausea"],
    tips: ["Your immune system stays weak for months: keep taking antiviral and antibiotic tablets.", "If you need a blood transfusion — now or in the future — tell the hospital you had fludarabine (you need 'irradiated' blood)."],
  },
  fluorouracil: {
    name: "Fluorouracil (5-FU)",
    what: "A chemotherapy that stops cancer cells copying their DNA. Often given through a small pump you take home.",
    effects: ["mouth", "diarrhoea", "hand-foot", "infection", "nausea", "fatigue", "sun"],
    tips: ["Keep the pump safe, dry and below the level of your line; use the spill kit if it leaks.", "Chest pain during the pump — stop the pump (if shown how) and go to hospital."],
  },
  gemcitabine: {
    what: "A chemotherapy that stops cancer cells copying their DNA.",
    effects: ["infection", "bleeding", "flu-like", "rash", "fluid", "fatigue"],
    tips: ["A flu-like feeling the day after treatment is common — paracetamol helps."],
  },
  idarubicin: {
    what: "A strong chemotherapy (anthracycline) that damages DNA in leukaemia cells.",
    effects: ["infection", "bleeding", "nausea", "hair-loss", "mouth", "red-urine", "heart", "drip-site"],
  },
  ifosfamide: {
    what: "A chemotherapy that damages cancer cell DNA.",
    effects: ["bladder", "confusion", "kidney", "infection", "nausea", "hair-loss", "fatigue"],
    tips: ["Given with mesna and extra fluids to protect your bladder.", "Family should tell the nurse if you seem confused, very sleepy or 'not yourself'."],
    diet: ["Drink plenty and pass urine often."],
  },
  irinotecan: {
    what: "A chemotherapy that stops cancer cells repairing their DNA.",
    effects: ["diarrhoea", "infection", "nausea", "hair-loss", "fatigue"],
    tips: ["Sweating, tummy cramps or watery eyes during or soon after the drip — tell the nurse (an injection helps).", "Start loperamide at the **first** loose stool after you go home — late diarrhoea can be serious."],
    diet: ["Follow the diarrhoea food advice if stools become loose."],
  },
  lenalidomide: {
    what: "A tablet that helps the immune system fight myeloma and stops new blood vessels feeding the cancer.",
    effects: ["infection", "bleeding", "clots", "rash", "diarrhoea", "fatigue"],
    tips: ["Swallow capsules whole at the same time each day.", "**Must not be taken in pregnancy** — follow the pregnancy prevention programme and do not donate blood.", "Take your aspirin or blood thinner to prevent clots."],
  },
  leucovorin: {
    name: "Folinic acid (leucovorin)",
    what: "A vitamin-like medicine. With 5-FU it makes the chemotherapy work better; after high-dose methotrexate it 'rescues' healthy cells.",
    effects: [],
    tips: ["After high-dose methotrexate the doses must be taken exactly on time."],
  },
  mesna: {
    what: "Not chemotherapy. It protects the bladder from damage by ifosfamide or high-dose cyclophosphamide.",
    effects: [],
    tips: ["Take mesna tablets exactly on time. If you vomit within 2 hours, tell the nurse."],
    diet: ["Mesna tablets can taste bad — take with juice or a cold drink."],
  },
  methotrexate: {
    what: "A chemotherapy that blocks a vitamin (folate) that cancer cells need to grow.",
    effects: ["mouth", "kidney", "infection", "liver", "nausea", "rash", "confusion"],
    tips: ["High doses are given in hospital with fluids, urine tests and daily blood levels.", "Do not take ibuprofen, aspirin, omeprazole-type stomach tablets, co-trimoxazole or penicillin antibiotics around high-dose methotrexate unless your team agrees."],
    diet: ["Do not take vitamin or supplement tablets containing folic acid unless your team prescribes them."],
  },
  methylprednisolone: {
    name: "Methylprednisolone (steroid)",
    what: "A steroid given through the drip as part of your treatment.",
    effects: ["steroid-effects", "blood-sugar"],
  },
  "nab-paclitaxel": {
    what: "A chemotherapy (taxane) joined to a protein (albumin) that stops cancer cells dividing.",
    effects: ["infection", "neuropathy", "hair-loss", "fatigue", "nausea", "diarrhoea"],
  },
  oxaliplatin: {
    what: "A platinum chemotherapy that damages cancer cell DNA.",
    effects: ["cold-tingling", "neuropathy", "nausea", "diarrhoea", "infection", "allergy", "fatigue"],
    tips: ["Tingling with cold is common for a few days after each dose.", "Tell your team before each treatment if numbness lasts between treatments."],
    diet: ["Drink at room temperature or warm for 3–5 days — no ice, cold drinks or cold food."],
  },
  paclitaxel: {
    what: "A chemotherapy (taxane) that stops cancer cells dividing.",
    effects: ["allergy", "neuropathy", "hair-loss", "aches", "infection", "fatigue"],
    tips: ["You get medicines before the drip to prevent allergic reactions.", "Aching muscles or joints 2–4 days after treatment is common — paracetamol helps.", "Contains alcohol — you may feel drowsy; do not drive straight after."],
  },
  pembrolizumab: {
    what: "An immunotherapy. It takes the 'brakes' off your immune system so it can attack cancer cells.",
    effects: ["immune", "fatigue", "rash"],
    tips: ["Side effects can start any time — even months after the last dose. Carry your immunotherapy alert card."],
  },
  pemetrexed: {
    what: "A chemotherapy that blocks a vitamin (folate) cancer cells need to grow.",
    effects: ["infection", "rash", "mouth", "fatigue", "nausea"],
    tips: ["Take the folic acid tablet **every day** — it protects you from side effects.", "You will have a vitamin B12 injection every 9 weeks.", "Take steroid tablets the day before, the day of and the day after treatment (prevents rash).", "Avoid ibuprofen around treatment days unless your team agrees."],
    diet: ["Take folic acid daily as prescribed."],
  },
  pertuzumab: {
    what: "A targeted antibody that blocks HER2, a protein that helps some breast cancers grow.",
    effects: ["diarrhoea", "rash", "heart", "allergy"],
    tips: ["Heart scans every 3 months."],
  },
  polatuzumab: {
    what: "An antibody that carries a chemotherapy drug directly to lymphoma cells.",
    effects: ["neuropathy", "infection", "diarrhoea", "allergy"],
  },
  prednisolone: {
    name: "Prednisolone (steroid)",
    what: "A steroid tablet. In lymphoma treatment it helps kill cancer cells; it also reduces sickness and allergic reactions.",
    effects: ["steroid-effects", "blood-sugar"],
    tips: ["Take in the morning with food."],
    diet: ["Take with food; limit sugary foods and drinks."],
  },
  rituximab: {
    what: "An antibody that sticks to a marker (CD20) on lymphoma cells and helps the immune system destroy them.",
    effects: ["allergy", "infection", "fatigue"],
    tips: ["The first drip is given slowly. Fever, shivering or a rash during the drip is common — tell the nurse.", "You will be tested for hepatitis B before starting.", "Do not have live vaccines."],
  },
  temozolomide: {
    what: "A chemotherapy capsule that damages DNA in brain tumour cells.",
    effects: ["nausea", "constipation", "fatigue", "infection", "bleeding"],
    tips: ["Take at the same time each day on an empty stomach (1 hour before food or at bedtime).", "Take your anti-sickness tablet 30–60 minutes before.", "Take the antibiotic co-trimoxazole as prescribed to prevent a lung infection."],
    diet: ["Empty stomach: 1 hour before food or 2 hours after."],
  },
  thiotepa: {
    what: "A strong chemotherapy that damages cancer cell DNA.",
    effects: ["infection", "mouth", "skin-darkening", "nausea"],
    tips: ["Shower and change clothes and bed sheets at least twice a day during treatment and for 2 days after."],
  },
  trastuzumab: {
    what: "A targeted antibody that blocks HER2, a protein that helps some cancers grow.",
    effects: ["heart", "allergy", "fatigue"],
    tips: ["Heart scans every 3 months.", "Usually given for a year in total."],
  },
  "trastuzumab-emtansine": {
    name: "Trastuzumab emtansine (T-DM1)",
    what: "A HER2 antibody joined to a chemotherapy drug, delivering it straight to the cancer cells.",
    effects: ["bleeding", "liver", "fatigue", "neuropathy", "nausea", "heart"],
    tips: ["Blood tests check your platelets and liver before each dose."],
  },
  tretinoin: {
    name: "Tretinoin (ATRA)",
    what: "A vitamin A–like capsule that helps APL leukaemia cells mature into normal cells.",
    effects: ["differentiation", "headache", "rash", "liver"],
    tips: ["Severe headache or vision changes — tell your team.", "Must not be taken in pregnancy."],
    diet: ["Take with food. Do not take vitamin A supplements."],
  },
  venetoclax: {
    what: "A tablet that removes a 'survival signal' (BCL-2) that keeps leukaemia cells alive.",
    effects: ["tumour-lysis", "infection", "nausea", "diarrhoea", "fatigue"],
    tips: ["The dose is increased slowly at the start; you will have frequent blood tests.", "Take with a meal and water at the same time every day.", "Tell your team before starting any new medicine (especially antifungals or antibiotics)."],
    diet: ["Avoid grapefruit, Seville oranges (marmalade) and starfruit.", "Drink plenty of fluid in the first weeks."],
  },
  vinblastine: {
    what: "A chemotherapy (vinca alkaloid) that stops cancer cells dividing.",
    effects: ["infection", "constipation", "neuropathy", "drip-site", "fatigue"],
    tips: ["Take laxatives to prevent constipation."],
  },
  vincristine: {
    what: "A chemotherapy (vinca alkaloid) that stops cancer cells dividing.",
    effects: ["neuropathy", "constipation", "drip-site"],
    tips: ["Take laxatives every day to prevent constipation.", "Jaw pain soon after the injection can happen and passes.", "Tell your team about tingling, weakness or trouble with buttons."],
  },
  vinorelbine: {
    what: "A chemotherapy (vinca alkaloid) that stops cancer cells dividing.",
    effects: ["infection", "constipation", "drip-site", "neuropathy", "fatigue"],
    tips: ["Tell the nurse if the vein hurts during the injection."],
  },
};
