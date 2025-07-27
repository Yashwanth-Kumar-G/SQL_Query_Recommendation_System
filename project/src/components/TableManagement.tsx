import React, { useState } from 'react';
import { Table, Person } from '../types/database';
import { Eye, Edit, Trash2, Plus, Download } from 'lucide-react';

interface TableManagementProps {
  tables: Table[];
  onUpdateTable: (tableName: string, data: Person[]) => void;
  onDeleteTable: (tableName: string) => void;
}

const TableManagement: React.FC<TableManagementProps> = ({ 
  tables, 
  onUpdateTable, 
  onDeleteTable 
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [newRow, setNewRow] = useState<Partial<Person>>({});
  const [editRow, setEditRow] = useState<Person | null>(null);

  const selectedTableData = tables.find(t => t.name === selectedTable);

  const handleAddRow = () => {
    if (!selectedTableData || !newRow.id || !newRow.name) return;
    
    const updatedData = [...selectedTableData.data, newRow as Person];
    onUpdateTable(selectedTable, updatedData);
    setNewRow({});
    setShowAddForm(false);
  };

  const handleEditRow = (person: Person) => {
    setEditingRow(person.id);
    setEditRow({ ...person });
  };

  const handleSaveEdit = () => {
    if (!selectedTableData || !editRow) return;
    
    const updatedData = selectedTableData.data.map(p => 
      p.id === editRow.id ? editRow : p
    );
    onUpdateTable(selectedTable, updatedData);
    setEditingRow(null);
    setEditRow(null);
  };

  const handleDeleteRow = (id: number) => {
    if (!selectedTableData) return;
    
    const updatedData = selectedTableData.data.filter(p => p.id !== id);
    onUpdateTable(selectedTable, updatedData);
  };

  const exportTableData = (table: Table) => {
    const csvContent = [
      table.structure.map(col => col.name).join(','),
      ...table.data.map(row => [row.id, row.name, row.frnd_id, row.hob, row.foll].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${table.name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Table Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tables.map((table) => (
            <div key={table.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 uppercase">{table.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                  {table.data.length} rows
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                <p>Columns: {table.structure.length}</p>
                <p>Last updated: Recently</p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTable(table.name)}
                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => exportTableData(table)}
                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedTable && selectedTableData && (
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 uppercase">
                {selectedTable} Table Data
              </h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Row</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedTableData.structure.map((col) => (
                      <th key={col.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.name}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedTableData.data.map((person) => (
                    <tr key={person.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingRow === person.id ? (
                          <input
                            type="number"
                            value={editRow?.id || ''}
                            onChange={(e) => setEditRow(prev => prev ? { ...prev, id: parseInt(e.target.value) } : null)}
                            className="border border-gray-300 rounded px-2 py-1 w-20"
                          />
                        ) : (
                          person.id
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingRow === person.id ? (
                          <input
                            type="text"
                            value={editRow?.name || ''}
                            onChange={(e) => setEditRow(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          person.name
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingRow === person.id ? (
                          <input
                            type="number"
                            value={editRow?.frnd_id || ''}
                            onChange={(e) => setEditRow(prev => prev ? { ...prev, frnd_id: parseInt(e.target.value) } : null)}
                            className="border border-gray-300 rounded px-2 py-1 w-20"
                          />
                        ) : (
                          person.frnd_id
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingRow === person.id ? (
                          <input
                            type="text"
                            value={editRow?.hob || ''}
                            onChange={(e) => setEditRow(prev => prev ? { ...prev, hob: e.target.value } : null)}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          person.hob
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingRow === person.id ? (
                          <input
                            type="number"
                            value={editRow?.foll || ''}
                            onChange={(e) => setEditRow(prev => prev ? { ...prev, foll: parseInt(e.target.value) } : null)}
                            className="border border-gray-300 rounded px-2 py-1 w-24"
                          />
                        ) : (
                          person.foll.toLocaleString()
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {editingRow === person.id ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingRow(null);
                                setEditRow(null);
                              }}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditRow(person)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRow(person.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddForm && selectedTableData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Row to {selectedTable}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID</label>
                  <input
                    type="number"
                    value={newRow.id || ''}
                    onChange={(e) => setNewRow(prev => ({ ...prev, id: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newRow.name || ''}
                    onChange={(e) => setNewRow(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Friend ID</label>
                  <input
                    type="number"
                    value={newRow.frnd_id || ''}
                    onChange={(e) => setNewRow(prev => ({ ...prev, frnd_id: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hobby</label>
                  <input
                    type="text"
                    value={newRow.hob || ''}
                    onChange={(e) => setNewRow(prev => ({ ...prev, hob: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Followers</label>
                  <input
                    type="number"
                    value={newRow.foll || ''}
                    onChange={(e) => setNewRow(prev => ({ ...prev, foll: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleAddRow}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Row
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewRow({});
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableManagement;