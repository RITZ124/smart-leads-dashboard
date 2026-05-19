import { Search, SlidersHorizontal, X } from "lucide-react";
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from "../../types";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface LeadFiltersBarProps {
  filters: LeadFilters;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "Qualified", label: "Qualified" },
  { value: "Lost", label: "Lost" },
];

const sourceOptions = [
  { value: "Website", label: "Website" },
  { value: "Instagram", label: "Instagram" },
  { value: "Referral", label: "Referral" },
];

const sortOptions = [
  { value: "latest", label: "Latest First" },
  { value: "oldest", label: "Oldest First" },
];

const hasActiveFilters = (filters: LeadFilters): boolean =>
  !!filters.status || !!filters.source || !!filters.search || filters.sort !== "latest";

const LeadFiltersBar = ({ filters, onFilterChange, onReset }: LeadFiltersBarProps) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.status ?? ""}
            onChange={(e) => onFilterChange("status", e.target.value as LeadStatus | "")}
            options={statusOptions}
            placeholder="All Statuses"
            className="w-40"
          />
          <Select
            value={filters.source ?? ""}
            onChange={(e) => onFilterChange("source", e.target.value as LeadSource | "")}
            options={sourceOptions}
            placeholder="All Sources"
            className="w-40"
          />
          <Select
            value={filters.sort}
            onChange={(e) => onFilterChange("sort", e.target.value as SortOrder)}
            options={sortOptions}
            className="w-40"
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          />
          {hasActiveFilters(filters) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              leftIcon={<X className="w-3.5 h-3.5" />}
              className="text-gray-500"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadFiltersBar;
