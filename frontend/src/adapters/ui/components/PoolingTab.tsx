import React, { useState } from 'react';
import { ComplianceService } from '../../../core/application/compliance.service';
import { PoolMember } from '../../../core/domain/pooling';

interface PoolingTabProps {
  complianceService: ComplianceService;
}

// Data for our ship selection
const allShips = ['R001', 'R002', 'R003', 'R004', 'R005'];
const formatCB = (num: number) => new Intl.NumberFormat().format(num) + ' gCO₂eq';

interface PoolMemberState {
  ship_id: string;
  cb_before: number;
}

export const PoolingTab: React.FC<PoolingTabProps> = ({ complianceService }) => {
  // --- State ---
  const [year, setYear] = useState(2024);
  const [selectedShip, setSelectedShip] = useState(allShips[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This is our list of ships in the prospective pool
  const [members, setMembers] = useState<PoolMemberState[]>([]);
  // This holds the final result after creating the pool
  const [poolResult, setPoolResult] = useState<PoolMember[] | null>(null);
  
  // --- Actions ---
  const handleAddShip = async () => {
    setLoading(true);
    setError(null);
    try {
      if (members.find(m => m.ship_id === selectedShip)) {
        throw new Error('Ship is already in the pool.');
      }
      // Get the adjusted CB to show the "cb_before"
      const adjustedCB = await complianceService.getAdjustedComplianceBalance(selectedShip, year);
      setMembers([...members, {
        ship_id: selectedShip,
        cb_before: adjustedCB.cb_gco2eq
      }]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ship data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePool = async () => {
    if (members.length < 2) {
      setError('A pool requires at least 2 members.');
      return;
    }
    setLoading(true);
    setError(null);
    setPoolResult(null);
    try {
      const memberInputs = members.map(m => ({ shipId: m.ship_id }));
      const result = await complianceService.createPool(year, memberInputs);
      setPoolResult(result); // Set the final result
      setMembers([]); // Clear the "staging" list
    } catch (err: any) {
      setError(err.message || 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  // --- Derived Values ---
  const poolSum = members.reduce((sum, m) => sum + m.cb_before, 0);
  const poolSumColor = poolSum >= 0 ? 'text-green-600' : 'text-red-600';
  const availableShips = allShips.filter(s => !members.find(m => m.ship_id === s));

  return (
    <div className="p-4 space-y-6">
      {/* 1. Controls */}
      <div className="flex space-x-4 items-center p-4 bg-gray-50 rounded-lg">
        <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="border rounded p-2">
          <option value={2024}>Year 2024</option>
          <option value={2025}>Year 2025</option>
        </select>
        
        <select 
          value={selectedShip} 
          onChange={e => setSelectedShip(e.target.value)} 
          className="border rounded p-2"
          disabled={availableShips.length === 0}
        >
          {availableShips.map(shipId => (
            <option key={shipId} value={shipId}>{shipId}</option>
          ))}
          {availableShips.length === 0 && <option>All ships added</option>}
        </select>

        <button
          onClick={handleAddShip}
          disabled={loading || availableShips.length === 0}
          className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Ship to Pool'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* 2. Staging Area */}
      {members.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Prospective Pool Members (Year {year})</h3>
          <table className="min-w-full mb-4">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Ship</th>
                <th className="py-2 px-4 border-b text-left">Adjusted CB (Before)</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.ship_id}>
                  <td className="py-2 px-4 border-b">{m.ship_id}</td>
                  <td className={`py-2 px-4 border-b ${m.cb_before >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCB(m.cb_before)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="py-2 px-4 border-b font-bold">Pool Sum</td>
                <td className={`py-2 px-4 border-b font-bold ${poolSumColor}`}>{formatCB(poolSum)}</td>
              </tr>
            </tfoot>
          </table>
          <button
            onClick={handleCreatePool}
            disabled={loading || poolSum < 0}
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            {poolSum < 0 ? 'Pool Sum must be >= 0' : (loading ? 'Creating...' : 'Create Pool')}
          </button>
        </div>
      )}

      {/* 3. Pool Result */}
      {poolResult && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Pool Created Successfully!</h3>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Ship</th>
                <th className="py-2 px-4 border-b text-left">CB Before</th>
                <th className="py-2 px-4 border-b text-left">CB After</th>
              </tr>
            </thead>
            <tbody>
              {poolResult.map(m => (
                <tr key={m.ship_id}>
                  <td className="py-2 px-4 border-b">{m.ship_id}</td>
                  <td className={`py-2 px-4 border-b ${m.cb_before >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCB(m.cb_before)}
                  </td>
                  <td className={`py-2 px-4 border-b ${m.cb_after >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCB(m.cb_after)}
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