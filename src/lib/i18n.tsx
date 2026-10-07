import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "sw";

const strings = {
  en: {
    browse: "Browse",
    postAd: "Post an ad",
    tagline:
      "Simple, fast classifieds for rural Kenya — rentals, jobs and car hire. Works on any phone.",
    otherWays: "Other ways to post",
    smsLine: "SMS: send your ad to 40777",
    whatsappLine: "WhatsApp: 0700 000 000",
    ussdLine: "USSD: *384*77# (no internet needed)",
    staySafe: "Stay safe",
    staySafeText:
      "Never pay before viewing. Look for the verified badge and report suspicious numbers.",
    heroKicker: "Kenya's simple classifieds",
    heroTitle: "Rentals, jobs & car hire — near you",
    heroSub:
      "Fast pages that load on any phone and any network. Post free, pay with M-Pesa if you want a boost, and deal directly by phone or WhatsApp.",
    searchPlaceholder: "Search e.g. bedsitter Maseno, driver, pickup…",
    searchLabel: "Search listings",
    all: "All",
    latestAds: "Latest ads",
    noResults: "No ads match your search. Try different words — or",
    postFirst: "post the first one",
    verified: "✓ Verified",
    ad: "Ad",
    call: "Call",
    lookingFor: "What are you looking for?",
    howItWorks: "How it works",
    step1Title: "Post in a minute",
    step1Text:
      "A short form — title, price, location, phone. Or send by SMS, WhatsApp or USSD.",
    step2Title: "We review it",
    step2Text: "Every ad is checked to keep scams out. Verified posters get a badge.",
    step3Title: "Buyers call you",
    step3Text: "Every ad has click-to-call and WhatsApp. No accounts, no CVs, no fuss.",
    noSmartphone:
      "No smartphone? No problem. Post and browse by SMS (40777), WhatsApp, or USSD *384*77# — and community agents at local shops and cyber cafés can post for you.",
    // Categories
    rentals: "Rentals",
    jobs: "Jobs",
    carHire: "Car Hire",
    rentalsBlurb: "Houses, bedsitters, hostels near Maseno, shops and land.",
    jobsBlurb: "Formal jobs, kibarua work, internships and skilled fundis.",
    carHireBlurb: "Cars with or without a driver, pickups, lorries and matatu charter.",
    // Post page
    postKicker: "Post an ad",
    postTitle: "Reach buyers near you",
    postSub:
      "One short form — no accounts, no CV uploads. Your ad is reviewed, then goes live with click-to-call and WhatsApp buttons.",
    planFree: "Free",
    planFreeDesc: "Live for 7 days",
    planExtended: "Extended",
    planExtendedDesc: "Live for 30 days",
    planFeatured: "Featured",
    planFeaturedDesc: "Top of the list for 30 days + verified check",
    mpesaNote:
      "Paid options are completed with an M-Pesa prompt on your phone — no cards, no sign-up.",
    labelTitle: "Ad title",
    labelCategory: "Category",
    labelPrice: "Price",
    labelLocation: "Location",
    labelPhone: "Your phone number",
    labelDescription: "Description",
    labelPlan: "Listing plan",
    phTitle: "e.g. Bedsitter near Maseno University",
    phPrice: "e.g. KES 6,500 / month",
    phLocation: "e.g. Maseno, Kisumu County",
    phPhone: "e.g. 0712 345 678",
    phDescription: "What are you offering? Condition, terms, what's included…",
    planFreeShort: "Free · 7 days",
    planExtendedShort: "KES 50 · 30 days",
    planFeaturedShort: "KES 300 · Featured",
    submit: "Submit for review",
    termsNote: "By posting you agree to our terms. Scams and fake listings are removed and reported.",
    // Confirmation
    adReceived: "Ad received!",
    inReview: "is now in review. Once approved it goes live — usually within the hour.",
    yourAdCode: "Your ad code — keep it safe:",
    codeUsage: "Use this code to edit, renew or delete your ad later — e.g. send",
    bySms: "by SMS to 40777.",
    mpesaPrompt: "You'll receive an M-Pesa prompt on",
    toComplete: "to complete your",
    featuredPayment: "KES 300 featured",
    extendedPayment: "KES 50 extended",
    payment: "payment.",
    postAnother: "Post another ad",
  },
  sw: {
    browse: "Tazama",
    postAd: "Weka tangazo",
    tagline:
      "Matangazo rahisi na ya haraka kwa mashambani Kenya — nyumba za kupanga, kazi na kukodi magari. Inafanya kazi kwenye simu yoyote.",
    otherWays: "Njia nyingine za kutangaza",
    smsLine: "SMS: tuma tangazo lako kwa 40777",
    whatsappLine: "WhatsApp: 0700 000 000",
    ussdLine: "USSD: *384*77# (huhitaji intaneti)",
    staySafe: "Kuwa salama",
    staySafeText:
      "Usilipe kabla ya kuona. Tafuta alama ya uthibitisho na ripoti namba za kuaminika.",
    heroKicker: "Matangazo rahisi ya Kenya",
    heroTitle: "Nyumba, kazi na kukodi magari — karibu nawe",
    heroSub:
      "Kurasa za haraka zinazofungua kwenye simu na mtandao wowote. Tangaza bure, lipa kwa M-Pesa ukitaka kusitawi, na wasiliana moja kwa moja kwa simu au WhatsApp.",
    searchPlaceholder: "Tafuta k.m. bedsitter Maseno, dereva, pickup…",
    searchLabel: "Tafuta matangazo",
    all: "Yote",
    latestAds: "Matangazo mapya",
    noResults: "Hakuna tangazo linalolingana na utafutaji wako. Jaribu maneno mengine — au",
    postFirst: "weka wa kwanza",
    verified: "✓ Imethibitishwa",
    ad: "Tangazo",
    call: "Piga simu",
    lookingFor: "Unatafuta nini?",
    howItWorks: "Jinsi inavyofanya kazi",
    step1Title: "Tangaza kwa dakika moja",
    step1Text:
      "Fomu fupi — jina, bei, mahali, simu. Au tuma kwa SMS, WhatsApp au USSD.",
    step2Title: "Tunakagua",
    step2Text: "Kila tangazo hukaguliwa kuzuia ulaghai. Watangazaji waliothibitishwa hupata alama.",
    step3Title: "Wanunuzi wanakupigia",
    step3Text: "Kila tangazo lina kitufe cha kupiga simu na WhatsApp. Hakuna akaunti, hakuna CV.",
    noSmartphone:
      "Huna smartphone? Hakuna shida. Tangaza na tafuta kwa SMS (40777), WhatsApp, au USSD *384*77# — na mawakala wa jamii kwenye maduka na cyber café wanaweza kutangaza kwa niaba yako.",
    rentals: "Nyumba za Kupanga",
    jobs: "Kazi",
    carHire: "Kukodi Magari",
    rentalsBlurb: "Nyumba, bedsitter, hosteli karibu na Maseno, maduka na ardhi.",
    jobsBlurb: "Kazi rasmi, kibarua, internship na fundi wenye ujuzi.",
    carHireBlurb: "Magari na dereva au bila, pickup, lori na matatu za kukodi.",
    postKicker: "Weka tangazo",
    postTitle: "Fikia wanunuzi karibu nawe",
    postSub:
      "Fomu moja fupi — hakuna akaunti, hakuna CV. Tangazo lako hukaguliwa, kisha huwekwa mtandaoni na vitufe vya kupiga simu na WhatsApp.",
    planFree: "Bure",
    planFreeDesc: "Mtandaoni kwa siku 7",
    planExtended: "Imeongezwa",
    planExtendedDesc: "Mtandaoni kwa siku 30",
    planFeatured: "Maalum",
    planFeaturedDesc: "Juu ya orodha kwa siku 30 + ukaguzi wa uthibitisho",
    mpesaNote:
      "Chaguzi za kulipia hukamilishwa kwa ujumbe wa M-Pesa kwenye simu yako — hakuna kadi, hakuna kujisajili.",
    labelTitle: "Jina la tangazo",
    labelCategory: "Aina",
    labelPrice: "Bei",
    labelLocation: "Mahali",
    labelPhone: "Namba yako ya simu",
    labelDescription: "Maelezo",
    labelPlan: "Mpango wa tangazo",
    phTitle: "k.m. Bedsitter karibu na Chuo Kikuu cha Maseno",
    phPrice: "k.m. KES 6,500 / mwezi",
    phLocation: "k.m. Maseno, Kaunti ya Kisumu",
    phPhone: "k.m. 0712 345 678",
    phDescription: "Unauza nini? Hali, masharti, kinachojumuishwa…",
    planFreeShort: "Bure · siku 7",
    planExtendedShort: "KES 50 · siku 30",
    planFeaturedShort: "KES 300 · Maalum",
    submit: "Tuma kwa ukaguzi",
    termsNote: "Kwa kutangaza unakubali masharti yetu. Ulaghai na matangazo bandia huondolewa na kuripotiwa.",
    adReceived: "Tangazo limepokelewa!",
    inReview: "sasa linakaguliwa. Linapoidhinishwa huwekwa mtandaoni — kwa kawaida ndani ya saa moja.",
    yourAdCode: "Msimbo wa tangazo lako — uweke salama:",
    codeUsage: "Tumia msimbo huu kurekebisha, kufanya upya au kufuta tangazo lako baadaye — k.m. tuma",
    bySms: "kwa SMS kwa 40777.",
    mpesaPrompt: "Utapokea ujumbe wa M-Pesa kwa",
    toComplete: "kukamilisha malipo yako ya",
    featuredPayment: "KES 300 maalum",
    extendedPayment: "KES 50 imeongezwa",
    payment: ".",
    postAnother: "Weka tangazo jingine",
  },
} as const;

export type StringKey = keyof (typeof strings)["en"];

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => strings.en[key],
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("tangaza-lang");
    if (saved === "sw" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem("tangaza-lang", l);
    document.documentElement.lang = l;
  }

  const t = (key: StringKey) => strings[lang][key];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

/** Localised display name for a category. */
export function categoryLabel(name: string, t: (k: StringKey) => string): string {
  if (name === "Rentals") return t("rentals");
  if (name === "Jobs") return t("jobs");
  if (name === "Car Hire") return t("carHire");
  return name;
}

export function categoryBlurb(name: string, t: (k: StringKey) => string): string {
  if (name === "Rentals") return t("rentalsBlurb");
  if (name === "Jobs") return t("jobsBlurb");
  if (name === "Car Hire") return t("carHireBlurb");
  return "";
}
