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
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [vesselType, setVesselType] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Fetch data on component mount
  const fetchRoutes = () => {
    setLoading(true);
    routeService.getRoutes()
      .then(data => {
        setRoutes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Filter routes based on selected filters
  const filteredRoutes = routes.filter(route => {
    const matchesVesselType = !vesselType || route.vessel_type === vesselType;
    const matchesFuelType = !fuelType || route.fuel_type === fuelType;
    const matchesYear = !year || route.year.toString() === year;
    return matchesVesselType && matchesFuelType && matchesYear;
  });

  // Load data on mount
  useEffect(() => {
    fetchRoutes();
  }, [routeService]);

  const handleSetBaseline = async (id: number) => {
    setUpdatingId(id); // Set loading state for this specific button
    try {
      await routeService.setBaseline(id);
      // After success, refetch all routes to update the UI
      fetchRoutes(); 
    } catch (error) {
      console.error('Failed to set baseline:', error);
      alert('Error setting baseline. See console for details.');
    } finally {
      setUpdatingId(null); // Remove loading state
    }
  };

  return (
    <div className="routes-tab p-4">
      {/* 1. Filters Section */}
      <div className="filters flex space-x-4 mb-4">
        <select 
          className="filter-select border rounded p-2"
          value={vesselType}
          onChange={(e) => setVesselType(e.target.value)}
        >
          <option value="">All Vessel Types</option>
          <option value="Container">Container</option>
          <option value="BulkCarrier">BulkCarrier</option>
        </select>
        <select 
          className="filter-select border rounded p-2"
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
        >
          <option value="">All Fuel Types</option>
          <option value="HFO">HFO</option>
          <option value="LNG">LNG</option>
        </select>
        <select 
          className="filter-select border rounded p-2"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* 2. Routes Table Section */}
      {loading ? (
        <div>Loading routes...</div>
      ) : (
        <div className="routes-table overflow-x-auto">
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
              {filteredRoutes.map((route) => (
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
                      onClick={() => handleSetBaseline(route.id)}
                      className={`route-action-btn py-1 px-3 rounded text-white transition-colors
                        ${route.is_baseline 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-500 hover:bg-blue-600'
                        }
                        ${updatingId === route.id ? 'opacity-50' : ''}
                      `}
                      disabled={route.is_baseline || updatingId !== null}
                    >
                      {updatingId === route.id
                        ? 'Setting...'
                        : route.is_baseline
                        ? 'Baseline'
                        : 'Set Baseline'}
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