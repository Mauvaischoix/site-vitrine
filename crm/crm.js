/* crm.js — Calanque CRM, démonstration pour le portfolio de Mohamed Tanouti.
   Entreprise, prospects et chiffres fictifs. Tout est calculé dans le navigateur :
   aucun appel réseau, aucune donnée enregistrée (un rechargement remet la démo à zéro).
   Le « score IA » est un calcul à règles transparentes, affichées dans l'onglet Assistant IA.
   Les brouillons d'e-mails ont été rédigés à l'avance avec une IA et sont signalés comme tels. */
(function () {
  "use strict";
  var EN = document.documentElement.lang.indexOf("en") === 0;
  var L = function (o) { return o && typeof o === "object" && "fr" in o ? (EN ? o.en : o.fr) : o; };

  /* ---------- Textes de l'interface ---------- */
  var TX = {
    nav: { tableau: { fr: "Tableau de bord", en: "Dashboard" }, pipeline: { fr: "Pipeline", en: "Pipeline" }, prospects: { fr: "Prospects", en: "Prospects" }, assistant: { fr: "Assistant IA", en: "AI assistant" } },
    demo: { fr: "Démo · données fictives", en: "Demo · fictional data" },
    hello: { fr: "Bonjour", en: "Hello" },
    company: { fr: "Calanque Services, maintenance multitechnique B2B (entreprise fictive)", en: "Calanque Services, B2B multi-technical maintenance (fictional company)" },
    stages: [{ fr: "Nouveau", en: "New" }, { fr: "Qualifié", en: "Qualified" }, { fr: "Rendez-vous", en: "Meeting" }, { fr: "Proposition", en: "Proposal" }, { fr: "Négociation", en: "Negotiation" }],
    kpi: [{ fr: "CA en cours", en: "Open pipeline" }, { fr: "CA prévu pondéré", en: "Weighted forecast" }, { fr: "Taux de conversion", en: "Win rate" }, { fr: "Affaires à risque", en: "Deals at risk" }],
    openDeals: { fr: " affaires ouvertes", en: " open deals" },
    weightedNote: { fr: "Montant × score IA", en: "Amount × AI score" },
    winNote: { fr: "Historique fictif sur 6 mois", en: "Fictional 6-month history" },
    riskNote: { fr: "Sans contact depuis plus de 14 jours", en: "No contact for over 14 days" },
    toCall: { fr: "À appeler aujourd'hui", en: "To call today" },
    rankedAI: { fr: "Priorisé par l'IA", en: "Ranked by AI" },
    toCallNote: { fr: "Classement par score IA, puis les affaires qui refroidissent. Le détail du calcul est dans l'onglet Assistant IA.", en: "Ranked by AI score, then deals going cold. The scoring rules are in the AI assistant tab." },
    byStage: { fr: "Pipeline par étape", en: "Pipeline by stage" },
    goal: { fr: "Objectif du mois", en: "Monthly target" },
    open: { fr: "Ouvrir", en: "Open" },
    pipeSub: { fr: "Glissez une carte vers une autre colonne (ordinateur) ou changez l'étape depuis la fiche.", en: "Drag a card to another column (desktop) or change the stage from the deal page." },
    sortBy: { fr: "Trier par", en: "Sort by" },
    sorts: {
      next: { fr: "Prochaine action", en: "Next action" },
      score: { fr: "Score IA", en: "AI score" },
      amount: { fr: "Montant", en: "Amount" },
      cold: { fr: "Jours sans contact", en: "Days without contact" },
      name: { fr: "Nom de l'entreprise", en: "Company name" }
    },
    sortHelp: {
      next: { fr: "La prochaine action la plus proche en premier.", en: "Nearest next action first." },
      score: { fr: "La plus forte chance de signature en premier. Le score s'affiche sur les cartes.", en: "Highest chance to win first. The score is shown on the cards." },
      amount: { fr: "Le plus gros montant en premier.", en: "Largest amount first." },
      cold: { fr: "Les affaires qui refroidissent en premier.", en: "Deals going cold first." },
      name: { fr: "De A à Z.", en: "A to Z." }
    },
    today: { fr: "aujourd'hui", en: "today" },
    late: { fr: "en retard", en: "overdue" },
    inDays: { fr: "dans %n j", en: "in %n d" },
    moved: { fr: "%c passe en « %s ». Score IA recalculé : %n.", en: "%c moved to “%s”. AI score recalculated: %n." },
    prospectsSub: { fr: "Toutes les affaires ouvertes. Cliquez sur un nom pour ouvrir la fiche.", en: "All open deals. Click a name to open the deal page." },
    cols: [{ fr: "Entreprise", en: "Company" }, { fr: "Étape", en: "Stage" }, { fr: "Montant", en: "Amount" }, { fr: "Dernier contact", en: "Last contact" }, { fr: "Prochaine action", en: "Next action" }],
    daysAgo: { fr: "il y a %n j", en: "%n d ago" },
    back: { fr: "← Retour", en: "← Back" },
    info: { fr: "Informations", en: "Details" },
    fields: { contact: { fr: "Contact", en: "Contact" }, sector: { fr: "Secteur", en: "Industry" }, sites: { fr: "Sites", en: "Sites" }, origin: { fr: "Origine", en: "Source" }, stage: { fr: "Étape", en: "Stage" }, amount: { fr: "Montant annuel", en: "Annual amount" } },
    history: { fr: "Historique des échanges", en: "Activity history" },
    aiPanel: { fr: "Assistant IA", en: "AI assistant" },
    aiIntro: { fr: "Chance de signature, calculée en direct à partir de ces facteurs :", en: "Chance to win, calculated live from these factors:" },
    nextAdvice: { fr: "Prochaine action conseillée", en: "Recommended next action" },
    draft: { fr: "Brouillon de relance", en: "Follow-up draft" },
    draftNote: { fr: "Texte rédigé à l'avance avec une IA gratuite · à relire avant envoi", en: "Text written in advance with a free AI tool · review before sending" },
    noDraft: { fr: "Pas de brouillon pour cette affaire.", en: "No draft for this deal." },
    asstSub: { fr: "Ce que l'IA propose, au même endroit. Tout est calculé en direct sur les données de la démo.", en: "Everything the AI suggests, in one place. All figures are calculated live from the demo data." },
    brief: { fr: "Le brief du jour", en: "Today's brief" },
    ask: { fr: "Poser une question au CRM", en: "Ask the CRM" },
    askHelp: { fr: "Choisissez une question : la réponse est calculée sur les affaires en cours.", en: "Pick a question: the answer is calculated from the open deals." },
    how: { fr: "Comment l'IA calcule le score", en: "How the AI calculates the score" },
    howHelp: { fr: "Un score sur 100 : la base de l'étape, plus ou moins chaque facteur. Les règles sont volontairement simples et visibles.", en: "A score out of 100: the stage base, plus or minus each factor. The rules are deliberately simple and visible." },
    reset: { fr: "Remettre la démo à zéro", en: "Reset the demo" },
    resetDone: { fr: "Démo remise à zéro.", en: "Demo reset." },
    portfolio: { fr: "← Retour au portfolio", en: "← Back to the portfolio" },
    none: { fr: "Aucune affaire ne correspond.", en: "No matching deal." }
  };
  var STAGE_COLORS = ["#C9CEC9", "#82917B", "#4969C8", "#E77B4B", "#202522"];
  var STAGE_BASE = [10, 20, 30, 40, 50];
  var RULES = [
    { k: "base", label: { fr: "Base de l'étape (Nouveau 10 → Négociation 50)", en: "Stage base (New 10 → Negotiation 50)" } },
    { k: "inbound", v: 10, label: { fr: "Le prospect est venu de lui-même", en: "Inbound lead" } },
    { k: "demo", v: 20, label: { fr: "Démo ou visite réalisée", en: "Demo or site visit done" } },
    { k: "price", v: 18, label: { fr: "Demande de prix écrite", en: "Written price request" } },
    { k: "budget", v: 12, label: { fr: "Budget confirmé", en: "Budget confirmed" } },
    { k: "compEnd", v: 10, label: { fr: "Contrat du concurrent bientôt terminé", en: "Competitor contract ending soon" } },
    { k: "comp", v: -8, label: { fr: "Concurrent encore en place", en: "Competitor still in place" } },
    { k: "cool", v: -10, label: { fr: "Sans contact depuis 8 à 14 jours", en: "No contact for 8 to 14 days" } },
    { k: "cold", v: -25, label: { fr: "Sans contact depuis plus de 14 jours", en: "No contact for over 14 days" } }
  ];

  /* ---------- Données fictives ---------- */
  var SOURCE = [
    { id: "oliviers", company: "Résidence Les Oliviers", object: { fr: "Entretien des parties communes", en: "Common areas upkeep" }, amount: 6200, stage: 0, last: 3, next: 1,
      action: { fr: "Qualifier le besoin", en: "Qualify the need" }, f: { inbound: true },
      why: { fr: "A rempli le formulaire du site, budget encore inconnu.", en: "Filled in the website form, budget still unknown." },
      contact: "Nadia Benali, gestionnaire", sector: { fr: "Copropriété, 64 logements", en: "Residential building, 64 flats" }, sites: "Marseille 9e", origin: { fr: "Formulaire du site", en: "Website form" },
      hist: [["3", { fr: "Formulaire reçu", en: "Form received" }, { fr: "Demande de devis pour l'entretien de l'ascenseur et des parties communes.", en: "Quote request for lift and common areas upkeep." }]] },
    { id: "prado", company: "Atelier Vélo Prado", object: { fr: "Maintenance du chauffage", en: "Heating maintenance" }, amount: 3900, stage: 0, last: 5, next: 3,
      action: { fr: "Appeler le gérant", en: "Call the manager" }, f: {},
      why: { fr: "Petit contrat, contact obtenu par un client.", en: "Small contract, contact referred by a client." },
      contact: "Julien Rossi, gérant", sector: { fr: "Commerce, 6 salariés", en: "Retail, 6 staff" }, sites: "Marseille 8e", origin: { fr: "Recommandation", en: "Referral" },
      hist: [["5", { fr: "Recommandation", en: "Referral" }, { fr: "Coordonnées transmises par un client satisfait.", en: "Details passed on by a happy client." }]] },
    { id: "roucas", company: "Clinique vétérinaire du Roucas", object: { fr: "Contrat de climatisation", en: "Air-conditioning contract" }, amount: 9800, stage: 1, last: 4, next: 3,
      action: { fr: "Rendez-vous jeudi", en: "Meeting on Thursday" }, f: { inbound: true, budget: true, compEnd: true, comp: true },
      why: { fr: "Budget validé, contrat actuel terminé dans 2 mois.", en: "Budget approved, current contract ends in 2 months." },
      contact: "Dr Sophie Arnaud, associée", sector: { fr: "Santé animale, 14 salariés", en: "Veterinary care, 14 staff" }, sites: "Marseille 7e", origin: { fr: "Appel entrant", en: "Inbound call" },
      hist: [["4", { fr: "Appel de qualification", en: "Qualification call" }, { fr: "Budget de 10 k€ validé par les associés.", en: "€10k budget approved by the partners." }]] },
    { id: "joliette", company: "Coworking Joliette", object: { fr: "Maintenance multisite", en: "Multi-site maintenance" }, amount: 12500, stage: 1, last: 10, next: 0,
      action: { fr: "Proposer un créneau", en: "Suggest a call slot" }, f: { inbound: true, price: true },
      why: { fr: "Lit les e-mails sans répondre : proposer un appel court.", en: "Opens emails without replying: suggest a short call." },
      contact: "Thomas Girard, responsable des sites", sector: { fr: "Immobilier de bureaux, 3 sites", en: "Office space, 3 sites" }, sites: "Marseille 2e · 3e", origin: { fr: "LinkedIn", en: "LinkedIn" },
      hist: [["10", { fr: "E-mail envoyé", en: "Email sent" }, { fr: "Grille tarifaire envoyée suite à sa demande.", en: "Price list sent at his request." }], ["16", { fr: "Message LinkedIn", en: "LinkedIn message" }, { fr: "Demande de tarifs pour trois sites.", en: "Asked for prices for three sites." }]],
      draft: { fr: "Bonjour Monsieur Girard, je reviens vers vous au sujet de la maintenance de vos trois sites. Auriez-vous 15 minutes cette semaine pour que je vous présente les options adaptées à vos espaces ?", en: "Hello Mr Girard, I'm following up on the maintenance of your three sites. Would you have 15 minutes this week so I can walk you through the options for your spaces?" } },
    { id: "mistral", company: "Imprimerie Mistral", object: { fr: "Contrat de maintenance, 2 sites", en: "Maintenance contract, 2 sites" }, amount: 18400, stage: 2, last: 2, next: 2,
      action: { fr: "Envoyer la proposition", en: "Send the proposal" }, f: { demo: true, price: true, budget: true, compEnd: true, comp: true },
      why: { fr: "Démo réussie, la directrice a demandé un tarif multisite.", en: "Successful demo, the managing director asked for a multi-site price." },
      advice: { fr: "Envoyer la proposition multisite avant jeudi, avec l'option intervention sous 4 h.", en: "Send the multi-site proposal before Thursday, with the 4-hour response option." },
      contact: "Claire Martin, directrice générale", sector: { fr: "Imprimerie, 42 salariés", en: "Printing, 42 staff" }, sites: "Marseille 15e · Vitrolles", origin: { fr: "Salon professionnel", en: "Trade show" },
      hist: [["2", { fr: "E-mail reçu", en: "Email received" }, { fr: "Demande d'un tarif pour les deux sites, avec intervention sous 4 h.", en: "Asked for a price for both sites, with a 4-hour response time." }], ["3", { fr: "Démo sur site", en: "On-site demo" }, { fr: "Visite de l'atelier de Vitrolles, 3 machines critiques identifiées.", en: "Visit of the Vitrolles workshop, 3 critical machines identified." }], ["9", { fr: "Appel découverte", en: "Discovery call" }, { fr: "Pannes fréquentes avec le prestataire actuel, contrat terminé fin janvier.", en: "Frequent breakdowns with the current provider, contract ends late January." }]],
      draft: { fr: "Bonjour Madame Martin, suite à notre visite à Vitrolles, voici notre proposition pour vos deux sites, avec une intervention garantie sous 4 heures sur vos machines critiques. Seriez-vous disponible jeudi pour en parler ?", en: "Hello Ms Martin, following our visit to Vitrolles, here is our proposal for both sites, with a guaranteed 4-hour response on your critical machines. Would you be available on Thursday to discuss it?" } },
    { id: "goudes", company: "Hôtel des Goudes", object: { fr: "Plomberie et climatisation, 38 chambres", en: "Plumbing and air-con, 38 rooms" }, amount: 24000, stage: 2, last: 3, next: 1,
      action: { fr: "Préparer le devis", en: "Prepare the quote" }, f: { inbound: true, demo: true, budget: true },
      why: { fr: "Visite technique faite mardi, devis attendu cette semaine.", en: "Technical visit done on Tuesday, quote expected this week." },
      contact: "Marc Lopez, directeur", sector: { fr: "Hôtellerie, 38 chambres", en: "Hotel, 38 rooms" }, sites: "Marseille 8e", origin: { fr: "Appel entrant", en: "Inbound call" },
      hist: [["3", { fr: "Visite technique", en: "Technical visit" }, { fr: "Relevé des équipements, priorité à la climatisation avant l'été.", en: "Equipment survey, air-con is the priority before summer." }]] },
    { id: "phocea", company: "Laboratoire Phocéa", object: { fr: "Salles techniques 24 h/24", en: "24/7 technical rooms" }, amount: 31000, stage: 3, last: 6, next: 4,
      action: { fr: "Relancer vendredi", en: "Follow up on Friday" }, f: { demo: true, price: true, comp: true },
      why: { fr: "Proposition envoyée, le comité achats se réunit vendredi.", en: "Proposal sent, the purchasing committee meets on Friday." },
      contact: "Élodie Fabre, responsable achats", sector: { fr: "Analyses médicales, 120 salariés", en: "Medical lab, 120 staff" }, sites: "Marseille 13e", origin: { fr: "Prospection", en: "Outbound" },
      hist: [["6", { fr: "Proposition envoyée", en: "Proposal sent" }, { fr: "Contrat 24 h/24 avec astreinte, présenté au comité achats.", en: "24/7 contract with on-call service, presented to purchasing." }]] },
    { id: "panier", company: "Brasserie du Panier", object: { fr: "Cuisine professionnelle, contrat annuel", en: "Professional kitchen, annual contract" }, amount: 7200, stage: 3, last: 18, next: -2,
      action: { fr: "Relancer", en: "Follow up" }, f: { price: true },
      why: { fr: "Sans réponse depuis 18 jours : risque de perte.", en: "No reply for 18 days: at risk." },
      contact: "Karim Haddad, gérant", sector: { fr: "Restauration, 22 couverts", en: "Restaurant, 22 covers" }, sites: "Marseille 2e", origin: { fr: "Prospection terrain", en: "Field prospecting" },
      hist: [["18", { fr: "Proposition envoyée", en: "Proposal sent" }, { fr: "Devis pour l'entretien des équipements de cuisine.", en: "Quote for kitchen equipment upkeep." }]],
      draft: { fr: "Bonjour Monsieur Haddad, avez-vous pu regarder notre proposition pour l'entretien de votre cuisine ? Si le calendrier ne convient pas, je peux l'adapter à votre saison.", en: "Hello Mr Haddad, have you had a chance to look at our proposal for your kitchen? If the timing doesn't suit you, I can adapt it to your season." } },
    { id: "estaque", company: "Logistique Estaque", object: { fr: "Entrepôt de 6 000 m²", en: "6,000 m² warehouse" }, amount: 46500, stage: 4, last: 1, next: 9,
      action: { fr: "Décision attendue", en: "Decision expected" }, f: { demo: true, price: true },
      why: { fr: "Devis ouvert 3 fois cette semaine, décision attendue fin novembre.", en: "Quote opened 3 times this week, decision expected end of November." },
      contact: "Pierre Vidal, directeur de site", sector: { fr: "Logistique, 85 salariés", en: "Logistics, 85 staff" }, sites: "Marseille 16e", origin: { fr: "Recommandation", en: "Referral" },
      hist: [["1", { fr: "Appel", en: "Call" }, { fr: "Questions sur les délais d'intervention de nuit.", en: "Questions about night-time response times." }], ["7", { fr: "Négociation", en: "Negotiation" }, { fr: "Remise de 4 % accordée contre un engagement de 3 ans.", en: "4% discount granted for a 3-year commitment." }]],
      draft: { fr: "Bonjour Monsieur Vidal, pour répondre à votre question sur les interventions de nuit : notre astreinte couvre 22 h – 6 h avec un délai de 2 heures. Je reste disponible pour finaliser avant votre décision.", en: "Hello Mr Vidal, to answer your question about night-time call-outs: our on-call service covers 10 pm–6 am with a 2-hour response time. I'm available to finalise before your decision." } },
    { id: "pastre", company: "Cabinet d'architectes Pastré", object: { fr: "Bureaux, contrat de 3 ans", en: "Offices, 3-year contract" }, amount: 11000, stage: 4, last: 11, next: 2,
      action: { fr: "Répondre sur la remise", en: "Answer on the discount" }, f: { demo: true, comp: true },
      why: { fr: "Demande une remise, sans nouvelles depuis 11 jours.", en: "Asking for a discount, no news for 11 days." },
      contact: "Laura Pastré, associée", sector: { fr: "Architecture, 18 salariés", en: "Architecture, 18 staff" }, sites: "Marseille 6e", origin: { fr: "Salon professionnel", en: "Trade show" },
      hist: [["11", { fr: "Négociation", en: "Negotiation" }, { fr: "Demande une remise de 10 % pour signer sur 3 ans.", en: "Asked for a 10% discount to sign for 3 years." }]] }
  ];
  var SIGNED = 58000, TARGET = 100000, WIN_RATE = 27;

  var state, root, announcer;
  var fresh = function () { return { deals: JSON.parse(JSON.stringify(SOURCE)), view: "tableau", current: null, sort: "next", question: null }; };

  /* ---------- Outils ---------- */
  var h = function (tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") el.className = attrs[k];
      else if (k === "text") el.textContent = attrs[k];
      else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i]; if (c == null || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) el.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
      else el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return el;
  };
  var fmt = new Intl.NumberFormat(EN ? "en-GB" : "fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  var money = function (n) { return fmt.format(n); };
  var kEur = function (n) { var v = (n / 1000).toFixed(1); return (EN ? "€" + v + "k" : v.replace(".", ",") + " k€"); };
  var t = function (o, map) { var s = L(o); for (var k in map) s = s.split("%" + k).join(map[k]); return s; };
  var factors = function (d) {
    var out = [{ label: (EN ? "Stage base: “" : "Base de l'étape « ") + L(TX.stages[d.stage]) + (EN ? "”" : " »"), v: STAGE_BASE[d.stage] }];
    RULES.slice(1).forEach(function (r) {
      var on = r.k === "cool" ? d.last > 7 && d.last <= 14 : r.k === "cold" ? d.last > 14 : !!d.f[r.k];
      if (on) out.push({ label: L(r.label), v: r.v });
    });
    return out;
  };
  var score = function (d) { var s = factors(d).reduce(function (a, f) { return a + f.v; }, 0); return Math.max(0, Math.min(100, s)); };
  var level = function (s) { return s >= 65 ? "eleve" : s >= 40 ? "moyen" : "faible"; };
  var badge = function (d) { var s = score(d); return h("span", { class: "score score--" + level(s), text: (EN ? "AI " : "IA ") + s, title: L({ fr: "Score IA : chance de signature sur 100", en: "AI score: chance to win out of 100" }) }); };
  var nextLabel = function (d) { return d.next < 0 ? L(TX.late) : d.next === 0 ? L(TX.today) : t(TX.inDays, { n: d.next }); };
  var find = function (id) { return state.deals.filter(function (d) { return d.id === id; })[0]; };
  var total = function (list) { return list.reduce(function (a, d) { return a + d.amount; }, 0); };
  var weighted = function (list) { return Math.round(list.reduce(function (a, d) { return a + d.amount * score(d) / 100; }, 0)); };
  var announce = function (msg) {
    announcer.textContent = msg; announcer.classList.add("annonce--visible");
    clearTimeout(announce.t); announce.t = setTimeout(function () { announcer.classList.remove("annonce--visible"); }, 3200);
  };

  /* ---------- Navigation ---------- */
  var go = function (view, id) {
    state.view = view; if (id) state.current = id;
    render();
    var h1 = root.querySelector("h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: false }); }
    window.scrollTo(0, 0);
  };
  var header = function (title, sub) {
    return h("header", { class: "tete" },
      h("div", null, h("h1", { text: title }), sub ? h("p", { class: "tete__sous", text: sub }) : null),
      h("div", { class: "tete__actions" }, h("span", { class: "puce-demo", text: L(TX.demo) }), h("a", { class: "langue", href: EN ? "/en/#chapitre-6" : "/#chapitre-6", text: EN ? "Portfolio" : "Portfolio" }), h("a", { class: "langue", href: EN ? "/crm/" : "/en/crm/", hreflang: EN ? "fr" : "en", lang: EN ? "fr" : "en", "aria-label": EN ? "Version française" : "English version", text: EN ? "FR" : "EN" })));
  };

  /* ---------- Vues ---------- */
  var viewDashboard = function () {
    var deals = state.deals, risk = deals.filter(function (d) { return d.last > 14; });
    var frag = [header(L(TX.hello) + " Mohamed", L(TX.company))];
    var k = h("div", { class: "grille-kpi" });
    [[kEur(total(deals)), deals.length + L(TX.openDeals), ""], [kEur(weighted(deals)), L(TX.weightedNote), ""], [WIN_RATE + " %", L(TX.winNote), ""], [String(risk.length), L(TX.riskNote), risk.length ? " kpi__note--alerte" : ""]]
      .forEach(function (x, i) { k.appendChild(h("div", { class: "kpi" }, h("p", { class: "kpi__libelle", text: L(TX.kpi[i]) }), h("p", { class: "kpi__valeur", text: x[0] }), h("p", { class: "kpi__note" + x[2], text: x[1] }))); });
    frag.push(k);
    var top = deals.filter(function (d) { return d.last <= 14; }).sort(function (a, b) { return score(b) - score(a); }).slice(0, 4).concat(risk);
    var list = h("ul", { class: "priorites" });
    top.forEach(function (d) {
      list.appendChild(h("li", { class: "priorite" }, badge(d),
        h("div", null, h("p", { class: "priorite__nom", text: d.company }), h("p", { class: "priorite__pourquoi", text: L(d.why) })),
        h("button", { class: "bouton" + (d.last > 14 ? " bouton--alerte" : ""), type: "button", onclick: function () { go("fiche", d.id); }, text: L(d.action), "aria-label": L(d.action) + " — " + d.company })));
    });
    var left = h("section", { class: "panneau", "aria-labelledby": "t-prio" },
      h("div", { class: "titre-ligne" }, h("h2", { id: "t-prio", text: L(TX.toCall) }), h("span", { class: "etiquette-ia", text: L(TX.rankedAI) })), list, h("p", { class: "note", text: L(TX.toCallNote) }));
    var stages = h("div", { class: "etapes" }), max = 1, sums = [0, 0, 0, 0, 0], counts = [0, 0, 0, 0, 0];
    deals.forEach(function (d) { sums[d.stage] += d.amount; counts[d.stage]++; }); max = Math.max.apply(null, sums) || 1;
    var bars = [];
    sums.forEach(function (s, i) {
      var bar = h("span"); bar.style.background = STAGE_COLORS[i]; bars.push([bar, Math.round(s / max * 100)]);
      stages.appendChild(h("div", null, h("div", { class: "etape__ligne" }, h("span", { text: L(TX.stages[i]) + " · " + counts[i] }), h("b", { text: kEur(s) })), h("div", { class: "piste", role: "img", "aria-label": L(TX.stages[i]) + " : " + money(s) }, bar)));
    });
    requestAnimationFrame(function () { bars.forEach(function (b) { b[0].style.width = b[1] + "%"; }); });
    var neg = deals.filter(function (d) { return d.stage === 4; }), est = SIGNED + weighted(neg), pct = Math.round(SIGNED / TARGET * 100);
    var right = h("section", { class: "panneau", "aria-labelledby": "t-etapes" }, h("h2", { id: "t-etapes", text: L(TX.byStage) }), stages,
      h("div", { class: "objectif" },
        h("p", { text: L(TX.goal) + " : " + pct + " %" + (EN ? " reached" : " atteint") }),
        h("p", { text: EN ? money(SIGNED) + " signed out of " + money(TARGET) + ". The AI estimates " + money(est) + " by month-end if the deals in negotiation close at their score." : money(SIGNED) + " signés sur " + money(TARGET) + ". L'IA estime " + money(est) + " à fin de mois si les affaires en négociation aboutissent selon leur score." })));
    frag.push(h("div", { class: "deux-colonnes" }, left, right));
    return frag;
  };

  var sortFns = {
    next: function (a, b) { return a.next - b.next; },
    score: function (a, b) { return score(b) - score(a); },
    amount: function (a, b) { return b.amount - a.amount; },
    cold: function (a, b) { return b.last - a.last; },
    name: function (a, b) { return a.company.localeCompare(b.company, EN ? "en" : "fr"); }
  };
  var viewPipeline = function () {
    var deals = state.deals, frag = [header(L(TX.nav.pipeline), deals.length + L(TX.openDeals) + " · " + kEur(total(deals)) + ". " + L(TX.pipeSub))];
    var sel = h("select", { id: "tri", onchange: function (e) { state.sort = e.target.value; render(); var s = document.getElementById("tri"); if (s) s.focus(); } });
    Object.keys(TX.sorts).forEach(function (k) { var o = h("option", { value: k, text: L(TX.sorts[k]) }); if (k === state.sort) o.selected = true; sel.appendChild(o); });
    frag.push(h("div", { class: "outils" }, h("label", { for: "tri", text: L(TX.sortBy) }), sel, h("p", { class: "outils__aide", text: L(TX.sortHelp[state.sort]) })));
    var board = h("div", { class: "tableau-pipeline" });
    TX.stages.forEach(function (st, i) {
      var inCol = deals.filter(function (d) { return d.stage === i; }).sort(sortFns[state.sort]);
      var col = h("section", { class: "colonne", "aria-labelledby": "col-" + i, "data-etape": i });
      var p = h("span", { class: "pastille" }); p.style.background = STAGE_COLORS[i];
      col.appendChild(h("div", { class: "colonne__tete" }, p, h("h2", { id: "col-" + i, text: L(st) }), h("span", { text: inCol.length + " · " + kEur(total(inCol)) })));
      inCol.forEach(function (d) {
        var card = h("button", { class: "carte", type: "button", draggable: "true", "data-id": d.id, onclick: function () { go("fiche", d.id); } },
          h("span", { class: "carte__haut" }, h("span", { class: "carte__nom", text: d.company }), state.sort === "score" ? badge(d) : null),
          h("span", { class: "carte__objet", text: L(d.object) }),
          h("span", { class: "carte__bas" }, h("span", { class: "carte__montant", text: money(d.amount) }),
            h("span", { class: "carte__action" + (d.next < 0 ? " carte__action--retard" : ""), text: L(d.action) + " · " + nextLabel(d) })));
        card.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", d.id); e.dataTransfer.effectAllowed = "move"; card.classList.add("carte--deplacee"); });
        card.addEventListener("dragend", function () { card.classList.remove("carte--deplacee"); });
        col.appendChild(card);
      });
      col.addEventListener("dragover", function (e) { e.preventDefault(); col.classList.add("colonne--survol"); });
      col.addEventListener("dragleave", function () { col.classList.remove("colonne--survol"); });
      col.addEventListener("drop", function (e) { e.preventDefault(); col.classList.remove("colonne--survol"); moveTo(e.dataTransfer.getData("text/plain"), i); });
      board.appendChild(col);
    });
    frag.push(board);
    return frag;
  };
  var moveTo = function (id, stage) {
    var d = find(id); if (!d || d.stage === stage) return;
    d.stage = stage; d.last = 0;
    render();
    announce(t(TX.moved, { c: d.company, s: L(TX.stages[stage]), n: score(d) }));
  };

  var viewProspects = function () {
    var frag = [header(L(TX.nav.prospects), L(TX.prospectsSub))];
    var tb = h("tbody");
    state.deals.slice().sort(sortFns.name).forEach(function (d) {
      tb.appendChild(h("tr", null,
        h("td", null, h("button", { type: "button", onclick: function () { go("fiche", d.id); }, text: d.company })),
        h("td", { text: L(TX.stages[d.stage]) }), h("td", { text: money(d.amount) }),
        h("td", { text: t(TX.daysAgo, { n: d.last }) }), h("td", { text: L(d.action) + " · " + nextLabel(d) })));
    });
    var head = h("tr"); TX.cols.forEach(function (c) { head.appendChild(h("th", { scope: "col", text: L(c) })); });
    frag.push(h("div", { class: "tableau-defile" }, h("table", { class: "liste" }, h("caption", { class: "visuellement-cache", text: L(TX.nav.prospects) }), h("thead", null, head), tb)));
    return frag;
  };

  var viewFiche = function () {
    var d = find(state.current) || state.deals[0], s = score(d);
    var frag = [h("p", { class: "outils" }, h("button", { type: "button", class: "bouton bouton--clair", onclick: function () { go("pipeline"); }, text: L(TX.back) }))];
    frag.push(header(d.company, L(TX.stages[d.stage]) + " · " + money(d.amount) + " · " + L(d.object)));
    var stageSel = h("select", { id: "etape", onchange: function (e) { d.stage = +e.target.value; d.last = 0; render(); announce(t(TX.moved, { c: d.company, s: L(TX.stages[d.stage]), n: score(d) })); var x = document.getElementById("etape"); if (x) x.focus(); } });
    TX.stages.forEach(function (st, i) { var o = h("option", { value: i, text: L(st) }); if (i === d.stage) o.selected = true; stageSel.appendChild(o); });
    var dl = h("dl", { class: "champs" });
    [[TX.fields.contact, d.contact], [TX.fields.sector, L(d.sector)], [TX.fields.sites, d.sites], [TX.fields.origin, L(d.origin)], [TX.fields.amount, money(d.amount)]]
      .forEach(function (x) { dl.appendChild(h("div", null, h("dt", { text: L(x[0]) }), h("dd", { text: x[1] }))); });
    dl.appendChild(h("div", null, h("dt", null, h("label", { for: "etape", text: L(TX.fields.stage) })), h("dd", null, stageSel)));
    var hist = h("ol", { class: "historique" });
    d.hist.forEach(function (x) { hist.appendChild(h("li", null, h("div", null, h("p", { text: t(TX.daysAgo, { n: x[0] }) + " · " + L(x[1]) }), h("p", { text: L(x[2]) })))); });
    var left = h("div", { class: "fiche__gauche" },
      h("section", { class: "panneau", "aria-labelledby": "t-info" }, h("h2", { id: "t-info", text: L(TX.info) }), dl),
      h("section", { class: "panneau", "aria-labelledby": "t-hist" }, h("h2", { id: "t-hist", text: L(TX.history) }), hist));
    var fl = h("ul", { class: "facteurs" });
    factors(d).forEach(function (f) { fl.appendChild(h("li", null, h("span", { text: f.label }), h("span", { class: f.v < 0 ? "moins" : "plus", text: (f.v < 0 ? "−" : "+") + Math.abs(f.v) }))); });
    var advice = d.advice ? L(d.advice) : L(d.action) + (EN ? " (" : " (") + nextLabel(d) + "). " + L(d.why);
    var ai = h("aside", { class: "assistant", "aria-labelledby": "t-ai" },
      h("div", { class: "assistant__tete" }, h("h2", { id: "t-ai", text: L(TX.aiPanel) }), h("p", { class: "assistant__score" }, String(s), h("small", { text: "/100" }))),
      h("p", { text: L(TX.aiIntro) }), fl,
      h("div", { class: "conseil" }, h("p", { text: L(TX.nextAdvice) }), h("p", { text: advice })),
      h("div", { class: "brouillon" }, h("h3", { text: L(TX.draft) }), h("p", { text: d.draft ? L(d.draft) : L(TX.noDraft) }), d.draft ? h("p", { class: "note", text: L(TX.draftNote) }) : null));
    frag.push(h("div", { class: "fiche" }, left, ai));
    return frag;
  };

  var QUESTIONS = [
    { q: { fr: "Quelles affaires de plus de 10 k€ n'ont pas eu de contact depuis plus de 7 jours ?", en: "Which deals over €10k have had no contact for more than 7 days?" },
      run: function (ds) { return ds.filter(function (d) { return d.amount > 10000 && d.last > 7; }); },
      line: function (d) { return d.company + " · " + money(d.amount) + " · " + t(TX.daysAgo, { n: d.last }); } },
    { q: { fr: "Où risque-t-on de perdre du chiffre ce mois-ci ?", en: "Where are we likely to lose revenue this month?" },
      run: function (ds) { return ds.filter(function (d) { return d.stage >= 1 && score(d) < 40; }); },
      line: function (d) { return d.company + " · " + (EN ? "AI " : "IA ") + score(d) + " · " + L(d.why); } },
    { q: { fr: "Quelles affaires peuvent signer en premier ?", en: "Which deals could close first?" },
      run: function (ds) { return ds.filter(function (d) { return d.stage >= 3 && score(d) >= 65; }).sort(sortFns.score); },
      line: function (d) { return d.company + " · " + money(d.amount) + " · " + (EN ? "AI " : "IA ") + score(d); } },
    { q: { fr: "Quel chiffre d'affaires peut-on raisonnablement attendre ?", en: "What revenue can we reasonably expect?" },
      run: function (ds) { return null; },
      text: function (ds) { return EN ? "Open pipeline: " + money(total(ds)) + ". Weighted by the AI score: " + money(weighted(ds)) + ". Deals in negotiation alone: " + money(weighted(ds.filter(function (d) { return d.stage === 4; }))) + "." : "Pipeline ouvert : " + money(total(ds)) + ". Pondéré par le score IA : " + money(weighted(ds)) + ". Rien que les affaires en négociation : " + money(weighted(ds.filter(function (d) { return d.stage === 4; }))) + "."; } }
  ];
  var viewAssistant = function () {
    var ds = state.deals, cold = ds.filter(function (d) { return d.last > 14; }), soon = ds.filter(function (d) { return d.stage === 4 && d.next <= 10; });
    var best = ds.slice().sort(sortFns.score)[0];
    var frag = [header(L(TX.nav.assistant), L(TX.asstSub))];
    var brief = h("p", { class: "brief" },
      EN ? "You have " : "Vous avez ", h("strong", { text: cold.length + (EN ? (cold.length > 1 ? " deals" : " deal") + " going cold" : (cold.length > 1 ? " affaires qui refroidissent" : " affaire qui refroidit")) }),
      EN ? ", " : ", ", h("strong", { text: soon.length + (EN ? (soon.length > 1 ? " decisions" : " decision") + " expected soon" : (soon.length > 1 ? " décisions attendues bientôt" : " décision attendue bientôt")) }),
      EN ? " and a weighted forecast of " : " et un prévisionnel pondéré de ", h("strong", { text: money(weighted(ds)) }), ". ",
      EN ? "Best opportunity: " : "Meilleure opportunité : ", h("strong", { text: best.company + " (" + (EN ? "AI " : "IA ") + score(best) + ")" }), ".");
    frag.push(h("section", { class: "panneau", "aria-labelledby": "t-brief" }, h("div", { class: "titre-ligne" }, h("h2", { id: "t-brief", text: L(TX.brief) }), h("span", { class: "etiquette-ia", text: L(TX.rankedAI) })), brief));
    var qs = h("div", { class: "questions" }), ans = h("div", { class: "reponse", "aria-live": "polite" });
    var showAnswer = function (i) {
      ans.textContent = ""; var Q = QUESTIONS[i];
      ans.appendChild(h("p", null, h("strong", { text: L(Q.q) })));
      if (Q.text) { ans.appendChild(h("p", { text: Q.text(ds) })); return; }
      var r = Q.run(ds); if (!r.length) { ans.appendChild(h("p", { text: L(TX.none) })); return; }
      var ul = h("ul"); r.forEach(function (d) { ul.appendChild(h("li", null, h("a", { href: "#", onclick: function (e) { e.preventDefault(); go("fiche", d.id); }, text: Q.line(d) }))); }); ans.appendChild(ul);
    };
    QUESTIONS.forEach(function (Q, i) {
      qs.appendChild(h("button", { type: "button", class: "bouton bouton--clair", "aria-pressed": state.question === i ? "true" : "false", text: L(Q.q),
        onclick: function (e) { state.question = i; Array.prototype.forEach.call(qs.children, function (b) { b.setAttribute("aria-pressed", "false"); }); e.currentTarget.setAttribute("aria-pressed", "true"); showAnswer(i); } }));
    });
    if (state.question != null) showAnswer(state.question); else ans.appendChild(h("p", { class: "note", text: L(TX.askHelp) }));
    frag.push(h("section", { class: "panneau", "aria-labelledby": "t-ask" }, h("h2", { id: "t-ask", text: L(TX.ask) }), qs, ans));
    var tb = h("tbody");
    RULES.forEach(function (r) { tb.appendChild(h("tr", null, h("td", { text: L(r.label) }), h("td", { text: r.k === "base" ? "10 → 50" : (r.v < 0 ? "−" : "+") + Math.abs(r.v) }))); });
    frag.push(h("section", { class: "panneau", "aria-labelledby": "t-how" }, h("h2", { id: "t-how", text: L(TX.how) }), h("p", { class: "note", text: L(TX.howHelp) }), h("table", { class: "regles" }, h("caption", { class: "visuellement-cache", text: L(TX.how) }), tb)));
    var wrap = h("div", { class: "fiche__gauche" }); frag.forEach(function (x, i) { if (i) wrap.appendChild(x); });
    return [frag[0], wrap];
  };

  /* ---------- Rendu ---------- */
  var VIEWS = { tableau: viewDashboard, pipeline: viewPipeline, prospects: viewProspects, fiche: viewFiche, assistant: viewAssistant };
  var render = function () {
    var main = document.getElementById("contenu"); main.textContent = "";
    VIEWS[state.view]().forEach(function (n) { main.appendChild(n); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-vue]"), function (b) {
      var v = b.getAttribute("data-vue"), on = v === state.view || (state.view === "fiche" && v === "prospects");
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
  };

  var start = function () {
    root = document.querySelector("[data-crm]"); if (!root) return;
    state = fresh();
    var nav = h("nav", { class: "nav", "aria-label": L({ fr: "Sections du CRM", en: "CRM sections" }) });
    Object.keys(TX.nav).forEach(function (k) { nav.appendChild(h("button", { type: "button", "data-vue": k, text: L(TX.nav[k]), onclick: function () { go(k); } })); });
    var resetBtn = h("button", { type: "button", class: "lien-discret", text: L(TX.reset), onclick: function () { state = fresh(); render(); announce(L(TX.resetDone)); } });
    var side = h("div", { class: "barre" },
      h("a", { class: "barre__logo", href: EN ? "/en/crm/" : "/crm/" }, "Calanque", h("span", { text: "CRM" })), nav,
      h("div", { class: "barre__bas" }, h("a", { href: EN ? "/en/#chapitre-6" : "/#chapitre-6", text: L(TX.portfolio) }), h("a", { href: EN ? "/crm/" : "/en/crm/", hreflang: EN ? "fr" : "en", lang: EN ? "fr" : "en", text: EN ? "Version française" : "English version" }), resetBtn,
        h("p", { text: L({ fr: "Démo : entreprise, personnes et chiffres fictifs. Aucune donnée enregistrée.", en: "Demo: fictional company, people and figures. No data is stored." }) })));
    var main = h("main", { class: "contenu", id: "contenu", tabindex: "-1" });
    announcer = h("div", { class: "annonce", role: "status", "aria-live": "polite" });
    root.textContent = "";
    root.appendChild(h("div", { class: "app" }, side, main));
    root.appendChild(announcer);
    render();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
