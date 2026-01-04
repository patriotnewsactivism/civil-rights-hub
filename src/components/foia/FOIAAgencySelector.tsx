import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, Building2, Mail, Phone, Globe, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type FOIAAgency = Database["public"]["Tables"]["foia_agencies"]["Row"];

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
  agencyType,
  state,
  className,
}: FOIAAgencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [agencies, setAgencies] = useState<FOIAAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAgencies = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("foia_agencies")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (agencyType) {
        query = query.eq("agency_type", agencyType);
      }

      if (state && agencyType !== "Federal") {
        query = query.eq("state", state);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAgencies(data || []);
    } catch (error) {
      console.error("Error fetching FOIA agencies:", error);
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  }, [agencyType, state]);

  useEffect(() => {
    void fetchAgencies();
  }, [fetchAgencies]);

  const filteredAgencies = useMemo(() => {
    if (!searchQuery.trim()) return agencies;
    const normalized = searchQuery.toLowerCase();
    return agencies.filter((agency) =>
      `${agency.name} ${agency.acronym || ""} ${agency.foia_office_name || ""}`
        .toLowerCase()
        .includes(normalized)
    );
  }, [agencies, searchQuery]);

  const selectedAgency = useMemo(
    () => agencies.find((agency) => agency.id === selectedAgencyId) || null,
    [agencies, selectedAgencyId]
  );

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
              {loading
                ? "Loading agencies..."
                : selectedAgency
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
              {selectedAgency.foia_office_name && (
                <p className="text-sm text-muted-foreground mt-1">
                  FOIA Office: {selectedAgency.foia_office_name}
                </p>
              )}
            </div>
            <Badge>{selectedAgency.agency_type}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {selectedAgency.foia_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${selectedAgency.foia_email}`}
                  className="text-primary hover:underline truncate"
                >
                  {selectedAgency.foia_email}
                </a>
              </div>
            )}

            {selectedAgency.foia_phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${selectedAgency.foia_phone}`} className="text-primary hover:underline">
                  {selectedAgency.foia_phone}
                </a>
              </div>
            )}

            {selectedAgency.foia_online_portal_url && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={selectedAgency.foia_online_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  Online Portal
                </a>
              </div>
            )}

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

          {selectedAgency.mailing_address && (
            <div className="pt-2 border-t text-sm">
              <p className="text-muted-foreground mb-1">Mailing Address:</p>
              <p className="whitespace-pre-line">{selectedAgency.mailing_address}</p>
            </div>
          )}

          {selectedAgency.notes && (
            <div className="pt-2 border-t text-sm">
              <p className="text-muted-foreground mb-1">Important Notes:</p>
              <p className="whitespace-pre-line">{selectedAgency.notes}</p>
            </div>
          )}

          {selectedAgency.foia_guide_url && (
            <div className="pt-2">
              <a
                href={selectedAgency.foia_guide_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                View FOIA Guide for this Agency
              </a>
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            {selectedAgency.accepts_email && <Badge variant="secondary">Accepts Email</Badge>}
            {selectedAgency.accepts_online && <Badge variant="secondary">Online Portal</Badge>}
            {selectedAgency.accepts_mail && <Badge variant="secondary">Accepts Mail</Badge>}
            {selectedAgency.accepts_fax && <Badge variant="secondary">Accepts Fax</Badge>}
            {selectedAgency.accepts_in_person && <Badge variant="secondary">In-Person Requests</Badge>}
          </div>
        </div>
      )}
    </div>
  );
}
