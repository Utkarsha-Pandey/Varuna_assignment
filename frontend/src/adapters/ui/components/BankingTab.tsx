import React, { useState } from 'react';
import { ComplianceService } from '../../../core/application/compliance.service';
import { IShipCompliance } from '../../../core/domain/compliance';
import { BankingSummary } from '../../../core/domain/banking';

interface BankingTabProps {
  complianceService: ComplianceService;
}

// Helper to format large numbers
const formatCB = (num: number) => new Intl.NumberFormat().format(num) + ' gCO₂eq';

export const BankingTab: React.FC<BankingTabProps> = ({ complianceService }) => {
  // --- State for Inputs ---
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [amountToApply, setAmountToApply] = useState('');

  // --- State for Data ---
  const [compliance, setCompliance] = useState<IShipCompliance | null>(null);
  const [summary, setSummary] = useState<BankingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setCompliance(null);
    setSummary(null);
    try {
      // First, calculate the CB for the year
      const cbData = await complianceService.getComplianceBalance(shipId, year);
      setCompliance(cbData);
      
      // Then, get the all-time banking summary for the ship
      const summaryData = await complianceService.getBankingSummary(shipId);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // --- Actions ---
  const handleBank = async () => {
    setLoading(true);
    setError(null);
    try {
      await complianceService.bankSurplus(shipId, year);
      // Refresh all data after action
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to bank surplus');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    const amount = parseFloat(amountToApply);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount to apply.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await complianceService.applyBankedSurplus(shipId, year, amount);
      setAmountToApply(''); // Clear input
      // Refresh all data after action
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to apply surplus');
    } finally {
      setLoading(false);
    }
  };

  // --- Derived Values for UI ---
  const cb_before = compliance?.cb_gco2eq ?? 0;
  const net_banked = summary?.totalAvailable ?? 0;
  const cb_after = cb_before + net_banked;

  const canBank = cb_before > 0;
  const canApply = cb_before < 0 && net_banked > 0;

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-blue-400 via-white to-gray-300 min-screen rounded-lg">
      {/* 1. Input Controls */}
      <div className="flex space-x-4 items-center p-4 bg-gray-50 rounded-lg">
        <select value={shipId} onChange={e => setShipId(e.target.value)} className="border rounded p-2">
          <option value="R001">Ship R001</option>
          <option value="R002">Ship R002</option>
          <option value="R003">Ship R003</option>
          <option value="R004">Ship R004</option>
          <option value="R005">Ship R005</option>
        </select>
        <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="border rounded p-2">
          <option value={2024}>Year 2024</option>
          <option value={2025}>Year 2025</option>
        </select>
        <button
          onClick={fetchData}
          disabled={loading}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Fetch Ship Data'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* 2. KPIs */}
      {compliance && summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">CB (Before Bank)</h3>
            <p className={`text-2xl font-bold ${cb_before > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCB(cb_before)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Net Banked Amount</h3>
            <p className="text-2xl font-bold text-gray-800">{formatCB(net_banked)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Adjusted CB (After Bank)</h3>
            <p className={`text-2xl font-bold ${cb_after > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCB(cb_after)}
            </p>
          </div>
        </div>
      )}

      {/* 3. Actions */}
      {compliance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Action */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Bank Surplus</h3>
            <p className="text-sm mb-4">Bank this ship's {year} surplus to use in the future.</p>
            <button
              onClick={handleBank}
              disabled={!canBank || loading}
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
            >
              {canBank ? `Bank ${formatCB(cb_before)}` : 'No surplus to bank'}
            </button>
          </div>
          
          {/* Apply Action */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Apply Banked Surplus</h3>
            <p className="text-sm mb-4">Apply banked surplus to cover this ship's {year} deficit.</p>
            <div className="flex space-x-2">
              <input 
                type="number"
                value={amountToApply}
                onChange={e => setAmountToApply(e.target.value)}
                placeholder="Amount to apply"
                className="flex-1 border rounded p-2"
                disabled={!canApply || loading}
              />
              <button
                onClick={handleApply}
                disabled={!canApply || loading}
                className="py-2 px-4 bg-yellow-500 text-black rounded hover:bg-yellow-600 disabled:bg-gray-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Banking History */}
      {summary && summary.records.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Banking History for {shipId}</h3>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Year of CB</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {summary.records.map(entry => (
                <tr key={entry.id}>
                  <td className="py-2 px-4 border-b">{new Date(entry.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{entry.year}</td>
                  <td className={`py-2 px-4 border-b ${entry.amount_gco2eq > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCB(entry.amount_gco2eq)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {entry.amount_gco2eq > 0 ? 'Bank (Deposit)' : 'Apply (Withdrawal)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};