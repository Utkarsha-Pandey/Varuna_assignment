import React, { useEffect, useState } from 'react';
import { Route } from '../../../core/domain/route';
import { RouteService } from '../../../core/application/route.service';

// The component receives the service as a prop
interface RoutesTabProps {
  routeService: RouteService;
}

export const RoutesTab: React.FC<RoutesTabProps> = ({ routeService }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    setLoading(true);
    routeService.getRoutes()
      .then(data => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [routeService]);

  return (
    <div className="p-4">
      {/* 1. Filters Section */}
      <div className="flex space-x-4 mb-4">
        <select className="border rounded p-2">
          <option value="">All Vessel Types</option>
          <option value="Container">Container</option>
          <option value="BulkCarrier">BulkCarrier</option>
        </select>
        <select className="border rounded p-2">
          <option value="">All Fuel Types</option>
          <option value="HFO">HFO</option>
          <option value="LNG">LNG</option>
        </select>
        <select className="border rounded p-2">
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* 2. Routes Table Section */}
      {loading ? (
        <div>Loading routes...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Route ID</th>
                <th className="py-2 px-4 border-b text-left">Vessel Type</th>
                <th className="py-2 px-4 border-b text-left">Fuel Type</th>
                <th className="py-2 px-4 border-b text-left">Year</th>
                <th className="py-2 px-4 border-b text-left">GHG Intensity</th>
                <th className="py-2 px-4 border-b text-left">Fuel (t)</th>
                <th className="py-2 px-4 border-b text-left">Distance (km)</th>
                <th className="py-2 px-4 border-b text-left">Total Emis. (t)</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{route.route_id}</td>
                  <td className="py-2 px-4 border-b">{route.vessel_type}</td>
                  <td className="py-2 px-4 border-b">{route.fuel_type}</td>
                  <td className="py-2 px-4 border-b">{route.year}</td>
                  <td className="py-2 px-4 border-b">{route.ghg_intensity}</td>
                  <td className="py-2 px-4 border-b">{route.fuel_consumption_t}</td>
                  <td className="py-2 px-4 border-b">{route.distance_km}</td>
                  <td className="py-2 px-4 border-b">{route.total_emissions_t}</td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      className={`py-1 px-3 rounded text-white ${route.is_baseline ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                      disabled={route.is_baseline}
                    >
                      {route.is_baseline ? 'Baseline' : 'Set Baseline'}
                    </button>
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