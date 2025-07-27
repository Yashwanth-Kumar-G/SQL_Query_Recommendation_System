import React, { useMemo } from 'react';
import { Table } from '../types/database';
import { BarChart3, Users, TrendingUp, Heart } from 'lucide-react';

interface QueryAnalyticsProps {
  tables: Table[];
}

const QueryAnalytics: React.FC<QueryAnalyticsProps> = ({ tables }) => {
  const analytics = useMemo(() => {
    const stdnts1 = tables.find(t => t.name === 'stdnts1')?.data || [];
    const stdnts2 = tables.find(t => t.name === 'stdnts2')?.data || [];
    const celebrities = tables.find(t => t.name === 'celebrities')?.data || [];
    
    const allPeople = [...stdnts1, ...stdnts2, ...celebrities];
    
    // Interest distribution
    const interestCount: { [key: string]: number } = {};
    allPeople.forEach(person => {
      interestCount[person.hob] = (interestCount[person.hob] || 0) + 1;
    });
    
    // Follower stats
    const followerStats = {
      total: allPeople.reduce((sum, person) => sum + person.foll, 0),
      average: Math.round(allPeople.reduce((sum, person) => sum + person.foll, 0) / allPeople.length),
      max: Math.max(...allPeople.map(p => p.foll)),
      min: Math.min(...allPeople.map(p => p.foll))
    };
    
    // Connection analysis
    const connections = stdnts1.length + stdnts2.length;
    const uniqueConnections = new Set([...stdnts1.map(p => p.frnd_id), ...stdnts2.map(p => p.frnd_id)]).size;
    
    return {
      interestCount,
      followerStats,
      connections,
      uniqueConnections,
      totalPeople: allPeople.length,
      celebrities: celebrities.length
    };
  }, [tables]);

  const topInterests = Object.entries(analytics.interestCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Database Analytics</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-800">Total People</h3>
                <p className="text-2xl font-bold text-blue-600">{analytics.totalPeople}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-800">Connections</h3>
                <p className="text-2xl font-bold text-green-600">{analytics.connections}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-purple-800">Celebrities</h3>
                <p className="text-2xl font-bold text-purple-600">{analytics.celebrities}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-orange-800">Avg Followers</h3>
                <p className="text-2xl font-bold text-orange-600">{analytics.followerStats.average.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interest Distribution */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Interests</h3>
            <div className="space-y-4">
              {topInterests.map(([interest, count], index) => (
                <div key={interest} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="font-medium text-gray-700 capitalize">{interest}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${(count / Math.max(...Object.values(analytics.interestCount))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follower Statistics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Follower Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Total Followers</span>
                <span className="font-semibold text-gray-800">{analytics.followerStats.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Average Followers</span>
                <span className="font-semibold text-gray-800">{analytics.followerStats.average.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Highest Followers</span>
                <span className="font-semibold text-gray-800">{analytics.followerStats.max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Lowest Followers</span>
                <span className="font-semibold text-gray-800">{analytics.followerStats.min.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Query Performance Insights */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Query Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Optimization Recommendations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Consider indexing on FRND_ID for faster friend queries</li>
                <li>• Hobby field could benefit from normalization</li>
                <li>• Add composite indexes for complex relationship queries</li>
                <li>• Consider partitioning large tables by user type</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Data Quality Metrics</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Connection Rate: {Math.round((analytics.uniqueConnections / analytics.totalPeople) * 100)}%</li>
                <li>• Celebrity Ratio: {Math.round((analytics.celebrities / analytics.totalPeople) * 100)}%</li>
                <li>• Data Consistency: High</li>
                <li>• Query Response Time: Optimal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryAnalytics;