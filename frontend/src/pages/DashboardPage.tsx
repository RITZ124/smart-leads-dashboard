import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, TrendingUp, Users2, Target, AlertCircle, ArrowRight } from "lucide-react";
import { leadsApi } from "../api/leads";
import { Lead, LeadStatus } from "../types";
import { useAuth } from "../context/AuthContext";
import { StatusBadge, SourceBadge } from "../components/ui/Badge";
import { PageSpinner } from "../components/ui/Spinner";

interface Stats {
  total: number;
  byStatus: Record<LeadStatus, number>;
}

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    byStatus: { New: 0, Contacted: 0, Qualified: 0, Lost: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await leadsApi.getLeads({ sort: "latest", page: 1 });
        if (response.success && response.data) {
          setLeads(response.data.slice(0, 5));
          const allResponse = await leadsApi.getLeads({ sort: "latest", page: 1 });
          const total = allResponse.meta?.total ?? 0;
          const byStatus: Record<LeadStatus, number> = {
            New: 0,
            Contacted: 0,
            Qualified: 0,
            Lost: 0,
          };
          (allResponse.data ?? []).forEach((l) => {
            byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
          });
          setStats({ total, byStatus });
        }
      } catch {
        /* silent */
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s what&apos;s happening with your leads today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={stats.total}
          icon={Users2}
          color="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
        />
        <StatCard
          label="New Leads"
          value={stats.byStatus.New}
          icon={Zap}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Qualified"
          value={stats.byStatus.Qualified}
          icon={Target}
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <StatCard
          label="Lost"
          value={stats.byStatus.Lost}
          icon={AlertCircle}
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-500" />
            Recent Leads
          </h2>
          <Link
            to="/leads"
            className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {leads.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No leads yet.</p>
            <Link
              to="/leads"
              className="text-sm text-brand-600 dark:text-brand-400 hover:underline mt-1 inline-block"
            >
              Create your first lead
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{lead.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3">
                      <SourceBadge source={lead.source} />
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
