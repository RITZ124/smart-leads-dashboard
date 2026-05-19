import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { Lead } from "../../types";
import { StatusBadge, SourceBadge } from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const LeadRow = ({ lead, onEdit, onDelete, onView }: LeadRowProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {lead.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
            {lead.email}
          </p>
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-4 py-3">
        <SourceBadge source={lead.source} />
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(lead)}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            title="View details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 rounded-md hover:bg-brand-100 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 transition-colors"
            title="Edit lead"
          >
            <Pencil className="w-4 h-4" />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(lead)}
              className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
              title="Delete lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default LeadRow;
