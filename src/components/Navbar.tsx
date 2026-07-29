import React, { useState, useRef, useEffect } from 'react';
import {
  TreePine,
  GraduationCap,
  Map,
  AlertTriangle,
  Sprout,
  Bot,
  BarChart3,
  MoreVertical,
  LogIn,
  LogOut,
  User,
  X,
  ShieldCheck,
  CheckCircle2,
  Flame,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingIncidentsCount: number;
  totalTreesPlanted: number;
  studentName?: string;
  institution?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pendingIncidentsCount,
  totalTreesPlanted,
  studentName = 'Hassan Bin Bello',
  institution = 'Federal University Gusau',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'Ranger' | 'Researcher' | 'Admin'>('Researcher');
  const [loginId, setLoginId] = useState('FUG/2026/SIWES-042');
  const [password, setPassword] = useState('••••••••');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      id: 'sdg-dashboard',
      label: 'Dashboard',
      subLabel: 'UN SDG 15 Impact & Analytics',
      icon: BarChart3,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'incident-reporting',
      label: 'Report Issue',
      subLabel: 'Deforestation & Ranger Dispatch',
      icon: AlertTriangle,
      badge: pendingIncidentsCount > 0 ? `${pendingIncidentsCount} Active` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'map-hotspots',
      label: 'GIS Hotspot Map',
      subLabel: '14 Zamfara LGAs & Forest Belts',
      icon: Map,
    },
    {
      id: 'tree-tracker',
      label: 'Tree Planting',
      subLabel: 'Species Registry & CO2 Offset',
      icon: Sprout,
    },
    {
      id: 'eco-assistant',
      label: 'Zamfara Eco-AI',
      subLabel: 'Gemini 3.6 Research Assistant',
      icon: Bot,
    },
    {
      id: 'phase1-academic',
      label: 'SIWES Project Setup',
      subLabel: 'Phase 1 Docs & System Architecture',
      icon: GraduationCap,
    },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const currentActiveItem = menuItems.find((item) => item.id === activeTab) || menuItems[0];

  return (
    <>
      {/* Single-Line Compact Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div
            onClick={() => handleSelectTab('sdg-dashboard')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-950/50 text-white group-hover:scale-105 transition-transform">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  GreenWatch <span className="text-emerald-400">Zamfara</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono uppercase">
                  SDG 15
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden md:block">
                Deforestation Control • Tree Tracking • SIWES Suite
              </span>
            </div>
          </div>

          {/* Center (Desktop): Direct Navigation Tabs & Current Active Indicator */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Quick Action Buttons, Login & 3-Dots Menu Button */}
          <div className="flex items-center gap-2">
            
            {/* Quick Report Issue Button */}
            <button
              onClick={() => handleSelectTab('incident-reporting')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Issue</span>
            </button>

            {/* Login / Profile Button */}
            {isLoggedIn ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-xs font-medium hover:bg-emerald-900/50 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-semibold">{userRole}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Login</span>
              </button>
            )}

            {/* 3-Dots Menu Dropdown Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Open Navigation Menu"
                className={`p-2 rounded-lg border transition-all ${
                  isMenuOpen
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/40'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {/* Dropdown Menu Popup */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Menu Header */}
                  <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TreePine className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-slate-200">Navigation Menu</span>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                      Zamfara SIWES
                    </span>
                  </div>

                  {/* Menu List */}
                  <div className="p-2 space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                            isActive
                              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-1.5 rounded-md ${
                                isActive
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-200">{item.label}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{item.subLabel}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                        </button>
                      );
                    })}

                    {/* Login / Profile Item in Menu */}
                    <div className="pt-1 mt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsLoginModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-slate-200 hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-slate-800 text-emerald-400">
                            {isLoggedIn ? <ShieldCheck className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-100">
                              {isLoggedIn ? `Account (${userRole})` : 'Login / Ranger Portal'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {isLoggedIn ? studentName : 'Access SIWES & Ranger Verification'}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* Menu Footer / Quick Stats */}
                  <div className="p-3 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400 block">Trees Planted</span>
                      <span className="font-bold text-emerald-400 font-mono text-xs">
                        {totalTreesPlanted.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400 block">Active Incidents</span>
                      <span className="font-bold text-amber-400 font-mono text-xs">
                        {pendingIncidentsCount} Pending
                      </span>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Login / User Verification Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-5">
            
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">GreenWatch Zamfara Portal</h3>
                <p className="text-xs text-slate-400">Ranger Dispatch & SIWES Research Authentication</p>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Authenticated Account Active</span>
                  </div>
                  <p className="text-slate-300">
                    Logged in as <strong>{studentName}</strong> ({userRole})
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Institution: <strong>{institution}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Select Account Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Researcher', 'Ranger', 'Admin'] as const).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setUserRole(role)}
                        className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all ${
                          userRole === role
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {userRole === 'Ranger' ? 'Ranger Badge / Staff ID' : 'Matriculation / Staff ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="e.g. FUG/2026/SIWES-042"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Access PIN / Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate & Login</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
