import React, { useState } from 'react';
import { Table } from './types/database';
import { initialTables } from './data/mockData';
import Sidebar from './components/Sidebar';
import TableManagement from './components/TableManagement';
import CreateTable from './components/CreateTable';
import RelationshipQueries from './components/RelationshipQueries';
import QueryAnalytics from './components/QueryAnalytics';

function App() {
  const [activeSection, setActiveSection] = useState('tables');
  const [tables, setTables] = useState<Table[]>(initialTables);

  const handleUpdateTable = (tableName: string, data: any[]) => {
    setTables(prevTables => 
      prevTables.map(table => 
        table.name === tableName ? { ...table, data } : table
      )
    );
  };

  const handleDeleteTable = (tableName: string) => {
    setTables(prevTables => prevTables.filter(table => table.name !== tableName));
  };

  const handleCreateTable = (newTable: Table) => {
    setTables(prevTables => [...prevTables, newTable]);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'tables':
        return (
          <TableManagement
            tables={tables}
            onUpdateTable={handleUpdateTable}
            onDeleteTable={handleDeleteTable}
          />
        );
      case 'create':
        return <CreateTable onCreateTable={handleCreateTable} />;
      case 'queries':
        return <RelationshipQueries tables={tables} />;
      case 'analytics':
        return <QueryAnalytics tables={tables} />;
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="ml-64 min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeSection === 'tables' && 'Table Management'}
                  {activeSection === 'create' && 'Create New Table'}
                  {activeSection === 'queries' && 'Relationship Queries'}
                  {activeSection === 'analytics' && 'Database Analytics'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === 'tables' && 'Manage your database tables and data'}
                  {activeSection === 'create' && 'Create and configure new database tables'}
                  {activeSection === 'queries' && 'Execute social media relationship queries'}
                  {activeSection === 'analytics' && 'View insights and analytics for your data'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {tables.length} table{tables.length !== 1 ? 's' : ''} loaded
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;