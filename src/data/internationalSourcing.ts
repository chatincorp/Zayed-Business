// src/data/internationalSourcing.ts
// International Sourcing category, sectors and target countries.
// Sectors are activated/managed in the admin panel; countries are toggled from a
// full country listing. This is the current static config; admin-driven values
// should be mirrored to Supabase in a future step.

export type SourcingSector = string;

export type SourcingCountry = {
  code: string;
  name: string;
  flag: string;
  dial: string;
  region: string;
  office: string;
  enabled: boolean;
};

export const INTERNATIONAL_SOURCING_SECTORS: readonly SourcingSector[] = [
  "Fashion & Clothing",
  "Beauty & Cosmetics",
  "Footware",
  "ATV & Offroad Fun Motors",
  "Electronics & Communication Devices",
  "Aluminium Panel & Interior Design",
  "Home Decor & Furniture",
  "Grains",
  "FMCG Products & Coffee",
];

export const INTERNATIONAL_SOURCING_COUNTRIES: readonly SourcingCountry[] = [
  {
    code: "local",
    name: "Local (Kenya)",
    flag: "🇰🇪",
    dial: "+254",
    region: "East Africa",
    office: "nairobi",
    enabled: true,
  },
  {
    code: "cn",
    name: "China",
    flag: "🇨🇳",
    dial: "+86",
    region: "Asia Pacific",
    office: "singapore",
    enabled: true,
  },
  {
    code: "us",
    name: "USA",
    flag: "🇺🇸",
    dial: "+1",
    region: "North America",
    office: "newyork",
    enabled: true,
  },
  {
    code: "ae",
    name: "UAE",
    flag: "🇦🇪",
    dial: "+971",
    region: "Middle East",
    office: "dubai",
    enabled: true,
  },
  {
    code: "eu",
    name: "Europe",
    flag: "🇪🇺",
    dial: "",
    region: "Europe",
    office: "london",
    enabled: true,
  },
  {
    code: "ug",
    name: "Uganda",
    flag: "🇺🇬",
    dial: "+256",
    region: "East Africa",
    office: "nairobi",
    enabled: true,
  },
  {
    code: "tz",
    name: "Tanzania",
    flag: "🇹🇿",
    dial: "+255",
    region: "East Africa",
    office: "nairobi",
    enabled: true,
  },
  {
    code: "zm",
    name: "Zambia",
    flag: "🇿🇲",
    dial: "+260",
    region: "Southern Africa",
    office: "nairobi",
    enabled: true,
  },
];

export function getSourcingCountryByCode(
  code: string
): SourcingCountry | undefined {
  return INTERNATIONAL_SOURCING_COUNTRIES.find((c) => c.code === code);
}

export function getEnabledSourcingCountries(): readonly SourcingCountry[] {
  return INTERNATIONAL_SOURCING_COUNTRIES.filter((c) => c.enabled);
}

export function getDefaultSourcingCountry(): SourcingCountry {
  return INTERNATIONAL_SOURCING_COUNTRIES.find((c) => c.code === "local") as SourcingCountry;
}

export const INTERNATIONAL_SOURCING_CTA = {
  email: "sourcing@yasirzayed.com",
  phone: "+254 114 712 989",
  shortDescription:
    "Cross-border sourcing across multiple sectors, with vetted suppliers, landed-cost benchmarking and country-specific compliance support.",
};
