import React, { useState, useEffect } from 'react';
import { Vote, AlertCircle, CheckCircle, ChevronRight, MapPin, AlertTriangle, Fingerprint, FileText } from 'lucide-react';
// Import ข้อมูลจากไฟล์กลาง
import { MP_CANDIDATES, PARTIES, saveVote } from '../../data/electionData';

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

  // --- Screens ---
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
                   <button onClick={() => changeStep('warning')} className="flex-1 py-4 bg-white border-2 border-red-500 text-red-600 font-bold rounded-xl hover:bg-red-50">ไม่ใช่ตัวตนของฉัน</button>
                   <button onClick={() => changeStep('terms_conditions')} className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 flex items-center justify-center gap-2"><Fingerprint/> ยืนยันตัวตนถูกต้อง</button>
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

export default VotingKiosk;