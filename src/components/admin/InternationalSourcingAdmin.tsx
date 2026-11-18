import { GenericAdminPanel } from "@/components/admin/RemainingPanels";

export function IndustriesPanel() {
  return (
    <GenericAdminPanel
      title="Industries & Sectors"
      description="Activate and manage the sectors available for International Sourcing across multiple sectors."
    />
  );
}

export function CountriesPanel() {
  return (
    <GenericAdminPanel
      title="Target Countries"
      description="Select and manage the countries available for International Sourcing, with country flags and full country names."
    />
  );
}
