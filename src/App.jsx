import React, { useState, useEffect } from 'react';
import { User, CheckCircle, ChevronRight, Fingerprint, MapPin, Vote, AlertTriangle, Search, FileText, Activity, RefreshCw, BarChart3, PieChart, Users, AlertCircle, MonitorPlay, BookOpen, PlayCircle, X, Target, TrendingUp, Hammer } from 'lucide-react';

/**
 * THAILAND ELECTION SYSTEM 2026 (FULL VERSION - SINGLE FILE FIX)
 * แก้ปัญหาหน้าจอขาวโดยการรวมทุก Component ไว้ในไฟล์เดียว
 */

// ============================================================================
// 1. DATA & CONFIG (ข้อมูลกลาง)
// ============================================================================

const MP_CANDIDATES = [
  { id: 1, name: "นายกไก่ ใจซื่อ", number: 1, party: "พรรคพัฒนาไทย", color: "bg-red-500", barColor: "bg-red-500" },
  { id: 2, name: "นายขไข่ ใฝ่ดี", number: 2, party: "พรรคอนาคตไกล", color: "bg-blue-500", barColor: "bg-blue-500" },
  { id: 3, name: "นางสาวคควาย รักจริง", number: 3, party: "พรรคพลังใหม่", color: "bg-green-500", barColor: "bg-green-500" },
  { id: 4, name: "ไม่ประสงค์ลงคะแนน", number: 0, party: "-", color: "bg-gray-400", barColor: "bg-gray-400" },
];

const PARTIES = [
  { 
    id: 1, name: "พรรคภูมิใจไทย", number: 1, logo: "🐘", color: "text-red-600", bg: "bg-red-600",
    slogan: "พัฒนาไทย ให้ดิ่งลงเหว",
    mission: "มุ่งเน้นการสร้างรากฐานเศรษฐกิจที่ล้มละลาย สร้างความเหลื่อมล้ำ",
    promote: "ส่งเสริม SME และสินค้าไทยสู่ตลาดโซมาเลียและลิเบีย",
    develop: "พัฒนาระบบสวัสดิการ สาธารณสุข และการศึกษาฟรีเฉพาะกลุ่มคนรวยและสว.เท่านั้น",
    policies: ["เพิ่มภาษี SME เหลือ 125%", "เรียนฟรีถึง อนุบาล 2", "รถไฟฟ้า 200 บาทตลอดสาย", "เบี้ยผู้สูงอายุ 3 บาท"],
    videoThumbnail: "bg-red-100"
  },
  { 
    id: 2, name: "พรรคอนาคตไกล", number: 2, logo: "🚀", color: "text-blue-600", bg: "bg-blue-600",
    slogan: "มองไกล ไปข้างหน้า สู่อนาคตใหม่",
    mission: "เปลี่ยนผ่านสู่ยุคดิจิทัล สร้างรัฐบาลโปร่งใสด้วย Blockchain",
    promote: "ส่งเสริมทักษะ Coding & AI และ Startup ไทย",
    develop: "โครงสร้างพื้นฐาน 5G/6G และ Smart City",
    policies: ["ราชการ AI ทั้งระบบ", "สนับสนุน Startup", "เน็ตฟรีทุกหมู่บ้าน", "พื้นที่รกร้างเป็นสวนสาธารณะ"],
    videoThumbnail: "bg-blue-100"
  },
  { 
    id: 3, name: "พรรคพลังใหม่", number: 3, logo: "⚡", color: "text-green-600", bg: "bg-green-600",
    slogan: "พลังใหม่ พลังสะอาด เพื่อชาติไทย",
    mission: "กอบกู้วิกฤตสิ่งแวดล้อม สร้างเศรษฐกิจสีเขียว (Green Economy)",
    promote: "พลังงานหมุนเวียน โซลาร์เซลล์ และ EV",
    develop: "จัดการน้ำและป่าไม้ แก้ปัญหา PM 2.5 ถาวร",
    policies: ["รถเมล์ EV ใน 2 ปี", "โซลาร์เซลล์ทุกครัวเรือน", "แก้ PM 2.5 ยั่งยืน", "เกษตรกรใช้เทคโนโลยี"],
    videoThumbnail: "bg-green-100"
  },
  { 
    id: 4, name: "ไม่ประสงค์ลงคะแนน", number: 0, logo: "❌", color: "text-gray-400", bg: "bg-gray-400",
    slogan: "-", mission: "-", promote: "-", develop: "-", policies: [], videoThumbnail: "bg-gray-100"
  },
];

