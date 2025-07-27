import React, { useState } from 'react';
import { QueryEngine } from '../services/queryEngine';
import { Table, QueryResult, QueryType } from '../types/database';
import { Search, Users, Heart, TrendingUp, Play } from 'lucide-react';

interface RelationshipQueriesProps {
  tables: Table[];
}

const RelationshipQueries: React.FC<RelationshipQueriesProps> = ({ tables }) => {
  const [queryType, setQueryType] = useState<QueryType>('friends');
  const [personName, setPersonName] = useState('');
  const [interest, setInterest] = useState('');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryEngine = new QueryEngine(tables);

  const queryTypes = [
    {
      id: 'friends' as QueryType,
      label: "Person's Friends",
      description: "Find all friends of a specific person",
      icon: Users,
      color: 'blue',
      inputType: 'person'
    },
    {
      id: 'friend-of-friend' as QueryType,
      label: 'Friend of a Friend',
      description: "Find friends of a person's friends",
      icon: Heart,
      color: 'purple',
      inputType: 'person'
    },
    {
      id: 'interests' as QueryType,
      label: 'Interest-based Suggestions',
      description: 'Find people with similar interests',
      icon: TrendingUp,
      color: 'green',
      inputType: 'interest'
    },
    {
      id: 'you-may-like' as QueryType,
      label: 'You May Like',
      description: "Suggestions based on friend's interests",
      icon: Search,
      color: 'orange',
      inputType: 'person'
    }
  ];

  const executeQuery = async () => {
    if (!personName.trim() && queryType !== 'interests') return;
    if (!interest.trim() && queryType === 'interests') return;

    setIsLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    let result: QueryResult;

    switch (queryType) {
      case 'friends':
        result = queryEngine.executePersonFriendsQuery(personName);
        break;
      case 'friend-of-friend':
        result = queryEngine.executeFriendOfFriendQuery(personName);
        break;
      case 'interests':
        result = queryEngine.executeInterestsQuery(interest);
        break;
      case 'you-may-like':
        result = queryEngine.executeYouMayLikeQuery(personName);
        break;
      default:
        result = { columns: [], rows: [] };
    }

    setResults(result);
    setIsLoading(false);
  };

  const selectedQuery = queryTypes.find(q => q.id === queryType);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Relationship Query Engine</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {queryTypes.map((query) => {
            const Icon = query.icon;
            const isSelected = queryType === query.id;
            
            return (
              <button
                key={query.id}
                onClick={() => {
                  setQueryType(query.id);
                  setResults(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? `border-${query.color}-500 bg-${query.color}-50`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Icon className={`h-6 w-6 mb-2 ${
                  isSelected ? `text-${query.color}-600` : 'text-gray-500'
                }`} />
                <h3 className={`font-semibold mb-1 ${
                  isSelected ? `text-${query.color}-800` : 'text-gray-800'
                }`}>
                  {query.label}
                </h3>
                <p className="text-sm text-gray-600">{query.description}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedQuery?.label} Query
          </h3>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {selectedQuery?.inputType === 'person' ? (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person Name
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Enter person name (e.g., pranava, srujan, vivek)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest/Hobby
                </label>
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="Enter interest (e.g., dance, music, politics)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <button
              onClick={executeQuery}
              disabled={isLoading || (!personName.trim() && queryType !== 'interests') || (!interest.trim() && queryType === 'interests')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <Play className="h-4 w-4" />
              <span>{isLoading ? 'Executing...' : 'Execute Query'}</span>
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="text-sm text-blue-700">
              <strong>Query Description:</strong> {selectedQuery?.description}
            </p>
          </div>
        </div>

        {results && (
          <div className="mt-8">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Query Results</h3>
                {results.message && (
                  <p className="text-sm text-gray-600 mt-1">{results.message}</p>
                )}
              </div>
              
              {results.rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {results.columns.map((column, index) => (
                          <th
                            key={index}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500">No results found for this query.</p>
                </div>
              )}
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Found {results.rows.length} result(s)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationshipQueries;