import { VerifiedDataHold } from "@/components/VerifiedDataHold";

interface StateSelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

export const StateSelector = (_props: StateSelectorProps) => (
  <VerifiedDataHold
    title="State-specific legal profiles are temporarily withheld"
    description="The previous state selector combined generalized recording-law labels with generated organizations, generated legal-support contacts, and templated legal conclusions that were not tied to current primary authority."
    detail="State navigation will return after each displayed legal rule, organization, contact, and resource is independently sourced and carries a verification date."
  />
);
