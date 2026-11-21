/**
 * marketCatalog — the single source of truth for every instrument shown in the
 * tabloid market bar, the markets desk and the markets explorer.
 *
 * `yahoo` is the primary upstream quote symbol. Exchanges that publish only
 * through another machine-readable feed (MOEX ISS, TradingView, Wazi Markets,
 * the GSE market table) are routed in `feedRoutes` below. When no reachable feed
 * publishes a market at all the entry carries `reference` instead and the UI
 * labels it as a reference level rather than pretending it is live.
 */

export type AssetClass = "index" | "stock" | "commodity" | "forex";

export interface MarketInstrument {
  /** Stable key used by the cache, the queries and the UI. */
  symbol: string;
  /** Upstream quote symbol, or null when only a reference level exists. */
  yahoo: string | null;
  label: string;
  name: string;
  assetClass: AssetClass;
  region: string;
  country: string;
  countryCode: string;
  currency: string;
  exchange: string;
  /** Last known level, used until (or instead of) a live quote. */
  reference: number;
  decimals?: number;
}

type Row = [
  symbol: string,
  yahoo: string | null,
  label: string,
  name: string,
  region: string,
  country: string,
  countryCode: string,
  currency: string,
  exchange: string,
  reference: number,
  decimals?: number,
];

function instrument(assetClass: AssetClass, row: Row): MarketInstrument {
  const [symbol, yahoo, label, name, region, country, countryCode, currency, exchange, reference, decimals] = row;
  return { symbol, yahoo, label, name, assetClass, region, country, countryCode, currency, exchange, reference, decimals };
}

const indexRows: Row[] = [
  // Americas
  ["^GSPC", "^GSPC", "S&P 500", "S&P 500", "Americas", "United States", "US", "USD", "NYSE", 5842.31],
  ["^IXIC", "^IXIC", "NASDAQ", "NASDAQ Composite", "Americas", "United States", "US", "USD", "NASDAQ", 19234.56],
  ["^DJI", "^DJI", "Dow Jones", "Dow Jones Industrial Average", "Americas", "United States", "US", "USD", "NYSE", 43210.88],
  ["^RUT", "^RUT", "Russell 2000", "Russell 2000", "Americas", "United States", "US", "USD", "NYSE", 2360.42],
  ["^GSPTSE", "^GSPTSE", "TSX", "S&P/TSX Composite", "Americas", "Canada", "CA", "CAD", "TSX", 24845.9],
  ["^BVSP", "^BVSP", "Bovespa", "Ibovespa", "Americas", "Brazil", "BR", "BRL", "B3", 134567.89],
  ["^MXX", "^MXX", "IPC", "S&P/BMV IPC", "Americas", "Mexico", "MX", "MXN", "BMV", 56789.12],
  ["^MERV", "^MERV", "MERVAL", "S&P MERVAL", "Americas", "Argentina", "AR", "ARS", "BYMA", 2848945.2],
  // Europe
  ["^FTSE", "^FTSE", "FTSE 100", "FTSE 100", "Europe", "United Kingdom", "GB", "GBP", "LSE", 8456.78],
  ["^GDAXI", "^GDAXI", "DAX", "DAX 40", "Europe", "Germany", "DE", "EUR", "XETRA", 19234.56],
  ["^FCHI", "^FCHI", "CAC 40", "CAC 40", "Europe", "France", "FR", "EUR", "Euronext Paris", 7890.12],
  ["FTSEMIB.MI", "FTSEMIB.MI", "FTSE MIB", "FTSE MIB", "Europe", "Italy", "IT", "EUR", "Borsa Italiana", 34567.89],
  ["^IBEX", "^IBEX", "IBEX 35", "IBEX 35", "Europe", "Spain", "ES", "EUR", "BME", 11890.45],
  ["^SSMI", "^SSMI", "SMI", "Swiss Market Index", "Europe", "Switzerland", "CH", "CHF", "SIX", 12345.67],
  ["^AEX", "^AEX", "AEX", "AEX Index", "Europe", "Netherlands", "NL", "EUR", "Euronext Amsterdam", 912.34],
  ["^OMX", "^OMX", "OMXS30", "OMX Stockholm 30", "Europe", "Sweden", "SE", "SEK", "Nasdaq Stockholm", 2567.89],
  ["^BFX", "^BFX", "BEL 20", "BEL 20", "Europe", "Belgium", "BE", "EUR", "Euronext Brussels", 4123.45],
  ["^ATX", "^ATX", "ATX", "Austrian Traded Index", "Europe", "Austria", "AT", "EUR", "Wiener Börse", 3678.9],
  ["XU100.IS", "XU100.IS", "BIST 100", "Borsa Istanbul 100", "Europe", "Turkey", "TR", "TRY", "Borsa Istanbul", 9876.54],
  ["MOEX", null, "MOEX", "Moscow Exchange Index", "Europe", "Russia", "RU", "RUB", "Moscow Exchange", 3456.78],
  ["OBX", "OBX.OL", "OBX", "Oslo Børs Benchmark", "Europe", "Norway", "NO", "NOK", "Oslo Børs", 1412.36],
  // Africa & Middle East
  ["^JN0U.JO", "^JN0U.JO", "JSE Top 40", "FTSE/JSE Top 40", "Africa", "South Africa", "ZA", "ZAR", "JSE", 78901.23],
  ["^CASE30", "^CASE30", "EGX 30", "EGX 30", "Africa", "Egypt", "EG", "EGP", "EGX", 34567.89],
  ["^TASI.SR", "^TASI.SR", "TASI", "Tadawul All Share", "Middle East", "Saudi Arabia", "SA", "SAR", "Tadawul", 11234.56],
  ["^TA125.TA", "^TA125.TA", "TA-125", "Tel Aviv 125", "Middle East", "Israel", "IL", "ILS", "TASE", 2156.78],
  ["NASI", null, "NASI", "Nairobi Securities Exchange All Share", "Africa", "Kenya", "KE", "KES", "NSE", 240.57],
  ["NGXASI", null, "NGX ASI", "Nigerian Exchange All Share", "Africa", "Nigeria", "NG", "NGN", "NGX", 247660.74],
  ["MASI", null, "MASI", "Casablanca MASI", "Africa", "Morocco", "MA", "MAD", "CSE", 16974.44],
  ["GSE-CI", null, "GSE-CI", "Ghana Stock Exchange Composite", "Africa", "Ghana", "GH", "GHS", "GSE", 13824.5],
  ["IPSA", "MXIPSAGC.SN", "IPSA", "S&P/CLX IPSA", "Americas", "Chile", "CL", "CLP", "Bolsa de Santiago", 10350.41],
  ["COLCAP", "ICOLCAP.CL", "COLCAP", "MSCI COLCAP", "Americas", "Colombia", "CO", "COP", "BVC", 22920.0],
  ["PSEI", "PSEI.PS", "PSEi", "Philippine Stock Exchange Index", "Asia-Pacific", "Philippines", "PH", "PHP", "PSE", 5306.98],
  // Asia-Pacific
  ["^N225", "^N225", "Nikkei 225", "Nikkei 225", "Asia-Pacific", "Japan", "JP", "JPY", "Tokyo Stock Exchange", 42345.67],
  ["^HSI", "^HSI", "Hang Seng", "Hang Seng Index", "Asia-Pacific", "Hong Kong", "HK", "HKD", "HKEX", 21345.67],
  ["000001.SS", "000001.SS", "SSE Composite", "Shanghai Composite", "Asia-Pacific", "China", "CN", "CNY", "Shanghai Stock Exchange", 3456.78],
  ["^KS11", "^KS11", "KOSPI", "KOSPI Composite", "Asia-Pacific", "South Korea", "KR", "KRW", "KRX", 2789.45],
  ["^BSESN", "^BSESN", "SENSEX", "BSE SENSEX", "Asia-Pacific", "India", "IN", "INR", "BSE", 78901.23],
  ["^NSEI", "^NSEI", "Nifty 50", "Nifty 50", "Asia-Pacific", "India", "IN", "INR", "NSE India", 23890.12],
  ["^STI", "^STI", "STI", "Straits Times Index", "Asia-Pacific", "Singapore", "SG", "SGD", "SGX", 3456.78],
  ["^KLSE", "^KLSE", "KLCI", "FTSE Bursa Malaysia KLCI", "Asia-Pacific", "Malaysia", "MY", "MYR", "Bursa Malaysia", 1567.89],
  ["^SET.BK", "^SET.BK", "SET", "SET Index", "Asia-Pacific", "Thailand", "TH", "THB", "SET", 1345.67],
  ["^JKSE", "^JKSE", "IHSG", "Jakarta Composite", "Asia-Pacific", "Indonesia", "ID", "IDR", "IDX", 7890.12],
  ["^AXJO", "^AXJO", "ASX 200", "S&P/ASX 200", "Asia-Pacific", "Australia", "AU", "AUD", "ASX", 8234.56],
  ["^NZ50", "^NZ50", "NZX 50", "S&P/NZX 50", "Asia-Pacific", "New Zealand", "NZ", "NZD", "NZX", 12345.67],
  ["^TWII", "^TWII", "TAIEX", "TAIEX", "Asia-Pacific", "Taiwan", "TW", "TWD", "TWSE", 22345.67],
];

