import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Attorney = Database["public"]["Tables"]["attorneys"]["Row"];

interface AttorneyListProps {
  searchQuery: string;
  selectedState: string;
  selectedSpecialty: string;
}

export default function AttorneyList({ searchQuery, selectedState, selectedSpecialty }: AttorneyListProps) {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttorneys = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("attorneys")
          .select("*");

        if (selectedState && selectedState !== "All States") {
          query = query.eq("state", selectedState);
        }

        if (selectedSpecialty && selectedSpecialty !== "All Specialties") {
          query = query.contains("specialties", [selectedSpecialty]);
        }

        if (searchQuery.trim()) {
          query = query.textSearch("name", searchQuery.trim(), {
            type: "plain",
            config: "english",
          });
        }

        const { data, error: fetchError } = await query.limit(50);

        if (fetchError) throw fetchError;

        setAttorneys(data ?? []);
      } catch (err) {
        console.error("Supabase Fetch Error:", err);
        setError("Connection to Civil Rights Database failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = window.setTimeout(() => {
      void fetchAttorneys();
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, selectedSpecialty, selectedState]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Searching the national database...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
        <strong>System Alert:</strong> {error}
      </div>
    );
  }

  if (attorneys.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">No attorneys found</h3>
        <p className="text-gray-500 mt-1">
          Try adjusting your search terms or selecting a broader region.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        Showing {attorneys.length} results from live database
      </div>

      {attorneys.map((lawyer) => (
        <div
          key={lawyer.id}
          className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{lawyer.name}</h3>
              {lawyer.firm_name && (
                <p className="text-sm text-gray-600 font-medium">{lawyer.firm_name}</p>
              )}
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
              Verified
            </span>
          </div>

          {(lawyer.city || lawyer.state) && (
            <div className="mt-3 flex items-center text-gray-500 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {[lawyer.city, lawyer.state].filter(Boolean).join(", ")}
            </div>
          )}

          {lawyer.specialties && lawyer.specialties.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {lawyer.specialties.slice(0, 4).map((spec) => (
                <span
                  key={`${lawyer.id}-${spec}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            {lawyer.email && (
              <a href={`mailto:${lawyer.email}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Email Attorney
              </a>
            )}
            {lawyer.phone && (
              <a href={`tel:${lawyer.phone}`} className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {lawyer.phone}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
