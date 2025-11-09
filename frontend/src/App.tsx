import React, { useState } from 'react';
import { RouteService } from './core/application/route.service';
import { AxiosRouteApi } from './adapters/infrastructure/axios.route.api';
import { RoutesTab } from './adapters/ui/components/RoutesTab';

// --- This is the Frontend Dependency Injection ---
// 1. Create the concrete API adapter
const routeApi = new AxiosRouteApi();
// 2. Create the service, injecting the adapter
const routeService = new RouteService(routeApi);
// --- End of Injection ---

type Tab = 'Routes' | 'Compare' | 'Banking' | 'Pooling';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Routes');

  const tabs: Tab[] = ['Routes', 'Compare', 'Banking', 'Pooling'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Routes':
        // Pass the service instance to the component as a prop
        return <RoutesTab routeService={routeService} />;
      case 'Compare':
        return <div className="p-4">Compare Tab Content</div>;
      case 'Banking':
        return <div className="p-4">Banking Tab Content</div>;
      case 'Pooling':
        return <div className="p-4">Pooling Tab Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">FuelEU Maritime Dashboard</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;