// Helper: ดึงคะแนนจากเครื่อง
const getStoredVotes = () => {
  const stored = localStorage.getItem('election_votes');
  return stored ? JSON.parse(stored) : { mp: {}, party: {}, total: 0, logs: [] };
};

// Helper: บันทึกคะแนน
const saveVote = (mpId, partyId) => {
  const currentData = getStoredVotes();
  currentData.mp[mpId] = (currentData.mp[mpId] || 0) + 1;
  currentData.party[partyId] = (currentData.party[partyId] || 0) + 1;
  currentData.total += 1;
  
  const timestamp = new Date().toLocaleTimeString('th-TH');
  currentData.logs.unshift({ time: timestamp, unit: `Unit-${Math.floor(Math.random()*5)+1}` });
  if (currentData.logs.length > 5) currentData.logs.pop();

  localStorage.setItem('election_votes', JSON.stringify(currentData));
  // แจ้งเตือนแท็บอื่นว่าข้อมูลเปลี่ยนแล้ว (เพื่อให้กราฟเด้ง)
  window.dispatchEvent(new Event('storage'));
};

// ============================================================================
// 2. COMPONENT: VOTING KIOSK (หน้าจอเลือกตั้ง - ประชาชน)
// ============================================================================

const VotingKiosk = () => {
  const [currentStep, setCurrentStep] = useState('home');
  const [nationalID, setNationalID] = useState('');
  const [selectedMP, setSelectedMP] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionVotedIDs, setSessionVotedIDs] = useState([]); 

  const mockUserData = {
    name: "นายรักชาติ ยิ่งชีพ",
    age: 25,
    district: "เขตเลือกตั้งที่ 1 กรุงเทพมหานคร",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  };

  const resetSystem = () => {
    setNationalID('');
    setSelectedMP(null);
    setSelectedParty(null);
    setErrorMessage('');
    setSearchTerm('');
    setCurrentStep('home');
  };

  const changeStep = (step) => {
    setSearchTerm('');
    setCurrentStep(step);
  };

  const handleConfirmVote = () => {
    saveVote(selectedMP.id, selectedParty.id);
    setSessionVotedIDs([...sessionVotedIDs, nationalID]);
    changeStep('success');
  };

  useEffect(() => {
    if (currentStep !== 'input_id') return;
    const handleKeyDown = (e) => {
      if (/^\d$/.test(e.key)) {
        if (nationalID.length < 13) { setNationalID(prev => prev + e.key); setErrorMessage(''); }
      } else if (e.key === 'Backspace') {
        setNationalID(prev => prev.slice(0, -1)); setErrorMessage('');
      } else if (e.key === 'Enter') {
        if (nationalID.length === 13) {
            if (sessionVotedIDs.includes(nationalID)) {
                setErrorMessage('หมายเลขบัตรประชาชนนี้ได้ใช้สิทธิเลือกตั้งไปแล้ว');
            } else {
                setSearchTerm(''); setCurrentStep('verify_identity');
            }
        }
      } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        setNationalID(''); setErrorMessage('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, nationalID, sessionVotedIDs]);

  if (currentStep === 'home') {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="z-10 text-center space-y-8 animate-fade-in">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
             <Vote className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider drop-shadow-lg">ระบบเลือกตั้งอิเล็กทรอนิกส์</h1>
          <p className="text-xl text-slate-300">ปลอดภัย • โปร่งใส • ตรวจสอบได้</p>
          <button onClick={() => changeStep('input_id')} className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-bold text-white transition-all duration-200 bg-blue-600 rounded-2xl shadow-2xl hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-95 mt-8">
             แตะเพื่อใช้สิทธิเลือกตั้ง
          </button>
        </div>
        
        <div className="absolute bottom-6 right-6 flex gap-3 z-50">
          <a href="#info" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 hover:border-blue-400/50 backdrop-blur-sm">
             <BookOpen size={16} />
             <span className="text-sm font-medium">ข้อมูลพรรค</span>
          </a>
          <a href="#dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 hover:border-red-400/50 backdrop-blur-sm">
             <Activity size={16} />
             <span className="text-sm font-medium">รายงานผล</span>
          </a>
        </div>

        <div className="absolute bottom-4 left-4 text-slate-600 text-xs">Kiosk Unit ID: K-089 • Official System</div>
      </div>
    );
  }

  if (currentStep === 'input_id') {
    const handleNumClick = (n) => { if(nationalID.length < 13) setNationalID(nationalID + n); setErrorMessage(''); };
    const handleSubmit = () => { if(nationalID.length === 13) { if(sessionVotedIDs.includes(nationalID)) setErrorMessage('ใช้สิทธิไปแล้ว'); else changeStep('verify_identity'); }};
    return (
       <div className="h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
           <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
               <h2 className="text-2xl font-bold text-center text-slate-800">กรุณาระบุเลขบัตรประชาชน</h2>
               <div className={`bg-slate-100 p-4 rounded-xl text-center border-2 ${errorMessage ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
                   <span className={`text-3xl font-mono tracking-widest ${nationalID ? 'text-slate-800' : 'text-slate-400'}`}>{nationalID || "_ _ _ _ _ _ _ _ _ _ _ _ _"}</span>
               </div>
               {errorMessage && <div className="flex items-center justify-center gap-2 text-red-600 font-bold animate-bounce"><AlertCircle size={20}/>{errorMessage}</div>}
               <div className="grid grid-cols-3 gap-4">
                   {[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={()=>handleNumClick(n)} className="h-16 text-2xl font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-blue-50 shadow-sm">{n}</button>)}
                   <button onClick={()=>{setNationalID('');setErrorMessage('')}} className="h-16 text-red-500 font-bold bg-white border-2 border-red-100 rounded-xl">C</button>
                   <button onClick={()=>handleNumClick(0)} className="h-16 text-2xl font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-blue-50">0</button>
                   <button onClick={()=>setNationalID(prev=>prev.slice(0,-1))} className="h-16 text-slate-600 font-bold bg-white border-2 border-slate-200 rounded-xl">⌫</button>
               </div>
               <button onClick={handleSubmit} disabled={nationalID.length !== 13} className={`w-full py-4 text-xl font-bold rounded-xl transition-all ${nationalID.length===13 ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' : 'bg-slate-300 text-slate-500'}`}>ตรวจสอบข้อมูล</button>
           </div>
       </div>
    );
  }

  if (currentStep === 'verify_identity') {
     return (
         <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
           <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
               <div className="bg-blue-600 p-6 text-white text-center"><h2 className="text-2xl font-bold">ยืนยันตัวตนผู้ใช้สิทธิ</h2></div>
               <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                   <img src={mockUserData.image} className="w-48 h-48 bg-slate-200 rounded-full border-4 border-blue-100 object-cover" />
                   <div className="space-y-4 text-center md:text-left">
                       <div><p className="text-sm text-slate-500">เลขบัตรประชาชน</p><p className="text-xl font-mono font-bold text-slate-800">{nationalID}</p></div>
                       <div><p className="text-sm text-slate-500">ชื่อ-นามสกุล</p><p className="text-2xl font-bold text-slate-900">{mockUserData.name}</p></div>
                   </div>
               </div>
               <div className="p-6 bg-slate-50 flex gap-4 border-t border-slate-100">
                   <button onClick={() => changeStep('warning')} className="flex-1 py-4 bg-white border-2 border-red-500 text-red-600 font-bold rounded-xl hover:bg-red-50 flex items-center justify-center gap-2"><AlertTriangle size={20}/> ไม่ใช่ตัวตนของฉัน</button>
                   <button onClick={() => changeStep('terms_conditions')} className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 flex items-center justify-center gap-2"><Fingerprint size={20}/> ยืนยันตัวตนถูกต้อง</button>
               </div>
           </div>
         </div>
     );
  }

  if (currentStep === 'terms_conditions') {
   return (
     <div className="h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
       <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
         <div className="bg-slate-800 p-6 text-white flex items-center gap-3"><FileText size={28} /><h2 className="text-2xl font-bold">ข้อตกลงและเงื่อนไข</h2></div>
         <div className="p-8 overflow-y-auto flex-1 text-slate-700">
             <ul className="space-y-4 list-disc pl-5">
               <li><span className="font-bold">การยืนยันตัวตน:</span> ข้าพเจ้าขอยืนยันว่าเป็นเจ้าของบัตรประชาชนและเป็นผู้มีสิทธิเลือกตั้งที่ถูกต้องตามกฎหมายจริง</li>
               <li><span className="font-bold">ความเป็นอิสระ:</span> ข้าพเจ้าจะลงคะแนนด้วยตนเองอย่างอิสระ ปราศจากการชี้นำ</li>
               <li><span className="font-bold">ความลับ:</span> ข้าพเจ้ารับทราบว่าผลการลงคะแนนจะเป็นความลับ</li>
             </ul>
         </div>
         <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
           <button onClick={() => changeStep('home')} className="px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-100">ยกเลิก</button>
           <button onClick={() => changeStep('vote_mp')} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"><CheckCircle size={20} /> ข้าพเจ้ายอมรับ</button>
         </div>
       </div>
     </div>
   );
  }

  if (currentStep === 'vote_mp') {
   const filteredMPs = MP_CANDIDATES.filter(c => c.name.includes(searchTerm) || c.party.includes(searchTerm) || c.number.toString().includes(searchTerm));
   return (
       <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
           <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
               <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div><h2 className="text-xl font-bold">เลือก ส.ส. เขต</h2></div>
               <div className="text-sm text-slate-500 font-bold">{mockUserData.name}</div>
           </div>
           <div className="px-6 pt-6"><div className="relative max-w-5xl mx-auto"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"/><input type="text" placeholder="ค้นหาผู้สมัคร..." className="w-full pl-12 pr-4 py-3 rounded-xl border" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div></div>
           <div className="flex-1 overflow-y-auto p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pb-20">
               {filteredMPs.map(c => (
                   <button key={c.id} onClick={()=>setSelectedMP(c)} className={`p-6 rounded-2xl border-4 flex items-center gap-6 text-left relative transition-all ${selectedMP?.id===c.id ? 'border-green-500 bg-green-50 ring-4 ring-green-200 transform scale-[1.02]' : 'bg-white hover:border-blue-200'}`}>
                       {selectedMP?.id===c.id && <CheckCircle className="absolute top-4 right-4 text-green-500 w-8 h-8"/>}
                       <div className={`w-24 h-24 ${c.color} rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-inner flex-shrink-0`}>{c.number}</div>
                       <div><h3 className="text-xl font-bold">{c.name}</h3><p className="text-slate-500">{c.party}</p></div>
                   </button>
               ))}
               </div>
           </div>
           <div className="p-6 bg-white fixed bottom-0 w-full z-20 border-t"><div className="max-w-5xl mx-auto flex justify-end">{selectedMP && <button onClick={()=>changeStep('vote_party')} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-bold flex items-center gap-3 hover:bg-blue-700 shadow-lg">ถัดไป <ChevronRight/></button>}</div></div>
       </div>
   );
  }

  if (currentStep === 'vote_party') {
   const filteredParties = PARTIES.filter(p => p.name.includes(searchTerm) || p.number.toString().includes(searchTerm));
   return (
       <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
           <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
               <div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div><h2 className="text-xl font-bold">เลือกพรรคการเมือง</h2></div>
               <button onClick={() => changeStep('vote_mp')} className="text-slate-500 underline">กลับไปแก้ไข</button>
           </div>
           <div className="px-6 pt-6"><div className="relative max-w-5xl mx-auto"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"/><input type="text" placeholder="ค้นหาพรรค..." className="w-full pl-12 pr-4 py-3 rounded-xl border" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/></div></div>
           <div className="flex-1 overflow-y-auto p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pb-20">
               {filteredParties.map(p => (
                   <button key={p.id} onClick={()=>setSelectedParty(p)} className={`p-6 rounded-2xl border-4 flex items-center gap-6 text-left relative transition-all ${selectedParty?.id===p.id ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200 transform scale-[1.02]' : 'bg-white hover:border-purple-200'}`}>
                       {selectedParty?.id===p.id && <CheckCircle className="absolute top-4 right-4 text-purple-500 w-8 h-8"/>}
                       <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-4xl border border-slate-200 flex-shrink-0">{p.logo}</div>
                       <div><span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-bold mb-2 inline-block">เบอร์ {p.number}</span><h3 className="text-xl font-bold">{p.name}</h3></div>
                   </button>
               ))}
               </div>
           </div>
           <div className="p-6 bg-white fixed bottom-0 w-full z-20 border-t"><div className="max-w-5xl mx-auto flex justify-end">{selectedParty && <button onClick={handleConfirmVote} className="bg-green-600 text-white px-12 py-3 rounded-xl text-xl font-bold flex items-center gap-3 hover:bg-green-700 shadow-lg"><Vote/> โหวตเสร็จสิ้น</button>}</div></div>
       </div>
   );
  }

  if (currentStep === 'success') {
     setTimeout(resetSystem, 3000);
     return (
         <div className="h-screen w-full bg-green-600 flex flex-col items-center justify-center p-8 text-white font-sans">
             <div className="bg-white text-green-600 rounded-full p-6 mb-8 shadow-2xl animate-bounce"><CheckCircle className="w-24 h-24" /></div>
             <h1 className="text-5xl font-bold mb-4 drop-shadow-md">บันทึกคะแนนสำเร็จ</h1>
             <p className="text-2xl opacity-90">ขอบคุณที่ใช้สิทธิเลือกตั้ง</p>
             <p className="absolute bottom-8 text-sm opacity-70 animate-pulse">กำลังกลับสู่หน้าหลัก...</p>
         </div>
     );
  }

  if (currentStep === 'warning') {
     return (
         <div className="h-screen w-full bg-red-600 flex flex-col items-center justify-center p-8 text-center font-sans">
             <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-lg w-full space-y-6 animate-pulse">
                 <AlertTriangle className="w-16 h-16 text-red-600 mx-auto"/>
                 <h2 className="text-3xl font-bold text-red-700">แจ้งเตือนระบบความปลอดภัย</h2>
                 <p className="text-slate-600">กรุณาติดต่อเจ้าหน้าที่เพื่อยืนยันตัวตนอีกครั้ง</p>
                 <button onClick={resetSystem} className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900">กลับสู่หน้าหลัก</button>
             </div>
         </div>
     );
  }

  return null;
};

// ============================================================================
// 3. COMPONENT: LIVE DASHBOARD (หน้าจอกรรมการ - แสดงผล)
// ============================================================================

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

// ============================================================================
// 4. COMPONENT: PARTY INFO (หน้าข้อมูลพรรค - ประชาสัมพันธ์)
// ============================================================================

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

// ============================================================================
// 5. MAIN APP ROUTER (ตัวจัดการหน้า)
// ============================================================================

const App = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#dashboard') return <LiveDashboard />;
  if (route === '#info') return <PartyInfo />;

  return <VotingKiosk />;
};

export default App;