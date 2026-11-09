import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  INTERNATIONAL_SOURCING_SECTORS,
  INTERNATIONAL_SOURCING_COUNTRIES,
  type SourcingSector,
  type SourcingCountry,
} from "@/data/internationalSourcing";

interface InternationalSourcingPanelProps {
  hosts: readonly SourcingSector[];
  countries: readonly SourcingCountry[];
}

export default function InternationalSourcingPanel({
  hosts,
  countries,
}: InternationalSourcingPanelProps) {
  const [activeTab, setActiveTab] = useState<"sectors" | "countries">("sectors");
  const [sectorQuery, setSectorQuery] = useState("");
  const [sectorName, setSectorName] = useState("");
  const [countryQuery, setCountryQuery] = useState("");

  const sectorList: readonly SourcingSector[] = hosts.length
    ? hosts
    : INTERNATIONAL_SOURCING_SECTORS;

  const countryList: readonly SourcingCountry[] = countries.length
    ? countries
    : INTERNATIONAL_SOURCING_COUNTRIES;

  const filteredSectors = sectorList.filter((sector) =>
    sector.toLowerCase().includes(sectorQuery.toLowerCase())
  );

  const filteredCountries = countryList.filter((country) =>
    country.name.toLowerCase().includes(countryQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(countryQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">International Sourcing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage sectors and target countries for cross-border sourcing.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("sectors")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "sectors"
              ? "bg-electric text-white"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Sectors
        </button>
        <button
          onClick={() => setActiveTab("countries")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "countries"
              ? "bg-electric text-white"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Countries
        </button>
      </div>

      {activeTab === "sectors" && (
        <div>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={sectorQuery}
                onChange={(e) => setSectorQuery(e.target.value)}
                placeholder="Search sectors…"
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm"
              />
            </div>
            <div className="flex gap-2">
              <input
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
                placeholder="New sector"
                className="w-48 px-3 py-2 rounded-lg border bg-background text-sm"
              />
              <button
                onClick={() => {
                  if (sectorName.trim()) {
                    setSectorName("");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric-dark transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Sector
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <div className="col-span-1" />
              <div className="col-span-5">Sector</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>
            <div className="divide-y divide-border">
              {filteredSectors.map((sector, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors group"
                >
                  <div className="col-span-1">
                    <Globe className="w-4 h-4 text-muted-foreground/30" />
                  </div>
                  <div className="col-span-5">
                    <p className="text-sm font-medium text-foreground">{sector}</p>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center justify-end gap-2">
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredSectors.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No sectors match your filter.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "countries" && (
        <div>
          <div className="relative flex-1 max-w-xs mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={countryQuery}
              onChange={(e) => setCountryQuery(e.target.value)}
              placeholder="Search countries…"
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm"
            />
          </div>

          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
              <div className="col-span-1" />
              <div className="col-span-3">Country</div>
              <div className="col-span-2 text-center">Code</div>
              <div className="col-span-2 text-center">Flag</div>
              <div className="col-span-2 text-center">Region</div>
              <div className="col-span-2 text-center">Status</div>
            </div>
            <div className="divide-y divide-border">
              {filteredCountries.map((country, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-muted/30 transition-colors group"
                >
                  <div className="col-span-1">
                    <Globe className="w-4 h-4 text-muted-foreground/30" />
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-foreground">{country.name}</p>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {country.code}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-lg">{country.flag}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-[10px] text-muted-foreground">{country.region}</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    {country.enabled ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        <XCircle className="w-3 h-3" />
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {filteredCountries.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No countries match your filter.
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
