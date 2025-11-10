import React, { useState } from 'react';
import { RouteService } from './core/application/route.service';
import { AxiosRouteApi } from './adapters/infrastructure/axios.route.api';
import { RoutesTab } from './adapters/ui/components/RoutesTab';

const routeApi = new AxiosRouteApi();
const routeService = new RouteService(routeApi);

type Tab = 'Routes' | 'Compare' | 'Banking' | 'Pooling';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Routes');
  const tabs: Tab[] = ['Routes', 'Compare', 'Banking', 'Pooling'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Routes':
        return <RoutesTab routeService={routeService} />;
      case 'Compare':
        return <div className="bg-white rounded-lg shadow-md p-8">Compare Tab Content</div>;
      case 'Banking':
        return <div className="bg-white rounded-lg shadow-md p-8">Banking Tab Content</div>;
      case 'Pooling':
        return <div className="bg-white rounded-lg shadow-md p-8">Pooling Tab Content</div>;
      default:
        return null;
    }
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-gray-250">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                FuelEU
              </span>
              <span className="text-gray-800 ml-2">Maritime Dashboard</span>
            </h1>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="bg-gray-50 px-6 pt-4">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    relative px-6 py-3 font-medium text-sm rounded-t-lg transition-all duration-200
                    ${activeTab === tab
                      ? 'bg-white text-blue-600 shadow-md border-t-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6">
            <div className="transition-all duration-200 ease-in-out">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;