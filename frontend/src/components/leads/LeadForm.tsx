import { useState, FormEvent } from "react";
import { LeadFormData, LeadStatus, LeadSource, Lead } from "../../types";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

interface LeadFormProps {
  initialData?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
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

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

const LeadForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: LeadFormProps) => {
  const [form, setForm] = useState<LeadFormData>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    status: initialData?.status ?? "New",
    source: initialData?.source ?? "Website",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.source) {
      newErrors.source = "Source is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        placeholder="John Doe"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        error={errors.name}
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        value={form.email}
        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
        error={errors.email}
        required
      />
      <Select
        label="Status"
        value={form.status}
        onChange={(e) =>
          setForm((p) => ({ ...p, status: e.target.value as LeadStatus }))
        }
        options={statusOptions}
      />
      <Select
        label="Source"
        value={form.source}
        onChange={(e) =>
          setForm((p) => ({ ...p, source: e.target.value as LeadSource }))
        }
        options={sourceOptions}
        error={errors.source}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Save Changes" : "Create Lead"}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
