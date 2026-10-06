import { useState, useRef, useEffect } from "react";
import {
  Home, BookOpen, FileText, Calendar, Bell, User,
  BarChart2, TrendingUp, AlertTriangle, List,
  ChevronRight, ChevronDown, Plus, Eye, Download, Upload, Send,
  CheckCircle, X, Search, Filter, MoreHorizontal,
  Edit2, Paperclip, Clock, LogOut, ArrowUpRight,
  Layers, RefreshCw, PlayCircle, Lock, Check,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Role = "learner" | "lecturer" | "pm";
type AssignmentStatus = "draft" | "published" | "closed";
type SubmissionStatus = "not_started" | "submitted" | "late" | "graded";
type PmTab = "overview" | "assignments" | "participants";

interface CrumbItem { label: string; nav?: string }

interface ReviewsContext {
  name: string; task: string; course: string; edition: string;
}

interface Scenario {
  assignmentStatus: AssignmentStatus;
  submissionStatus: SubmissionStatus;
  submissionFile: string | null;
  submittedAt: string | null;
  grade: number | null;
  gradeLetter: string | null;
  feedbackText: string | null;
  gradedAt: string | null;
}

interface Notif {
  id: string; text: string; time: string; read: boolean; deepLink?: string;
}

interface Actions {
  publishAssignment: () => void;
  submitWork: (file: string) => void;
  publishGrade: (grade: number, letter: string, feedback: string) => void;
  markNotifRead: (id: string) => void;
}

interface NavParams {
  filter?: string; pmTab?: PmTab; pmHighlight?: string | null;
}

// ── Static config ──────────────────────────────────────────────────────────────

const NAV: Record<Role, { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[]> = {
  learner: [
    { id: "l-dashboard",     label: "Dashboard",      icon: Home },
    { id: "l-courses",       label: "My Courses",     icon: BookOpen },
    { id: "l-assignments",   label: "Assignments",    icon: FileText },
    { id: "l-calendar",      label: "Calendar",       icon: Calendar },
    { id: "l-notifications", label: "Notifications",  icon: Bell },
    { id: "l-account",       label: "Account",        icon: User },
  ],
  lecturer: [
    { id: "lec-dashboard",     label: "Dashboard",      icon: Home },
    { id: "lec-courses",       label: "My Courses",     icon: BookOpen },
    { id: "lec-reviews",       label: "Reviews",        icon: List },
    { id: "lec-calendar",      label: "Calendar",       icon: Calendar },
    { id: "lec-notifications", label: "Notifications",  icon: Bell },
    { id: "lec-account",       label: "Account",        icon: User },
  ],
  pm: [
    { id: "pm-operations",    label: "Operations",        icon: BarChart2 },
    { id: "pm-courses",       label: "Courses & Editions", icon: Layers },
    { id: "pm-schedule",      label: "Schedule",          icon: Calendar },
    { id: "pm-reports",       label: "Reports",           icon: TrendingUp },
    { id: "pm-issues",        label: "Issues",            icon: AlertTriangle },
    { id: "pm-notifications", label: "Notifications",     icon: Bell },
    { id: "pm-account",       label: "Account",           icon: User },
  ],
};

const NAV_PARENT: Record<string, string> = { "l-workspace": "l-courses" };

const DEFAULT_NAV: Record<Role, string> = {
  learner: "l-dashboard", lecturer: "lec-dashboard", pm: "pm-operations",
};
const ROLE_LABELS: Record<Role, string> = {
  learner: "Student", lecturer: "Lecturer", pm: "PM / Course Manager",
};
const NOTIF_SCREEN: Record<Role, string> = {
  learner: "l-notifications", lecturer: "lec-notifications", pm: "pm-notifications",
};

const WIDE_SCREENS = new Set([
  "lec-reviews", "pm-operations", "pm-courses", "pm-reports", "pm-issues", "pm-schedule",
]);

const INITIAL_NOTIFS: Notif[] = [
  { id: "n0", text: "Online session — Pandas and NumPy — tomorrow at 09:00", time: "yesterday", read: false },
];

const CREDS: Record<Role, string> = {
  learner: "piotr.jablonski@gmail.com",
  lecturer: "jan.nowak@gloria.pl",
  pm: "anna.kowalska@gloria.pl",
};

// ── Breadcrumbs ────────────────────────────────────────────────────────────────

function computeBreadcrumbs(nav: string, reviewsCtx: ReviewsContext | null): CrumbItem[] {
  if (nav === "lec-reviews") {
    if (reviewsCtx) {
      return [
        { label: "Courses", nav: "lec-courses" },
        { label: reviewsCtx.course, nav: "lec-courses" },
        { label: reviewsCtx.edition, nav: "lec-courses" },
        { label: "Assignments" },
        { label: reviewsCtx.task },
        { label: "Submission" },
        { label: reviewsCtx.name },
      ];
    }
    return [
      { label: "Courses", nav: "lec-courses" },
      { label: "Python for Data Analysts", nav: "lec-courses" },
      { label: "Edition 2025/1", nav: "lec-courses" },
      { label: "Assignments" },
    ];
  }
  const map: Record<string, CrumbItem[]> = {
    "l-dashboard":       [{ label: "Courses", nav: "l-courses" }, { label: "Python for Data Analysts", nav: "l-workspace" }, { label: "Edition 2025/1" }],
    "l-courses":         [{ label: "Courses" }],
    "l-workspace":       [{ label: "Courses", nav: "l-courses" }, { label: "Python for Data Analysts" }, { label: "Edition 2025/1" }],
    "l-assignments":     [{ label: "Courses", nav: "l-courses" }, { label: "Python for Data Analysts", nav: "l-workspace" }, { label: "Edition 2025/1", nav: "l-workspace" }, { label: "Module 3", nav: "l-workspace" }, { label: "Assignment 2" }],
    "l-calendar":        [{ label: "Calendar" }],
    "l-notifications":   [{ label: "Notifications" }],
    "l-account":         [{ label: "Account" }],
    "lec-dashboard":     [{ label: "Courses", nav: "lec-courses" }, { label: "Python for Data Analysts" }, { label: "Edition 2025/1" }],
    "lec-courses":       [{ label: "Courses", nav: "lec-courses" }, { label: "Python for Data Analysts" }, { label: "Edition 2025/1" }, { label: "Course Management" }],
    "lec-calendar":      [{ label: "Calendar" }],
    "lec-notifications": [{ label: "Notifications" }],
    "lec-account":       [{ label: "Account" }],
    "pm-operations":     [{ label: "Operations" }],
    "pm-courses":        [{ label: "Courses", nav: "pm-courses" }, { label: "Python for Data Analysts" }, { label: "Edition 2025/1" }],
    "pm-schedule":       [{ label: "Courses", nav: "pm-courses" }, { label: "Python for Data Analysts" }, { label: "Edition 2025/1" }, { label: "Schedule" }],
    "pm-reports":        [{ label: "Reports" }],
    "pm-issues":         [{ label: "Issues" }],
    "pm-notifications":  [{ label: "Notifications" }],
    "pm-account":        [{ label: "Account" }],
  };
  return map[nav] ?? [{ label: nav }];
}

// ── Design primitives ──────────────────────────────────────────────────────────

type BadgeColor = "navy" | "orange" | "green" | "gray" | "red";

function Badge({ children, color = "navy" }: { children: React.ReactNode; color?: BadgeColor }) {
  const c: Record<BadgeColor, string> = {
    navy:   "bg-blue-100 text-blue-800",
    orange: "bg-amber-100 text-amber-800",
    green:  "bg-emerald-100 text-emerald-800",
    gray:   "bg-slate-100 text-slate-600",
    red:    "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c[color]}`}>
      {children}
    </span>
  );
}

function Btn({
  children, variant = "primary", onClick, className = "", disabled = false, size = "md",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const base = "inline-flex items-center gap-1.5 font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm" };
  const v = {
    primary:   "bg-blue-700 text-white hover:bg-blue-800",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    ghost:     "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
    danger:    "bg-white text-red-600 border border-red-200 hover:bg-red-50",
  };
  return (
    <button className={`${base} ${sizes[size]} ${v[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function MetricRow({ label, value, sub, alert, onClick }: { label: string; value: string; sub?: string; alert?: boolean; onClick?: () => void }) {
  return (
    <div
      className={`flex flex-col gap-0.5 py-4 px-5 ${alert ? "cursor-pointer hover:bg-amber-50/50" : ""} transition-colors`}
      onClick={onClick}
    >
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-bold tabular-nums ${alert ? "text-amber-700" : "text-slate-900"}`}>{value}</span>
      {sub && <span className={`text-xs ${alert ? "text-amber-600 font-medium" : "text-slate-500"}`}>{sub}</span>}
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "blue" }: { value: number; max?: number; color?: "blue" | "emerald" | "amber" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const c = { blue: "bg-blue-600", emerald: "bg-emerald-500", amber: "bg-amber-500" };
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c[color]}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 tabular-nums w-8 text-right">{pct}%</span>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500" {...props} />
    </div>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" {...props} />
    </div>
  );
}

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-[22px] font-bold text-slate-900 leading-tight tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{children}</p>;
}

