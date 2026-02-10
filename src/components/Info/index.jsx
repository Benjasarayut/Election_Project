import React, { useState } from 'react';
import { BookOpen, ChevronRight, FileText, MonitorPlay, PlayCircle, Target, TrendingUp, Hammer } from 'lucide-react';
// Import ข้อมูลจากไฟล์กลาง
import { PARTIES } from '../../data/electionData';

const PartyInfo = () => {
  const [selectedParty, setSelectedParty] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 font-sans overflow-y-auto">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <ChevronRight className="rotate-180" /> กลับหน้าหลัก
          </a>
          <div className="h-6 w-px bg-slate-300"></div>
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600 w-6 h-6" />
            <h1 className="text-xl font-bold text-slate-800">ศูนย์ข้อมูลพรรคการเมือง</h1>
          </div>
        </div>
      </nav>

      <div className="p-6 max-w-6xl mx-auto">
        {!selectedParty ? (
          // List View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTIES.filter(p => p.number !== 0).map(party => (
              <button 
                key={party.id}
                onClick={() => setSelectedParty(party)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden text-left group border border-transparent hover:border-blue-200"
              >
                <div className={`h-32 ${party.bg} flex items-center justify-center`}>
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform">
                      {party.logo}
                   </div>
                </div>
                <div className="p-6">
                   <div className="flex justify-between items-center mb-2">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">เบอร์ {party.number}</span>
                   </div>
                   <h3 className={`text-2xl font-bold mb-2 ${party.color}`}>{party.name}</h3>
                   <p className="text-slate-500 line-clamp-2">{party.slogan}</p>
                   <div className="mt-4 flex items-center text-blue-500 font-medium">
                      ดูข้อมูลเพิ่มเติม <ChevronRight size={18} />
                   </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Detail View
          <div className="animate-fade-in-up">
            <button onClick={() => setSelectedParty(null)} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2">
               <ChevronRight className="rotate-180" size={20} /> ย้อนกลับไปหน้ารายชื่อ
            </button>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
               {/* Hero Banner */}
               <div className={`h-48 md:h-64 ${selectedParty.bg} relative flex items-center justify-center`}>
                  <div className="text-center text-white p-6">
                     <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-6xl shadow-2xl mx-auto mb-4 text-slate-900">
                        {selectedParty.logo}
                     </div>
                     <h2 className="text-4xl md:text-5xl font-bold drop-shadow-md">{selectedParty.name}</h2>
                     <p className="text-xl mt-2 opacity-90 font-light">"{selectedParty.slogan}"</p>
                  </div>
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full text-white font-bold text-2xl border border-white/30">
                     เบอร์ {selectedParty.number}
                  </div>
               </div>

               <div className="p-8 space-y-8">
                  
                  {/* Mission / Promote / Develop Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                           <Target size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">ภารกิจหลัก</h4>
                        <p className="text-slate-600">{selectedParty.mission}</p>
                     </div>
                     <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                           <TrendingUp size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">สิ่งที่ส่งเสริม</h4>
                        <p className="text-slate-600">{selectedParty.promote}</p>
                     </div>
                     <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                           <Hammer size={28} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">เป้าหมายการพัฒนา</h4>
                        <p className="text-slate-600">{selectedParty.develop}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-8">
                     {/* Policies Section */}
                     <div className="md:col-span-2 space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 border-b pb-4">
                           <FileText className="text-blue-600" /> นโยบายเร่งด่วน
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                           {selectedParty.policies.map((policy, idx) => (
                              <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                                    {idx + 1}
                                 </div>
                                 <p className="text-lg text-slate-700 mt-0.5">{policy}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Media Section */}
                     <div className="space-y-6">
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 border-b pb-4">
                           <MonitorPlay className="text-red-600" /> สื่อประชาสัมพันธ์
                        </h3>
                        
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black group relative cursor-pointer hover:shadow-2xl transition-all">
                           <div className={`aspect-video ${selectedParty.videoThumbnail} opacity-80 group-hover:opacity-60 transition-opacity flex items-center justify-center`}>
                              {selectedParty.logo} 
                           </div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                              <p className="text-white font-medium">แนะนำพรรค{selectedParty.name}</p>
                              <p className="text-xs text-slate-300">2:30 นาที</p>
                           </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                           <p className="font-bold mb-1">📢 ติดตามข้อมูลข่าวสาร</p>
                           <p>สามารถดูข้อมูลเพิ่มเติมได้ที่เว็บไซต์หลักของพรรค หรือสแกน QR Code ที่ป้ายหาเสียง</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyInfo;