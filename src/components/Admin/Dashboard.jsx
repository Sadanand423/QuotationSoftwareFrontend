import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Quotations', value: '0', color: 'from-blue-500 to-blue-600', icon: '📋', change: '+12%' },
    { title: 'Total Clients', value: '0', color: 'from-indigo-500 to-purple-500', icon: '👥', change: '+8%' },
    { title: 'Total Employees', value: '0', color: 'from-orange-500 to-red-500', icon: '👨💼', change: '+15%' },
    { title: 'Total Revenue', value: '$0', color: 'from-green-500 to-emerald-500', icon: '💰', change: '+25%' }
  ]);
  const [chartData, setChartData] = useState({
    approved: 0,
    pending: 0,
    draft: 0,
    monthlyRevenue: []
  });
  const [recentQuotations, setRecentQuotations] = useState([]);


  useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/quotations");
      const quotations = await res.json();

      // GET LATEST 3 QUOTATIONS (recently added)
      const latestThree = [...quotations].reverse().slice(0, 3);
      setRecentQuotations(latestThree);

      // STATUS COUNTS
      const approvedQuotations = quotations.filter(q => q.status === "Approved").length;
      const pendingQuotations = quotations.filter(q => q.status === "Pending").length;
      const draftQuotations = quotations.filter(q => !q.status || q.status === "Draft").length;

      // TOTAL REVENUE
      const totalRevenue = quotations
        .filter(q => q.status === "Approved")
        .reduce((sum, q) => sum + (q.totalCost || 0), 0);

      // UNIQUE CLIENTS
      const uniqueClients = new Set();
      quotations.forEach(q => {
        if (q.client) uniqueClients.add(q.client);
      });

      setStats([
        { title: 'Total Quotations', value: quotations.length.toString(), color: 'from-blue-500 to-blue-600', icon: '📋', change: '+12%' },
        { title: 'Approved Quotations', value: approvedQuotations.toString(), color: 'from-green-500 to-emerald-500', icon: '✅', change: '+18%' },
        { title: 'Pending Quotations', value: pendingQuotations.toString(), color: 'from-yellow-500 to-orange-500', icon: '⏳', change: '+5%' },
        { title: 'Draft Quotations', value: draftQuotations.toString(), color: 'from-gray-500 to-gray-700', icon: '📝', change: '+5%' },
        { title: 'Total Clients', value: uniqueClients.size.toString(), color: 'from-indigo-500 to-purple-500', icon: '👥', change: '+8%' },
        { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'from-green-500 to-emerald-500', icon: '💰', change: '+25%' }
      ]);

      setChartData({
        approved: approvedQuotations,
        pending: pendingQuotations,
        draft: draftQuotations,
        monthlyRevenue: [12000,15000,18000,22000,25000,28000]
      });

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  loadDashboardData();
}, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening with your business today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              const data = stats.map(stat => ({ metric: stat.title, value: stat.value }));
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Metric,Value\n" + data.map(row => `${row.metric},${row.value}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "dashboard-stats.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium text-sm"
          >
            Export Data
          </button>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
            <span className="font-semibold text-sm sm:text-base">📅 {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"></div>
            <div className="relative bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-sm sm:text-lg lg:text-2xl">{stat.icon}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-1 sm:px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
              </div>
              <h3 className="text-gray-500 text-xs font-medium mb-1">{stat.title}</h3>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Pie Chart - Quotation Status */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center">
              <span className="mr-2">🍰</span>
              Quotation Status
            </h3>
            <p className="text-purple-100 text-xs sm:text-sm mt-1">Distribution overview</p>
          </div>
          <div className="p-4 sm:p-6 flex flex-col items-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
              <div className="absolute inset-0 rounded-full" style={{
                background: `conic-gradient(
                  #10b981 0deg ${(chartData.approved / (chartData.approved + chartData.pending + chartData.draft) * 360) || 0}deg,
                  #f59e0b ${(chartData.approved / (chartData.approved + chartData.pending + chartData.draft) * 360) || 0}deg ${((chartData.approved + chartData.pending) / (chartData.approved + chartData.pending + chartData.draft) * 360) || 0}deg,
                  #6b7280 ${((chartData.approved + chartData.pending) / (chartData.approved + chartData.pending + chartData.draft) * 360) || 0}deg 360deg
                )`
              }}></div>
              <div className="absolute inset-2 sm:inset-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-lg font-bold text-gray-800">{chartData.approved + chartData.pending + chartData.draft}</span>
              </div>
            </div>
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Approved</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold">{chartData.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold">{chartData.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Draft</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold">{chartData.draft}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Chart - Revenue Trend */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center">
              <span className="mr-2">📈</span>
              Revenue Trend
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">Last 6 months</p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="h-32 sm:h-40 flex items-end justify-between space-x-1 sm:space-x-2">
              {chartData.monthlyRevenue.map((value, index) => {
                const maxValue = Math.max(...chartData.monthlyRevenue);
                const height = (value / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-1 sm:mb-2">${(value/1000).toFixed(0)}k</div>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-1000 ease-out"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-1 sm:mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Recent Quotations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:col-span-2 xl:col-span-1">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center">
              <span className="mr-2">📈</span>
              Recent Quotations
            </h3>
            <p className="text-green-100 text-xs sm:text-sm mt-1">Latest quotation activities</p>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {recentQuotations.map((quote) => (
              <div
                key={quote.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 gap-2 sm:gap-4"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {/* STATUS DOT */}
                  <div
                    className={`w-3 h-3 rounded-full ${
                      quote.status === "Approved"
                        ? "bg-green-400"
                        : quote.status === "Pending"
                        ? "bg-yellow-400"
                        : quote.status === "Rejected"
                        ? "bg-red-400"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  <div>
                    {/* QUOTATION NUMBER */}
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                      {quote.quotationNumber}
                    </p>

                    {/* CLIENT */}
                    <p className="text-xs sm:text-sm text-gray-500">
                      {quote.client}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right ml-6 sm:ml-0">
                  {/* AMOUNT */}
                  <p className="font-bold text-gray-800 text-sm sm:text-base">
                    ₹{quote.totalCost?.toLocaleString()}
                  </p>

                  {/* STATUS BADGE */}
                  <span
                    className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${
                      quote.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : quote.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : quote.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {quote.status || "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;