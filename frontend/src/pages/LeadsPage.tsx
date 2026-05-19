import { useState } from "react";
import { Plus, Download, Zap } from "lucide-react";
import { useLeads } from "../hooks/useLeads";
import { leadsApi } from "../api/leads";
import { Lead, LeadFormData } from "../types";
import LeadFiltersBar from "../components/leads/LeadFiltersBar";
import LeadRow from "../components/leads/LeadRow";
import LeadForm from "../components/leads/LeadForm";
import LeadDetailModal from "../components/leads/LeadDetailModal";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ApiResponse } from "../types";

const LeadsPage = () => {
  const { leads, meta, isLoading, filters, updateFilter, resetFilters, refetch } =
    useLeads();

  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCreate = async (data: LeadFormData) => {
    setSubmitting(true);
    try {
      await leadsApi.createLead(data);
      toast.success("Lead created successfully");
      setCreateOpen(false);
      void refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      toast.error(axiosErr.response?.data?.message ?? "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: LeadFormData) => {
    if (!editLead) return;
    setSubmitting(true);
    try {
      await leadsApi.updateLead(editLead._id, data);
      toast.success("Lead updated successfully");
      setEditLead(null);
      void refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      toast.error(axiosErr.response?.data?.message ?? "Failed to update lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteLead) return;
    setDeleting(true);
    try {
      await leadsApi.deleteLead(deleteLead._id);
      toast.success("Lead deleted");
      setDeleteLead(null);
      void refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      toast.error(axiosErr.response?.data?.message ?? "Failed to delete lead");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await leadsApi.exportCSV(filters);
      toast.success("CSV exported successfully");
    } catch {
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Leads
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {meta ? `${meta.total} total leads` : "Manage your pipeline"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
            isLoading={exporting}
          >
            Export CSV
          </Button>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateOpen(true)}
          >
            New Lead
          </Button>
        </div>
      </div>

      <LeadFiltersBar
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            icon={<Zap className="w-7 h-7" />}
            title="No leads found"
            description="Try adjusting your filters or create a new lead to get started."
            action={
              <Button
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setCreateOpen(true)}
              >
                Add Lead
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 dark:bg-gray-800/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {leads.map((lead) => (
                    <LeadRow
                      key={lead._id}
                      lead={lead}
                      onEdit={setEditLead}
                      onDelete={setDeleteLead}
                      onView={setViewLead}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {meta && (
              <div className="px-4 border-t">
                <Pagination
                  meta={meta}
                  onPageChange={(p) => updateFilter("page", p)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Lead"
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          isLoading={submitting}
        />
      </Modal>

      <Modal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
      >
        <LeadForm
          initialData={editLead ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditLead(null)}
          isLoading={submitting}
        />
      </Modal>

      <LeadDetailModal
        lead={viewLead}
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
      />

      <ConfirmDialog
        isOpen={!!deleteLead}
        onClose={() => setDeleteLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteLead?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
};

export default LeadsPage;