const stockRows: Row[] = [
  ["AAPL", "AAPL", "Apple", "Apple Inc.", "Americas", "United States", "US", "USD", "NASDAQ", 228.52],
  ["MSFT", "MSFT", "Microsoft", "Microsoft Corp.", "Americas", "United States", "US", "USD", "NASDAQ", 421.34],
  ["NVDA", "NVDA", "NVIDIA", "NVIDIA Corp.", "Americas", "United States", "US", "USD", "NASDAQ", 148.92],
  ["AMZN", "AMZN", "Amazon", "Amazon.com Inc.", "Americas", "United States", "US", "USD", "NASDAQ", 204.11],
  ["GOOGL", "GOOGL", "Alphabet", "Alphabet Inc.", "Americas", "United States", "US", "USD", "NASDAQ", 178.35],
  ["META", "META", "Meta", "Meta Platforms Inc.", "Americas", "United States", "US", "USD", "NASDAQ", 592.44],
  ["TSLA", "TSLA", "Tesla", "Tesla Inc.", "Americas", "United States", "US", "USD", "NASDAQ", 341.06],
  ["JPM", "JPM", "JPMorgan", "JPMorgan Chase & Co.", "Americas", "United States", "US", "USD", "NYSE", 243.18],
  ["XOM", "XOM", "ExxonMobil", "Exxon Mobil Corp.", "Americas", "United States", "US", "USD", "NYSE", 118.42],
  ["SHEL.L", "SHEL.L", "Shell", "Shell plc", "Europe", "United Kingdom", "GB", "GBP", "LSE", 2540.5, 2],
  ["AZN.L", "AZN.L", "AstraZeneca", "AstraZeneca plc", "Europe", "United Kingdom", "GB", "GBP", "LSE", 10450.0],
  ["SAP.DE", "SAP.DE", "SAP", "SAP SE", "Europe", "Germany", "DE", "EUR", "XETRA", 228.4],
  ["OR.PA", "OR.PA", "L'Oréal", "L'Oréal SA", "Europe", "France", "FR", "EUR", "Euronext Paris", 348.2],
  ["NESN.SW", "NESN.SW", "Nestlé", "Nestlé SA", "Europe", "Switzerland", "CH", "CHF", "SIX", 80.46],
  ["7203.T", "7203.T", "Toyota", "Toyota Motor Corp.", "Asia-Pacific", "Japan", "JP", "JPY", "Tokyo Stock Exchange", 2567.0],
  ["6758.T", "6758.T", "Sony", "Sony Group Corp.", "Asia-Pacific", "Japan", "JP", "JPY", "Tokyo Stock Exchange", 2890.5],
  ["0700.HK", "0700.HK", "Tencent", "Tencent Holdings", "Asia-Pacific", "Hong Kong", "HK", "HKD", "HKEX", 402.6],
  ["9988.HK", "9988.HK", "Alibaba", "Alibaba Group", "Asia-Pacific", "Hong Kong", "HK", "HKD", "HKEX", 84.35],
  ["RELIANCE.NS", "RELIANCE.NS", "Reliance", "Reliance Industries", "Asia-Pacific", "India", "IN", "INR", "NSE India", 1289.7],
  ["TCS.NS", "TCS.NS", "TCS", "Tata Consultancy Services", "Asia-Pacific", "India", "IN", "INR", "NSE India", 4123.5],
  ["BHP.AX", "BHP.AX", "BHP", "BHP Group", "Asia-Pacific", "Australia", "AU", "AUD", "ASX", 42.18],
  ["CBA.AX", "CBA.AX", "CommBank", "Commonwealth Bank of Australia", "Asia-Pacific", "Australia", "AU", "AUD", "ASX", 152.34],
  ["005930.KS", "005930.KS", "Samsung", "Samsung Electronics", "Asia-Pacific", "South Korea", "KR", "KRW", "KRX", 57200],
  ["2330.TW", "2330.TW", "TSMC", "Taiwan Semiconductor", "Asia-Pacific", "Taiwan", "TW", "TWD", "TWSE", 1035],
  ["NPN.JO", "NPN.JO", "Naspers", "Naspers Ltd", "Africa", "South Africa", "ZA", "ZAR", "JSE", 3421.0],
  ["FSR.JO", "FSR.JO", "FirstRand", "FirstRand Ltd", "Africa", "South Africa", "ZA", "ZAR", "JSE", 8120],
];

