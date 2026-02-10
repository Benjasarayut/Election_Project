import React, { useState, useEffect } from 'react';
import { User, AlertTriangle, CheckCircle, ChevronRight, Fingerprint, MapPin, Flag, Vote, AlertCircle, Search, FileText } from 'lucide-react';

/**
 * ระบบเลือกตั้งอิเล็กทรอนิกส์ (Electronic Voting System)
 * Version: 1.3.0 (Terms & Conditions Added)
 */

const App = () => {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState('home');
  const [nationalID, setNationalID] = useState('');
  const [selectedMP, setSelectedMP] = useState(null);
  const [selectedParty, setSelectedParty] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const [votedIDs, setVotedIDs] = useState([]); 

  // --- Mock Data ---
  const mockUserData = {
    name: "นายรักชาติ ยิ่งชีพ",
    age: 25,
    district: "เขตเลือกตั้งที่ 1 กรุงเทพมหานคร",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  };

  const mpCandidates = [
    { id: 1, name: "นายกไก่ ใจซื่อ", number: 1, party: "พรรคพัฒนาไทย", color: "bg-red-500" },
    { id: 2, name: "นายขไข่ ใฝ่ดี", number: 2, party: "พรรคอนาคตไกล", color: "bg-blue-500" },
    { id: 3, name: "นางสาวคควาย รักจริง", number: 3, party: "พรรคพลังใหม่", color: "bg-green-500" },
    { id: 4, name: "ไม่ประสงค์ลงคะแนน", number: 0, party: "-", color: "bg-gray-400" },
  ];

  const parties = [
    { id: 1, name: "พรรคพัฒนาไทย", number: 1, logo: "🐘" },
    { id: 2, name: "พรรคอนาคตไกล", number: 2, logo: "🚀" },
    { id: 3, name: "พรรคพลังใหม่", number: 3, logo: "⚡" },
    { id: 4, name: "ไม่ประสงค์ลงคะแนน", number: 0, logo: "❌" },
  ];

  // --- Functions ---
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
    setVotedIDs([...votedIDs, nationalID]);
    changeStep('success');
  };

  // --- Keyboard Support for ID Input ---
  useEffect(() => {
    if (currentStep !== 'input_id') return;

    const handleKeyDown = (e) => {
      // Number keys (0-9)
      if (/^\d$/.test(e.key)) {
        if (nationalID.length < 13) {
          setNationalID(prev => prev + e.key);
          setErrorMessage('');
        }
      } 
      // Backspace
      else if (e.key === 'Backspace') {
        setNationalID(prev => prev.slice(0, -1));
        setErrorMessage('');
      } 
      // Enter
      else if (e.key === 'Enter') {
        if (nationalID.length === 13) {
          if (votedIDs.includes(nationalID)) {
            setErrorMessage('หมายเลขบัตรประชาชนนี้ได้ใช้สิทธิเลือกตั้งไปแล้ว');
          } else {
            setSearchTerm(''); // Reset search term (mimics changeStep)
            setCurrentStep('verify_identity');
          }
        }
      } 
      // Escape or 'c' to clear
      else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        setNationalID('');
        setErrorMessage('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, nationalID, votedIDs]);

  // --- Render Steps ---

  // 1. Home
  if (currentStep === 'home') {
    return (
      <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-500 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="z-10 text-center space-y-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider drop-shadow-lg">
            ระบบเลือกตั้งอิเล็กทรอนิกส์
          </h1>
          <p className="text-xl text-slate-300">ปลอดภัย • โปร่งใส • ตรวจสอบได้</p>
          
          <button 
            onClick={() => changeStep('input_id')}
            className="group relative inline-flex items-center justify-center px-12 py-8 text-2xl font-bold text-white transition-all duration-200 bg-blue-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 active:scale-95 shadow-2xl hover:bg-blue-700 hover:shadow-blue-500/30"
          >
            <Vote className="w-8 h-8 mr-4" />
            ใช้สิทธิเลือกตั้ง
          </button>
        </div>
        
        <div className="absolute bottom-4 text-slate-500 text-sm">
          Version 1.3.0 (Stable Build)
        </div>
      </div>
    );
  }

  // 2. Input ID
  if (currentStep === 'input_id') {
    const handleNumClick = (num) => {
      if (nationalID.length < 13) {
        setNationalID(nationalID + num);
        setErrorMessage(''); 
      }
    };
    const handleDelete = () => {
      setNationalID(nationalID.slice(0, -1));
      setErrorMessage('');
    };
    
    const handleSubmit = () => {
      if (nationalID.length === 13) {
        if (votedIDs.includes(nationalID)) {
          setErrorMessage('หมายเลขบัตรประชาชนนี้ได้ใช้สิทธิเลือกตั้งไปแล้ว');
        } else {
          changeStep('verify_identity');
        }
      }
    };

    return (
      <div className="h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-slate-800">กรุณาระบุเลขบัตรประชาชน</h2>
          
          <div className={`bg-slate-100 p-4 rounded-xl text-center border-2 transition-colors ${errorMessage ? 'border-red-500 bg-red-50' : 'border-transparent'}`}>
            <span className={`text-3xl font-mono tracking-widest ${nationalID ? 'text-slate-800' : 'text-slate-400'}`}>
              {nationalID || "_ _ _ _ _ _ _ _ _ _ _ _ _"}
            </span>
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center gap-2 text-red-600 animate-bounce">
              <AlertCircle size={20} />
              <span className="font-bold text-sm">{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleNumClick(num)} className="h-16 text-2xl font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-sm">
                {num}
              </button>
            ))}
            <button onClick={() => { setNationalID(''); setErrorMessage(''); }} className="h-16 text-red-500 font-bold bg-white border-2 border-red-100 rounded-xl hover:bg-red-50 transition-colors shadow-sm">C</button>
            <button onClick={() => handleNumClick(0)} className="h-16 text-2xl font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-colors shadow-sm">0</button>
            <button onClick={handleDelete} className="h-16 text-slate-600 font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">⌫</button>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={nationalID.length !== 13}
            className={`w-full py-4 text-xl font-bold rounded-xl transition-all shadow-lg ${
              nationalID.length === 13 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/40 transform hover:-translate-y-1' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            ตรวจสอบข้อมูล
          </button>
        </div>
      </div>
    );
  }

  // 3. Verify Identity
  if (currentStep === 'verify_identity') {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">ยืนยันตัวตนผู้ใช้สิทธิ</h2>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 bg-slate-200 rounded-full overflow-hidden border-4 border-blue-100 flex-shrink-0 shadow-inner">
              <img src={mockUserData.image} alt="User" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <p className="text-sm text-slate-500">เลขบัตรประชาชน</p>
                <p className="text-xl font-mono font-bold text-slate-800 tracking-wide">{nationalID}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">ชื่อ-นามสกุล</p>
                <p className="text-2xl font-bold text-slate-900">{mockUserData.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">หน่วยเลือกตั้ง</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 font-medium">
                  <MapPin size={18} />
                  <span>{mockUserData.district}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 flex gap-4 border-t border-slate-100">
            <button 
              onClick={() => changeStep('warning')}
              className="flex-1 py-4 bg-white border-2 border-red-500 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <AlertTriangle size={24} />
              ไม่ใช่ตัวตนของฉัน
            </button>
            <button 
              onClick={() => changeStep('terms_conditions')} // เปลี่ยนให้ไปหน้าเงื่อนไข
              className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 hover:shadow-green-500/30"
            >
              <Fingerprint size={24} />
              ยืนยันตัวตนถูกต้อง
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3.5 Terms and Conditions (หน้าใหม่)
  if (currentStep === 'terms_conditions') {
    return (
      <div className="h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bg-slate-800 p-6 text-white flex items-center gap-3">
            <FileText size={28} />
            <h2 className="text-2xl font-bold">ข้อตกลงและเงื่อนไขการเลือกตั้ง</h2>
          </div>

          <div className="p-8 overflow-y-auto flex-1">
            <div className="space-y-6 text-slate-700">
              <p className="font-bold text-lg text-slate-900">โปรดอ่านและทำความเข้าใจก่อนดำเนินการต่อ:</p>
              
              <ul className="space-y-4 list-disc pl-5">
                <li>
                  <span className="font-bold text-slate-900">การยืนยันตัวตน:</span> ข้าพเจ้าขอยืนยันว่าเป็นเจ้าของบัตรประชาชนและเป็นผู้มีสิทธิเลือกตั้งที่ถูกต้องตามกฎหมายจริง
                </li>
                <li>
                  <span className="font-bold text-slate-900">ความเป็นอิสระ:</span> ข้าพเจ้าจะลงคะแนนด้วยตนเองอย่างอิสระ ปราศจากการชี้นำ ข่มขู่ หรือจูงใจด้วยทรัพย์สินเงินทองจากผู้ใด
                </li>
                <li>
                  <span className="font-bold text-slate-900">ความลับ:</span> ข้าพเจ้ารับทราบว่าผลการลงคะแนนจะเป็นความลับ และห้ามมิให้ถ่ายภาพ บันทึกวิดีโอ หรือนำผลการลงคะแนนส่วนบุคคลไปเผยแพร่ต่อสาธารณะ
                </li>
                <li>
                  <span className="font-bold text-slate-900">บทลงโทษ:</span> ข้าพเจ้ารับทราบว่าการสวมสิทธิ์ การลงคะแนนซ้ำ หรือการกระทำผิดกฎหมายเลือกตั้ง มีโทษทั้งจำและปรับตามที่กฎหมายกำหนด
                </li>
              </ul>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mt-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  เมื่อกดยอมรับ ระบบจะบันทึกเวลาการเข้าใช้สิทธิเพื่อเป็นหลักฐานในการตรวจสอบ
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-4">
            <button 
              onClick={() => changeStep('home')}
              className="px-6 py-3 bg-white text-slate-600 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              onClick={() => changeStep('vote_mp')}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all hover:shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              ข้าพเจ้ายอมรับและดำเนินการต่อ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3.1 Warning
  if (currentStep === 'warning') {
    return (
      <div className="h-screen w-full bg-red-600 flex flex-col items-center justify-center p-8 text-center font-sans">
        <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-lg w-full space-y-6 animate-pulse">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-red-700">แจ้งเตือนระบบความปลอดภัย</h2>
          <p className="text-xl text-slate-700 leading-relaxed">
            กรุณาติดต่อเจ้าหน้าที่ประจำหน่วยเลือกตั้งโดยด่วน <br/>เพื่อตรวจสอบข้อมูล
          </p>
          <button 
            onClick={resetSystem}
            className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-lg"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // 4. Vote MP
  if (currentStep === 'vote_mp') {
    const filteredMPs = mpCandidates.filter(candidate => {
      const search = searchTerm.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(search) ||
        candidate.party.toLowerCase().includes(search) ||
        candidate.number.toString().includes(search)
      );
    });

    return (
      <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
        <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">1</div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">เลือกสมาชิกสภาผู้แทนราษฎร (ส.ส.)</h2>
              <p className="text-sm text-slate-500">แบบแบ่งเขตเลือกตั้ง</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-slate-400">ผู้ใช้สิทธิ</p>
            <p className="font-bold text-slate-700">{mockUserData.name}</p>
          </div>
        </div>

        <div className="px-6 pt-6 pb-2 sticky top-[80px] z-10 bg-slate-100">
          <div className="max-w-5xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อผู้สมัคร, ชื่อพรรค หรือหมายเลข (เช่น 'เบอร์ 1' หรือ 'พัฒนาไทย')" 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto pb-20">
            {filteredMPs.length > 0 ? (
              filteredMPs.map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => setSelectedMP(candidate)}
                  className={`relative p-6 rounded-2xl border-4 transition-all duration-200 flex items-center gap-6 group text-left
                    ${selectedMP?.id === candidate.id 
                      ? 'border-green-500 bg-green-50 ring-4 ring-green-200 transform scale-[1.02] shadow-xl' 
                      : 'border-white bg-white hover:border-blue-200 shadow-sm hover:shadow-md'
                    }`}
                >
                  {selectedMP?.id === candidate.id && (
                    <div className="absolute top-4 right-4 text-green-500">
                      <CheckCircle className="w-8 h-8 fill-green-500 text-white" />
                    </div>
                  )}
                  <div className={`w-24 h-24 ${candidate.color} rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-inner flex-shrink-0`}>
                    {candidate.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{candidate.name}</h3>
                    <p className="text-slate-500 text-lg">{candidate.party}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-500 py-10 flex flex-col items-center">
                <Search size={48} className="text-slate-300 mb-4" />
                <p className="text-xl">ไม่พบข้อมูลที่ค้นหา</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-200 fixed bottom-0 w-full z-20">
          <div className="max-w-5xl mx-auto flex justify-end h-16 items-center">
            {selectedMP && (
              <button 
                onClick={() => changeStep('vote_party')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xl font-bold hover:bg-blue-700 flex items-center gap-3 shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1"
              >
                ถัดไป <ChevronRight />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 5. Vote Party
  if (currentStep === 'vote_party') {
    const filteredParties = parties.filter(p => {
      const search = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(search) ||
        p.number.toString().includes(search)
      );
    });

    return (
      <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
        <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">2</div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">เลือกพรรคการเมือง</h2>
              <p className="text-sm text-slate-500">แบบบัญชีรายชื่อ</p>
            </div>
          </div>
          <button 
            onClick={() => changeStep('vote_mp')} 
            className="text-slate-400 hover:text-slate-600 underline font-medium"
          >
            กลับไปแก้ไข ส.ส. เขต
          </button>
        </div>

        <div className="px-6 pt-6 pb-2 sticky top-[80px] z-10 bg-slate-100">
          <div className="max-w-5xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อพรรค หรือหมายเลข (เช่น 'เบอร์ 2' หรือ 'อนาคตไกล')" 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none shadow-sm transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto pb-20">
            {filteredParties.length > 0 ? (
              filteredParties.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedParty(p)}
                  className={`relative p-6 rounded-2xl border-4 transition-all duration-200 flex items-center gap-6 text-left
                    ${selectedParty?.id === p.id 
                      ? 'border-purple-500 bg-purple-50 ring-4 ring-purple-200 transform scale-[1.02] shadow-xl' 
                      : 'border-white bg-white hover:border-purple-200 shadow-sm hover:shadow-md'
                    }`}
                >
                  {selectedParty?.id === p.id && (
                    <div className="absolute top-4 right-4 text-purple-500">
                      <CheckCircle className="w-8 h-8 fill-purple-500 text-white" />
                    </div>
                  )}
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-4xl border border-slate-200 flex-shrink-0">
                    {p.logo}
                  </div>
                  <div>
                    <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm font-bold mb-2 inline-block">เบอร์ {p.number}</span>
                    <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center text-slate-500 py-10 flex flex-col items-center">
                <Search size={48} className="text-slate-300 mb-4" />
                <p className="text-xl">ไม่พบข้อมูลที่ค้นหา</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-200 fixed bottom-0 w-full z-20">
          <div className="max-w-5xl mx-auto flex justify-end h-16 items-center">
            {selectedParty && (
              <button 
                onClick={handleConfirmVote}
                className="bg-green-600 text-white px-12 py-3 rounded-xl text-xl font-bold hover:bg-green-700 flex items-center gap-3 shadow-lg hover:shadow-green-500/40 transition-all transform hover:-translate-y-1"
              >
                <Vote className="w-6 h-6" />
                โหวตเสร็จสิ้น
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 6. Success
  if (currentStep === 'success') {
    setTimeout(resetSystem, 3000);

    return (
      <div className="h-screen w-full bg-green-600 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-white opacity-10" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="z-10 flex flex-col items-center space-y-8 animate-fade-in">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold drop-shadow-md">บันทึกคะแนนสำเร็จ</h1>
            <p className="text-2xl opacity-90">ขอบคุณที่ใช้สิทธิเลือกตั้ง</p>
          </div>

          <div className="mt-12 p-6 bg-green-700/50 rounded-2xl border border-green-400/30 backdrop-blur-sm max-w-md w-full shadow-xl">
             <h3 className="text-lg font-bold mb-4 border-b border-white/20 pb-2">สรุปการลงคะแนน</h3>
             <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-80">ส.ส. เขต:</span>
                  <span className="font-bold text-lg">{selectedMP?.name} (เบอร์ {selectedMP?.number})</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">พรรค:</span>
                  <span className="font-bold text-lg">{selectedParty?.name} (เบอร์ {selectedParty?.number})</span>
                </div>
             </div>
          </div>

          <p className="absolute bottom-8 text-sm animate-pulse opacity-80">กำลังกลับสู่หน้าหลัก...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default App;