import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Building2, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// Static FOIA agency data for federal agencies
const FEDERAL_AGENCIES = [
  { id: "fbi", name: "Federal Bureau of Investigation", acronym: "FBI", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "doj", name: "Department of Justice", acronym: "DOJ", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "dhs", name: "Department of Homeland Security", acronym: "DHS", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "ice", name: "Immigration and Customs Enforcement", acronym: "ICE", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "cbp", name: "Customs and Border Protection", acronym: "CBP", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "dod", name: "Department of Defense", acronym: "DOD", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "cia", name: "Central Intelligence Agency", acronym: "CIA", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "epa", name: "Environmental Protection Agency", acronym: "EPA", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "hhs", name: "Department of Health and Human Services", acronym: "HHS", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
  { id: "usda", name: "Department of Agriculture", acronym: "USDA", agency_type: "Federal", standard_response_days: 20, has_fees: true, fee_waiver_available: true },
];

export interface FOIAAgency {
  id: string;
  name: string;
  acronym?: string;
  agency_type: string;
  standard_response_days?: number;
  has_fees?: boolean;
  fee_waiver_available?: boolean;
}

interface FOIAAgencySelectorProps {
  onSelect: (agency: FOIAAgency | null) => void;
  selectedAgencyId?: string | null;
  agencyType?: "Federal" | "State" | "County" | "Municipal";
  state?: string | null;
  className?: string;
}

export function FOIAAgencySelector({
  onSelect,
  selectedAgencyId,
  className,
}: FOIAAgencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const agencies = FEDERAL_AGENCIES;

  const filteredAgencies = searchQuery.trim()
    ? agencies.filter((agency) =>
        `${agency.name} ${agency.acronym || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : agencies;

  const selectedAgency = agencies.find((agency) => agency.id === selectedAgencyId) || null;

  const handleSelect = (agency: FOIAAgency) => {
    onSelect(agency);
    setOpen(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedAgency
                ? `${selectedAgency.name}${selectedAgency.acronym ? ` (${selectedAgency.acronym})` : ""}`
                : "Select FOIA agency..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search agencies..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No agencies found.</CommandEmpty>
              <CommandGroup>
                {filteredAgencies.map((agency) => (
                  <CommandItem
                    key={agency.id}
                    value={agency.id}
                    onSelect={() => handleSelect(agency)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedAgencyId === agency.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{agency.name}</span>
                        {agency.acronym && (
                          <span className="text-xs text-muted-foreground">{agency.acronym}</span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {agency.agency_type}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedAgency && (
        <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {selectedAgency.name}
              </h4>
              {selectedAgency.acronym && (
                <p className="text-sm text-muted-foreground">{selectedAgency.acronym}</p>
              )}
            </div>
            <Badge>{selectedAgency.agency_type}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {selectedAgency.standard_response_days && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Response: {selectedAgency.standard_response_days} business days</span>
              </div>
            )}

            {selectedAgency.has_fees && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {selectedAgency.fee_waiver_available ? "Fee waivers available" : "Fees may apply"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