const commodityRows: Row[] = [
  ["GC=F", "GC=F", "Gold", "Gold futures (COMEX)", "Global", "United States", "US", "USD", "COMEX", 2645.3],
  ["SI=F", "SI=F", "Silver", "Silver futures (COMEX)", "Global", "United States", "US", "USD", "COMEX", 31.24],
  ["PL=F", "PL=F", "Platinum", "Platinum futures (NYMEX)", "Global", "United States", "US", "USD", "NYMEX", 964.5],
  ["PA=F", "PA=F", "Palladium", "Palladium futures (NYMEX)", "Global", "United States", "US", "USD", "NYMEX", 1032.0],
  ["HG=F", "HG=F", "Copper", "Copper futures (COMEX)", "Global", "United States", "US", "USD", "COMEX", 4.18],
  ["CL=F", "CL=F", "WTI Crude", "WTI crude oil", "Global", "United States", "US", "USD", "NYMEX", 71.34],
  ["BZ=F", "BZ=F", "Brent Crude", "Brent crude oil", "Global", "United Kingdom", "GB", "USD", "ICE", 75.12],
  ["NG=F", "NG=F", "Natural Gas", "Henry Hub natural gas", "Global", "United States", "US", "USD", "NYMEX", 2.94],
  ["RB=F", "RB=F", "RBOB Gasoline", "RBOB gasoline futures", "Global", "United States", "US", "USD", "NYMEX", 2.06],
  ["ZC=F", "ZC=F", "Corn", "Corn futures (CBOT)", "Global", "United States", "US", "USD", "CBOT", 4.42],
  ["ZW=F", "ZW=F", "Wheat", "Chicago wheat futures", "Global", "United States", "US", "USD", "CBOT", 5.48],
  ["ZS=F", "ZS=F", "Soybeans", "Soybean futures (CBOT)", "Global", "United States", "US", "USD", "CBOT", 9.87],
  ["KC=F", "KC=F", "Coffee", "Arabica coffee (ICE)", "Global", "United States", "US", "USD", "ICE", 3.12],
  ["SB=F", "SB=F", "Sugar", "Raw sugar No. 11 (ICE)", "Global", "United States", "US", "USD", "ICE", 0.21, 4],
  ["CC=F", "CC=F", "Cocoa", "Cocoa futures (ICE)", "Global", "United States", "US", "USD", "ICE", 8210.0],
  ["CT=F", "CT=F", "Cotton", "Cotton No. 2 (ICE)", "Global", "United States", "US", "USD", "ICE", 71.4],
];

const forexRows: Row[] = [
  ["EURUSD=X", "EURUSD=X", "EUR/USD", "Euro / US Dollar", "Global", "Euro area", "EU", "USD", "FX", 1.0892, 4],
  ["GBPUSD=X", "GBPUSD=X", "GBP/USD", "Sterling / US Dollar", "Global", "United Kingdom", "GB", "USD", "FX", 1.2734, 4],
  ["USDJPY=X", "USDJPY=X", "USD/JPY", "US Dollar / Yen", "Global", "Japan", "JP", "JPY", "FX", 149.23],
  ["USDCHF=X", "USDCHF=X", "USD/CHF", "US Dollar / Swiss Franc", "Global", "Switzerland", "CH", "CHF", "FX", 0.8834, 4],
  ["AUDUSD=X", "AUDUSD=X", "AUD/USD", "Aussie / US Dollar", "Global", "Australia", "AU", "USD", "FX", 0.6534, 4],
  ["USDCAD=X", "USDCAD=X", "USD/CAD", "US Dollar / Canadian Dollar", "Global", "Canada", "CA", "CAD", "FX", 1.3567, 4],
  ["NZDUSD=X", "NZDUSD=X", "NZD/USD", "Kiwi / US Dollar", "Global", "New Zealand", "NZ", "USD", "FX", 0.5987, 4],
  ["USDKES=X", "USDKES=X", "USD/KES", "US Dollar / Kenyan Shilling", "Africa", "Kenya", "KE", "KES", "FX", 153.45],
  ["USDZAR=X", "USDZAR=X", "USD/ZAR", "US Dollar / Rand", "Africa", "South Africa", "ZA", "ZAR", "FX", 18.23],
  ["USDNGN=X", "USDNGN=X", "USD/NGN", "US Dollar / Naira", "Africa", "Nigeria", "NG", "NGN", "FX", 1545.67],
  ["USDEGP=X", "USDEGP=X", "USD/EGP", "US Dollar / Egyptian Pound", "Africa", "Egypt", "EG", "EGP", "FX", 49.56],
  ["USDGHS=X", "USDGHS=X", "USD/GHS", "US Dollar / Cedi", "Africa", "Ghana", "GH", "GHS", "FX", 14.89],
  ["USDINR=X", "USDINR=X", "USD/INR", "US Dollar / Rupee", "Asia-Pacific", "India", "IN", "INR", "FX", 84.32],
  ["USDCNY=X", "USDCNY=X", "USD/CNY", "US Dollar / Yuan", "Asia-Pacific", "China", "CN", "CNY", "FX", 7.24],
];

/**
 * Machine-readable feeds for exchanges Yahoo does not publish. `ref` is the
 * provider's own identifier (MOEX securities id, TradingView ticker, or the
 * Wazi Markets index path).
 */
export type IndexFeed =
  | { provider: "moex"; ref: string }
  | { provider: "tradingview"; ref: string }
  | { provider: "wazi"; ref: string }
  | { provider: "gse" };

export const feedRoutes: Record<string, IndexFeed> = {
  MOEX: { provider: "moex", ref: "IMOEX" },
  // TradingView carries these two benchmark indices under its country exchanges.
  NGXASI: { provider: "tradingview", ref: "NSENG:ASI" },
  MASI: { provider: "tradingview", ref: "CSEMA:MASI" },
  // Wazi Markets renders the NSE daily board; the GSE site serves its own table.
  NASI: { provider: "wazi", ref: "NASI" },
  "GSE-CI": { provider: "gse" },
};