function MvpScreen({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
        <Calendar size={18} className="text-slate-400" />
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500 mt-0.5">Screen visible as product context.</p>
      </div>
      <Badge color="gray">MVP</Badge>
    </div>
  );
}

function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex border-b border-slate-200">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            active === t.id
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Status badges ──────────────────────────────────────────────────────────────

function AssignmentBadge({ status }: { status: AssignmentStatus }) {
  if (status === "draft")     return <Badge color="gray">draft</Badge>;
  if (status === "published") return <Badge color="green">published</Badge>;
  return <Badge color="navy">closed</Badge>;
}

function SubmissionBadge({ status }: { status: SubmissionStatus }) {
  if (status === "not_started") return <Badge color="gray">not started</Badge>;
  if (status === "submitted")   return <Badge color="navy">submitted</Badge>;
  if (status === "late")        return <Badge color="orange">late</Badge>;
  return <Badge color="green">graded</Badge>;
}

// ── Prototype panel (shared inner content) ────────────────────────────────────

interface ProtoState {
  activeRole: Role | null; debugRole: Role; scenario: Scenario;
  learnerNotifs: Notif[]; lecturerUnread: boolean;
  onRoleSwitch: (r: Role) => void; onReset: () => void;
  isOpen: boolean; onToggle: () => void;
}

