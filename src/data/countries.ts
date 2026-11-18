/**
 * Global countries with dial codes, flags, and RBAC office routing.
 * Used across all Contact form phone fields.
 */

export interface Country {
  code: string;       // ISO 2-letter
  name: string;
  dial: string;       // e.g. "+254"
  flag: string;       // emoji flag
  region: string;     // for RBAC office routing
  office: string;     // which office handles this country
}

/** RBAC office routing map — determines which team handles which region */
export const officeMap: Record<string, { name: string; email: string; phone: string }> = {
  "nairobi": {
    name: "Nairobi HQ — East Africa",
    email: "info@yasirzayed.com",
    phone: "+254 717 227 012",
  },
  "london": {
    name: "London Office — Europe & UK",
    email: "uk@yasirzayed.com",
    phone: "+44 20 7946 0958",
  },
  "dubai": {
    name: "Dubai Office — Middle East & North Africa",
    email: "mena@yasirzayed.com",
    phone: "+971 4 321 6789",
  },
  "lagos": {
    name: "Lagos Office — West Africa",
    email: "westafrica@yasirzayed.com",
    phone: "+234 1 234 5678",
  },
  "newyork": {
    name: "New York Office — Americas",
    email: "americas@yasirzayed.com",
    phone: "+1 212 555 0199",
  },
  "singapore": {
    name: "Singapore Office — Asia Pacific",
    email: "apac@yasirzayed.com",
    phone: "+65 6123 4567",
  },
};

/** Route country to the appropriate office */
export function routeToOffice(countryCode: string): string {
  const country = countries.find((c) => c.code === countryCode);
  return country?.office || "nairobi";
}

/** Get office info for RBAC routing */
export function getOfficeForCountry(countryCode: string) {
  const office = routeToOffice(countryCode);
  return officeMap[office] || officeMap.nairobi;
}

export const countries: Country[] = [
  // ── East Africa ──
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪", region: "East Africa", office: "nairobi" },
  { code: "UG", name: "Uganda", dial: "+256", flag: "🇺🇬", region: "East Africa", office: "nairobi" },
  { code: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿", region: "East Africa", office: "nairobi" },
  { code: "RW", name: "Rwanda", dial: "+250", flag: "🇷🇼", region: "East Africa", office: "nairobi" },
  { code: "ET", name: "Ethiopia", dial: "+251", flag: "🇪🇹", region: "East Africa", office: "nairobi" },
  { code: "SS", name: "South Sudan", dial: "+211", flag: "🇸🇸", region: "East Africa", office: "nairobi" },
  { code: "BI", name: "Burundi", dial: "+257", flag: "🇧🇮", region: "East Africa", office: "nairobi" },
  { code: "SO", name: "Somalia", dial: "+252", flag: "🇸🇴", region: "East Africa", office: "nairobi" },
  { code: "DJ", name: "Djibouti", dial: "+253", flag: "🇩🇯", region: "East Africa", office: "nairobi" },
  { code: "ER", name: "Eritrea", dial: "+291", flag: "🇪🇷", region: "East Africa", office: "nairobi" },

  // ── West Africa ──
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", region: "West Africa", office: "lagos" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭", region: "West Africa", office: "lagos" },
  { code: "SN", name: "Senegal", dial: "+221", flag: "🇸🇳", region: "West Africa", office: "lagos" },
  { code: "CI", name: "Ivory Coast", dial: "+225", flag: "🇨🇮", region: "West Africa", office: "lagos" },
  { code: "CM", name: "Cameroon", dial: "+237", flag: "🇨🇲", region: "West Africa", office: "lagos" },
  { code: "ML", name: "Mali", dial: "+223", flag: "🇲🇱", region: "West Africa", office: "lagos" },
  { code: "BF", name: "Burkina Faso", dial: "+226", flag: "🇧🇫", region: "West Africa", office: "lagos" },
  { code: "NE", name: "Niger", dial: "+227", flag: "🇳🇪", region: "West Africa", office: "lagos" },
  { code: "GN", name: "Guinea", dial: "+224", flag: "🇬🇳", region: "West Africa", office: "lagos" },
  { code: "SL", name: "Sierra Leone", dial: "+232", flag: "🇸🇱", region: "West Africa", office: "lagos" },
  { code: "LR", name: "Liberia", dial: "+231", flag: "🇱🇷", region: "West Africa", office: "lagos" },
  { code: "TG", name: "Togo", dial: "+228", flag: "🇹🇬", region: "West Africa", office: "lagos" },
  { code: "BJ", name: "Benin", dial: "+229", flag: "🇧🇯", region: "West Africa", office: "lagos" },
  { code: "GM", name: "Gambia", dial: "+220", flag: "🇬🇲", region: "West Africa", office: "lagos" },
  { code: "GW", name: "Guinea-Bissau", dial: "+245", flag: "🇬🇼", region: "West Africa", office: "lagos" },
  { code: "CV", name: "Cape Verde", dial: "+238", flag: "🇨🇻", region: "West Africa", office: "lagos" },
  { code: "MR", name: "Mauritania", dial: "+222", flag: "🇲🇷", region: "West Africa", office: "lagos" },

  // ── Southern Africa ──
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", region: "Southern Africa", office: "nairobi" },
  { code: "BW", name: "Botswana", dial: "+267", flag: "🇧🇼", region: "Southern Africa", office: "nairobi" },
  { code: "NA", name: "Namibia", dial: "+264", flag: "🇳🇦", region: "Southern Africa", office: "nairobi" },
  { code: "ZM", name: "Zambia", dial: "+260", flag: "🇿🇲", region: "Southern Africa", office: "nairobi" },
  { code: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼", region: "Southern Africa", office: "nairobi" },
  { code: "MZ", name: "Mozambique", dial: "+258", flag: "🇲🇿", region: "Southern Africa", office: "nairobi" },
  { code: "MW", name: "Malawi", dial: "+265", flag: "🇲🇼", region: "Southern Africa", office: "nairobi" },
  { code: "MG", name: "Madagascar", dial: "+261", flag: "🇲🇬", region: "Southern Africa", office: "nairobi" },
  { code: "MU", name: "Mauritius", dial: "+230", flag: "🇲🇺", region: "Southern Africa", office: "nairobi" },
  { code: "SZ", name: "Eswatini", dial: "+268", flag: "🇸🇿", region: "Southern Africa", office: "nairobi" },
  { code: "LS", name: "Lesotho", dial: "+266", flag: "🇱🇸", region: "Southern Africa", office: "nairobi" },

  // ── North Africa ──
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬", region: "North Africa", office: "dubai" },
  { code: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦", region: "North Africa", office: "dubai" },
  { code: "TN", name: "Tunisia", dial: "+216", flag: "🇹🇳", region: "North Africa", office: "dubai" },
  { code: "DZ", name: "Algeria", dial: "+213", flag: "🇩🇿", region: "North Africa", office: "dubai" },
  { code: "LY", name: "Libya", dial: "+218", flag: "🇱🇾", region: "North Africa", office: "dubai" },
  { code: "SD", name: "Sudan", dial: "+249", flag: "🇸🇩", region: "North Africa", office: "dubai" },

  // ── Middle East ──
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪", region: "Middle East", office: "dubai" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦", region: "Middle East", office: "dubai" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦", region: "Middle East", office: "dubai" },
  { code: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭", region: "Middle East", office: "dubai" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼", region: "Middle East", office: "dubai" },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲", region: "Middle East", office: "dubai" },
  { code: "JO", name: "Jordan", dial: "+962", flag: "🇯🇴", region: "Middle East", office: "dubai" },
  { code: "LB", name: "Lebanon", dial: "+961", flag: "🇱🇧", region: "Middle East", office: "dubai" },
  { code: "IQ", name: "Iraq", dial: "+964", flag: "🇮🇶", region: "Middle East", office: "dubai" },
  { code: "IL", name: "Israel", dial: "+972", flag: "🇮🇱", region: "Middle East", office: "dubai" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷", region: "Middle East", office: "dubai" },

  // ── Europe ──
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", region: "Europe", office: "london" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪", region: "Europe", office: "london" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪", region: "Europe", office: "london" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷", region: "Europe", office: "london" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸", region: "Europe", office: "london" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹", region: "Europe", office: "london" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹", region: "Europe", office: "london" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱", region: "Europe", office: "london" },
  { code: "BE", name: "Belgium", dial: "+32", flag: "🇧🇪", region: "Europe", office: "london" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭", region: "Europe", office: "london" },
  { code: "AT", name: "Austria", dial: "+43", flag: "🇦🇹", region: "Europe", office: "london" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪", region: "Europe", office: "london" },
  { code: "NO", name: "Norway", dial: "+47", flag: "🇳🇴", region: "Europe", office: "london" },
  { code: "DK", name: "Denmark", dial: "+45", flag: "🇩🇰", region: "Europe", office: "london" },
  { code: "FI", name: "Finland", dial: "+358", flag: "🇫🇮", region: "Europe", office: "london" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱", region: "Europe", office: "london" },
  { code: "CZ", name: "Czech Republic", dial: "+420", flag: "🇨🇿", region: "Europe", office: "london" },
  { code: "RO", name: "Romania", dial: "+40", flag: "🇷🇴", region: "Europe", office: "london" },
  { code: "GR", name: "Greece", dial: "+30", flag: "🇬🇷", region: "Europe", office: "london" },
  { code: "UA", name: "Ukraine", dial: "+380", flag: "🇺🇦", region: "Europe", office: "london" },

  // ── North America ──
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸", region: "North America", office: "newyork" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦", region: "North America", office: "newyork" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽", region: "North America", office: "newyork" },

  // ── Central America & Caribbean ──
  { code: "GT", name: "Guatemala", dial: "+502", flag: "🇬🇹", region: "Central America", office: "newyork" },
  { code: "HN", name: "Honduras", dial: "+504", flag: "🇭🇳", region: "Central America", office: "newyork" },
  { code: "SV", name: "El Salvador", dial: "+503", flag: "🇸🇻", region: "Central America", office: "newyork" },
  { code: "NI", name: "Nicaragua", dial: "+505", flag: "🇳🇮", region: "Central America", office: "newyork" },
  { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷", region: "Central America", office: "newyork" },
  { code: "PA", name: "Panama", dial: "+507", flag: "🇵🇦", region: "Central America", office: "newyork" },
  { code: "CU", name: "Cuba", dial: "+53", flag: "🇨🇺", region: "Central America", office: "newyork" },
  { code: "JM", name: "Jamaica", dial: "+1876", flag: "🇯🇲", region: "Caribbean", office: "newyork" },
  { code: "TT", name: "Trinidad & Tobago", dial: "+1868", flag: "🇹🇹", region: "Caribbean", office: "newyork" },

  // ── South America ──
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷", region: "South America", office: "newyork" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷", region: "South America", office: "newyork" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱", region: "South America", office: "newyork" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴", region: "South America", office: "newyork" },
  { code: "PE", name: "Peru", dial: "+51", flag: "🇵🇪", region: "South America", office: "newyork" },
  { code: "EC", name: "Ecuador", dial: "+593", flag: "🇪🇨", region: "South America", office: "newyork" },
  { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪", region: "South America", office: "newyork" },
  { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾", region: "South America", office: "newyork" },

  // ── Asia Pacific ──
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳", region: "Asia Pacific", office: "singapore" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳", region: "Asia Pacific", office: "singapore" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵", region: "Asia Pacific", office: "singapore" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷", region: "Asia Pacific", office: "singapore" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬", region: "Asia Pacific", office: "singapore" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾", region: "Asia Pacific", office: "singapore" },
  { code: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭", region: "Asia Pacific", office: "singapore" },
  { code: "VN", name: "Vietnam", dial: "+84", flag: "🇻🇳", region: "Asia Pacific", office: "singapore" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭", region: "Asia Pacific", office: "singapore" },
  { code: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩", region: "Asia Pacific", office: "singapore" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺", region: "Asia Pacific", office: "singapore" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿", region: "Asia Pacific", office: "singapore" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰", region: "Asia Pacific", office: "singapore" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩", region: "Asia Pacific", office: "singapore" },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰", region: "Asia Pacific", office: "singapore" },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵", region: "Asia Pacific", office: "singapore" },
  { code: "MM", name: "Myanmar", dial: "+95", flag: "🇲🇲", region: "Asia Pacific", office: "singapore" },
  { code: "KH", name: "Cambodia", dial: "+855", flag: "🇰🇭", region: "Asia Pacific", office: "singapore" },
];
