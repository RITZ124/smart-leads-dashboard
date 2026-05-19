import { useState, useEffect, useCallback } from "react";
import { leadsApi } from "../api/leads";
import { Lead, LeadFilters, PaginationMeta } from "../types";
import { useDebounce } from "./useDebounce";
import toast from "react-hot-toast";

const defaultFilters: LeadFilters = {
  status: "",
  source: "",
  search: "",
  sort: "latest",
  page: 1,
};

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadsApi.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      if (response.success && response.data) {
        setLeads(response.data);
        if (response.meta) setMeta(response.meta);
      }
    } catch {
      toast.error("Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const updateFilter = <K extends keyof LeadFilters>(
    key: K,
    value: LeadFilters[K]
  ): void => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    }));
  };

  const resetFilters = (): void => setFilters(defaultFilters);

  return {
    leads,
    meta,
    isLoading,
    filters,
    updateFilter,
    resetFilters,
    refetch: fetchLeads,
  };
};
