import React, { useState } from 'react';
import { Table, TableColumn } from '../types/database';
import { Plus, Trash2 } from 'lucide-react';

interface CreateTableProps {
  onCreateTable: (table: Table) => void;
}

const CreateTable: React.FC<CreateTableProps> = ({ onCreateTable }) => {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<TableColumn[]>([
    { name: 'ID', type: 'NUMBER(3)', nullable: false },
    { name: 'NAME', type: 'VARCHAR2(10)', nullable: false },
    { name: 'FRND_ID', type: 'NUMBER(3)', nullable: false },
    { name: 'HOB', type: 'VARCHAR2(15)', nullable: false },
    { name: 'FOLL', type: 'NUMBER(10)', nullable: false }
  ]);

  const dataTypes = [
    'NUMBER(3)',
    'NUMBER(10)',
    'VARCHAR2(10)',
    'VARCHAR2(15)',
    'VARCHAR2(50)',
    'DATE',
    'TIMESTAMP'
  ];

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'VARCHAR2(10)', nullable: true }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof TableColumn, value: any) => {
    const updatedColumns = columns.map((col, i) => 
      i === index ? { ...col, [field]: value } : col
    );
    setColumns(updatedColumns);
  };

  const handleCreateTable = () => {
    if (!tableName.trim() || columns.length === 0) {
      alert('Please provide a table name and at least one column');
      return;
    }

    const newTable: Table = {
      name: tableName.toLowerCase(),
      data: [],
      structure: columns
    };

    onCreateTable(newTable);
    setTableName('');
    setColumns([
      { name: 'ID', type: 'NUMBER(3)', nullable: false },
      { name: 'NAME', type: 'VARCHAR2(10)', nullable: false },
      { name: 'FRND_ID', type: 'NUMBER(3)', nullable: false },
      { name: 'HOB', type: 'VARCHAR2(15)', nullable: false },
      { name: 'FOLL', type: 'NUMBER(10)', nullable: false }
    ]);
    alert('Table created successfully!');
  };

  const generateCreateSQL = () => {
    const columnDefinitions = columns
      .filter(col => col.name.trim() !== '')
      .map(col => `  ${col.name} ${col.type}${col.nullable ? '' : ' NOT NULL'}`)
      .join(',\n');
    
    return `CREATE TABLE ${tableName.toUpperCase()} (\n${columnDefinitions}\n);`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Table</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Name
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Enter table name (e.g., users, posts)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Column Definitions</h3>
                <button
                  onClick={addColumn}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Column</span>
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {columns.map((column, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Column Name
                        </label>
                        <input
                          type="text"
                          value={column.name}
                          onChange={(e) => updateColumn(index, 'name', e.target.value.toUpperCase())}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="COLUMN_NAME"
                        />
                      </div>
                      
                      <div className="col-span-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Data Type
                        </label>
                        <select
                          value={column.type}
                          onChange={(e) => updateColumn(index, 'type', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          {dataTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Nullable
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={column.nullable}
                            onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm">Allow NULL</span>
                        </label>
                      </div>
                      
                      <div className="col-span-1">
                        <button
                          onClick={() => removeColumn(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateTable}
              disabled={!tableName.trim() || columns.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Table
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generated SQL</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{tableName.trim() ? generateCreateSQL() : 'Enter table name to generate SQL...'}</pre>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Quick Tips:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use descriptive column names in UPPERCASE</li>
                <li>• Choose appropriate data types for your data</li>
                <li>• Consider making ID columns NOT NULL</li>
                <li>• VARCHAR2 is for text data, NUMBER for numeric</li>
                <li>• Default columns follow social media table structure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTable;