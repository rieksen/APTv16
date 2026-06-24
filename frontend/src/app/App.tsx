import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Building2, Users, FileText, CreditCard,
  Wrench, BarChart3, Settings, Bell, Search, Plus, Download,
  Eye, Edit, Trash2, X, TrendingUp, TrendingDown, LogOut,
  Moon, Sun, MoreHorizontal, ArrowUpRight, DollarSign,
  Menu, ChevronDown, Shield, Mail, Phone, AlertTriangle,
  Lock, Key, Home, Check, UserCircle, Star, Zap, LayoutGrid,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────

type Page =
  | "dashboard" | "units" | "tenants" | "leases"
  | "payments" | "maintenance" | "reports" | "settings";

// ─── Static data ─────────────────────────────────────────────

const revenueData = [
  { month: "Jan", v: 62 }, { month: "Feb", v: 65 }, { month: "Mar", v: 68 },
  { month: "Apr", v: 71 }, { month: "May", v: 78 }, { month: "Jun", v: 82 },
  { month: "Jul", v: 80 }, { month: "Aug", v: 85 }, { month: "Sep", v: 88 },
  { month: "Oct", v: 87 }, { month: "Nov", v: 91 }, { month: "Dec", v: 95 },
];

const activityFeed = [
  { id: 1, Icon: DollarSign,    bg: "bg-emerald-100", ic: "text-emerald-600", title: "Rent payment received",     detail: "Unit 401 · Zoe Mitchell · UGX 3,800",     time: "2h ago"    },
  { id: 2, Icon: FileText,      bg: "bg-blue-100",    ic: "text-blue-600",    title: "Lease renewal signed",       detail: "Unit 302 · James Porter · 12 months",    time: "5h ago"    },
  { id: 3, Icon: Wrench,        bg: "bg-red-100",     ic: "text-red-600",     title: "Maintenance request opened", detail: "Unit 203 · HVAC Malfunction · Critical", time: "8h ago"    },
  { id: 4, Icon: UserCircle,    bg: "bg-violet-100",  ic: "text-violet-600",  title: "New tenant onboarded",       detail: "Emma Lawson · Unit 301",                 time: "Yesterday" },
  { id: 5, Icon: AlertTriangle, bg: "bg-amber-100",   ic: "text-amber-600",   title: "Payment overdue",            detail: "Unit 302 · James Porter · UGX 2,000",    time: "Yesterday" },
];

const unitsData = [
  { id: 1,  number: "101", floor: 1, bedrooms: 1, bathrooms: 1, rent: 1800, status: "Occupied",    tenant: "Sarah Chen"   },
  { id: 2,  number: "102", floor: 1, bedrooms: 2, bathrooms: 1, rent: 2200, status: "Occupied",    tenant: "Marcus Webb"  },
  { id: 3,  number: "103", floor: 1, bedrooms: 0, bathrooms: 1, rent: 1400, status: "Vacant",      tenant: ""             },
  { id: 4,  number: "201", floor: 2, bedrooms: 2, bathrooms: 2, rent: 2600, status: "Occupied",    tenant: "Priya Sharma" },
  { id: 5,  number: "202", floor: 2, bedrooms: 1, bathrooms: 1, rent: 1900, status: "Occupied",    tenant: "Tyler Brooks" },
  { id: 6,  number: "203", floor: 2, bedrooms: 3, bathrooms: 2, rent: 3200, status: "Maintenance", tenant: ""             },
  { id: 7,  number: "301", floor: 3, bedrooms: 2, bathrooms: 2, rent: 2800, status: "Occupied",    tenant: "Emma Lawson"  },
  { id: 8,  number: "302", floor: 3, bedrooms: 1, bathrooms: 1, rent: 2000, status: "Occupied",    tenant: "James Porter" },
  { id: 9,  number: "303", floor: 3, bedrooms: 0, bathrooms: 1, rent: 1500, status: "Vacant",      tenant: ""             },
  { id: 10, number: "401", floor: 4, bedrooms: 3, bathrooms: 2, rent: 3800, status: "Occupied",    tenant: "Zoe Mitchell" },
  { id: 11, number: "402", floor: 4, bedrooms: 2, bathrooms: 2, rent: 2900, status: "Occupied",    tenant: "David Kim"    },
  { id: 12, number: "403", floor: 4, bedrooms: 1, bathrooms: 1, rent: 2100, status: "Vacant",      tenant: ""             },
];

const tenantsData = [
  { id: 1, name: "Sarah Chen",   phone: "(415) 555-0101", email: "s.chen@gmail.com",     unit: "101", leaseStatus: "Active",   moveIn: "Jan 15, 2024", initials: "SC" },
  { id: 2, name: "Marcus Webb",  phone: "(415) 555-0102", email: "m.webb@gmail.com",     unit: "102", leaseStatus: "Active",   moveIn: "Mar 1, 2024",  initials: "MW" },
  { id: 3, name: "Priya Sharma", phone: "(415) 555-0103", email: "p.sharma@gmail.com",   unit: "201", leaseStatus: "Expiring", moveIn: "Jun 1, 2023",  initials: "PS" },
  { id: 4, name: "Tyler Brooks", phone: "(415) 555-0104", email: "t.brooks@gmail.com",   unit: "202", leaseStatus: "Active",   moveIn: "Sep 15, 2023", initials: "TB" },
  { id: 5, name: "Emma Lawson",  phone: "(415) 555-0105", email: "e.lawson@gmail.com",   unit: "301", leaseStatus: "Active",   moveIn: "Feb 1, 2024",  initials: "EL" },
  { id: 6, name: "James Porter", phone: "(415) 555-0106", email: "j.porter@gmail.com",   unit: "302", leaseStatus: "Expiring", moveIn: "Aug 1, 2023",  initials: "JP" },
  { id: 7, name: "Zoe Mitchell", phone: "(415) 555-0107", email: "z.mitchell@gmail.com", unit: "401", leaseStatus: "Active",   moveIn: "May 1, 2024",  initials: "ZM" },
  { id: 8, name: "David Kim",    phone: "(415) 555-0108", email: "d.kim@gmail.com",      unit: "402", leaseStatus: "Active",   moveIn: "Jan 1, 2024",  initials: "DK" },
];

const leasesData = [
  { id: 1, tenant: "Sarah Chen",   unit: "101", start: "Jan 15, 2024", end: "Jan 14, 2025", rent: 1800, status: "Active"        },
  { id: 2, tenant: "Marcus Webb",  unit: "102", start: "Mar 1, 2024",  end: "Feb 28, 2025", rent: 2200, status: "Active"        },
  { id: 3, tenant: "Priya Sharma", unit: "201", start: "Jun 1, 2023",  end: "May 31, 2024", rent: 2600, status: "Expiring Soon" },
  { id: 4, tenant: "Tyler Brooks", unit: "202", start: "Sep 15, 2023", end: "Sep 14, 2024", rent: 1900, status: "Active"        },
  { id: 5, tenant: "Emma Lawson",  unit: "301", start: "Feb 1, 2024",  end: "Jan 31, 2025", rent: 2800, status: "Active"        },
  { id: 6, tenant: "James Porter", unit: "302", start: "Aug 1, 2023",  end: "Jul 31, 2024", rent: 2000, status: "Expiring Soon" },
  { id: 7, tenant: "Zoe Mitchell", unit: "401", start: "May 1, 2024",  end: "Apr 30, 2025", rent: 3800, status: "Active"        },
  { id: 8, tenant: "David Kim",    unit: "402", start: "Jan 1, 2024",  end: "Dec 31, 2024", rent: 2900, status: "Active"        },
];

const paymentsData = [
  { id: 1, tenant: "Zoe Mitchell",  unit: "401", amount: 3800, due: "Jun 1, 2024",  paid: "Jun 1, 2024",  status: "Paid"    },
  { id: 2, tenant: "David Kim",     unit: "402", amount: 2900, due: "Jun 1, 2024",  paid: "Jun 2, 2024",  status: "Paid"    },
  { id: 3, tenant: "Sarah Chen",    unit: "101", amount: 1800, due: "Jun 1, 2024",  paid: "Jun 1, 2024",  status: "Paid"    },
  { id: 4, tenant: "Emma Lawson",   unit: "301", amount: 2800, due: "Jun 1, 2024",  paid: "—",            status: "Pending" },
  { id: 5, tenant: "Marcus Webb",   unit: "102", amount: 2200, due: "Jun 5, 2024",  paid: "—",            status: "Pending" },
  { id: 6, tenant: "James Porter",  unit: "302", amount: 2000, due: "May 1, 2024",  paid: "—",            status: "Overdue" },
  { id: 7, tenant: "Tyler Brooks",  unit: "202", amount: 1900, due: "Jun 1, 2024",  paid: "Jun 3, 2024",  status: "Paid"    },
  { id: 8, tenant: "Priya Sharma",  unit: "201", amount: 2600, due: "Jun 1, 2024",  paid: "Jun 1, 2024",  status: "Paid"    },
];

const maintenanceData = [
  { id: 1, title: "HVAC Malfunction",      unit: "203",      priority: "Critical", assignee: "Mike Torres",    status: "In Progress", date: "Jun 18" },
  { id: 2, title: "Leaking Faucet",        unit: "102",      priority: "Low",      assignee: "Unassigned",     status: "Open",        date: "Jun 20" },
  { id: 3, title: "Broken Window Lock",    unit: "303",      priority: "Medium",   assignee: "Sarah Nguyen",   status: "In Progress", date: "Jun 17" },
  { id: 4, title: "Elevator Inspection",   unit: "Building", priority: "High",     assignee: "Otis Elevators", status: "Completed",   date: "Jun 15" },
  { id: 5, title: "Parking Lot Light Out", unit: "Exterior", priority: "Low",      assignee: "Mike Torres",    status: "Completed",   date: "Jun 14" },
  { id: 6, title: "Water Heater Failure",  unit: "103",      priority: "High",     assignee: "Jake Miller",    status: "Open",        date: "Jun 21" },
];

// ─── Style helpers ────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  Occupied:        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-700/50",
  Vacant:          "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-700/50",
  Maintenance:     "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-700/50",
  Active:          "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-700/50",
  Expiring:        "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-700/50",
  "Expiring Soon": "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-700/50",
  Expired:         "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  Paid:            "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-700/50",
  Pending:         "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-700/50",
  Overdue:         "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-700/50",
  Open:            "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-700/50",
  "In Progress":   "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-700/50",
  Completed:       "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-700/50",
  Critical:        "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-700/60",
  High:            "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 ring-1 ring-orange-200 dark:ring-orange-700/50",
  Medium:          "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-700/50",
  Low:             "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

const AVATAR_COLORS = [
  "bg-emerald-500", "bg-blue-500", "bg-violet-500",
  "bg-amber-500",   "bg-pink-500", "bg-teal-500",
];

const formatCurrency = (value: number) => `UGX ${value.toLocaleString()}`;

// ─── Primitive components ─────────────────────────────────────

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap ${STATUS_STYLES[status] ?? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
      {status}
    </span>
  );
}

function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const color = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  const sz = size === "lg" ? "w-12 h-12 text-base" : size === "md" ? "w-9 h-9 text-sm" : "w-7 h-7 text-xs";
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{value}</p>
    </div>
  );
}

function PrimaryBtn({ children, icon, onClick, sm }: {
  children: string; icon?: React.ReactNode; onClick?: () => void; sm?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl active:scale-95 transition-all ${sm ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}`}
    >
      {icon}{children}
    </button>
  );
}

function GhostBtn({ children, icon, onClick }: {
  children: string; icon?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
    >
      {icon}{children}
    </button>
  );
}

// ─── Static SVG charts (zero external dependencies) ──────────

function LineChart() {
  const max = Math.max(...revenueData.map(d => d.v));
  const min = Math.min(...revenueData.map(d => d.v));
  const W = 400, H = 100, pad = 4;
  const x = (i: number) => pad + (i / (revenueData.length - 1)) * (W - pad * 2);
  const y = (v: number) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
  const d = revenueData.map((pt, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(pt.v).toFixed(1)}`).join(" ");
  const area = d + ` L${x(revenueData.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
      <path d={area} fill="#16A34A" fillOpacity="0.1" />
      <path d={d} fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ dark }: { dark?: boolean }) {
  const W = 520, H = 200, PL = 36, PR = 8, PT = 12, PB = 26;
  const cw = W - PL - PR, ch = H - PT - PB;
  const maxV = 100; // round ceiling above data max of 95
  const gridLines = [0, 25, 50, 75, 100];
  const slotW = cw / revenueData.length;
  const barW = slotW * 0.55;
  const bx = (i: number) => PL + i * slotW + (slotW - barW) / 2;
  const bh = (v: number) => (v / maxV) * ch;
  const by = (v: number) => PT + ch - bh(v);
  const gridColor = dark ? "#1e293b" : "#f1f5f9";
  const labelColor = dark ? "#64748b" : "#94a3b8";
  const barColor = dark ? "#22c55e" : "#16a34a";
  const barBg = dark ? "#162032" : "#f0fdf4";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
      {/* Background bars (ghost track) */}
      {revenueData.map((_, i) => (
        <rect key={`bg-${i}`} x={bx(i)} y={PT} width={barW} height={ch} fill={barBg} rx="4" />
      ))}
      {/* Grid lines */}
      {gridLines.map(g => {
        const yv = PT + ch - (g / maxV) * ch;
        return (
          <g key={`grid-${g}`}>
            <line x1={PL} y1={yv} x2={W - PR} y2={yv} stroke={gridColor} strokeWidth="1" />
            <text x={PL - 5} y={yv + 4} textAnchor="end" fontSize="9" fill={labelColor}>UGX {g}k</text>
          </g>
        );
      })}
      {/* Bars */}
      {revenueData.map((d, i) => (
        <g key={d.month}>
          <rect x={bx(i)} y={by(d.v)} width={barW} height={bh(d.v)} fill={barColor} rx="4" />
          <text x={bx(i) + barW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill={labelColor}>{d.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Navigation ───────────────────────────────────────────────

const NAV_ITEMS: { id: Page; label: string; Icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard",   label: "Dashboard",  Icon: LayoutDashboard },
  { id: "units",       label: "Units",       Icon: Building2 },
  { id: "tenants",     label: "Tenants",     Icon: Users },
  { id: "payments",    label: "Payments",    Icon: CreditCard, badge: "1" },
  { id: "leases",      label: "Leases",      Icon: FileText },
  { id: "maintenance", label: "Maintenance", Icon: Wrench, badge: "2" },
  { id: "reports",     label: "Reports",     Icon: BarChart3 },
  { id: "settings",    label: "Settings",    Icon: Settings },
];

const BOTTOM_NAV = NAV_ITEMS.slice(0, 4);
const MORE_NAV   = NAV_ITEMS.slice(4);

// ─── Top bar ──────────────────────────────────────────────────

function TopBar({
  activePage, collapsed, setCollapsed, dark, setDark, onLogout,
}: {
  activePage: Page; collapsed: boolean; setCollapsed: (v: boolean) => void;
  dark: boolean; setDark: (v: boolean) => void; onLogout: () => void;
}) {
  const [notif, setNotif]   = useState(false);
  const [user,  setUser]    = useState(false);
  const label = NAV_ITEMS.find(n => n.id === activePage)?.label ?? "APT Manager";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      {/* Mobile */}
      <div className="lg:hidden h-14 flex items-center px-4 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{label}</span>
        </div>
        <div className="relative flex-shrink-0">
          <button onClick={() => { setNotif(!notif); setUser(false); }} className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell size={19} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          {notif && <NotifPanel onClose={() => setNotif(false)} />}
        </div>
        <div className="relative flex-shrink-0">
          <button onClick={() => { setUser(!user); setNotif(false); }} className="w-10 h-10 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold">TR</div>
          </button>
          {user && <UserPanel dark={dark} setDark={setDark} onLogout={onLogout} onClose={() => setUser(false)} />}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex h-16 items-center px-4 gap-3">
        <div className="flex items-center gap-2.5 flex-shrink-0 transition-all" style={{ minWidth: collapsed ? 52 : 224 }}>
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Menu size={18} />
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Building2 size={13} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">APT Manager</span>
            </div>
          )}
        </div>
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input placeholder="Search units, tenants…" className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
          </div>
        </div>
        <div className="flex-1" />
        <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div className="relative">
          <button onClick={() => { setNotif(!notif); setUser(false); }} className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          {notif && <NotifPanel onClose={() => setNotif(false)} />}
        </div>
        <div className="relative ml-1">
          <button onClick={() => { setUser(!user); setNotif(false); }} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-xs font-bold">TR</div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden xl:block">Taban Riak</span>
            <ChevronDown size={13} className="text-slate-400 dark:text-slate-500 hidden xl:block" />
          </button>
          {user && <UserPanel dark={dark} setDark={setDark} onLogout={onLogout} onClose={() => setUser(false)} />}
        </div>
      </div>
    </header>
  );
}

function NotifPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-[100]">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</span>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">3 new</span>
        </div>
        {[
          { t: "Payment overdue",     d: "James Porter · Unit 302",  dot: "bg-red-500"   },
          { t: "Lease expiring soon", d: "Priya Sharma · Unit 201",  dot: "bg-amber-500" },
          { t: "Maintenance request", d: "HVAC Malfunction · Unit 203", dot: "bg-blue-500" },
        ].map((n, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800">
            <div className={`w-2 h-2 ${n.dot} rounded-full mt-1.5 flex-shrink-0`} />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.t}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.d}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function UserPanel({ dark, setDark, onLogout, onClose }: {
  dark: boolean; setDark: (v: boolean) => void; onLogout: () => void; onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-[100] py-1">
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Taban Riak</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Administrator</p>
        </div>
        <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
          {dark ? <Sun size={14} className="text-slate-400 dark:text-slate-500" /> : <Moon size={14} className="text-slate-400 dark:text-slate-500" />}
          {dark ? "Light mode" : "Dark mode"}
        </button>
        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Settings size={14} className="text-slate-400 dark:text-slate-500" />Settings
        </button>
        <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
          <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut size={14} />Sign out
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Desktop sidebar ──────────────────────────────────────────

function Sidebar({ active, setActive, collapsed }: {
  active: Page; setActive: (p: Page) => void; collapsed: boolean;
}) {
  return (
    <aside className={`hidden lg:flex fixed top-16 left-0 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex-col transition-all duration-200 z-40 ${collapsed ? "w-16" : "w-60"}`}>
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const on = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${on ? "bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 dark:text-slate-100"}`}
            >
              <item.Icon size={17} className={`flex-shrink-0 ${on ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"}`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.badge}</span>}
                </>
              )}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-emerald-50 dark:bg-emerald-900/25 rounded-xl p-3.5 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 bg-emerald-600 rounded-md flex items-center justify-center">
                <Star size={11} className="text-white" />
              </div>
              <span className="text-xs font-bold text-emerald-700">Pro Plan</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Parkview Residences</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">48 units · San Francisco</p>
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────

function BottomNav({ active, setActive, onMore }: {
  active: Page; setActive: (p: Page) => void; onMore: () => void;
}) {
  const isMore = MORE_NAV.some(n => n.id === active);
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
      <div className="flex items-stretch h-16 px-1">
        {BOTTOM_NAV.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} className="flex-1 flex flex-col items-center justify-center gap-1 relative">
              {on && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-emerald-50 dark:bg-emerald-900/250 rounded-full" />}
              <div className={`p-1.5 rounded-xl ${on ? "bg-emerald-50 dark:bg-emerald-900/25" : ""}`}>
                <item.Icon size={22} className={on ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"} />
              </div>
              <span className={`text-[10px] font-semibold leading-none ${on ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"}`}>{item.label}</span>
            </button>
          );
        })}
        <button onClick={onMore} className="flex-1 flex flex-col items-center justify-center gap-1 relative">
          {isMore && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-emerald-50 dark:bg-emerald-900/250 rounded-full" />}
          <div className={`p-1.5 rounded-xl ${isMore ? "bg-emerald-50 dark:bg-emerald-900/25" : ""}`}>
            <LayoutGrid size={22} className={isMore ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"} />
          </div>
          <span className={`text-[10px] font-semibold leading-none ${isMore ? "text-emerald-600" : "text-slate-400 dark:text-slate-500"}`}>More</span>
        </button>
      </div>
    </nav>
  );
}

// ─── More drawer ──────────────────────────────────────────────

function MoreDrawer({ active, setActive, onClose, onLogout, dark, setDark }: {
  active: Page; setActive: (p: Page) => void; onClose: () => void;
  onLogout: () => void; dark: boolean; setDark: (v: boolean) => void;
}) {
  const grid = [
    { id: "leases"      as Page, label: "Leases",      Icon: FileText,  bg: "bg-blue-100",   ic: "text-blue-600"   },
    { id: "maintenance" as Page, label: "Maintenance",  Icon: Wrench,    bg: "bg-amber-100",  ic: "text-amber-600", badge: "2" },
    { id: "reports"     as Page, label: "Reports",      Icon: BarChart3, bg: "bg-violet-100", ic: "text-violet-600" },
    { id: "settings"    as Page, label: "Settings",     Icon: Settings,  bg: "bg-slate-100 dark:bg-slate-800",  ic: "text-slate-600 dark:text-slate-400"  },
  ];
  return (
    <>
      <div className="lg:hidden fixed inset-0 bg-black/40 z-[80]" onClick={onClose} />
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl z-[90] shadow-2xl">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0">TR</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Taban Riak</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">Parkview Residences · Admin</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <X size={16} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 px-5 py-5">
          {grid.map(item => {
            const on = active === item.id;
            return (
              <button key={item.id} onClick={() => { setActive(item.id); onClose(); }} className={`flex flex-col items-center gap-2 py-3.5 rounded-2xl transition-all active:scale-95 relative ${on ? "bg-emerald-50 dark:bg-emerald-900/25 ring-1 ring-emerald-200" : "bg-slate-50 dark:bg-slate-800"}`}>
                {item.badge && <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{item.badge}</span>}
                <div className={`w-10 h-10 ${on ? "bg-emerald-100" : item.bg} rounded-2xl flex items-center justify-center`}>
                  <item.Icon size={18} className={on ? "text-emerald-600" : item.ic} />
                </div>
                <span className={`text-[11px] font-semibold ${on ? "text-emerald-700" : "text-slate-600 dark:text-slate-400"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="px-5 pb-6 space-y-2">
          <button onClick={() => setDark(!dark)} className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                {dark ? <Sun size={15} className="text-slate-600 dark:text-slate-400" /> : <Moon size={15} className="text-slate-600 dark:text-slate-400" />}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{dark ? "Light mode" : "Dark mode"}</span>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors ${dark ? "bg-emerald-50 dark:bg-emerald-900/250" : "bg-slate-200 dark:bg-slate-700"}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${dark ? "translate-x-5" : "translate-x-1"}`} />
            </div>
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3.5 bg-red-50 rounded-2xl">
            <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut size={15} className="text-red-600" />
            </div>
            <span className="text-sm font-semibold text-red-600">Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Dashboard ────────────────────────────────────────────────

function DashboardPage() {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-5 text-white">
        <p className="text-xs font-semibold text-emerald-200 uppercase tracking-widest mb-1">Good morning</p>
        <h1 className="text-2xl font-bold">Taban Riak</h1>
        <p className="text-sm text-emerald-100 mt-1">Parkview Residences · 48 units</p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
          {[[formatCurrency(82400), "Revenue"], ["75%", "Occupancy"], ["2", "Alerts"]].map(([v, l], i) => (
            <div key={l} className="flex items-center gap-4">
              {i > 0 && <div className="w-px h-8 bg-white/20" />}
              <div>
                <p className={`text-xl font-bold ${i === 2 ? "text-amber-300" : ""}`}>{v}</p>
                <p className="text-xs text-emerald-200">{l}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Total Units",    value: "48",      trend: "+2",    up: true,  Icon: Building2,  ibg: "bg-slate-100 dark:bg-slate-800",   ic: "text-slate-600 dark:text-slate-400"   },
          { title: "Occupied",       value: "36",      trend: "+4.3%", up: true,  Icon: Home,       ibg: "bg-emerald-100", ic: "text-emerald-600" },
          { title: "Vacant",         value: "8",       trend: "-1.2%", up: false, Icon: Key,        ibg: "bg-amber-100",   ic: "text-amber-600"   },
          { title: "Revenue",        value: formatCurrency(82400), trend: "+8.7%", up: true,  Icon: DollarSign, ibg: "bg-blue-100",    ic: "text-blue-600"    },
        ].map(c => (
          <div key={c.title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 ${c.ibg} rounded-xl flex items-center justify-center`}>
                <c.Icon size={15} className={c.ic} />
              </div>
              <span className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${c.up ? "bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {c.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{c.trend}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">{c.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{c.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Revenue 2024</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Monthly trend</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/25 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp size={11} />+8.7%</span>
        </div>
        <LineChart />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Occupancy</h3>
        <div className="space-y-3">
          {[
            { label: "Occupied", value: 36, total: 48, color: "bg-emerald-500 dark:bg-emerald-400" },
            { label: "Vacant",   value: 8,  total: 48, color: "bg-amber-400"  },
            { label: "Reserved", value: 4,  total: 48, color: "bg-blue-400"   },
          ].map(row => (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.label}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{row.value}<span className="text-slate-400 dark:text-slate-500 font-normal text-xs"> / {row.total}</span></span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${row.color} rounded-full`} style={{ width: `${(row.value / row.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Activity</h2>
          <button className="text-xs font-semibold text-emerald-600 min-h-[44px] flex items-center">See all</button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
          {activityFeed.map(item => (
            <div key={item.id} className="flex items-center gap-3.5 px-4 py-3.5">
              <div className={`w-9 h-9 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <item.Icon size={16} className={item.ic} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{item.detail}</p>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0 font-medium">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Units ────────────────────────────────────────────────────

function UnitsPage() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [modal,  setModal]    = useState(false);
  const [form,   setForm]     = useState({ number: "", floor: "", bedrooms: "1", bathrooms: "1", rent: "", status: "Vacant" });

  const rows = unitsData.filter(u => {
    const q = search.toLowerCase();
    return (search === "" || u.number.includes(search) || u.tenant.toLowerCase().includes(q))
      && (filter === "All" || u.status === filter);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Units</h1>
        <div className="flex gap-2">
          <GhostBtn icon={<Download size={13} />} onClick={() => {}}>Export</GhostBtn>
          <PrimaryBtn icon={<Plus size={14} />} sm onClick={() => setModal(true)}>Add Unit</PrimaryBtn>
        </div>
      </div>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search units or tenants…"
          className="w-full pl-9 pr-3 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 min-h-[44px]" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {["All", "Occupied", "Vacant", "Maintenance"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 min-h-[36px] ${filter === s ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {rows.map(u => (
          <div key={u.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">#{u.number}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Floor {u.floor}</span>
              </div>
              <Badge status={u.status} />
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <Pill label="Size" value={u.bedrooms === 0 ? "Studio" : `${u.bedrooms}BR`} />
              <Pill label="Rent" value={formatCurrency(u.rent)} />
              <Pill label="Baths" value={`${u.bathrooms}BA`} />
            </div>
            {u.tenant && (
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-50">
                <Avatar initials={u.tenant.split(" ").map(n => n[0]).join("")} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">{u.tenant}</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"><Eye size={15} /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              {["Unit #", "Floor", "Size", "Rent", "Status", "Tenant", ""].map((c, i) => (
                <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {rows.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100 font-mono text-sm">{u.number}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">Floor {u.floor}</td>
                <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400">{u.bedrooms === 0 ? "Studio" : `${u.bedrooms}BR/${u.bathrooms}BA`}</td>
                <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(u.rent)}<span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/mo</span></td>
                <td className="px-4 py-3.5"><Badge status={u.status} /></td>
                <td className="px-4 py-3.5">
                  {u.tenant ? (
                    <div className="flex items-center gap-2">
                      <Avatar initials={u.tenant.split(" ").map(n => n[0]).join("")} />
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{u.tenant}</span>
                    </div>
                  ) : <span className="text-sm text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {[Eye, Edit].map((I, i) => <button key={i} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300"><I size={13} /></button>)}
                    <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-500"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100]">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Add New Unit</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-4">
              {[{ label: "Unit #", key: "number", type: "text", ph: "e.g. 501" }, { label: "Floor", key: "floor", type: "number", ph: "e.g. 5" }].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <input type={f.type} value={(form as Record<string, string>)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 min-h-[44px]" />
                </div>
              ))}
              {[
                { label: "Bedrooms", key: "bedrooms", opts: [["0","Studio"],["1","1 Bed"],["2","2 Bed"],["3","3 Bed"]] },
                { label: "Bathrooms", key: "bathrooms", opts: [["1","1 Bath"],["2","2 Bath"],["3","3 Bath"]] },
                { label: "Status", key: "status", opts: [["Vacant","Vacant"],["Occupied","Occupied"],["Maintenance","Maintenance"]] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{f.label}</label>
                  <select value={(form as Record<string, string>)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 min-h-[44px]">
                    {f.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Rent (UGX/mo)</label>
                <input type="number" value={form.rent} onChange={e => setForm({ ...form, rent: e.target.value })} placeholder="e.g. 2400"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 min-h-[44px]" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button onClick={() => setModal(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
              <button onClick={() => setModal(false)} className="flex-1 py-3 bg-emerald-600 rounded-xl text-sm font-semibold text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5"><Check size={14} />Save Unit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tenants ──────────────────────────────────────────────────

function TenantsPage() {
  const [search, setSearch] = useState("");
  const [sel, setSel]       = useState<typeof tenantsData[0] | null>(null);
  const rows = tenantsData.filter(t => {
    const q = search.toLowerCase();
    return search === "" || t.name.toLowerCase().includes(q) || t.unit.includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Tenants</h1>
        <PrimaryBtn icon={<Plus size={14} />} sm>Add Tenant</PrimaryBtn>
      </div>
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or unit…"
          className="w-full pl-9 pr-3 py-2.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 min-h-[44px]" />
      </div>

      <div className="lg:hidden space-y-3">
        {rows.map(t => (
          <button key={t.id} onClick={() => setSel(t)} className="w-full text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm active:scale-[0.99] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Avatar initials={t.initials} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{t.email}</p>
              </div>
              <Badge status={t.leaseStatus} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Pill label="Unit" value={`#${t.unit}`} />
              <Pill label="Phone" value={t.phone.slice(-8)} />
              <Pill label="Since" value={t.moveIn.split(",")[0]} />
            </div>
          </button>
        ))}
      </div>

      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              {["Tenant","Phone","Email","Unit","Status","Move-in",""].map((c, i) => (
                <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {rows.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><Avatar initials={t.initials} /><span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.name}</span></div></td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{t.phone}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{t.email}</td>
                <td className="px-4 py-3.5"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold font-mono">#{t.unit}</span></td>
                <td className="px-4 py-3.5"><Badge status={t.leaseStatus} /></td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{t.moveIn}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setSel(t)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300"><Eye size={13} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300"><Edit size={13} /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-500"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel && (
        <>
          <div className="fixed inset-0 bg-black/30 z-[90]" onClick={() => setSel(null)} />
          <div className="fixed inset-0 sm:inset-auto sm:right-0 sm:top-0 sm:bottom-0 sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-[100] flex flex-col border-l border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Tenant Profile</h2>
              <button onClick={() => setSel(null)} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col items-center text-center px-5 py-6 border-b border-slate-100 dark:border-slate-800">
                <Avatar initials={sel.initials} size="lg" />
                <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100">{sel.name}</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-2 mt-0.5">Since {sel.moveIn}</p>
                <Badge status={sel.leaseStatus} />
              </div>
              <div className="px-5 py-5 space-y-5">
                {[{ I: Mail, v: sel.email }, { I: Phone, v: sel.phone }].map(item => (
                  <div key={item.v} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm"><item.I size={14} className="text-slate-500 dark:text-slate-400" /></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.v}</span>
                  </div>
                ))}
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">Unit #{sel.unit}</span>
                    <Badge status="Occupied" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[["Bedrooms","2 BR"],["Bathrooms","1 BA"],["Floor","1st"],["Rent",`${formatCurrency(1800)}/mo`]].map(([l,v]) => (
                      <div key={l}><p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{l}</p><p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{v}</p></div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Payment History</p>
                  {["Jun 2024","May 2024","Apr 2024","Mar 2024"].map(mo => (
                    <div key={mo} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{mo}</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatCurrency(1800)}</span>
                      <Badge status="Paid" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"><Edit size={14} />Edit</button>
              <button className="flex-1 py-3 bg-emerald-600 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-1.5"><FileText size={14} />View Lease</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Leases ───────────────────────────────────────────────────

function LeasesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Leases</h1>
        <PrimaryBtn icon={<Plus size={14} />} sm>New Lease</PrimaryBtn>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[["Active","6","text-emerald-600","bg-emerald-50 dark:bg-emerald-900/25"],["Expiring","2","text-amber-600","bg-amber-50"],["Expired","1","text-slate-500 dark:text-slate-400","bg-slate-100 dark:bg-slate-800"]].map(([l,v,c,bg]) => (
          <div key={l} className={`${bg} rounded-2xl p-4`}>
            <p className={`text-2xl font-bold ${c}`}>{v}</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{l}</p>
          </div>
        ))}
      </div>
      <div className="lg:hidden space-y-3">
        {leasesData.map(l => (
          <div key={l.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Avatar initials={l.tenant.split(" ").map(n => n[0]).join("")} />
                <div><p className="text-sm font-bold text-slate-900 dark:text-slate-100">{l.tenant}</p><p className="text-xs text-slate-400 dark:text-slate-500">Unit #{l.unit}</p></div>
              </div>
              <Badge status={l.status} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Pill label="Start" value={l.start.split(",")[0]} />
              <Pill label="End" value={l.end.split(",")[0]} />
              <Pill label="Rent" value={formatCurrency(l.rent)} />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">{["Tenant","Unit","Start","End","Rent","Status",""].map((c,i) => <th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {leasesData.map(l => (
              <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 group">
                <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><Avatar initials={l.tenant.split(" ").map(n=>n[0]).join("")} /><span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{l.tenant}</span></div></td>
                <td className="px-4 py-3.5"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold font-mono">#{l.unit}</span></td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{l.start}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{l.end}</td>
                <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(l.rent)}<span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/mo</span></td>
                <td className="px-4 py-3.5"><Badge status={l.status} /></td>
                <td className="px-4 py-3.5"><div className="flex gap-0.5 opacity-0 group-hover:opacity-100">{[Eye,Edit].map((I,i)=><button key={i} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300"><I size={13}/></button>)}<button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-500"><Trash2 size={13}/></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Payments ─────────────────────────────────────────────────

function PaymentsPage() {
  const collected   = paymentsData.filter(p => p.status === "Paid").reduce((a, p) => a + p.amount, 0);
  const outstanding = paymentsData.filter(p => p.status === "Pending").reduce((a, p) => a + p.amount, 0);
  const overdue     = paymentsData.filter(p => p.status === "Overdue").reduce((a, p) => a + p.amount, 0);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Payments</h1>
        <PrimaryBtn icon={<Plus size={14} />} sm>Record</PrimaryBtn>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[[formatCurrency(collected),"Collected","text-emerald-600","bg-emerald-50 dark:bg-emerald-900/25"],[formatCurrency(outstanding),"Pending","text-blue-600","bg-blue-50"],[formatCurrency(overdue),"Overdue","text-red-600","bg-red-50"]].map(([v,l,c,bg]) => (
          <div key={l} className={`${bg} rounded-2xl p-4`}><p className={`text-lg font-bold ${c} truncate`}>{v}</p><p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{l}</p></div>
        ))}
      </div>
      <div className="lg:hidden space-y-3">
        {paymentsData.map(p => (
          <div key={p.id} className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-sm ${p.status === "Overdue" ? "border-red-200" : "border-slate-100 dark:border-slate-800"}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Avatar initials={p.tenant.split(" ").map(n=>n[0]).join("")} />
                <div><p className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.tenant}</p><p className="text-xs text-slate-400 dark:text-slate-500">Unit #{p.unit}</p></div>
              </div>
              <div className="text-right"><p className="text-base font-bold text-slate-900 dark:text-slate-100">{formatCurrency(p.amount)}</p><Badge status={p.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3"><Pill label="Due" value={p.due} /><Pill label="Paid" value={p.paid} /></div>
          </div>
        ))}
      </div>
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">{["Tenant","Unit","Amount","Due","Paid","Status",""].map((c,i)=><th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {paymentsData.map(p=>(
              <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800 group ${p.status==="Overdue"?"bg-red-50/30":""}`}>
                <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><Avatar initials={p.tenant.split(" ").map(n=>n[0]).join("")}/><span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.tenant}</span></div></td>
                <td className="px-4 py-3.5"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold font-mono">#{p.unit}</span></td>
                <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{p.due}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{p.paid}</td>
                <td className="px-4 py-3.5"><Badge status={p.status}/></td>
                <td className="px-4 py-3.5"><div className="flex gap-0.5 opacity-0 group-hover:opacity-100"><button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300"><Eye size={13}/></button><button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300"><MoreHorizontal size={13}/></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Maintenance ──────────────────────────────────────────────

function MaintenancePage() {
  const open = maintenanceData.filter(m => m.status === "Open").length;
  const prog = maintenanceData.filter(m => m.status === "In Progress").length;
  const done = maintenanceData.filter(m => m.status === "Completed").length;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Maintenance</h1>
        <PrimaryBtn icon={<Plus size={14} />} sm>New Request</PrimaryBtn>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[[open,"Open","text-blue-600","bg-blue-50"],[prog,"In Progress","text-amber-600","bg-amber-50"],[done,"Completed","text-emerald-600","bg-emerald-50 dark:bg-emerald-900/25"]].map(([v,l,c,bg])=>(
          <div key={String(l)} className={`${bg} rounded-2xl p-4`}><p className={`text-2xl font-bold ${c}`}>{v}</p><p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{l}</p></div>
        ))}
      </div>
      <div className="lg:hidden space-y-3">
        {maintenanceData.map(req=>(
          <div key={req.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0"><Wrench size={14} className="text-slate-500 dark:text-slate-400"/></div>
                <div><p className="text-sm font-bold text-slate-900 dark:text-slate-100">{req.title}</p><p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{req.assignee}</p></div>
              </div>
              <Badge status={req.priority}/>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Pill label="Unit" value={req.unit}/>
              <Pill label="Status" value={req.status}/>
              <Pill label="Date" value={req.date}/>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">{["Request","Unit","Priority","Assigned","Status","Date",""].map((c,i)=><th key={i} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {maintenanceData.map(req=>(
              <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 group">
                <td className="px-4 py-3.5"><div className="flex items-center gap-2.5"><div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0"><Wrench size={13} className="text-slate-500 dark:text-slate-400"/></div><span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{req.title}</span></div></td>
                <td className="px-4 py-3.5"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold">{req.unit}</span></td>
                <td className="px-4 py-3.5"><Badge status={req.priority}/></td>
                <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{req.assignee}</td>
                <td className="px-4 py-3.5"><Badge status={req.status}/></td>
                <td className="px-4 py-3.5 text-xs text-slate-400 dark:text-slate-500 font-medium">{req.date}</td>
                <td className="px-4 py-3.5"><div className="flex gap-0.5 opacity-0 group-hover:opacity-100">{[Eye,Edit].map((I,i)=><button key={i} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 dark:text-slate-300"><I size={13}/></button>)}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────

function ReportsPage({ dark }: { dark: boolean }) {
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Reports</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {[
          { title: "Revenue Report",    desc: "Monthly and annual revenue breakdown", Icon: DollarSign, ib: "bg-emerald-100", ic: "text-emerald-600" },
          { title: "Occupancy Report",  desc: "Unit occupancy rates and trends",       Icon: Building2,  ib: "bg-blue-100",    ic: "text-blue-600"   },
          { title: "Maintenance Report",desc: "Request volume and resolution times",   Icon: Wrench,     ib: "bg-amber-100",   ic: "text-amber-600"  },
          { title: "Tenant Report",     desc: "Retention and payment reliability",     Icon: Users,      ib: "bg-violet-100",  ic: "text-violet-600" },
        ].map(r => (
          <button key={r.title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm flex items-start gap-3 hover:border-emerald-300 transition-all text-left group active:scale-[0.99]">
            <div className={`w-10 h-10 ${r.ib} rounded-2xl flex items-center justify-center flex-shrink-0`}><r.Icon size={18} className={r.ic}/></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">{r.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{r.desc}</p>
            </div>
            <ArrowUpRight size={15} className="text-slate-300 group-hover:text-emerald-500 transition-colors mt-0.5 flex-shrink-0"/>
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Annual Revenue 2024</h3><p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Monthly collected rent</p></div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/25 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp size={11}/>+8.7% YoY</span>
        </div>
        <BarChart dark={dark} />
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────

function SettingsPage() {
  const [tab, setTab] = useState("company");
  const tabs = [
    { id: "company",  label: "Company",  Icon: Building2 },
    { id: "security", label: "Security", Icon: Shield     },
    { id: "billing",  label: "Billing",  Icon: CreditCard },
    { id: "users",    label: "Users",    Icon: Users      },
  ];
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Settings</h1>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 -mx-4 px-4 lg:mx-0 lg:px-0">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 min-h-[44px] ${tab === t.id ? "bg-emerald-600 text-white" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
            <t.Icon size={13}/>{t.label}
          </button>
        ))}
      </div>
      {tab === "company" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-5">Company Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[["Company Name","Parkview Residences LLC"],["Contact Email","admin@parkviewresidences.com"],["Phone","(415) 555-0200"],["Address","123 Park Ave, San Francisco"],["City","San Francisco"],["ZIP","94102"]].map(([l,v]) => (
              <div key={l}><label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{l}</label><input defaultValue={v} className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 min-h-[44px]"/></div>
            ))}
          </div>
          <div className="flex justify-end mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-5 py-3 text-sm"><Check size={14}/>Save Changes</button>
          </div>
        </div>
      )}
      {tab === "security" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-5">Security Settings</h3>
          <div className="space-y-1">
            {[
              { label: "Two-Factor Auth",  desc: "Authenticator app or SMS", enabled: true,  Icon: Shield },
              { label: "Login Alerts",     desc: "Email on each new login",  enabled: true,  Icon: Bell   },
              { label: "Session Timeout",  desc: "Auto sign-out after 30m",  enabled: false, Icon: Lock   },
              { label: "API Access",       desc: "Third-party integrations", enabled: false, Icon: Zap    },
            ].map((s, i, arr) => (
              <div key={s.label} className={`flex items-center justify-between py-4 min-h-[68px] ${i<arr.length-1?"border-b border-slate-50":""}`}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0"><s.Icon size={15} className="text-slate-500 dark:text-slate-400"/></div>
                  <div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.label}</p><p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.desc}</p></div>
                </div>
                <div className={`w-11 h-6 rounded-full relative flex-shrink-0 ml-4 cursor-pointer transition-colors ${s.enabled?"bg-emerald-50 dark:bg-emerald-900/250":"bg-slate-200 dark:bg-slate-700"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${s.enabled?"translate-x-5":"translate-x-1"}`}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(tab === "billing" || tab === "users") && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 shadow-sm flex flex-col items-center max-w-2xl">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4"><Settings size={22} className="text-slate-400 dark:text-slate-500"/></div>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{tabs.find(t2=>t2.id===tab)?.label} Settings</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Coming soon</p>
        </div>
      )}
    </div>
  );
}

// ─── Auth ─────────────────────────────────────────────────────

function AuthPage({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode]   = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [name,  setName]  = useState("");
  const [co,    setCo]    = useState("");
  const field = "w-full px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[52px]";
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950">
      <div className="hidden lg:flex w-[480px] flex-shrink-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex-col justify-between p-12 relative overflow-hidden">
        {[160,280,400,520].map(s=><div key={s} className="absolute rounded-full border border-white/10 pointer-events-none" style={{width:s,height:s,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>)}
        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center"><Building2 size={16} className="text-white"/></div>
          <span className="text-white font-bold text-lg">APT Manager</span>
        </div>
        <div className="relative space-y-8">
          <div><h2 className="text-4xl font-bold text-white leading-tight">Property management made effortless.</h2><p className="text-emerald-100/80 mt-3 text-base leading-relaxed">The modern platform for landlords who want full control.</p></div>
          <div className="space-y-3">{["Manage all units from one dashboard","Automate rent collection","Track maintenance in real-time","Generate reports instantly"].map(item=><div key={item} className="flex items-center gap-3"><div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white"/></div><span className="text-sm text-white/80">{item}</span></div>)}</div>
          <div className="bg-white/10 rounded-2xl p-5 border border-white/20"><div className="flex items-start gap-3 mb-3"><div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">MR</div><div><p className="text-white text-sm font-semibold">Michael Reed</p><p className="text-white/60 text-xs">Reed &amp; Co Properties</p></div></div><p className="text-white/80 text-sm leading-relaxed">"APT Manager transformed how we handle our 120-unit portfolio."</p></div>
        </div>
        <div className="relative flex items-center gap-8">{[["120+","Properties"],["4,800+","Units"],["99.9%","Uptime"]].map(([v,l])=><div key={l}><p className="text-2xl font-bold text-white">{v}</p><p className="text-xs text-white/60 mt-0.5">{l}</p></div>)}</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen lg:min-h-0">
        <div className="lg:hidden flex items-center gap-2 mb-8 self-start">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center"><Building2 size={14} className="text-white"/></div>
          <span className="font-bold text-slate-900 dark:text-slate-100">APT Manager</span>
        </div>
        <div className="w-full max-w-[400px]">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{mode==="login"?"Welcome back":"Create account"}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 mb-7">{mode==="login"?"Sign in to your dashboard":"Start your 14-day free trial"}</p>
          <div className="space-y-3">
            {mode==="register"&&<>
              <div><label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Taban Riak" className={field}/></div>
              <div><label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label><input value={co} onChange={e=>setCo(e.target.value)} placeholder="Parkview Properties" className={field}/></div>
            </>}
            <div><label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email address</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" type="email" className={field}/></div>
            <div>
              <div className="flex items-center justify-between mb-1.5"><label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>{mode==="login"&&<button className="text-xs text-emerald-600 font-semibold">Forgot password?</button>}</div>
              <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" type="password" className={field}/>
            </div>
            <button onClick={onLogin} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl text-sm mt-1 min-h-[56px]">
              {mode==="login"?"Sign In →":"Start Free Trial →"}
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
            {mode==="login"?"No account? ":"Have one? "}<button onClick={()=>setMode(mode==="login"?"register":"login")} className="text-emerald-600 font-semibold hover:underline">{mode==="login"?"Start free trial":"Sign in"}</button>
          </p>
          {mode==="login"&&<button onClick={onLogin} className="w-full mt-3 py-3.5 border-2 border-dashed border-emerald-300 text-emerald-600 text-xs font-bold rounded-2xl hover:bg-emerald-50 dark:bg-emerald-900/25 dark:hover:bg-emerald-900/20">⚡ Demo — Enter dashboard</button>}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────

export default function App() {
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [page,      setPage]      = useState<Page>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [dark,      setDark]      = useState(false);
  const [moreOpen,  setMoreOpen]  = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  if (!loggedIn) return <AuthPage onLogin={() => setLoggedIn(true)} />;

  const renderPage = () => {
    switch (page) {
      case "dashboard":   return <DashboardPage />;
      case "units":       return <UnitsPage />;
      case "tenants":     return <TenantsPage />;
      case "leases":      return <LeasesPage />;
      case "payments":    return <PaymentsPage />;
      case "maintenance": return <MaintenancePage />;
      case "reports":     return <ReportsPage dark={dark} />;
      case "settings":    return <SettingsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar activePage={page} collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} setDark={setDark} onLogout={() => setLoggedIn(false)} />
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} />
      <BottomNav active={page} setActive={p => { setPage(p); setMoreOpen(false); }} onMore={() => setMoreOpen(true)} />
      {moreOpen && <MoreDrawer active={page} setActive={setPage} onClose={() => setMoreOpen(false)} onLogout={() => setLoggedIn(false)} dark={dark} setDark={setDark} />}
      <main className={`pt-14 pb-20 lg:pt-16 lg:pb-0 transition-all duration-200 ${collapsed ? "lg:ml-16" : "lg:ml-60"}`}>
        <div className="px-4 py-5 lg:px-6 lg:py-6 max-w-[1300px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
