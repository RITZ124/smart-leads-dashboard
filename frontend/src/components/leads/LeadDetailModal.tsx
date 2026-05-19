import { Lead } from "../../types";
import Modal from "../ui/Modal";
import { StatusBadge, SourceBadge } from "../ui/Badge";

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
      {label}
    </p>
    <div className="text-sm text-gray-900 dark:text-white">{value}</div>
  </div>
);

const LeadDetailModal = ({ lead, isOpen, onClose }: LeadDetailModalProps) => {
  if (!lead) return null;

  const createdBy =
    typeof lead.createdBy === "object" ? lead.createdBy.name : lead.createdBy;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" value={lead.name} />
          <Field
            label="Email"
            value={
              <a
                href={`mailto:${lead.email}`}
                className="text-brand-600 dark:text-brand-400 hover:underline font-mono text-xs"
              >
                {lead.email}
              </a>
            }
          />
          <Field label="Status" value={<StatusBadge status={lead.status} />} />
          <Field label="Source" value={<SourceBadge source={lead.source} />} />
          <Field label="Created By" value={createdBy} />
          <Field
            label="Created At"
            value={new Date(lead.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <Field
            label="Last Updated"
            value={new Date(lead.updatedAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <Field label="Lead ID" value={<span className="font-mono text-xs text-gray-400">{lead._id}</span>} />
        </div>
      </div>
    </Modal>
  );
};

export default LeadDetailModal;