function ProtoPanelContent({ activeRole, debugRole, scenario, learnerNotifs, lecturerUnread, onRoleSwitch, onReset, onToggle, chevronUp }: ProtoState & { chevronUp?: boolean }) {
  const displayRole = activeRole ?? debugRole;
  const unread = learnerNotifs.filter(n => !n.read).length;
  return (
    <div className="bg-[#0d1117] text-slate-200 rounded-xl shadow-2xl border border-slate-700/80 w-72 overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#161b22] border-b border-slate-700/60">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="text-amber-400">⚙</span> Prototype Controls
        </span>
        <button onClick={onToggle} className="text-slate-600 hover:text-slate-300">
          <ChevronDown size={14} className={chevronUp ? "rotate-180" : ""} />
        </button>
      </div>
      <div className="px-3.5 py-3 border-b border-slate-700/40">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Log in as</p>
        <div className="flex gap-1.5">
          {(["learner", "lecturer", "pm"] as Role[]).map(r => (
            <button key={r} onClick={() => onRoleSwitch(r)}
              className={`flex-1 py-1.5 rounded text-[11px] font-semibold transition-all border ${
                displayRole === r
                  ? "bg-amber-500/90 text-black border-amber-400/80"
                  : "bg-[#21262d] text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200"
              }`}>
              {r === "pm" ? "PM" : r === "lecturer" ? "Lecturer" : "Student"}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-2">{CREDS[displayRole]}</p>
      </div>
      <div className="px-3.5 py-3 border-b border-slate-700/40">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Scenario state</p>
        <div className="space-y-1.5">
          {[
            { k: "assignment", v: scenario.assignmentStatus },
            { k: "submission", v: scenario.submissionStatus },
            ...(scenario.grade !== null ? [{ k: "grade", v: `${scenario.grade} pts · ${scenario.gradeLetter}` }] : []),
            { k: "learner notifs", v: `${unread} unread` },
            { k: "lecturer notif", v: lecturerUnread ? "1 new submission" : "—" },
          ].map(row => (
            <div key={row.k} className="flex justify-between gap-3">
              <span className="text-[10px] text-slate-600 shrink-0">{row.k}</span>
              <span className="text-[11px] text-slate-300 font-medium text-right truncate">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3.5 py-2.5">
        <button onClick={onReset}
          className="w-full py-1.5 rounded text-[11px] font-semibold bg-red-950/60 text-red-400 border border-red-900/60 hover:bg-red-900/60 transition-colors flex items-center justify-center gap-1.5">
          <RefreshCw size={11} /> Reset scenario
        </button>
      </div>
    </div>
  );
}

// Login-screen floating prototype controls (bottom-left corner)
function PrototypeControlsFloat(props: ProtoState) {
  return (
    <div className="fixed bottom-16 left-4 z-50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {props.isOpen ? (
        <ProtoPanelContent {...props} />
      ) : (
        <button onClick={props.onToggle}
          className="bg-[#0d1117] text-slate-500 hover:text-amber-400 border border-slate-700/80 hover:border-amber-600/40 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all shadow-lg flex items-center gap-1.5">
          <span className="text-amber-500/80">⚙</span> Prototype
        </button>
      )}
    </div>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────────

function Sidebar({
  role, currentNav, onNav, onLogout,
  pendingReviews, learnerUnread, lecturerUnread,
}: {
  role: Role; currentNav: string; onNav: (id: string) => void; onLogout: () => void;
  pendingReviews: number; learnerUnread: number; lecturerUnread: number;
}) {
  const activeNavId = NAV_PARENT[currentNav] ?? currentNav;

  function getBadge(id: string) {
    const count =
      (role === "lecturer" && id === "lec-reviews"       && pendingReviews > 0) ? pendingReviews :
      (role === "learner"  && id === "l-notifications"   && learnerUnread > 0)  ? learnerUnread :
      (role === "lecturer" && id === "lec-notifications" && lecturerUnread > 0) ? lecturerUnread :
      0;
    if (!count) return null;
    return (
      <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-semibold tabular-nums">
        {count}
      </span>
    );
  }

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center">
            <BookOpen size={13} className="text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">Gloria</span>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 leading-tight">{ROLE_LABELS[role]}</p>
      </div>
      <nav className="flex-1 p-2 space-y-px overflow-y-auto">
        {NAV[role].map(item => {
          const active = activeNavId === item.id;
          return (
            <button key={item.id} onClick={() => onNav(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2.5 ${
                active
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}>
              <item.icon size={16} className="shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {getBadge(item.id)}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 px-2 py-2">
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
          <LogOut size={15} className="shrink-0" /> Sign out
        </button>
      </div>
    </aside>
  );
}

function Header({
  crumbs, role, learnerUnread, lecturerUnread, onNavNotifications, onNavigate, onNavAccount,
}: {
  crumbs: CrumbItem[]; role: Role; learnerUnread: number; lecturerUnread: number;
  onNavNotifications: () => void; onNavigate: (s: string) => void; onNavAccount: () => void;
}) {
  const unread = role === "learner" ? learnerUnread : role === "lecturer" ? lecturerUnread : 0;
  const initials = role === "pm" ? "AK" : role === "lecturer" ? "JN" : "PJ";
  return (
    <div className="flex items-center justify-between px-5 h-10 border-b border-slate-200 bg-white shrink-0">
      <nav className="flex items-center gap-1 overflow-x-auto min-w-0">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={i} className="flex items-center gap-1 shrink-0">
              {i > 0 && <ChevronRight size={10} className="text-slate-300" />}
              {!isLast && c.nav ? (
                <button onClick={() => onNavigate(c.nav!)}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors focus:outline-none">
                  {c.label}
                </button>
              ) : (
                <span className={`text-sm ${isLast ? "text-slate-800 font-medium" : "text-slate-400"}`}>{c.label}</span>
              )}
            </span>
          );
        })}
      </nav>
      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        <button onClick={onNavNotifications}
          className="relative p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <Bell size={16} className="text-slate-500" />
          {unread > 0 && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-amber-500 rounded-full" />}
        </button>
        <button onClick={onNavAccount}
          className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          {initials}
        </button>
      </div>
    </div>
  );
}

// ── LEARNER: Course Edition Workspace ─────────────────────────────────────────

function LearnerCourseWorkspace({ scenario, navigate }: { scenario: Scenario; navigate: (s: string) => void }) {
  const modules = [
    {
      id: "m1", num: 1, title: "Introduction to Python",
      date: "03 Feb 2025", mode: "online" as const, status: "completed" as const,
      materials: ["Python_Fundamentals.pdf", "Module_1_Slides.pptx"],
      assignment: { id: "a1", title: "Assignment 1", grade: "82 pts · B+", subStatus: "graded" as SubmissionStatus },
    },
    {
      id: "m2", num: 2, title: "Data Structures",
      date: "10 Feb 2025", mode: "in person" as const, status: "completed" as const,
      materials: ["Module_2_Slides.pptx", "Data_Structures_Exercises.zip"],
      assignment: null,
    },
    {
      id: "m3", num: 3, title: "Pandas and NumPy",
      date: "17 Feb 2025", mode: "online" as const, status: "current" as const,
      materials: ["Pandas_NumPy_Handbook.pdf", "Module_3_Slides.pptx", "Sales_Data_2024.xlsx"],
      assignment: { id: "a2", title: "Assignment 2 — Pandas Data Analysis", isScenario: true },
    },
    {
      id: "m4", num: 4, title: "Data Visualization",
      date: "24 Feb 2025", mode: "in person" as const, status: "upcoming" as const,
      materials: [], assignment: null,
    },
    {
      id: "m5", num: 5, title: "Final Project",
      date: "10 Mar 2025", mode: "in person" as const, status: "upcoming" as const,
      materials: [], assignment: null,
    },
  ] as const;

  const completed = modules.filter(m => m.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <PageTitle title="Python for Data Analysts" subtitle="Jan Nowak · Edition 2025/1 · 03 Feb – 28 Mar 2025" />
          <div className="flex items-center gap-2 mt-3">
            <Badge color="green">active</Badge>
            <Badge color="gray">hybrid</Badge>
            <span className="text-sm text-slate-500">{completed} of {modules.length} modules completed</span>
          </div>
        </div>
        <div className="shrink-0 w-32 pt-1">
          <ProgressBar value={completed} max={modules.length} color="blue" />
        </div>
      </div>

      {scenario.assignmentStatus === "published" && scenario.submissionStatus === "not_started" && (
        <div className="flex items-center justify-between gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div>
            <p className="font-semibold text-blue-900">Open assignment awaiting submission</p>
            <p className="text-sm text-blue-700 mt-0.5">Assignment 2 — Pandas Data Analysis · deadline: 17 Feb 2025, 23:59</p>
          </div>
          <Btn onClick={() => navigate("l-assignments")} className="shrink-0">
            Submit work <ArrowUpRight size={14} />
          </Btn>
        </div>
      )}
      {scenario.submissionStatus === "graded" && (
        <div className="flex items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">Assignment 2 has been graded</p>
              <p className="text-sm text-emerald-700 mt-0.5">{scenario.grade} pts · {scenario.gradeLetter} · {scenario.gradedAt}</p>
            </div>
          </div>
          <Btn variant="secondary" onClick={() => navigate("l-assignments")} className="shrink-0">
            View grade <ArrowUpRight size={14} />
          </Btn>
        </div>
      )}
      {scenario.submissionStatus === "submitted" && (
        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <Clock size={18} className="text-slate-400 shrink-0" />
          <div>
            <p className="font-medium text-slate-700">Work submitted — awaiting grade</p>
            <p className="text-sm text-slate-500 mt-0.5 font-mono">{scenario.submissionFile} · {scenario.submittedAt}</p>
          </div>
        </div>
      )}

      <div>
        <SectionLabel>Course schedule</SectionLabel>
        <div className="mt-4 relative">
          {modules.map((mod, idx) => {
            const isDone     = mod.status === "completed";
            const isCurrent  = mod.status === "current";
            const isUpcoming = mod.status === "upcoming";
            const isLast     = idx === modules.length - 1;

            return (
              <div key={mod.id} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                    isDone    ? "bg-emerald-500 text-white" :
                    isCurrent ? "bg-blue-700 text-white ring-4 ring-blue-100" :
                    "bg-white border-2 border-slate-300 text-slate-400"
                  }`}>
                    {isDone    ? <Check size={14} strokeWidth={2.5} /> :
                     isCurrent ? <PlayCircle size={14} /> :
                     <Lock size={12} />}
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1 mb-1 min-h-[24px]" />}
                </div>

                <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
                  <div className="flex items-start justify-between gap-2 -mt-0.5">
                    <div>
                      <p className={`font-semibold ${isUpcoming ? "text-slate-400" : "text-slate-900"}`}>
                        Module {mod.num}: {mod.title}
                      </p>
                      <p className={`text-sm mt-0.5 ${isUpcoming ? "text-slate-400" : "text-slate-500"}`}>
                        {mod.date} · {mod.mode}
                      </p>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {isDone    && <Badge color="green">completed</Badge>}
                      {isCurrent && <Badge color="navy">current</Badge>}
                    </div>
                  </div>

                  {(isDone || isCurrent) && (
                    <div className="mt-3 space-y-2">
                      {mod.materials.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {mod.materials.map(m => (
                            <span key={m} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors font-mono">
                              {m} <Download size={10} />
                            </span>
                          ))}
                        </div>
                      )}

                      {mod.assignment && (
                        "isScenario" in mod.assignment && mod.assignment.isScenario ? (
                          <button
                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm ${
                              scenario.assignmentStatus === "published" ? "border-blue-200 bg-white hover:border-blue-300" :
                              scenario.assignmentStatus === "draft"     ? "border-slate-200 bg-slate-50 opacity-60" :
                              "border-slate-200 bg-white"
                            }`}
                            onClick={() => navigate("l-assignments")}
                            disabled={scenario.assignmentStatus === "draft"}>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900">Assignment 2 — Pandas Data Analysis</p>
                              <p className="text-sm text-slate-500 mt-0.5">Deadline: 17 Feb 2025, 23:59</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <AssignmentBadge status={scenario.assignmentStatus} />
                              {scenario.submissionStatus !== "not_started" && <SubmissionBadge status={scenario.submissionStatus} />}
                              {scenario.submissionStatus === "graded" && scenario.grade && <Badge color="green">{scenario.grade} pts</Badge>}
                            </div>
                            {scenario.assignmentStatus !== "draft" && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{mod.assignment.title}</p>
                            </div>
                            {"grade" in mod.assignment && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <SubmissionBadge status="graded" />
                                <Badge color="green">{mod.assignment.grade as string}</Badge>
                              </div>
                            )}
                          </div>
                        )
                      )}

                      {isCurrent && scenario.assignmentStatus === "published" && scenario.submissionStatus === "not_started" && (
                        <Btn onClick={() => navigate("l-assignments")} size="sm">
                          Open Assignment 2 <ChevronRight size={13} />
                        </Btn>
                      )}
                    </div>
                  )}

                  {isUpcoming && (
                    <p className="mt-1 text-sm text-slate-400">
                      Materials published by the lecturer before class.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── LEARNER SCREENS ───────────────────────────────────────────────────────────

function LearnerDashboard({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200">
        <PageTitle title="Welcome, Piotr" subtitle="Your progress in the active course" />
      </div>
      <div className="grid grid-cols-4 divide-x divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
        <MetricRow label="Course Progress" value="40%" sub="2 of 5 modules" />
        <MetricRow label="Assignments"     value="1 / 3" sub="submitted" />
        <MetricRow label="Attendance"      value="100%" sub="all classes" />
        <MetricRow label="Avg. Score"      value="82 pts" sub="Assignment 1" />
      </div>
      <div>
        <SectionLabel>Active course</SectionLabel>
        <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">Python for Data Analysts</p>
              <p className="text-sm text-slate-500 mt-0.5">Edition 2025/1 · Jan Nowak</p>
            </div>
            <Badge color="green">active</Badge>
          </div>
          <div className="px-5 pb-3"><ProgressBar value={2} max={5} color="blue" /></div>
          <div className="divide-y divide-slate-100">
            {[
              { mod: "Module 1", title: "Introduction to Python", done: true,  active: false },
              { mod: "Module 2", title: "Data Structures",        done: true,  active: false },
              { mod: "Module 3", title: "Pandas i NumPy",          done: false, active: true  },
              { mod: "Module 4", title: "Data Visualization",     done: false, active: false },
              { mod: "Module 5", title: "Final Project",          done: false, active: false },
            ].map(m => (
              <div key={m.mod} className={`flex items-center gap-3 px-5 py-2.5 ${m.active ? "bg-blue-50/50" : ""}`}>
                {m.done ? <Check size={14} className="text-emerald-500 shrink-0" /> :
                 m.active ? <PlayCircle size={14} className="text-blue-600 shrink-0" /> :
                 <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />}
                <span className="text-xs text-slate-400 w-16 shrink-0">{m.mod}</span>
                <span className={`flex-1 text-sm ${m.done || m.active ? "text-slate-900" : "text-slate-400"} ${m.active ? "font-medium" : ""}`}>{m.title}</span>
                {m.active && <Badge color="navy">current</Badge>}
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-slate-100">
            <button className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline" onClick={() => navigate("l-workspace")}>
              Open course schedule <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LearnerMyCourses({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200">
        <PageTitle title="My Courses" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: "Python for Data Analysts", progress: 2, max: 5, edition: "2025/1", next: "17 Feb, 09:00" },
          { title: "Agile Project Management", progress: 1, max: 4, edition: "2025/1", next: "20 Feb, 14:00" },
        ].map(c => (
          <button key={c.title}
            className="text-left p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all group"
            onClick={() => navigate("l-workspace")}>
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{c.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">Edition {c.edition}</p>
              </div>
              <Badge color="green">active</Badge>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Progress</span><span className="tabular-nums">{c.progress}/{c.max} modules</span>
            </div>
            <ProgressBar value={c.progress} max={c.max} color="blue" />
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>Next: {c.next}</span>
              <span className="text-blue-600 font-medium flex items-center gap-1">Open <ChevronRight size={13} /></span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function LearnerAssignments({ scenario, actions }: { scenario: Scenario; actions: Actions }) {
  const [selectedId, setSelectedId] = useState<string>("a2");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState(false);

  const assignments = [
    { id: "a1", module: "Module 1", title: "Assignment 1 — Introduction to Python", deadline: "10 Feb 2025",        aStatus: "closed"    as AssignmentStatus, sStatus: "graded"      as SubmissionStatus },
    { id: "a2", module: "Module 3", title: "Assignment 2 — Pandas Data Analysis",    deadline: "17 Feb 2025, 23:59", aStatus: scenario.assignmentStatus,    sStatus: scenario.submissionStatus },
    { id: "a3", module: "Module 4", title: "Assignment 3 — Data Visualization",      deadline: "24 Feb 2025, 23:59", aStatus: "draft"     as AssignmentStatus, sStatus: "not_started" as SubmissionStatus },
  ];

  const sel  = assignments.find(a => a.id === selectedId)!;
  const isSc = selectedId === "a2";
  const curSub = isSc ? scenario.submissionStatus : sel.sStatus;

  function handleSubmit() {
    if (!uploadedFile) { setUploadError(true); return; }
    actions.submitWork(uploadedFile);
    setUploadError(false);
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200">
        <PageTitle title="Assignments" subtitle="Python for Data Analysts · Edition 2025/1" />
      </div>
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-1.5">
          {assignments.map(a => (
            <button key={a.id} onClick={() => setSelectedId(a.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedId === a.id
                  ? "border-blue-500 bg-blue-50/60 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
              }`}>
              <p className="text-xs text-slate-400">{a.module}</p>
              <p className="font-medium text-slate-900 mt-0.5">{a.title}</p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <AssignmentBadge status={a.aStatus} />
                {a.sStatus !== "not_started" && <SubmissionBadge status={a.sStatus} />}
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {sel.aStatus === "draft" ? (
            <div className="p-8 flex flex-col items-center text-center gap-3 border border-slate-200 rounded-xl bg-white">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock size={18} className="text-slate-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Assignment not yet published</p>
                <p className="text-sm text-slate-500 mt-0.5">The lecturer has not yet published this assignment.</p>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">{sel.module}</p>
                    <h3 className="font-semibold text-slate-900 mt-0.5">{sel.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <AssignmentBadge status={sel.aStatus} />
                    {curSub !== "not_started" && <SubmissionBadge status={curSub} />}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
                  <Clock size={13} className="shrink-0" /> <span>Deadline: {sel.deadline}</span>
                </div>
              </div>

              {selectedId !== "a1" && (
                <div className="px-5 py-4 text-sm text-slate-600 leading-relaxed bg-slate-50/60 border-b border-slate-100">
                  Analyze the provided sales dataset. Use{" "}
                  <code className="font-mono text-xs bg-white border border-slate-200 px-1 rounded">groupby</code> and{" "}
                  <code className="font-mono text-xs bg-white border border-slate-200 px-1 rounded">pivot_table</code>{" "}
                  for aggregation. Prepare at least two clear charts.
                </div>
              )}

              {selectedId === "a1" || (isSc && scenario.submissionStatus === "graded") ? (
                <div className="px-5 py-4 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div>
                      <p className="font-semibold text-emerald-900">
                        {selectedId === "a1" ? "Grade: B+ · 82 pts" : `Grade: ${scenario.gradeLetter} · ${scenario.grade} pts`}
                      </p>
                      <p className="text-sm text-emerald-700 mt-0.5">
                        {selectedId === "a1" ? "Graded: 08 Feb 2025" : `Graded: ${scenario.gradedAt}`}
                      </p>
                    </div>
                    <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Lecturer feedback</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {selectedId === "a1" ? "Good work! The code is correct and well documented." : scenario.feedbackText}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">— Jan Nowak</p>
                  </div>
                </div>
              ) : isSc && scenario.submissionStatus === "submitted" ? (
                <div className="px-5 py-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle size={16} className="text-blue-600 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-900">Work submitted successfully</p>
                      <p className="text-sm text-blue-700 mt-0.5 font-mono">{scenario.submissionFile} · {scenario.submittedAt}</p>
                    </div>
                    <SubmissionBadge status="submitted" />
                  </div>
                  <p className="text-sm text-slate-400 text-center mt-3">Awaiting lecturer's grade…</p>
                </div>
              ) : sel.aStatus === "closed" ? (
                <div className="px-5 py-4 text-sm text-slate-500 text-center">
                  Submission deadline has passed. Assignment closed.
                </div>
              ) : (
                <div className="px-5 py-4 space-y-3">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) { setUploadedFile(f.name); setUploadError(false); }
                  }} />
                  {uploadedFile ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <Paperclip size={14} className="text-slate-500 shrink-0" />
                      <span className="flex-1 text-sm font-mono text-slate-700 truncate">{uploadedFile}</span>
                      <button onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                        <X size={14} className="text-slate-400 hover:text-slate-700" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 transition-colors focus:outline-none ${
                        uploadError ? "border-red-400 bg-red-50/50" : "border-slate-300"
                      }`}>
                      <Upload size={22} className={`mx-auto mb-2 ${uploadError ? "text-red-500" : "text-slate-400"}`} />
                      <p className={`font-medium ${uploadError ? "text-red-600" : "text-slate-600"}`}>
                        {uploadError ? "Select a file before submitting" : "Choose a file or drag it here"}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">.ipynb · .py · .pdf · max 20 MB</p>
                    </button>
                  )}
                  <Btn onClick={handleSubmit} className="w-full justify-center">
                    <Send size={14} /> Submit work
                  </Btn>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LearnerNotifications({ notifs, onMarkRead, navigate }: {
  notifs: Notif[]; onMarkRead: (id: string) => void; navigate: (s: string) => void;
}) {
  function handleClick(n: Notif) {
    if (!n.read) onMarkRead(n.id);
    if (n.deepLink) navigate(n.deepLink);
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-5 border-b border-slate-200">
        <PageTitle title="Notifications" />
        <span className="text-sm text-slate-500">{notifs.filter(n => !n.read).length} unread</span>
      </div>
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
        {notifs.length === 0 && <p className="px-5 py-10 text-sm text-center text-slate-400">No notifications.</p>}
        {[...notifs].reverse().map(n => (
          <div key={n.id}
            className={`flex items-start gap-3 px-5 py-4 transition-colors ${n.deepLink ? "cursor-pointer hover:bg-slate-50" : ""} ${!n.read ? "bg-blue-50/30" : ""}`}
            onClick={() => handleClick(n)}>
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-blue-600" : "bg-slate-300"}`} />
            <div className="flex-1">
              <p className={`text-sm ${!n.read ? "font-medium text-slate-900" : "text-slate-700"}`}>{n.text}</p>
              <p className="text-xs text-slate-400 mt-1">{n.time}</p>
            </div>
            {n.deepLink && <ArrowUpRight size={14} className="text-blue-500 shrink-0 mt-0.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LECTURER SCREENS ───────────────────────────────────────────────────────────

function LecturerDashboard({ scenario, navigate }: { scenario: Scenario; navigate: (s: string, p?: NavParams) => void }) {
  const pending = scenario.submissionStatus === "submitted" ? 1 : 0;
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200">
        <PageTitle title="Good morning, dr Jan Nowak" subtitle="Course overview" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
        <MetricRow label="Courses" value="3" sub="active editions" />
        <MetricRow label="Participants" value="85" sub="total" />
        <MetricRow label="To Review" value={String(pending + 11)}
          sub={pending > 0 ? `including ${pending} new` : "pending"} alert={pending > 0}
          onClick={() => navigate("lec-reviews", { filter: "submitted" })} />
      </div>
      {pending > 0 && (
        <button
          className="w-full flex items-center gap-3 p-4 bg-white border border-amber-200 border-l-4 border-l-amber-400 rounded-xl text-left hover:bg-amber-50/40 transition-colors"
          onClick={() => navigate("lec-reviews", { filter: "submitted" })}>
          <AlertTriangle size={16} className="text-amber-600 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-slate-900">New submission: Piotr Jabłoński — Assignment 2</p>
            <p className="text-sm text-slate-500 mt-0.5">Python for Data Analysts · Edition 2025/1</p>
          </div>
          <ArrowUpRight size={14} className="text-amber-600 shrink-0" />
        </button>
      )}
      <div>
        <SectionLabel>Assigned courses</SectionLabel>
        <div className="mt-3 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {[
            { title: "Python for Data Analysts", participants: 28, pendingLocal: pending + 8, next: "tomorrow, 09:00" },
            { title: "Data Analysis in R",       participants: 22, pendingLocal: 3,            next: "Tue, 14:00" },
            { title: "Excel zaawansowany",            participants: 35, pendingLocal: 0,            next: "Wed, 10:00" },
          ].map(c => (
            <div key={c.title} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer" onClick={() => navigate("lec-courses")}>
              <BookOpen size={16} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{c.title}</p>
                <p className="text-sm text-slate-500">{c.participants} participants · next: {c.next}</p>
              </div>
              {c.pendingLocal > 0 && <Badge color="orange">{c.pendingLocal} pending</Badge>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LecturerMyCourses({ scenario, actions }: { scenario: Scenario; actions: Actions }) {
  const [tab, setTab] = useState<"assignments" | "materials">("assignments");
  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200">
        <p className="text-sm text-slate-500">Python for Data Analysts · Edition 2025/1</p>
        <PageTitle title="Course Management" />
      </div>
      <Tabs
        tabs={[{ id: "assignments", label: "Assignments" }, { id: "materials", label: "Materials" }]}
        active={tab} onChange={t => setTab(t as typeof tab)}
      />
      {tab === "assignments" && (
        <div className="space-y-3">
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {[
              { id: "a1", title: "Assignment 1 — Introduction to Python", status: "closed" as AssignmentStatus, deadline: "10 Feb" },
              { id: "a2", title: "Assignment 2 — Pandas Data Analysis",   status: scenario.assignmentStatus,    deadline: "17 Feb" },
              { id: "a3", title: "Assignment 3 — Data Visualization",      status: "draft" as AssignmentStatus, deadline: "24 Feb" },
            ].map(a => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-500">Deadline: {a.deadline}</p>
                </div>
                <AssignmentBadge status={a.status} />
                {a.id === "a2" && a.status === "draft" && (
                  <Btn onClick={actions.publishAssignment} size="sm"><Send size={14} /> Publish</Btn>
                )}
                {a.id === "a2" && a.status !== "draft" && (
                  <span className="text-sm text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle size={14} /> Published
                  </span>
                )}
              </div>
            ))}
          </div>
          <Btn variant="secondary" size="sm"><Plus size={14} /> New assignment</Btn>
        </div>
      )}
      {tab === "materials" && (
        <div className="space-y-3">
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
            {["Skrypt_Pandas_NumPy.pdf", "Prezentacja_tydzien3.pptx", "Dane_sprzedaz_2024.xlsx"].map(f => (
              <div key={f} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex-1">
                  <p className="font-mono text-sm text-slate-900">{f}</p>
                </div>
                <Badge color="green">published</Badge>
                <Btn variant="ghost" size="sm" className="px-2"><Edit2 size={14} /></Btn>
              </div>
            ))}
          </div>
          <Btn variant="secondary" size="sm"><Plus size={14} /> Add material</Btn>
        </div>
      )}
    </div>
  );
}

// ── LECTURER REVIEWS ──────────────────────────────────────────────────────────

interface FullSub {
  id: string; learner: string; course: string; edition: string;
  assignment: string; assignmentId: string;
  submittedAt: string | null; file: string | null;
  status: SubmissionStatus; isScenario: boolean;
}

function buildSubmissions(scenario: Scenario): FullSub[] {
  return [
    { id: "pj", learner: "Piotr Jabłoński",  course: "Python for Data Analysts", edition: "2025/1", assignment: "Assignment 2 — Pandas Analysis", assignmentId: "a2", submittedAt: scenario.submittedAt, file: scenario.submissionFile, status: scenario.submissionStatus, isScenario: true },
    { id: "kw", learner: "Karolina Wróbel",  course: "Python for Data Analysts", edition: "2025/1", assignment: "Assignment 2 — Pandas Analysis", assignmentId: "a2", submittedAt: "11 Feb, 18:20", file: "kwrobel_analysis.py",  status: "submitted", isScenario: false },
    { id: "tl", learner: "Tomasz Lewicki",   course: "Python for Data Analysts", edition: "2025/1", assignment: "Assignment 2 — Pandas Analysis", assignmentId: "a2", submittedAt: "10 Feb, 09:15", file: "tlewicki_assignment2.ipynb", status: "graded", isScenario: false },
    { id: "ab", learner: "Anna Brzezińska",  course: "Python for Data Analysts", edition: "2025/1", assignment: "Assignment 1 — Introduction",     assignmentId: "a1", submittedAt: "08 Feb, 22:01", file: null, status: "late", isScenario: false },
    { id: "kr", learner: "Karol Różański",   course: "Data Analysis in R",       edition: "2025/1", assignment: "Assignment 1 — R Fundamentals",   assignmentId: "r1", submittedAt: "05 Feb, 14:30", file: "kr_assignment1.R", status: "submitted", isScenario: false },
    { id: "mb", learner: "Marta Baranowska", course: "Data Analysis in R",       edition: "2025/1", assignment: "Assignment 1 — R Fundamentals",   assignmentId: "r1", submittedAt: "04 Feb, 20:10", file: "mbaranowska.R", status: "graded", isScenario: false },
  ].filter(s => s.status !== "not_started");
}

const GRADE_OPTIONS = [
  { value: "5",  label: "5 (excellent)" },
  { value: "4+", label: "4+ (good+)" },
  { value: "4",  label: "4 (good)" },
  { value: "3",  label: "3 (pass)" },
  { value: "2",  label: "2 (fail)" },
];

function LecturerReviews({ scenario, actions, initialFilter, onSelectSubmission }: {
  scenario: Scenario; actions: Actions; initialFilter: string;
  onSelectSubmission: (ctx: ReviewsContext | null) => void;
}) {
  const allSubs = buildSubmissions(scenario);
  const courses     = Array.from(new Set(allSubs.map(s => s.course)));
  const editions    = Array.from(new Set(allSubs.map(s => s.edition)));
  const assignments = Array.from(new Set(allSubs.map(s => s.assignment)));

  const [courseFilter,  setCourseFilter]  = useState("all");
  const [editionFilter, setEditionFilter] = useState("all");
  const [assignFilter,  setAssignFilter]  = useState("all");
  const [statusFilter,  setStatusFilter]  = useState(initialFilter);
  const [selectedId,    setSelectedId]    = useState<string | null>(
    scenario.submissionStatus !== "not_started" ? "pj" : null
  );
  const [gradeVal,       setGradeVal]       = useState("82");
  const [letterVal,      setLetterVal]      = useState("4+");
  const [feedbackVal,    setFeedbackVal]    = useState("Good data analysis. The code is clear and well commented. Consider using seaborn instead of matplotlib for more readable visualizations.");
  const [gradePublished, setGradePublished] = useState(false);

  useEffect(() => { setStatusFilter(initialFilter); }, [initialFilter]);

  useEffect(() => {
    if (selectedId !== null) {
      const s = allSubs.find(x => x.id === selectedId);
      if (s) onSelectSubmission({ name: s.learner, task: s.assignment, course: s.course, edition: s.edition });
    }
    return () => onSelectSubmission(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = allSubs.filter(s =>
    (courseFilter  === "all" || s.course     === courseFilter)  &&
    (editionFilter === "all" || s.edition    === editionFilter) &&
    (assignFilter  === "all" || s.assignment === assignFilter)  &&
    (statusFilter  === "all" || s.status     === statusFilter)
  );

  const sub = allSubs.find(s => s.id === selectedId) ?? null;
  const subVisible = sub && filtered.some(s => s.id === selectedId);
  const activeFilters = [courseFilter, editionFilter, assignFilter, statusFilter].filter(f => f !== "all").length;

  function selectSub(s: FullSub) {
    setSelectedId(s.id);
    onSelectSubmission({ name: s.learner, task: s.assignment, course: s.course, edition: s.edition });
  }

  function handlePublish() {
    actions.publishGrade(parseInt(gradeVal) || 82, letterVal, feedbackVal);
    setGradePublished(true);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between pb-5 border-b border-slate-200">
        <PageTitle title="Reviews" subtitle="Submitted work overview" />
        <span className="text-sm text-slate-500 mt-1.5">{filtered.length} results</span>
      </div>

      <div className="flex items-center gap-2 flex-wrap py-1">
        <Filter size={14} className="text-slate-400 shrink-0" />
        {[
          { value: courseFilter,  onChange: setCourseFilter,  options: courses,     placeholder: "Course" },
          { value: editionFilter, onChange: setEditionFilter, options: editions,    placeholder: "Edition" },
          { value: assignFilter,  onChange: setAssignFilter,  options: assignments, placeholder: "Assignment" },
        ].map((f, i) => (
          <select key={i} value={f.value} onChange={e => f.onChange(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All ({f.placeholder.toLowerCase()}s)</option>
            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All statuses</option>
          <option value="submitted">Awaiting review</option>
          <option value="graded">Graded</option>
          <option value="late">Late</option>
        </select>
        {activeFilters > 0 && (
          <button onClick={() => { setCourseFilter("all"); setEditionFilter("all"); setAssignFilter("all"); setStatusFilter("all"); }}
            className="text-sm text-blue-600 hover:underline font-medium">
            Clear ({activeFilters})
          </button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            {filtered.length === 0 && (
              <p className="px-5 py-8 text-sm text-center text-slate-400">No results for selected filters</p>
            )}
            {filtered.map((s, i) => (
              <button key={s.id} onClick={() => selectSub(s)}
                className={`w-full text-left px-4 py-3 transition-colors ${i > 0 ? "border-t border-slate-100" : ""} ${
                  selectedId === s.id
                    ? "bg-blue-50 border-l-2 border-l-blue-600"
                    : "hover:bg-slate-50 border-l-2 border-l-transparent"
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{s.learner}</p>
                    <p className="text-sm text-slate-500 truncate mt-0.5">{s.assignment}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.course} · Edition {s.edition}</p>
                  </div>
                  <SubmissionBadge status={s.status} />
                </div>
                {s.submittedAt && (
                  <p className="text-xs text-slate-400 mt-1.5 font-mono flex items-center gap-1">
                    <Clock size={10} /> {s.submittedAt}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-3">
          {!sub || !subVisible ? (
            <div className="p-10 flex flex-col items-center justify-center text-center gap-3 border border-slate-200 rounded-xl bg-white min-h-[240px]">
              <List size={24} className="text-slate-300" />
              <p className="text-sm text-slate-400">Select a submission from the list</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{sub.learner}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{sub.assignment}</p>
                  </div>
                  <SubmissionBadge status={sub.status} />
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                  <span>{sub.course}</span>
                  <ChevronRight size={10} />
                  <span>Edition {sub.edition}</span>
                  {sub.submittedAt && <><span>·</span><span className="font-mono">{sub.submittedAt}</span></>}
                </div>
              </div>

              <div className="px-5 py-3.5 border-b border-slate-100">
                {sub.file ? (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <Paperclip size={14} className="text-slate-500 shrink-0" />
                    <span className="flex-1 font-mono text-sm text-slate-700 truncate">{sub.file}</span>
                    <Btn variant="ghost" size="sm" className="px-2"><Eye size={14} /></Btn>
                    <Btn variant="ghost" size="sm" className="px-2"><Download size={14} /></Btn>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-600">
                    <AlertTriangle size={14} /> No file — submission not uploaded
                  </div>
                )}
              </div>

              <div className="px-5 py-4">
                {sub.isScenario && sub.status === "graded" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span className="font-semibold text-emerald-900">Published: {scenario.grade} pts · {scenario.gradeLetter}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Feedback</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{scenario.feedbackText}</p>
                    </div>
                  </div>
                ) : sub.isScenario && sub.status === "submitted" ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Points (0–100)" type="number" value={gradeVal} onChange={e => setGradeVal(e.target.value)} />
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Grade</label>
                        <select value={letterVal} onChange={e => setLetterVal(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          {GRADE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <Textarea label="Feedback for participant" rows={4} value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)} />
                    <div className="flex items-center gap-3">
                      <Btn onClick={handlePublish} disabled={gradePublished} size="sm">
                        <Send size={14} /> Publish grade
                      </Btn>
                      {gradePublished && (
                        <span className="text-sm text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle size={14} /> Published
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Points" defaultValue={sub.status === "graded" ? "74" : ""} disabled={sub.status === "graded"} />
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Grade</label>
                        <select defaultValue={sub.status === "graded" ? "4" : ""} disabled={sub.status === "graded"}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white disabled:bg-slate-50 disabled:text-slate-500">
                          <option value="">—</option>
                          {GRADE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    </div>
                    {sub.status === "late" ? (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-700">
                        <AlertTriangle size={14} /> Late submission — requires verification before grading.
                      </div>
                    ) : sub.status === "graded" ? (
                      <p className="text-sm text-slate-500">Work graded. Feedback visible to the participant.</p>
                    ) : (
                      <Btn size="sm"><Send size={14} /> Publish grade</Btn>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PM SCREENS ─────────────────────────────────────────────────────────────────

function PmOperations({ scenario, navigate }: { scenario: Scenario; navigate: (s: string, p?: NavParams) => void }) {
  const alerts = [
    { id: "a-anna",  msg: "Anna Brzezińska — inactive for 6 days",                              course: "Python for Data Analysts · Edition 2025/1", level: "warning", pmTab: "participants" as PmTab, pmHighlight: "Anna Brzezińska" },
    ...(scenario.assignmentStatus === "draft"     ? [{ id: "a-draft",  msg: "Assignment 2 not published by lecturer",                        course: "Python for Data Analysts · Edition 2025/1", level: "error", pmTab: "assignments" as PmTab, pmHighlight: "a2" }] : []),
    ...(scenario.submissionStatus === "submitted" ? [{ id: "a-sub",    msg: "New submission: Piotr Jabłoński — Assignment 2 awaiting review", course: "Python for Data Analysts · Edition 2025/1", level: "warning", pmTab: "assignments" as PmTab, pmHighlight: "a2-sub" }] : []),
    ...(scenario.submissionStatus === "graded"    ? [{ id: "a-graded", msg: "Assignment 2 graded — Piotr Jabłoński",                          course: "Python for Data Analysts · Edition 2025/1", level: "success", pmTab: "assignments" as PmTab, pmHighlight: "a2" }] : []),
    { id: "a-freq",  msg: "Attendance below 50% for 2 participants",                            course: "Agile Project Management · 2025/1", level: "warning", pmTab: "participants" as PmTab, pmHighlight: null },
  ];

  const borderColor = (level: string) =>
    level === "error" ? "border-l-red-500" : level === "success" ? "border-l-emerald-500" : "border-l-amber-400";
  const iconEl = (level: string) =>
    level === "success"
      ? <CheckCircle size={16} className="text-emerald-500 shrink-0" />
      : <AlertTriangle size={16} className={`shrink-0 ${level === "error" ? "text-red-500" : "text-amber-500"}`} />;

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200">
        <PageTitle title="Operations" subtitle="Anna Kowalska · Course Manager" />
      </div>

      <div>
        <SectionLabel>Alerts &amp; Risks</SectionLabel>
        <div className="mt-3 space-y-2">
          {alerts.map(a => (
            <button key={a.id}
              className={`w-full text-left flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 border-l-4 hover:bg-slate-50 transition-colors ${borderColor(a.level)}`}
              onClick={() => navigate("pm-courses", { pmTab: a.pmTab, pmHighlight: a.pmHighlight ?? undefined })}>
              {iconEl(a.level)}
              <div className="flex-1">
                <p className="font-medium text-slate-900">{a.msg}</p>
                <p className="text-sm text-slate-500 mt-0.5">{a.course}</p>
              </div>
              <ArrowUpRight size={14} className="text-slate-400 shrink-0 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel>Summary</SectionLabel>
        <div className="mt-3 grid grid-cols-4 divide-x divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
          <MetricRow label="Active Courses" value="5"   sub="in 3 editions" />
          <MetricRow label="Participants"   value="142" sub="active" />
          <MetricRow label="Completion"     value="87%" sub="course avg." />
          <MetricRow label="Alerts"         value={String(alerts.length)} sub="require action" alert onClick={() => navigate("pm-courses")} />
        </div>
      </div>

      <div>
        <SectionLabel>Active courses</SectionLabel>
        <div className="mt-3 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {[
            { title: "Python for Data Analysts", ed: "2025/1", participants: 28, progress: 40 },
            { title: "Agile Project Management", ed: "2025/1", participants: 35, progress: 25 },
            { title: "Excel zaawansowany",             ed: "2025/1", participants: 22, progress: 75 },
          ].map(c => (
            <div key={c.title} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer" onClick={() => navigate("pm-courses")}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{c.title}</p>
                <p className="text-sm text-slate-500">Edition {c.ed} · {c.participants} participants</p>
              </div>
              <div className="w-28"><ProgressBar value={c.progress} color="blue" /></div>
              {c.title.includes("Python") && scenario.submissionStatus === "submitted" && <Badge color="orange">1 new submission</Badge>}
              {c.title.includes("Python") && scenario.submissionStatus === "graded"    && <Badge color="green">Assignment 2 graded</Badge>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PmCoursesEditions({ scenario, tab, highlight, onTabChange }: {
  scenario: Scenario; tab: PmTab; highlight: string | null; onTabChange: (t: PmTab) => void;
}) {
  const assignments = [
    { id: "a1", title: "Assignment 1 — Introduction to Python", status: "closed" as AssignmentStatus, submissions: 26, graded: 26 },
    { id: "a2", title: "Assignment 2 — Pandas Data Analysis",   status: scenario.assignmentStatus, submissions: scenario.submissionStatus !== "not_started" ? 1 : 0, graded: scenario.submissionStatus === "graded" ? 1 : 0 },
    { id: "a3", title: "Assignment 3 — Data Visualization",     status: "draft" as AssignmentStatus, submissions: 0, graded: 0 },
  ];
  const participants = [
    { name: "Piotr Jabłoński",  p: 75,  tasks: "2/3", risk: false },
    { name: "Karolina Wróbel",  p: 50,  tasks: "2/3", risk: false },
    { name: "Tomasz Lewicki",   p: 100, tasks: "3/3", risk: false },
    { name: "Anna Brzezińska",  p: 25,  tasks: "1/3", risk: true },
    { name: "Marcin Dąbrowski", p: 40,  tasks: "1/3", risk: true },
  ];
  const rowH  = (id: string)   => highlight === id        ? "bg-blue-50 ring-1 ring-blue-300 ring-inset" : "";
  const nameH = (name: string) => highlight === name      ? "bg-blue-50 ring-1 ring-blue-300 ring-inset" : "";
  const subH  = (id: string)   => highlight === id+"-sub" ? "ring-1 ring-amber-400 ring-inset rounded" : "";

  return (
    <div className="space-y-5">
      <div className="pb-4 border-b border-slate-200">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Courses &amp; Editions</p>
        <PageTitle title="Python for Data Analysts" />
        <div className="flex items-center gap-2 mt-2">
          <Badge color="green">active</Badge>
          <span className="text-sm text-slate-500">Edition 2025/1 · 03 Feb – 28 Mar 2025 · Jan Nowak</span>
        </div>
      </div>
      <Tabs
        tabs={[{ id: "overview", label: "Overview" }, { id: "assignments", label: "Assignments" }, { id: "participants", label: "Participants" }]}
        active={tab} onChange={t => onTabChange(t as PmTab)}
      />
      {tab === "overview" && (
        <div className="grid grid-cols-3 divide-x divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
          <MetricRow label="Participants" value="28" sub="enrolled" />
          <MetricRow label="Assignments"  value="3"  sub="defined" />
          <MetricRow label="Progress"     value="40%" sub="group avg." />
        </div>
      )}
      {tab === "assignments" && (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {assignments.map(a => (
            <div key={a.id} className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${rowH(a.id)}`}>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{a.title}</p>
                <p className="text-sm text-slate-500">{a.submissions} submissions · {a.graded} graded</p>
              </div>
              <AssignmentBadge status={a.status} />
              {a.id === "a2" && scenario.submissionStatus !== "not_started" && (
                <div className={subH("a2")}><SubmissionBadge status={scenario.submissionStatus} /></div>
              )}
            </div>
          ))}
        </div>
      )}
      {tab === "participants" && (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {participants.map(p => (
            <div key={p.name} className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${nameH(p.name)}`}>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{p.name}</p>
              </div>
              <div className="w-28"><ProgressBar value={p.p} color={p.risk ? "amber" : "blue"} /></div>
              <span className="text-sm text-slate-500 w-8 tabular-nums text-right">{p.tasks}</span>
              {p.risk ? <Badge color="red">at risk</Badge> : <Badge color="green">ok</Badge>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PmReports() {
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200">
        <PageTitle title="Reports" />
      </div>
      <div className="grid grid-cols-4 divide-x divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
        <MetricRow label="Completion" value="87%" sub="↑ 3% vs previous" />
        <MetricRow label="Attendance" value="73%" />
        <MetricRow label="Avg. Score" value="76 pts" sub="of 100" />
        <MetricRow label="Retention"  value="94%" sub="learners" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Participant progress — Python for Data Analysts</SectionLabel>
          <Btn variant="secondary" size="sm"><Download size={14} /> CSV</Btn>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["Participant", "Progress", "Attendance", "Avg. Score"].map(h => (
                  <th key={h} className="px-5 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { n: "Piotr Jabłoński", p: 75,  att: 90,  avg: 82 },
                { n: "Karolina Wróbel", p: 50,  att: 75,  avg: 74 },
                { n: "Tomasz Lewicki",  p: 100, att: 100, avg: 91 },
                { n: "Anna Brzezińska", p: 25,  att: 40,  avg: 55 },
              ].map(r => (
                <tr key={r.n} className="hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-medium text-slate-900">{r.n}</td>
                  <td className="px-5 py-3 w-36"><ProgressBar value={r.p} color="blue" /></td>
                  <td className="px-5 py-3 text-sm text-slate-600 tabular-nums">{r.att}%</td>
                  <td className="px-5 py-3 text-sm text-slate-600 tabular-nums">{r.avg} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PmIssues() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between pb-5 border-b border-slate-200">
        <PageTitle title="Issues" />
        <Btn variant="secondary" size="sm" className="mt-1.5"><Plus size={14} /> New issue</Btn>
      </div>
      <div className="flex items-center gap-2">
        <Search size={14} className="text-slate-400" />
        <input placeholder="Search issues…" className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-56" />
        <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All</option><option>Open</option><option>In Progress</option><option>Closed</option>
        </select>
      </div>
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
        {[
          { id: "ISS-041", title: "Participant unable to log in to the platform", course: "Python for Data Analysts · 2025/1", sev: "high", status: "open" },
          { id: "ISS-040", title: "Missing materials for module 4",                course: "Excel zaawansowany · 2025/1",    sev: "high",   status: "in progress" },
          { id: "ISS-039", title: "Request to reschedule a class",                 course: "Agile · 2025/1",                 sev: "low",    status: "closed"      },
        ].map(iss => (
          <div key={iss.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-slate-400">{iss.id}</span>
                <Badge color={iss.sev === "high" ? "red" : "gray"}>{iss.sev}</Badge>
              </div>
              <p className="font-medium text-slate-900">{iss.title}</p>
              <p className="text-sm text-slate-500 mt-0.5">{iss.course}</p>
            </div>
            <Badge color={iss.status === "closed" ? "green" : iss.status === "in progress" ? "navy" : "orange"}>{iss.status}</Badge>
            <Btn variant="ghost" size="sm" className="px-2 shrink-0"><MoreHorizontal size={16} /></Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen router ──────────────────────────────────────────────────────────────

function ScreenRouter({ screen, scenario, actions, navigate, reviewsFilter, learnerNotifs, pmTab, pmHighlight, onPmTabChange, onSelectSubmission }: {
  screen: string; scenario: Scenario; actions: Actions;
  navigate: (s: string, p?: NavParams) => void;
  reviewsFilter: string; learnerNotifs: Notif[];
  pmTab: PmTab; pmHighlight: string | null;
  onPmTabChange: (t: PmTab) => void;
  onSelectSubmission: (ctx: ReviewsContext | null) => void;
}) {
  switch (screen) {
    case "l-dashboard":      return <LearnerDashboard navigate={navigate} />;
    case "l-courses":        return <LearnerMyCourses navigate={navigate} />;
    case "l-workspace":      return <LearnerCourseWorkspace scenario={scenario} navigate={navigate} />;
    case "l-assignments":    return <LearnerAssignments scenario={scenario} actions={actions} />;
    case "l-calendar":       return <MvpScreen title="Calendar" />;
    case "l-notifications":  return <LearnerNotifications notifs={learnerNotifs} onMarkRead={actions.markNotifRead} navigate={navigate} />;
    case "l-account":        return <MvpScreen title="Account" />;
    case "lec-dashboard":    return <LecturerDashboard scenario={scenario} navigate={navigate} />;
    case "lec-courses":      return <LecturerMyCourses scenario={scenario} actions={actions} />;
    case "lec-reviews":      return <LecturerReviews scenario={scenario} actions={actions} initialFilter={reviewsFilter} onSelectSubmission={onSelectSubmission} />;
    case "lec-calendar":     return <MvpScreen title="Calendar" />;
    case "lec-notifications":return <MvpScreen title="Notifications" />;
    case "lec-account":      return <MvpScreen title="Account" />;
    case "pm-operations":    return <PmOperations scenario={scenario} navigate={navigate} />;
    case "pm-courses":       return <PmCoursesEditions scenario={scenario} tab={pmTab} highlight={pmHighlight} onTabChange={onPmTabChange} />;
    case "pm-schedule":      return <MvpScreen title="Schedule" />;
    case "pm-reports":       return <PmReports />;
    case "pm-issues":        return <PmIssues />;
    case "pm-notifications": return <MvpScreen title="Notifications" />;
    case "pm-account":       return <MvpScreen title="Account" />;
    default:                 return null;
  }
}

// ── Login ──────────────────────────────────────────────────────────────────────

function LoginScreen({ debugRole, onLogin }: { debugRole: Role; onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center mx-auto mb-4">
            <BookOpen size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gloria LMS</h1>
          <p className="text-sm text-slate-500 mt-1.5">Sign in to your account</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <Input label="Email" value={CREDS[debugRole]} readOnly />
          <Input label="Password" type="password" defaultValue="••••••••" />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded" defaultChecked /> Remember me
            </label>
            <button className="text-blue-600 hover:underline">Reset password</button>
          </div>
          <Btn className="w-full justify-center" onClick={onLogin}>Sign in</Btn>
          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-3 text-sm text-slate-400">or</span>
          </div>
          <Btn variant="secondary" className="w-full justify-center">Sign in with SSO</Btn>
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const captureParams = new URLSearchParams(window.location.search);
  const captureRole = captureParams.get("role") as Role | null;
  const captureMode = captureParams.get("capture") === "1";
  const initialRole = captureRole && ["learner", "lecturer", "pm"].includes(captureRole) ? captureRole : null;
  const [role,       setRole]       = useState<Role | null>(initialRole);
  const [debugRole,  setDebugRole]  = useState<Role>(initialRole ?? "learner");
  const [protoOpen,  setProtoOpen]  = useState(false);
  const [currentNav, setCurrentNav] = useState(captureParams.get("view") ?? (initialRole ? DEFAULT_NAV[initialRole] : "l-dashboard"));
  const [reviewsFilter,  setReviewsFilter]  = useState("all");
  const [pmTab,          setPmTab]          = useState<PmTab>("overview");
  const [pmHighlight,    setPmHighlight]    = useState<string | null>(null);
  const [reviewsCtx,     setReviewsCtx]     = useState<ReviewsContext | null>(null);

  const [assignmentStatus, setAssignmentStatus] = useState<AssignmentStatus>("draft");
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("not_started");
  const [submissionFile,   setSubmissionFile]   = useState<string | null>(null);
  const [submittedAt,      setSubmittedAt]      = useState<string | null>(null);
  const [grade,            setGrade]            = useState<number | null>(null);
  const [gradeLetter,      setGradeLetter]      = useState<string | null>(null);
  const [feedbackText,     setFeedbackText]     = useState<string | null>(null);
  const [gradedAt,         setGradedAt]         = useState<string | null>(null);
  const [learnerNotifs,    setLearnerNotifs]    = useState<Notif[]>(INITIAL_NOTIFS);
  const [lecturerSubNotif, setLecturerSubNotif] = useState(false);

  const scenario: Scenario = { assignmentStatus, submissionStatus, submissionFile, submittedAt, grade, gradeLetter, feedbackText, gradedAt };

  const actions: Actions = {
    publishAssignment: () => {
      setAssignmentStatus("published");
      setLearnerNotifs(prev => [...prev, { id: "n-pub", text: "Assignment 2 — Pandas Data Analysis has been published", time: "now", read: false, deepLink: "l-assignments" }]);
    },
    submitWork: (file: string) => {
      setSubmissionFile(file);
      setSubmittedAt("today, " + new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
      setSubmissionStatus("submitted");
      setLecturerSubNotif(true);
    },
    publishGrade: (g: number, letter: string, feedback: string) => {
      setGrade(g); setGradeLetter(letter); setFeedbackText(feedback);
      setGradedAt("today"); setSubmissionStatus("graded"); setLecturerSubNotif(false);
      setLearnerNotifs(prev => [...prev, { id: "n-grade", text: `Assignment 2 has been graded — ${g} pts (${letter}). Check your feedback.`, time: "now", read: false, deepLink: "l-assignments" }]);
    },
    markNotifRead: (id: string) => setLearnerNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)),
  };

  function resetScenario() {
    setAssignmentStatus("draft"); setSubmissionStatus("not_started"); setSubmissionFile(null);
    setSubmittedAt(null); setGrade(null); setGradeLetter(null); setFeedbackText(null); setGradedAt(null);
    setLearnerNotifs(INITIAL_NOTIFS); setLecturerSubNotif(false);
    setPmTab("overview"); setPmHighlight(null); setReviewsFilter("all"); setReviewsCtx(null);
  }

  function handleRoleSwitch(r: Role) {
    setDebugRole(r);
    if (role !== null) { setRole(r); setCurrentNav(DEFAULT_NAV[r]); setReviewsCtx(null); }
  }

  function navigate(screenId: string, params?: NavParams) {
    setCurrentNav(screenId);
    if (params?.filter !== undefined)        setReviewsFilter(params.filter);
    if (params?.pmTab)                       setPmTab(params.pmTab);
    if (params?.pmHighlight !== undefined)   setPmHighlight(params.pmHighlight ?? null);
    if (screenId !== "lec-reviews")          setReviewsCtx(null);
  }

  function handleSidebarNav(id: string) {
    setCurrentNav(id);
    setReviewsFilter("all");
    if (id !== "pm-courses")  { setPmTab("overview"); setPmHighlight(null); }
    if (id !== "lec-reviews") setReviewsCtx(null);
  }

  const learnerUnread  = learnerNotifs.filter(n => !n.read).length;
  const lecturerUnread = lecturerSubNotif ? 1 : 0;
  const pendingReviews = submissionStatus === "submitted" ? 1 : 0;
  const crumbs         = computeBreadcrumbs(currentNav, reviewsCtx);
  const isWide         = WIDE_SCREENS.has(currentNav);

  const protoState: ProtoState = {
    activeRole: role,
    debugRole,
    scenario,
    learnerNotifs,
    lecturerUnread: lecturerSubNotif,
    onRoleSwitch: handleRoleSwitch,
    onReset: resetScenario,
    isOpen: protoOpen,
    onToggle: () => setProtoOpen(p => !p),
  };

  return (
    <>
      {/* Global prototype controls — fixed bottom-left on every screen */}
      {!captureMode ? <PrototypeControlsFloat {...protoState} /> : null}

      {!role ? (
        <LoginScreen debugRole={debugRole} onLogin={() => { setRole(debugRole); setCurrentNav(DEFAULT_NAV[debugRole]); }} />
      ) : (
        <div className="min-h-screen bg-background flex" style={{ fontFamily: "'Inter', sans-serif" }}>
          <Sidebar
            role={role} currentNav={currentNav}
            onNav={handleSidebarNav} onLogout={() => setRole(null)}
            pendingReviews={pendingReviews}
            learnerUnread={learnerUnread}
            lecturerUnread={lecturerUnread}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <Header
              crumbs={crumbs} role={role}
              learnerUnread={learnerUnread} lecturerUnread={lecturerUnread}
              onNavNotifications={() => setCurrentNav(NOTIF_SCREEN[role])}
              onNavigate={navigate}
              onNavAccount={() => setCurrentNav(role === "learner" ? "l-account" : role === "lecturer" ? "lec-account" : "pm-account")}
            />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className={`mx-auto ${isWide ? "max-w-[1200px]" : "max-w-[1080px]"}`}>
                <ScreenRouter
                  screen={currentNav} scenario={scenario} actions={actions} navigate={navigate}
                  reviewsFilter={reviewsFilter} learnerNotifs={learnerNotifs}
                  pmTab={pmTab} pmHighlight={pmHighlight}
                  onPmTabChange={t => { setPmTab(t); setPmHighlight(null); }}
                  onSelectSubmission={setReviewsCtx}
                />
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
