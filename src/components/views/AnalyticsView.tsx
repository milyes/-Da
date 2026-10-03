import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  ArrowUpDown,
  FilterX,
  Server,
  Zap,
  Globe,
  Clock,
  Shield,
  Download,
} from 'lucide-react';
import { EndpointMetric } from '../../types';

interface AnalyticsViewProps {
  endpoints: EndpointMetric[];
  searchQuery: string;
  onClearSearch: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  endpoints,
  searchQuery,
  onClearSearch,
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [sortField, setSortField] = useState<'requests' | 'latencyMs' | 'errorRate'>('requests');
  const [sortAsc, setSortAsc] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Filter endpoints by search query
  const q = searchQuery.toLowerCase().trim();
  const filteredEndpoints = endpoints
    .filter(
      (ep) =>
        !q ||
        ep.endpoint.toLowerCase().includes(q) ||
        ep.service.toLowerCase().includes(q) ||
        ep.method.toLowerCase().includes(q) ||
        ep.status.toLowerCase().includes(q)
    )
    .sort((a, b) => {
      const multiplier = sortAsc ? 1 : -1;
      return (a[sortField] - b[sortField]) * multiplier;
    });

  // Simulated chart data points for the 7 days / selected period
  const chartData = [
    { day: 'Mon', requests: 1.84, latency: 22 },
    { day: 'Tue', requests: 2.12, latency: 19 },
    { day: 'Wed', requests: 2.45, latency: 24 },
    { day: 'Thu', requests: 2.91, latency: 18 },
    { day: 'Fri', requests: 2.65, latency: 20 },
    { day: 'Sat', requests: 1.42, latency: 16 },
    { day: 'Sun', requests: 1.68, latency: 17 },
  ];

  const maxRequests = 3.2;

  const toggleSort = (field: 'requests' | 'latencyMs' | 'errorRate') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner when Search is Active */}
      {searchQuery && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              Filtering API Endpoints & Metrics: &ldquo;{searchQuery}&rdquo;
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ({filteredEndpoints.length} of {endpoints.length} matching)
            </span>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors shrink-0"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset Analytics Filter</span>
          </button>
        </div>
      )}

      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>System Telemetry & Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time ingress throughput, network latency curves, and endpoint health diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors uppercase ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Analytics report exported as CSV.')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Metrics</span>
          </button>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Ingress Traffic</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">+18.2%</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            15.07M
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Http requests processed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Median Latency (P50)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">-4ms</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            19.4ms
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Target SLA &le; 30ms</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Overall Availability</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Nominal</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            99.982%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero downtime recorded</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Edge Cache Hit Ratio</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">+3.1%</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            94.6%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Bypassing origin servers</p>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Daily Request Volume & Latency Profile</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Traffic trends and edge duration (ms) across continental POP gateways.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 dark:bg-indigo-500"></span>
              Requests (M)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-0.5 bg-emerald-500"></span>
              Latency (ms)
            </span>
          </div>
        </div>

        {/* SVG/CSS Chart Bar visualization */}
        <div className="h-52 pt-4 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100 dark:border-slate-800">
          {chartData.map((item, index) => {
            const heightPercent = (item.requests / maxRequests) * 100;
            const isHovered = hoveredBarIndex === index;
            return (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="mb-2 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-mono py-1 px-2 rounded shadow-lg whitespace-nowrap z-10">
                    <p className="font-bold">{item.requests}M reqs</p>
                    <p className="text-emerald-400">{item.latency}ms avg</p>
                  </div>
                )}

                <div
                  className={`w-full max-w-[42px] rounded-t-md transition-all duration-200 ${
                    isHovered
                      ? 'bg-indigo-500 dark:bg-indigo-400'
                      : 'bg-indigo-600/90 dark:bg-indigo-500/80 hover:bg-indigo-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Endpoints Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Service Endpoint Performance</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live statistics filtered by currently active query &ldquo;{searchQuery || 'all'}&rdquo;.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {filteredEndpoints.length} endpoints
          </span>
        </div>

        {filteredEndpoints.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 select-none">
                <tr>
                  <th className="py-3 px-4 font-semibold">Service & Endpoint</th>
                  <th className="py-3 px-3 font-semibold">Method</th>
                  <th
                    className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => toggleSort('requests')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Total Ingress</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => toggleSort('latencyMs')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Latency (P95)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => toggleSort('errorRate')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Error Rate</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEndpoints.map((ep) => (
                  <tr
                    key={ep.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-900 dark:text-white font-medium">
                        {ep.endpoint}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {ep.service}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          ep.method === 'GET'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : ep.method === 'POST'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {ep.requests.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <span
                        className={
                          ep.latencyMs > 100
                            ? 'text-amber-600 dark:text-amber-400 font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }
                      >
                        {ep.latencyMs}ms
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500">
                      {(ep.errorRate * 100).toFixed(2)}%
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                          ep.status === 'healthy'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ep.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        <span className="capitalize">{ep.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">
            No endpoints matched &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>

    </div>
  );
};
