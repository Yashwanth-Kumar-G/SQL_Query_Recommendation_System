import React from 'react';
import { Database, Users, Search, TrendingUp, Plus, Table } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'tables', label: 'Table Management', icon: Database },
    { id: 'create', label: 'Create Table', icon: Plus },
    { id: 'queries', label: 'Relationship Queries', icon: Search },
    { id: 'analytics', label: 'Query Analytics', icon: TrendingUp },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Table className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">SocialDB</h1>
            <p className="text-sm text-gray-600">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Social Media Database</p>
          <p>Management & Analysis Tool</p>
        </div>
      </div>
    </div>
  );
}


export default Sidebar