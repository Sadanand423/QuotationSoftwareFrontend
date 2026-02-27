    import React, { useState, useEffect, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import EmployeeSidebar from './EmployeeSidebar';
    import EmployeeDashboard from './EmployeeDashboard';
    import MyQuotations from './MyQuotations';
    import MyClients from './MyClients';
    import CreateQuotation from './CreateQuotation';
    import Invoice from './Invoice';
    import MyInvoice from './MyInvoice';
    import MyProfile from './MyProfile';
    import AllNotifications from "./AllNotifications";



    const EmployeePanel = () => {
      const [activeModule, setActiveModule] = useState('dashboard');
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [selectedClient, setSelectedClient] = useState(null);
      const [notifications, setNotifications] = useState([]);
      const [showNotifications, setShowNotifications] = useState(false);
      const [showDropdown, setShowDropdown] = useState(false);

      const navigate = useNavigate();
      const dropdownRef = useRef(null);
      const bellRef = useRef(null);
    const [showAllNotifications, setShowAllNotifications] = useState(false);

      const handleCreateQuotation = (client = null) => {
        setSelectedClient(client);
        setActiveModule('create');
      };

      // Close dropdown when clicking outside
      useEffect(() => {
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        if (showNotifications) {
          // close instantly
          setShowNotifications(false);

          // update UI read state
          setNotifications(prev =>
            prev.map(n => (!n.read ? { ...n, read: true } : n))
          );

          // call backend
          const empId = localStorage.getItem("empId");
          if (empId) {
            fetch(`http://localhost:8080/api/notifications/mark-read/${empId}`, {
              method: "POST",
            }).catch(() => {});
          }
        }
      }

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

      const handleProfile = () => {
        setActiveModule('profile');
        setShowDropdown(false);
      };

      const handleLogout = () => {
        localStorage.clear();
        navigate('/');
      };

    // REPLACE your current fetchNotifications useEffect with this:
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const empId = localStorage.getItem("empId");
          if (!empId) return;

          const res = await fetch(`http://localhost:8080/api/notifications/employee/${empId}`);
          if (!res.ok) return;

          const incoming = await res.json();

          setNotifications(prev => {
            const prevMap = new Map(prev.map(n => [n.id, n]));

            return incoming.map(n => {
              const existing = prevMap.get(n.id);

              if (existing) return existing;        // keep read
              if (n.read === true) return n;        // backend read
              return { ...n, read: false };         // new unread
            });
          });

        } catch (e) {
          console.error("Notification fetch error", e);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000); // same as admin
      return () => clearInterval(interval);
    }, []);

    // NEW FUNCTION: Add this below the useEffect
    const toggleNotifications = () => {
      const newState = !showNotifications;

      if (!newState && showNotifications) {
        setShowNotifications(false);

        setNotifications(prev =>
          prev.map(n => (!n.read ? { ...n, read: true } : n))
        );

        const empId = localStorage.getItem("empId");
        if (empId) {
          fetch(`http://localhost:8080/api/notifications/mark-read/${empId}`, {
            method: "POST",
          }).catch(() => {});
        }

        return;
      }

      setShowNotifications(true);
    };

      const renderContent = () => {
        switch (activeModule) {
          case 'dashboard': return <EmployeeDashboard onCreateQuotation={() => setActiveModule('create')} />;
          case 'clients': return <MyClients onCreateQuotation={handleCreateQuotation} />;
          case 'create': return <CreateQuotation selectedClient={selectedClient} />;
          case 'quotations': return <MyQuotations />;
          case 'invoice': return <Invoice />;
          case 'myinvoice': return <MyInvoice />;
          case 'profile': return <MyProfile />;
          case "allNotifications": return <AllNotifications notifications={notifications} />;
          default: return <EmployeeDashboard />;
        }
      };

      const unreadNotifications = notifications.filter(n => !n.read);
      const unreadCount = unreadNotifications.length;

      return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 sm:hidden">
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setSidebarOpen(false)}
              />
              <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-50">
                <EmployeeSidebar
                  activeModule={activeModule}
                  setActiveModule={setActiveModule}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden sm:block">
            <EmployeeSidebar
              activeModule={activeModule}
              setActiveModule={setActiveModule}
            />
          </div>

          <div className="flex-1 overflow-auto">
            <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="sm:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>

                  <div>
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <span className="hidden sm:inline">Quotation Management System</span>
                      <span className="sm:hidden">QMS</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">
                      Professional Business Solutions
                    </p>
                  </div>
                </div>

              {/* 🔔 NOTIFICATION + EMPLOYEE */}
                <div className="flex items-center gap-3">

                  {/* 🔔 BELL */}
                  <div className="relative" ref={bellRef}>
                    <button
                      onClick={toggleNotifications}
                      className="w-10 h-10 flex items-center justify-center rounded-full 
                                bg-gradient-to-r from-indigo-500 to-purple-600
                                text-white shadow-lg hover:scale-105 transition-transform"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a7 7 0 00-7 7v4.586l-.707.707A1 1 0 005 17h14a1 1 0 00.707-1.707L19 13.586V9a7 7 0 00-7-7zm0 20a3 3 0 003-3H9a3 3 0 003 3z"/>
                      </svg>

                      {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow">
        {unreadCount}
      </span>
    )}
                    </button>

                    {/* 🔽 DROPDOWN */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 z-50">
                        <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 shadow-md"></div>

                        <div className="bg-white border rounded-2xl shadow-2xl overflow-hidden">
                          <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold">
                            Notifications
                          </div>

                          <div className="max-h-80 overflow-auto no-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-sm text-gray-500 text-center">
                                No notifications
                              </div>
                            ) : (
                              notifications.slice(0, 8).map((n) => (
                                <div
                                  key={n.id}
                                  className={`px-4 py-3 border-b border-gray-200 ${
      !n.read ? "bg-indigo-100" : "bg-white hover:bg-gray-50"
    }`}
                                >
                                  <div className="text-sm font-medium text-gray-800">
                                    {n.message}
                                  </div>

                                  {n.timestamp && (
                                    <div className="text-[10px] text-gray-400 mt-1">
                                      {new Date(n.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>

                          {/* VIEW ALL */}
                          <div
                            onClick={() => {
                              setActiveModule("allNotifications");
                              setShowNotifications(false);
                            }}
                            className="px-4 py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                          >
                            View All Notifications →
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 🔷 FULL PANEL */}
                    {showAllNotifications && (
                      <div className="fixed inset-0 z-[60] flex justify-end">
                        <div
                          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                          onClick={() => setShowAllNotifications(false)}
                        />

                        <div className="relative w-[420px] h-full bg-white shadow-2xl border-l flex flex-col animate-slideIn">
                          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center">
                            <div className="text-lg font-semibold">All Notifications</div>
                            <button
                              onClick={() => setShowAllNotifications(false)}
                              className="text-white/80 hover:text-white text-xl"
                            >
                              ✕
                            </button>
                          </div>

                          <div className="flex-1 overflow-auto">
                            {notifications.map((n) => (
                              <div
                                key={n.id}
                                className={`px-6 py-4 border-b hover:bg-indigo-50 transition ${
                                  !n.read ? "bg-indigo-50/40" : ""
                                }`}
                              >
                                <div className="text-sm font-medium text-gray-800">
                                  {n.message}
                                </div>

                                {n.timestamp && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {new Date(n.timestamp).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 👤 EMPLOYEE BUTTON */}
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg cursor-pointer"
                    >
                      👤 Employee Panel
                    </div>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-50">
                        <button
                          onClick={handleProfile}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          👤 Profile
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    )}
                  </div>
        </div>

              </div>
            </header>

            <main className="pt-2 pb-3 px-3 sm:pt-4 sm:px-6 sm:pb-6">
              <div className="max-w-7xl mx-auto">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      );
    };

    export default EmployeePanel;
