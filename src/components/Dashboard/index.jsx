import React, { useState, useEffect } from 'react';
import { Activity, Users } from 'lucide-react';
// Import ข้อมูลจากไฟล์กลาง
import { MP_CANDIDATES, PARTIES, getStoredVotes } from '../../data/electionData';

const LiveDashboard = () => {
  const [data, setData] = useState({ mp: {}, party: {}, total: 0, logs: [] });

  useEffect(() => {
    const loadData = () => {
        const storedData = getStoredVotes();
        setData(storedData);
    };
    loadData();
    window.addEventListener('storage', loadData);
    const interval = setInterval(loadData, 1000);
    return () => {
        window.removeEventListener('storage', loadData);
        clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-y-auto">
      <nav className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Activity className="text-red-500 animate-pulse w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-wider leading-none">THAILAND ELECTION</h1>
              <span className="text-xs text-red-500 font-bold tracking-widest">OFFICIAL LIVE RESULTS</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
              <p className="text-xs text-slate-400">STATUS</p>
              <p className="text-green-400 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> COUNTING IN PROGRESS</p>
           </div>
        </div>
      </nav>

      <div className="p-6 max-w-screen-2xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between col-span-1 md:col-span-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                 <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Votes Counted</p>
                 <h2 className="text-6xl font-bold text-white mt-2 font-mono tracking-tighter">{data.total.toLocaleString()}</h2>
              </div>
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                 <Users size={40} />
              </div>
           </div>
           
           <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl col-span-1 md:col-span-2">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Live Activity Feed</span>
                <span className="text-xs text-slate-600">Real-time</span>
              </p>
              <div className="space-y-2 max-h-[100px] overflow-hidden">
                 {data.logs.length > 0 ? data.logs.slice(0,3).map((log, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm animate-fade-in-left">
                       <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">{log.time}</span>
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                       <span className="text-slate-300">New vote received from <span className="text-white font-bold">{log.unit}</span></span>
                    </div>
                 )) : <p className="text-slate-700 text-sm italic">Waiting for incoming data...</p>}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900/20">1</div>
                   <div>
                     <h3 className="text-2xl font-bold">Constituency MP</h3>
                     <p className="text-slate-400 text-sm">ส.ส. แบบแบ่งเขตเลือกตั้ง</p>
                   </div>
                </div>
                <div className="space-y-8">
                    {MP_CANDIDATES.map(c => {
                        const score = data.mp[c.id] || 0;
                        const percent = data.total > 0 ? (score / data.total) * 100 : 0;
                        return (
                            <div key={c.id} className="relative group">
                                <div className="flex justify-between mb-2 items-end z-10 relative">
                                    <div>
                                      <span className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{c.name}</span>
                                      <span className="text-xs text-slate-500 ml-2 bg-slate-800 px-2 py-0.5 rounded">No.{c.number}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-mono text-2xl font-bold text-white">{score.toLocaleString()}</span>
                                      <span className="text-sm text-slate-500 ml-2">({percent.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden relative">
                                    <div 
                                      className={`h-full ${c.barColor} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                                      style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                   <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-purple-900/20">2</div>
                   <div>
                     <h3 className="text-2xl font-bold">Party-List</h3>
                     <p className="text-slate-400 text-sm">ส.ส. แบบบัญชีรายชื่อ</p>
                   </div>
                </div>
                <div className="space-y-4">
                    {PARTIES.map(p => {
                        const score = data.party[p.id] || 0;
                        const percent = data.total > 0 ? (score / data.total) * 100 : 0;
                        return (
                           <div key={p.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 group">
                              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-3xl border border-slate-700 shadow-inner group-hover:scale-110 transition-transform">{p.logo}</div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-lg text-slate-200">{p.name}</h4>
                                    <span className="text-xs bg-slate-900 text-slate-400 px-2 py-1 rounded">No.{p.number}</span>
                                 </div>
                                 <div className="w-full bg-slate-900 rounded-full h-2 mt-3 overflow-hidden">
                                    <div className={`h-full bg-purple-500 transition-all duration-1000`} style={{width: `${percent}%`}}></div>
                                 </div>
                              </div>
                              <div className="text-right min-w-[80px]">
                                 <div className="text-2xl font-bold font-mono text-white">{score}</div>
                              </div>
                           </div>
                        );
                    })}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;