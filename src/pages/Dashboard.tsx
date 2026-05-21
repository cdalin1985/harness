import React from 'react';
import { SAMPLE_TEMPLATES } from '../data';
import { MoreVertical, Plus, Activity, Clock, ArrowUpRight } from 'lucide-react';
import { DashboardStat } from '../components/DashboardStat';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const instances = [
    { id: 'inst-1', name: 'Customer_Support_L1', template: SAMPLE_TEMPLATES[0], status: 'active', lastTested: '2 hours ago', reliability: '98.2%', cost: '$0.04' },
    { id: 'inst-2', name: 'Legal_Analyzer_FR', template: SAMPLE_TEMPLATES[1], status: 'active', lastTested: '5 mins ago', reliability: '91.5%', cost: '$0.22' },
    { id: 'inst-3', name: 'Creative_Writer_V3', template: SAMPLE_TEMPLATES[2], status: 'draft', lastTested: 'Never', reliability: '76.0%', cost: '$0.01' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Platform overview and execution metrics.</p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center gap-2 text-sm shadow-sm">
          <Plus size={16} />
          Create Harness
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardStat label="Total Tokens Used" value="1.2M" trend="+12.4% from last week" />
        <DashboardStat label="Avg. Success Rate" value="94.2%" trend="+0.8% optimized" />
        <DashboardStat label="Active Deployments" value="18" trend="Stable latency 240ms" />
        <DashboardStat label="Test Coverage" value="88.5%" trend="Across 12 environments" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Harness Instances</h2>
          <button className="text-xs font-bold text-brand hover:underline flex items-center gap-1 uppercase tracking-wider">
            View All Instances
            <ArrowUpRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instances.map((inst) => (
            <div key={inst.id} className="card group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Badge type={inst.status === 'active' ? 'active' : 'draft'}>{inst.status}</Badge>
                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <Link to={`/builder/${inst.id}`}>
                 <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-brand transition-colors">{inst.name}</h3>
              </Link>
              <p className="text-xs text-slate-500 font-medium mb-5 flex-grow">{(inst.template?.name) || 'General'} • Version 1.4.2</p>
              
              <div className="flex gap-8 pt-4 border-t border-[#F3F4F6]">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{inst.reliability}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reliability</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{inst.cost}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Cost/Run</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="card h-full flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={16} className="text-slate-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Audit Log</h3>
          </div>
          <div className="flex flex-col gap-5 flex-grow">
            <LogItem status="INFO" msg="Deployed version v1.2.0 to Customer_Support_L1" time="15 mins ago" />
            <LogItem status="WARN" msg="Quality gate failed for Legal_Analyzer_FR: Length constraint" time="1 hour ago" />
            <LogItem status="INFO" msg="New harness template customized: Creative_Writer_V3" time="3 hours ago" />
          </div>
        </div>

        <div className="card h-full bg-slate-900 overflow-hidden relative border-slate-800">
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={16} className="text-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Pro Health Monitor</h3>
            </div>
            <div className="flex flex-col gap-4 flex-grow">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Global Latency</div>
                <div className="text-2xl font-bold text-white flex items-baseline gap-2">240ms <span className="text-xs text-teal-400">-5ms</span></div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Token Efficiency</div>
                <div className="text-2xl font-bold text-white flex items-baseline gap-2">92% <span className="text-xs text-teal-400">Optimal</span></div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[80px] -mr-32 -mt-32" />
        </div>
      </div>
    </div>
  );
}

function LogItem({ status, msg, time }: { status: 'INFO' | 'WARN', msg: string, time: string }) {
  return (
    <div className="flex gap-4 items-start">
      <Badge type={status === 'INFO' ? 'info' : 'warn'}>{status}</Badge>
      <div className="flex-grow">
        <p className="text-sm text-slate-700 font-semibold leading-tight">{msg}</p>
        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{time}</p>
      </div>
    </div>
  );
}

