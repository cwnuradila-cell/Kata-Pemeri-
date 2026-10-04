import React, { useState } from 'react';
import { UserPlus, X, Sparkles, Check } from 'lucide-react';
import { Student, TP_DESCRIPTIONS } from '../types';
import { soundManager } from '../utils/soundEffects';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
  existingClasses: string[];
}

const AVATAR_OPTIONS = ['👧', '👦', '🧒', '👧🏽', '👦🏻', '👧🏻', '🧑‍🦱', '🧒🏽', '🧕', '🧢', '🎒', '⭐'];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  existingClasses,
}) => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState(existingClasses[0] || '3 Cemerlang');
  const [customClass, setCustomClass] = useState('');
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [avatar, setAvatar] = useState('👦');
  const [initialTP, setInitialTP] = useState<number>(3);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Sila masukkan nama murid.');
      return;
    }

    const finalClassName = isCustomClass
      ? customClass.trim() || '3 Cemerlang'
      : selectedClass;

    const baseScore = Math.min(100, Math.max(30, initialTP * 16));

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      avatar,
      class: finalClassName,
      currentTP: initialTP,
      grammarStats: {
        ialahFrasaNama: baseScore,
        adalahFrasaAdjektif: Math.max(30, baseScore - 5),
        adalahFrasaSendiNama: Math.max(30, baseScore - 5),
        analisisKesalahan: Math.max(25, baseScore - 10),
        keseluruhanKataPemeri: baseScore,
      },
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      lastActive: 'Baru sahaja didaftarkan',
      notes: notes.trim() || `Daftar kelas ${finalClassName}. Bermula pada TP ${initialTP}.`,
    };

    soundManager.playLevelUp();
    onAddStudent(newStudent);
    onClose();

    // Reset form
    setName('');
    setCustomClass('');
    setIsCustomClass(false);
    setNotes('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-blue-300 relative animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-fun text-2xl font-bold text-slate-900">
              Tambah Murid Baharu
            </h2>
            <p className="text-xs text-slate-500">
              Daftar murid dan kelas untuk pentaksiran PBD Cikgu Eva AI
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* 1. Nama Murid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Penuh Murid <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Contoh: Ahmad Faris bin Roslan"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            />
          </div>

          {/* 2. Kelas Murid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kelas Murid <span className="text-red-500">*</span>
            </label>

            {!isCustomClass ? (
              <div className="flex gap-2">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white text-slate-800 cursor-pointer"
                >
                  {existingClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                  <option value="3 Bestari">3 Bestari</option>
                  <option value="3 Dedikasi">3 Dedikasi</option>
                  <option value="3 Amanah">3 Amanah</option>
                </select>
                <button
                  type="button"
                  onClick={() => setIsCustomClass(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition whitespace-nowrap cursor-pointer"
                >
                  + Kelas Lain
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customClass}
                  onChange={(e) => setCustomClass(e.target.value)}
                  placeholder="Masukkan nama kelas (cth: 3 Inovatif)"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomClass(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}
          </div>

          {/* 3. Pilihan Avatar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ikon / Avatar Murid
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setAvatar(av);
                  }}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition cursor-pointer ${
                    avatar === av
                      ? 'border-blue-600 bg-blue-50 scale-110 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Tahap Penguasaan Permulaan (TP 1 - TP 6) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tahap Penguasaan (TP) Permulaan: TP {initialTP}
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((tp) => (
                <button
                  key={tp}
                  type="button"
                  onClick={() => {
                    soundManager.playPop();
                    setInitialTP(tp);
                  }}
                  className={`py-2 rounded-xl font-fun font-bold text-xs border-2 transition cursor-pointer ${
                    initialTP === tp
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  TP {tp}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {TP_DESCRIPTIONS[initialTP]?.title}: {TP_DESCRIPTIONS[initialTP]?.desc}
            </p>
          </div>

          {/* 5. Catatan Guru (Pilihan) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Catatan Guru (Pilihan)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Perlukan penekanan pada frasa nama dan kata pemeri"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-fun font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Simpan & Daftarkan Murid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