export const marketInstruments: MarketInstrument[] = [
  ...indexRows.map((r) => instrument("index", r)),
  ...stockRows.map((r) => instrument("stock", r)),
  ...commodityRows.map((r) => instrument("commodity", r)),
  ...forexRows.map((r) => instrument("forex", r)),
];

export const instrumentsByClass = (assetClass: AssetClass) =>
  marketInstruments.filter((i) => i.assetClass === assetClass);

export const marketRegions = [
  "Americas",
  "Europe",
  "Africa",
  "Middle East",
  "Asia-Pacific",
  "Global",
] as const;

export const assetClassLabels: Record<AssetClass, string> = {
  index: "Indices",
  stock: "Stocks",
  commodity: "Commodities",
  forex: "Forex",
};

export function flagFor(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

/** Symbols for the rolling market bar — kept small so the cache stays warm. */
export const marketBarSymbols = {
  globalIndices: ["^GSPC", "^IXIC", "^DJI", "^FTSE", "^GDAXI", "^FCHI", "^N225", "^HSI", "^STI", "^AXJO", "^GSPTSE", "^BVSP"],
  africanIndices: ["^JN0U.JO", "^CASE30", "NASI", "NGXASI", "MASI", "GSE-CI"],
  commodities: ["GC=F", "SI=F", "CL=F", "BZ=F", "NG=F", "HG=F", "ZC=F", "KC=F"],
  forex: ["EURUSD=X", "GBPUSD=X", "USDJPY=X", "USDCHF=X", "AUDUSD=X", "USDCAD=X", "USDKES=X", "USDZAR=X", "USDNGN=X", "USDINR=X", "USDCNY=X", "USDEGP=X"],
} as const;

export function instrumentBySymbol(symbol: string): MarketInstrument | undefined {
  return marketInstruments.find((i) => i.symbol === symbol);
}

/** Match a legacy `index` label ("S&P 500", "JSE Top 40") to a catalog entry. */
export function instrumentByLabel(label: string): MarketInstrument | undefined {
  const wanted = label.trim().toLowerCase();
  return marketInstruments.find(
    (i) => i.assetClass === "index" && i.label.trim().toLowerCase() === wanted,
  );
}

/**
 * Currency → country table backing the "every country" forex view. Rates come
 * from a daily reference feed, so the list covers every currency the provider
 * publishes rather than only the pairs we quote live.
 */
export const nationCurrencies: Array<{ code: string; country: string; countryCode: string }> = [
  { code: "USD", country: "United States", countryCode: "US" },
  { code: "EUR", country: "Euro area", countryCode: "EU" },
  { code: "GBP", country: "United Kingdom", countryCode: "GB" },
  { code: "JPY", country: "Japan", countryCode: "JP" },
  { code: "CHF", country: "Switzerland", countryCode: "CH" },
  { code: "CAD", country: "Canada", countryCode: "CA" },
  { code: "AUD", country: "Australia", countryCode: "AU" },
  { code: "NZD", country: "New Zealand", countryCode: "NZ" },
  { code: "CNY", country: "China", countryCode: "CN" },
  { code: "HKD", country: "Hong Kong", countryCode: "HK" },
  { code: "INR", country: "India", countryCode: "IN" },
  { code: "KES", country: "Kenya", countryCode: "KE" },
  { code: "UGX", country: "Uganda", countryCode: "UG" },
  { code: "TZS", country: "Tanzania", countryCode: "TZ" },
  { code: "RWF", country: "Rwanda", countryCode: "RW" },
  { code: "ETB", country: "Ethiopia", countryCode: "ET" },
  { code: "SOS", country: "Somalia", countryCode: "SO" },
  { code: "SSP", country: "South Sudan", countryCode: "SS" },
  { code: "BIF", country: "Burundi", countryCode: "BI" },
  { code: "DJF", country: "Djibouti", countryCode: "DJ" },
  { code: "ERN", country: "Eritrea", countryCode: "ER" },
  { code: "NGN", country: "Nigeria", countryCode: "NG" },
  { code: "GHS", country: "Ghana", countryCode: "GH" },
  { code: "ZAR", country: "South Africa", countryCode: "ZA" },
  { code: "EGP", country: "Egypt", countryCode: "EG" },
  { code: "MAD", country: "Morocco", countryCode: "MA" },
  { code: "DZD", country: "Algeria", countryCode: "DZ" },
  { code: "TND", country: "Tunisia", countryCode: "TN" },
  { code: "LYD", country: "Libya", countryCode: "LY" },
  { code: "XOF", country: "West African CFA", countryCode: "SN" },
  { code: "XAF", country: "Central African CFA", countryCode: "CM" },
  { code: "MZN", country: "Mozambique", countryCode: "MZ" },
  { code: "ZMW", country: "Zambia", countryCode: "ZM" },
  { code: "BWP", country: "Botswana", countryCode: "BW" },
  { code: "NAD", country: "Namibia", countryCode: "NA" },
  { code: "MWK", country: "Malawi", countryCode: "MW" },
  { code: "ZWL", country: "Zimbabwe", countryCode: "ZW" },
  { code: "AOA", country: "Angola", countryCode: "AO" },
  { code: "CDF", country: "DR Congo", countryCode: "CD" },
  { code: "MGA", country: "Madagascar", countryCode: "MG" },
  { code: "MUR", country: "Mauritius", countryCode: "MU" },
  { code: "SCR", country: "Seychelles", countryCode: "SC" },
  { code: "LSL", country: "Lesotho", countryCode: "LS" },
  { code: "SZL", country: "Eswatini", countryCode: "SZ" },
  { code: "GMD", country: "Gambia", countryCode: "GM" },
  { code: "GNF", country: "Guinea", countryCode: "GN" },
  { code: "LRD", country: "Liberia", countryCode: "LR" },
  { code: "SLL", country: "Sierra Leone", countryCode: "SL" },
  { code: "CVE", country: "Cape Verde", countryCode: "CV" },
  { code: "STN", country: "São Tomé", countryCode: "ST" },
  { code: "MRU", country: "Mauritania", countryCode: "MR" },
  { code: "AED", country: "United Arab Emirates", countryCode: "AE" },
  { code: "SAR", country: "Saudi Arabia", countryCode: "SA" },
  { code: "QAR", country: "Qatar", countryCode: "QA" },
  { code: "KWD", country: "Kuwait", countryCode: "KW" },
  { code: "BHD", country: "Bahrain", countryCode: "BH" },
  { code: "OMR", country: "Oman", countryCode: "OM" },
  { code: "JOD", country: "Jordan", countryCode: "JO" },
  { code: "ILS", country: "Israel", countryCode: "IL" },
  { code: "LBP", country: "Lebanon", countryCode: "LB" },
  { code: "TRY", country: "Turkey", countryCode: "TR" },
  { code: "IRR", country: "Iran", countryCode: "IR" },
  { code: "IQD", country: "Iraq", countryCode: "IQ" },
  { code: "PKR", country: "Pakistan", countryCode: "PK" },
  { code: "BDT", country: "Bangladesh", countryCode: "BD" },
  { code: "LKR", country: "Sri Lanka", countryCode: "LK" },
  { code: "NPR", country: "Nepal", countryCode: "NP" },
  { code: "AFN", country: "Afghanistan", countryCode: "AF" },
  { code: "MMK", country: "Myanmar", countryCode: "MM" },
  { code: "THB", country: "Thailand", countryCode: "TH" },
  { code: "VND", country: "Vietnam", countryCode: "VN" },
  { code: "KHR", country: "Cambodia", countryCode: "KH" },
  { code: "LAK", country: "Laos", countryCode: "LA" },
  { code: "MYR", country: "Malaysia", countryCode: "MY" },
  { code: "SGD", country: "Singapore", countryCode: "SG" },
  { code: "IDR", country: "Indonesia", countryCode: "ID" },
  { code: "PHP", country: "Philippines", countryCode: "PH" },
  { code: "TWD", country: "Taiwan", countryCode: "TW" },
  { code: "KRW", country: "South Korea", countryCode: "KR" },
  { code: "MNT", country: "Mongolia", countryCode: "MN" },
  { code: "KZT", country: "Kazakhstan", countryCode: "KZ" },
  { code: "UZS", country: "Uzbekistan", countryCode: "UZ" },
  { code: "AZN", country: "Azerbaijan", countryCode: "AZ" },
  { code: "GEL", country: "Georgia", countryCode: "GE" },
  { code: "AMD", country: "Armenia", countryCode: "AM" },
  { code: "RUB", country: "Russia", countryCode: "RU" },
  { code: "UAH", country: "Ukraine", countryCode: "UA" },
  { code: "BYN", country: "Belarus", countryCode: "BY" },
  { code: "MDL", country: "Moldova", countryCode: "MD" },
  { code: "PLN", country: "Poland", countryCode: "PL" },
  { code: "CZK", country: "Czechia", countryCode: "CZ" },
  { code: "HUF", country: "Hungary", countryCode: "HU" },
  { code: "RON", country: "Romania", countryCode: "RO" },
  { code: "BGN", country: "Bulgaria", countryCode: "BG" },
  { code: "RSD", country: "Serbia", countryCode: "RS" },
  { code: "HRK", country: "Croatia", countryCode: "HR" },
  { code: "ALL", country: "Albania", countryCode: "AL" },
  { code: "MKD", country: "North Macedonia", countryCode: "MK" },
  { code: "BAM", country: "Bosnia", countryCode: "BA" },
  { code: "ISK", country: "Iceland", countryCode: "IS" },
  { code: "NOK", country: "Norway", countryCode: "NO" },
  { code: "SEK", country: "Sweden", countryCode: "SE" },
  { code: "DKK", country: "Denmark", countryCode: "DK" },
  { code: "MXN", country: "Mexico", countryCode: "MX" },
  { code: "BRL", country: "Brazil", countryCode: "BR" },
  { code: "ARS", country: "Argentina", countryCode: "AR" },
  { code: "CLP", country: "Chile", countryCode: "CL" },
  { code: "COP", country: "Colombia", countryCode: "CO" },
  { code: "PEN", country: "Peru", countryCode: "PE" },
  { code: "BOB", country: "Bolivia", countryCode: "BO" },
  { code: "PYG", country: "Paraguay", countryCode: "PY" },
  { code: "UYU", country: "Uruguay", countryCode: "UY" },
  { code: "VES", country: "Venezuela", countryCode: "VE" },
  { code: "ECU", country: "Ecuador", countryCode: "EC" },
  { code: "GTQ", country: "Guatemala", countryCode: "GT" },
  { code: "CRC", country: "Costa Rica", countryCode: "CR" },
  { code: "PAB", country: "Panama", countryCode: "PA" },
  { code: "DOP", country: "Dominican Republic", countryCode: "DO" },
  { code: "JMD", country: "Jamaica", countryCode: "JM" },
  { code: "TTD", country: "Trinidad & Tobago", countryCode: "TT" },
  { code: "BBD", country: "Barbados", countryCode: "BB" },
  { code: "BSD", country: "Bahamas", countryCode: "BS" },
  { code: "BZD", country: "Belize", countryCode: "BZ" },
  { code: "HNL", country: "Honduras", countryCode: "HN" },
  { code: "NIO", country: "Nicaragua", countryCode: "NI" },
  { code: "CUP", country: "Cuba", countryCode: "CU" },
  { code: "HTG", country: "Haiti", countryCode: "HT" },
  { code: "FJD", country: "Fiji", countryCode: "FJ" },
  { code: "PGK", country: "Papua New Guinea", countryCode: "PG" },
  { code: "SBD", country: "Solomon Islands", countryCode: "SB" },
  { code: "VUV", country: "Vanuatu", countryCode: "VU" },
  { code: "WST", country: "Samoa", countryCode: "WS" },
  { code: "TOP", country: "Tonga", countryCode: "TO" },
];
