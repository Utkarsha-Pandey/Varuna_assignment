import React, { useEffect, useState } from 'react';
import { RouteService } from '../../../core/application/route.service';
import { ComparisonData } from '../../../core/domain/comparison';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

interface CompareTabProps {
  routeService: RouteService;
}

export const CompareTab: React.FC<CompareTabProps> = ({ routeService }) => {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    routeService.getComparison()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch comparison. Is a baseline set?');
      })
      .finally(() => setLoading(false));
  }, [routeService]);

  if (loading) return <div className="p-4">Loading comparison data...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!data) return null;

  // Data for the chart
  const chartData = [
    { name: `Baseline (${data.baseline.route_id})`, ghgIntensity: data.baseline.ghg_intensity },
    ...data.comparisons.map(item => ({
      name: item.route_id,
      ghgIntensity: item.ghgIntensity,
    })),
  ];

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-blue-400 via-white to-gray-300 min-h-screen rounded-lg">
      {/* 1. Baseline & Target Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-blue-800">Current Baseline</h3>
          <p className="text-2xl font-bold text-blue-900">{data.baseline.route_id}</p>
          <p className="text-lg text-blue-700">{data.baseline.ghg_intensity} gCO₂e/MJ</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-green-800">2025 Compliance Target</h3>
          <p className="text-2xl font-bold text-green-900">{data.target} gCO₂e/MJ</p>
          <p className="text-lg text-green-700">(2% below 91.16)</p>
        </div>
      </div>

      {/* 2. Comparison Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-4">GHG Intensity Comparison</h2>
        {/* Legend for baseline/target to avoid overlapping labels on the chart */}
        <div className="flex items-center gap-6 mb-3">
          <div className="flex items-center gap-2">
            <span style={{ display: 'inline-block', width: 48, height: 0, borderTop: '3px dashed #e53e3e' }} />
            <span className="text-sm font-medium text-gray-800">Target: {data.target} gCO₂e/MJ</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Baseline is a blue dashed reference line */}
            <span style={{ display: 'inline-block', width: 48, height: 0, borderTop: '3px dashed #2b6cb0' }} />
            <span className="text-sm font-medium text-gray-800">Baseline: {data.baseline.ghg_intensity} gCO₂e/MJ ({data.baseline.route_id})</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              barGap={20}
              barCategoryGap="40%"
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ghgIntensity" fill="#2f855a" name="GHG Intensity" barSize={70} />
              {/* Use visible lines but no in-chart labels (we show labels in the legend above) */}
              <ReferenceLine y={data.target} stroke="#e53e3e" strokeDasharray="3 3" strokeWidth={2} />
              <ReferenceLine y={data.baseline.ghg_intensity} stroke="#2b6cb0" strokeDasharray="3 3" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Comparison Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Comparison Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Route ID</th>
                <th className="py-2 px-4 border-b text-left">GHG Intensity</th>
                <th className="py-2 px-4 border-b text-left">% Diff from Baseline</th>
                <th className="py-2 px-4 border-b text-left">Compliant (vs Target)</th>
              </tr>
            </thead>
            <tbody>
              {data.comparisons.map((item) => (
                <tr key={item.route_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.route_id}</td>
                  <td className="py-2 px-4 border-b">{item.ghgIntensity}</td>
                  <td className={`py-2 px-4 border-b ${item.percentDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.percentDiff > 0 ? '+' : ''}{item.percentDiff}%
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {item.compliant ? '✅' : '❌'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};