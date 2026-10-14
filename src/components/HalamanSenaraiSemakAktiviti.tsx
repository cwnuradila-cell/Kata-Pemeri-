import React, { useState, useEffect, useRef } from 'react';
import { Student, ObservationCriteriaItem, StudentObservationRecord, ActivityPhotoEvidence } from '../types';
import {
  ClipboardCheck,
  Calendar,
  Users,
  Printer,
  Sparkles,
  Search,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Upload,
  Image,
  Trash2,
  Maximize2,
  Plus,
  Camera,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Eye,
  Download,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import {
  loadAllPhotos,
  saveSinglePhoto,
  deletePhotoFromDB,
} from '../utils/photoStorage';

interface HalamanSenaraiSemakAktivitiProps {
  students: Student[];
}

// 10 observation items (Items 1, 8, and 11 removed as requested)
export const OBSERVATION_CRITERIA_LIST: ObservationCriteriaItem[] = [
  // A. Tingkah Laku & Tumpuan
  {
    id: 1,
    sectionCode: 'A',
    sectionTitle: 'A. Tingkah Laku & Tumpuan',
    aspekPemerhatian: 'Murid fokus pada skrin dan tidak terganggu dengan persekitaran.',
  },
  {
    id: 2,
    sectionCode: 'A',
    sectionTitle: 'A. Tingkah Laku & Tumpuan',
    aspekPemerhatian: 'Murid cuba menyelesaikan aktiviti/soalan sehingga tamat.',
  },
  {
    id: 3,
    sectionCode: 'A',
    sectionTitle: 'A. Tingkah Laku & Tumpuan',
    aspekPemerhatian: 'Murid mahu mencuba semula apabila gagal atau kalah.',
  },

  // B. Emosi & Minat
  {
    id: 4,
    sectionCode: 'B',
    sectionTitle: 'B. Emosi & Minat',
    aspekPemerhatian: 'Murid nampak seronok, tersenyum, atau gembira semasa bermain.',
  },
  {
    id: 5,
    sectionCode: 'B',
    sectionTitle: 'B. Emosi & Minat',
    aspekPemerhatian: 'Murid teruja apabila mendapat mata, lencana, atau naik tahap.',
  },
  {
    id: 6,
    sectionCode: 'B',
    sectionTitle: 'B. Emosi & Minat',
    aspekPemerhatian: 'Murid tidak menunjuk tanda bosan atau putus asa.',
  },

  // C. Pemikiran & Pembelajaran
  {
    id: 7,
    sectionCode: 'C',
    sectionTitle: 'C. Pemikiran & Pembelajaran',
    aspekPemerhatian: 'Murid berfikir sebelum membuat pilihan / jawapan.',
  },
  {
    id: 8,
    sectionCode: 'C',
    sectionTitle: 'C. Pemikiran & Pembelajaran',
    aspekPemerhatian: 'Murid faham kesilapan selepas membaca/melihat maklum balas (feedback).',
  },

  // D. Penggunaan Aplikasi
  {
    id: 9,
    sectionCode: 'D',
    sectionTitle: 'D. Penggunaan Aplikasi',
    aspekPemerhatian: 'Murid tahu butang apa yang nak ditekan (mudah diguna).',
  },
  {
    id: 10,
    sectionCode: 'D',
    sectionTitle: 'D. Penggunaan Aplikasi',
    aspekPemerhatian: 'Murid tidak berdepan masalah teknikal (sistem tersangkut/keliru).',
  },
];

const DEFAULT_GROUPS = [
  'Kumpulan Waja (Bomba)',
  'Kumpulan Satria (Polis)',
  'Kumpulan Persona (Doktor)',
  'Kumpulan Gemilang (Penyelamat)',
];

const QUICK_NOTES: Record<number, string[]> = {
  1: ['Tumpuan 100% pada skrin', 'Tidak peduli gangguan luar', 'Mudah terganggu'],
  2: ['Selesai semua 6 cabaran', 'Tekun menjawab', 'Berhenti sebelum selesai'],
  3: ['Segera tekan cuba semula', 'Tidak mudah mengaku kalah', 'Sedikit kecewa'],
  4: ['Ketawa dan ceria', 'Tersenyum bangga', 'Kelihatan neutral'],
  5: ['Sorak gembira naik TP', 'Bangga tunjuk lencana', 'Puas hati'],
  6: ['Kekal cergas sepanjang sesi', 'Tiada tanda mengantuk', 'Perlukan rehat pendek'],
  7: ['Membaca ayat dengan teliti', 'Membandingkan ialah & adalah', 'Menjawab secara terburu-buru'],
  8: ['Faham ulasan petua Cikgu Melati', 'Betulkan jawapan serta-merta', 'Ulang kesilapan sama'],
  9: ['Antara muka sangat mesra', 'Cepat faham butang bimbingan', 'Perlu bantuan tekan'],
  10: ['Aplikasi lancar tanpa gangguan', 'Suara audio jelas', 'Sambungan baik'],
};

// High quality initial sample photos
const INITIAL_SAMPLE_PHOTOS: ActivityPhotoEvidence[] = [
  {
    id: 'photo-sample-1',
    title: 'Sesi Latihan Interaktif Murid & Tablet',
    caption: 'Murid tekun mencuba latihan mengisi tempat kosong kata pemeri "ialah" & "adalah" di makmal komputer.',
    date: new Date().toISOString().split('T')[0],
    groupName: 'Kumpulan Waja (Bomba)',
    studentName: 'Nur Aisyah Humaira',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e3a8a"/><stop offset="100%" stop-color="%230284c7"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g1)" rx="24"/><circle cx="300" cy="160" r="60" fill="%23fef08a"/><text x="300" y="175" font-size="54" text-anchor="middle" font-family="sans-serif">👧💻</text><text x="300" y="270" font-size="22" font-weight="bold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">Evidens 1: Sesi Pembelajaran Interaktif</text><text x="300" y="305" font-size="15" fill="%23bae6fd" text-anchor="middle" font-family="sans-serif">Murid tekun menjawab soalan Kata Pemeri KSSR SK</text><rect x="50" y="340" width="500" height="30" rx="8" fill="%23ffffff" opacity="0.15"/><text x="300" y="360" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">Kelas Cikgu Adila • Bimbingan Cikgu Melati</text></svg>',
  },
  {
    id: 'photo-sample-2',
    title: 'Perbincangan Kumpulan Beringat Sebelum Kena',
    caption: 'Aktiviti berkumpulan memadankan Frasa Nama dengan "ialah" dan Frasa Sendi Nama/Adjektif dengan "adalah".',
    date: new Date().toISOString().split('T')[0],
    groupName: 'Kumpulan Satria (Polis)',
    studentName: 'Muhammad Adam Haris',
    dataUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23065f46"/><stop offset="100%" stop-color="%2310b981"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g2)" rx="24"/><circle cx="300" cy="160" r="60" fill="%23fed7aa"/><text x="300" y="175" font-size="54" text-anchor="middle" font-family="sans-serif">👦🤝👦</text><text x="300" y="270" font-size="22" font-weight="bold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">Evidens 2: Perbincangan Kumpulan Koperatif</text><text x="300" y="305" font-size="15" fill="%23d1fae5" text-anchor="middle" font-family="sans-serif">Buku Teks m/s 57 "Beringat Sebelum Kena"</text><rect x="50" y="340" width="500" height="30" rx="8" fill="%23ffffff" opacity="0.15"/><text x="300" y="360" font-size="12" font-weight="bold" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">Pentaksiran Bilik Darjah (PBD) • 10 Aspek Penglibatan</text></svg>',
  },
];

export const HalamanSenaraiSemakAktiviti: React.FC<HalamanSenaraiSemakAktivitiProps> = ({
  students,
}) => {
  const todayFormatted = new Date().toISOString().split('T')[0];
  const [activityDate, setActivityDate] = useState<string>(todayFormatted);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || 's1'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<string>('Semua');
  const [activityName, setActivityName] = useState<string>(
    'Aktiviti Pengukuhan Kata Pemeri ("ialah" & "adalah") bersama Cikgu Melati'
  );

  // View switch: 'semua' (All), 'senaraiSemak' (Only checklist), 'galeriGambar' (Only photo gallery)
  const [activeSectionTab, setActiveSectionTab] = useState<'semua' | 'senaraiSemak' | 'galeriGambar'>('semua');

  // Photo gallery filters
  const [galleryStudentFilter, setGalleryStudentFilter] = useState<string>('Semua');
  const [galleryGroupFilter, setGalleryGroupFilter] = useState<string>('Semua');
  const [gallerySearch, setGallerySearch] = useState<string>('');

  // Storage keys
  const STORAGE_KEY_RECORDS = 'bm_kssr_senarai_semak_pemerhatian_v3';

  // Photo Evidence State loaded from IndexedDB + localStorage
  const [photos, setPhotos] = useState<ActivityPhotoEvidence[]>(INITIAL_SAMPLE_PHOTOS);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState<boolean>(true);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);

  // Load photos persistently on mount
  useEffect(() => {
    loadAllPhotos(INITIAL_SAMPLE_PHOTOS).then((loaded) => {
      setPhotos(loaded);
      setIsLoadingPhotos(false);
    });
  }, []);

  // Modal / Zoom Image State
  const [previewingPhoto, setPreviewingPhoto] = useState<ActivityPhotoEvidence | null>(null);

  // Upload Form Inputs State
  const [isUploadingOpen, setIsUploadingOpen] = useState<boolean>(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');
  const [newPhotoGroup, setNewPhotoGroup] = useState<string>(DEFAULT_GROUPS[0]);
  const [newPhotoStudent, setNewPhotoStudent] = useState<string>(students[0]?.name || '');
  const [pendingImageDataUrl, setPendingImageDataUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State: Record for every student
  const [records, setRecords] = useState<Record<string, StudentObservationRecord>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }

    // Default pre-filled data based on student TP level
    const initial: Record<string, StudentObservationRecord> = {};
    students.forEach((s, idx) => {
      const assignedGroup = DEFAULT_GROUPS[idx % DEFAULT_GROUPS.length];
      const isHigh = s.currentTP >= 5;
      const isLow = s.currentTP <= 2;

      const itemsMap: Record<number, { status: boolean; catatan: string }> = {};
      OBSERVATION_CRITERIA_LIST.forEach((crit) => {
        let defaultStatus = true;
        let defaultNote = '';

        if (crit.id === 7 || crit.id === 8) {
          defaultStatus = isHigh || !isLow;
          defaultNote = defaultStatus ? 'Menunjukkan pemikiran gramatis' : 'Perlu bimbingan intervensi';
        } else if (crit.id === 3 && isLow) {
          defaultStatus = false;
          defaultNote = 'Perlu dorongan berterusan';
        } else {
          defaultNote = QUICK_NOTES[crit.id]?.[0] || 'Tercapai dengan baik';
        }

        itemsMap[crit.id] = {
          status: defaultStatus,
          catatan: defaultNote,
        };
      });

      initial[s.id] = {
        studentId: s.id,
        studentName: s.name,
        groupName: assignedGroup,
        activityDate: todayFormatted,
        className: s.class,
        activityName: 'Aktiviti Pengukuhan Kata Pemeri ("ialah" & "adalah") bersama Cikgu Melati',
        items: itemsMap,
        catatanKeseluruhan: isHigh
          ? 'Murid menunjukkan motivasi dan penguasaan tatabahasa yang amat cemerlang.'
          : isLow
          ? 'Murid seronok bermain tetapi masih memerlukan bimbingan guru dalam konsep frasa.'
          : 'Penglibatan aktif, memberi tindak balas positif terhadap maklum balas Cikgu Melati.',
      };
    });

    return initial;
  });

  // Save records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch {
      // ignore
    }
  }, [records]);

  // Current selected student record
  const currentRecord = records[selectedStudentId] || {
    studentId: selectedStudentId,
    studentName: students.find((s) => s.id === selectedStudentId)?.name || 'Murid',
    groupName: DEFAULT_GROUPS[0],
    activityDate: activityDate,
    className: students.find((s) => s.id === selectedStudentId)?.class || '3 Cemerlang',
    activityName: activityName,
    items: {},
    catatanKeseluruhan: '',
  };

  // Toggle Ya / Tidak for a criteria item
  const handleToggleStatus = (itemId: number, newStatus: boolean) => {
    soundManager.playPop();
    setRecords((prev) => {
      const studentRec = prev[selectedStudentId] || { ...currentRecord };
      const currentItem = studentRec.items[itemId] || { status: true, catatan: '' };

      return {
        ...prev,
        [selectedStudentId]: {
          ...studentRec,
          items: {
            ...studentRec.items,
            [itemId]: {
              ...currentItem,
              status: newStatus,
            },
          },
        },
      };
    });
  };

  // Update Catatan for a criteria item
  const handleUpdateItemNote = (itemId: number, note: string) => {
    setRecords((prev) => {
      const studentRec = prev[selectedStudentId] || { ...currentRecord };
      const currentItem = studentRec.items[itemId] || { status: true, catatan: '' };

      return {
        ...prev,
        [selectedStudentId]: {
          ...studentRec,
          items: {
            ...studentRec.items,
            [itemId]: {
              ...currentItem,
              catatan: note,
            },
          },
        },
      };
    });
  };

  // Update Student Group Name
  const handleUpdateGroupName = (newGroup: string) => {
    soundManager.playPop();
    setRecords((prev) => {
      const studentRec = prev[selectedStudentId] || { ...currentRecord };
      return {
        ...prev,
        [selectedStudentId]: {
          ...studentRec,
          groupName: newGroup,
        },
      };
    });
  };

  // Update Overall Teacher Comment
  const handleUpdateOverallNote = (note: string) => {
    setRecords((prev) => {
      const studentRec = prev[selectedStudentId] || { ...currentRecord };
      return {
        ...prev,
        [selectedStudentId]: {
          ...studentRec,
          catatanKeseluruhan: note,
        },
      };
    });
  };

  // Handle Image File Selection & Downscale compression via Canvas
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // High quality scale down to max 1200px
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPendingImageDataUrl(compressedDataUrl);
          setNewPhotoTitle(`Aktiviti ${currentRecord.studentName} (${currentRecord.groupName})`);
          setNewPhotoCaption(`Evidens bergambar penglibatan aktif murid semasa aktiviti Kata Pemeri.`);
          setNewPhotoGroup(currentRecord.groupName);
          setNewPhotoStudent(currentRecord.studentName);
          setIsCompressing(false);
          setIsUploadingOpen(true);
        } else {
          setPendingImageDataUrl(event.target?.result as string);
          setNewPhotoTitle(`Aktiviti ${currentRecord.studentName} (${currentRecord.groupName})`);
          setNewPhotoCaption(`Evidens bergambar penglibatan aktif murid semasa aktiviti Kata Pemeri.`);
          setNewPhotoGroup(currentRecord.groupName);
          setNewPhotoStudent(currentRecord.studentName);
          setIsCompressing(false);
          setIsUploadingOpen(true);
        }
      };
      img.onerror = () => {
        setIsCompressing(false);
        alert('Gagal memuat fail imej. Sila pilih fail gambar format JPG, PNG, atau WEBP.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Save new photo evidence to IndexedDB & state
  const handleSavePhotoEvidence = async () => {
    if (!pendingImageDataUrl) return;

    soundManager.playSuccess();
    const newEvidence: ActivityPhotoEvidence = {
      id: `photo-${Date.now()}`,
      dataUrl: pendingImageDataUrl,
      title: newPhotoTitle.trim() || `Evidens Aktiviti ${newPhotoStudent || currentRecord.studentName}`,
      caption: newPhotoCaption.trim() || 'Murid memberi tumpuan dan menyelesaikan aktiviti tatabahasa.',
      date: activityDate,
      groupName: newPhotoGroup || currentRecord.groupName,
      studentName: newPhotoStudent || currentRecord.studentName,
    };

    // Save persistently to IndexedDB
    await saveSinglePhoto(newEvidence);

    setPhotos((prev) => [newEvidence, ...prev]);
    setPendingImageDataUrl(null);
    setNewPhotoTitle('');
    setNewPhotoCaption('');
    setIsUploadingOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Show confirmation toast and auto-switch to gallery so they see their uploaded photo immediately!
    setSaveToastMessage(`Gambar "${newEvidence.title}" berjaya dimuat naik & disimpan!`);
    setActiveSectionTab('galeriGambar');
    setTimeout(() => {
      setSaveToastMessage(null);
    }, 4500);
  };

  // Delete photo evidence from IndexedDB & state
  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm('Adakah anda pasti mahu memadamkan gambar evidens aktiviti ini?')) {
      soundManager.playPop();
      await deletePhotoFromDB(photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (previewingPhoto?.id === photoId) {
        setPreviewingPhoto(null);
      }
      setSaveToastMessage('Gambar evidens telah dipadam.');
      setTimeout(() => setSaveToastMessage(null), 3000);
    }
  };

  // Calculate current score
  const totalItems = OBSERVATION_CRITERIA_LIST.length; // 10
  const countYa = Object.values(currentRecord.items || {}).filter((i) => i.status).length;
  const countTidak = totalItems - countYa;
  const percentageScore = Math.round((countYa / totalItems) * 100);

  // Photos for current selected student
  const studentPhotos = photos.filter(
    (p) => p.studentName === currentRecord.studentName || p.groupName === currentRecord.groupName
  );

  // Filtered photos for gallery view
  const filteredGalleryPhotos = photos.filter((photo) => {
    const matchStudent =
      galleryStudentFilter === 'Semua' || photo.studentName === galleryStudentFilter;
    const matchGroup =
      galleryGroupFilter === 'Semua' || photo.groupName === galleryGroupFilter;
    const matchSearch =
      gallerySearch === '' ||
      photo.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
      photo.caption.toLowerCase().includes(gallerySearch.toLowerCase()) ||
      (photo.studentName && photo.studentName.toLowerCase().includes(gallerySearch.toLowerCase()));
    return matchStudent && matchGroup && matchSearch;
  });

  // Navigate next/prev in preview modal
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewingPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === previewingPhoto.id);
    if (currentIndex > 0) {
      setPreviewingPhoto(photos[currentIndex - 1]);
    } else {
      setPreviewingPhoto(photos[photos.length - 1]);
    }
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewingPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === previewingPhoto.id);
    if (currentIndex < photos.length - 1) {
      setPreviewingPhoto(photos[currentIndex + 1]);
    } else {
      setPreviewingPhoto(photos[0]);
    }
  };

  // Group sections
  const sections = [
    { code: 'A', title: 'A. Tingkah Laku & Tumpuan', color: 'bg-blue-600' },
    { code: 'B', title: 'B. Emosi & Minat', color: 'bg-emerald-600' },
    { code: 'C', title: 'C. Pemikiran & Pembelajaran', color: 'bg-purple-600' },
    { code: 'D', title: 'D. Penggunaan Aplikasi', color: 'bg-amber-600' },
  ];

  const handlePrint = () => {
    soundManager.playPop();
    window.print();
  };

  // Filter students for sidebar
  const filteredStudents = students.filter((s) => {
    const rec = records[s.id];
    const groupMatches = groupFilter === 'Semua' || rec?.groupName === groupFilter;
    const nameMatches = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return groupMatches && nameMatches;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {saveToastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-emerald-400 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs font-bold">{saveToastMessage}</span>
          <button
            type="button"
            onClick={() => setSaveToastMessage(null)}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. SCREEN HEADER BANNER (Hidden on print) */}
      {/* ======================================================== */}
      <div className="print:hidden bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-radial from-white/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs mb-3 border border-white/30 backdrop-blur-sm">
              <ClipboardCheck className="w-4 h-4 text-yellow-300" />
              Borang Instrumen Pemerhatian Penglibatan Murid & Galeri Evidens Bergambar
            </div>
            <h1 className="font-fun text-2xl md:text-3xl font-extrabold tracking-tight">
              Senarai Semak Penglibatan Murid & Evidens Bergambar
            </h1>
            <p className="text-xs md:text-sm text-teal-100 mt-1 max-w-2xl leading-relaxed">
              Instrumen rasmi pemerhatian aspek tingkah laku, tumpuan, emosi, minat, pemikiran dan kebolehgunaan aplikasi bagi pembelajaran Kata Pemeri ("ialah" & "adalah") di Kelas Cikgu Adila bersama ruangan muat naik dan arkib foto evidens aktiviti.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-semibold text-teal-100">
              <span className="bg-black/20 px-3 py-1 rounded-xl">
                👩‍🏫 Guru: <strong>Cikgu Adila</strong>
              </span>
              <span className="bg-black/20 px-3 py-1 rounded-xl">
                🌸 Pembimbing: <strong>Cikgu Melati</strong>
              </span>
              <span className="bg-black/20 px-3 py-1 rounded-xl">
                📅 Tarikh: <strong>{activityDate}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setActiveSectionTab('galeriGambar');
                }}
                className="bg-emerald-500/40 hover:bg-emerald-500/60 text-white px-3 py-1 rounded-xl border border-emerald-300/40 flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                title="Klik untuk tengok semua gambar yang telah dimuat naik"
              >
                📸 <strong>{photos.length} Evidens Gambar Tersimpan</strong>
                <Eye className="w-3.5 h-3.5 text-yellow-300" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-fun font-bold text-xs shadow-lg transition cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-900" />
              Muat Naik Gambar Baru
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-emerald-950 font-fun font-bold text-xs shadow-lg hover:bg-emerald-50 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </div>

      {/* QUICK VIEW SWITCHER TABS (Borang vs Galeri Gambar vs Semua) */}
      <div className="print:hidden bg-white rounded-2xl p-2 border-2 border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setActiveSectionTab('semua');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-fun font-bold transition cursor-pointer ${
              activeSectionTab === 'semua'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Paparan Lengkap (Borang + Gambar)
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setActiveSectionTab('senaraiSemak');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-fun font-bold transition cursor-pointer ${
              activeSectionTab === 'senaraiSemak'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            Borang Senarai Semak (10 Aspek)
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              setActiveSectionTab('galeriGambar');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-fun font-bold transition cursor-pointer relative ${
              activeSectionTab === 'galeriGambar'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Tengok Galeri Gambar ({photos.length})</span>
            {photos.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        </div>

        <div className="text-xs text-slate-500 font-semibold px-2">
          {activeSectionTab === 'galeriGambar' ? (
            <span>🔍 Menampilkan foto evidens murid & PdP</span>
          ) : (
            <span>👤 Murid Terpilih: <strong>{currentRecord.studentName}</strong> ({currentRecord.groupName})</span>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PRINT-ONLY OFFICIAL KPM / PBD INSTRUMENT LAYOUT */}
      {/* ======================================================== */}
      <div className="hidden print:block font-sans text-black p-4 space-y-4">
        {/* Official Header */}
        <div className="border-b-2 border-black pb-3 text-center space-y-1">
          <div className="text-[12px] font-bold tracking-widest uppercase">
            KEMENTERIAN PENDIDIKAN MALAYSIA • PENTAKSIRAN BILIK DARJAH (PBD)
          </div>
          <div className="text-lg font-extrabold font-fun uppercase">
            BORANG INSTRUMEN SENARAI SEMAK PENGLIBATAN MURID & EVIDENS BERGAMBAR
          </div>
          <div className="text-[11px] font-medium text-slate-700">
            Mata Pelajaran: Bahasa Melayu SK • Tema 3: Keselamatan • Kemahiran 5.1.4 (vii) Kata Pemeri ("ialah" & "adalah")
          </div>
        </div>

        {/* Metadata Details Table */}
        <div className="grid grid-cols-2 gap-2 text-xs border border-black p-3 bg-slate-50/50">
          <div>
            <p><strong>Nama Murid:</strong> {currentRecord.studentName}</p>
            <p><strong>Kelas:</strong> {currentRecord.className}</p>
            <p><strong>Kumpulan:</strong> {currentRecord.groupName}</p>
          </div>
          <div>
            <p><strong>Tarikh Aktiviti:</strong> {currentRecord.activityDate}</p>
            <p><strong>Guru Pemerhati:</strong> Cikgu Adila</p>
            <p><strong>Guru Pembimbing:</strong> Cikgu Melati</p>
          </div>
        </div>

        {/* Observation Table */}
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-black p-2 w-10 text-center">Bil</th>
              <th className="border border-black p-2 text-left">Aspek Pemerhatian</th>
              <th className="border border-black p-2 w-14 text-center">Ya</th>
              <th className="border border-black p-2 w-14 text-center">Tidak</th>
              <th className="border border-black p-2 text-left">Catatan / Ringkasan Ulasan</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((sec) => (
              <React.Fragment key={sec.code}>
                <tr className="bg-slate-100 font-bold">
                  <td colSpan={5} className="border border-black px-2 py-1.5 uppercase">
                    {sec.title}
                  </td>
                </tr>
                {OBSERVATION_CRITERIA_LIST.filter((i) => i.sectionCode === sec.code).map((item) => {
                  const ans = currentRecord.items[item.id] || { status: true, catatan: '' };
                  return (
                    <tr key={item.id}>
                      <td className="border border-black p-1.5 text-center font-bold">{item.id}</td>
                      <td className="border border-black p-1.5">{item.aspekPemerhatian}</td>
                      <td className="border border-black p-1.5 text-center font-bold">
                        {ans.status ? '✓' : ''}
                      </td>
                      <td className="border border-black p-1.5 text-center font-bold">
                        {!ans.status ? '✓' : ''}
                      </td>
                      <td className="border border-black p-1.5 text-slate-800">{ans.catatan}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Summary & Teacher Comments */}
        <div className="border border-black p-3 space-y-2 text-xs">
          <div className="flex justify-between font-bold border-b border-black pb-1">
            <span>Skor Pemerhatian: {countYa} / {totalItems} Ya ({percentageScore}%)</span>
            <span>Status: {percentageScore >= 80 ? 'Penglibatan Sangat Cemerlang & Aktif' : 'Memerlukan Galakan Berterusan'}</span>
          </div>
          <div>
            <strong>Catatan & Ulasan Guru (Cikgu Adila):</strong>
            <p className="mt-1 italic">{currentRecord.catatanKeseluruhan || 'Murid memberi tumpuan baik dan berjaya menguasai peraturan frasa kata pemeri.'}</p>
          </div>
        </div>

        {/* Print Section: Photo Evidence Gallery */}
        {photos.length > 0 && (
          <div className="pt-4 page-break-inside-avoid">
            <div className="text-sm font-bold border-b-2 border-black pb-1 mb-3 uppercase">
              Lampiran: Evidens Bergambar Aktiviti Murid
            </div>
            <div className="grid grid-cols-2 gap-4">
              {photos.slice(0, 4).map((p) => (
                <div key={p.id} className="border border-black p-2 rounded text-xs space-y-1">
                  <div className="w-full h-44 flex items-center justify-center bg-slate-100 overflow-hidden border border-slate-300">
                    <img src={p.dataUrl} alt={p.title} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="font-bold">{p.title}</div>
                  <p className="text-[11px] text-slate-700">{p.caption}</p>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Kumpulan: {p.groupName || currentRecord.groupName} • Tarikh: {p.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 pt-8 text-xs">
          <div className="text-center">
            <div className="border-b border-black h-12 w-48 mx-auto"></div>
            <p className="mt-1 font-bold">Cikgu Adila binti Mansor</p>
            <p className="text-[11px] text-slate-600">Guru Pemerhati / Guru Bahasa Melayu</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black h-12 w-48 mx-auto"></div>
            <p className="mt-1 font-bold">Cikgu Melati</p>
            <p className="text-[11px] text-slate-600">Guru Pembimbing Tatabahasa KSSR</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SCREEN MAIN WORKSPACE (Hidden on print) */}
      {/* ======================================================== */}
      <div className="print:hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Selector & Activity Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card: Maklumat Sesi Pemerhatian */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-100 space-y-3">
            <h3 className="font-fun text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Maklumat Sesi Aktiviti
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tarikh Aktiviti:
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Nama Aktiviti:
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Tapis Mengikut Kumpulan:
              </label>
              <select
                value={groupFilter}
                onChange={(e) => {
                  soundManager.playPop();
                  setGroupFilter(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Semua">Semua Kumpulan</option>
                {DEFAULT_GROUPS.map((g, idx) => (
                  <option key={idx} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card: Senarai Murid untuk Pemerhatian */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-fun text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Pilih Murid Diperhatikan
              </h3>
              <span className="text-[11px] font-bold text-slate-400">
                {filteredStudents.length} Murid
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama murid..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Student List */}
            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => {
                const rec = records[s.id];
                const yaScore = Object.values(rec?.items || {}).filter((i) => i.status).length;
                const isSelected = s.id === selectedStudentId;

                // Check if this student has uploaded photos
                const hasPhotos = photos.some(
                  (p) => p.studentName === s.name || p.groupName === rec?.groupName
                );

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      soundManager.playPop();
                      setSelectedStudentId(s.id);
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl flex-shrink-0">{s.avatar}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                          <span>{s.name}</span>
                          {hasPhotos && <span title="Mempunyai evidens gambar">📸</span>}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {rec?.groupName || DEFAULT_GROUPS[0]}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          yaScore >= 9
                            ? 'bg-emerald-100 text-emerald-800'
                            : yaScore >= 6
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {yaScore}/10 Ya
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Photo Upload & View Button on Left Column */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-5 border-2 border-indigo-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-fun text-sm font-bold text-indigo-950">
                  Evidens Bergambar PdP
                </h4>
                <p className="text-[11px] text-indigo-700">
                  {photos.length} gambar aktiviti telah dimuat naik
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-bold text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>+ Muat Naik Gambar Baru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setActiveSectionTab('galeriGambar');
                }}
                className="w-full py-2 px-4 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-300 font-fun font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Tengok Semua Gambar ({photos.length})</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Right Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION A: OBSERVATION CHECKLIST (Shown if activeSectionTab === 'semua' || 'senaraiSemak') */}
          {(activeSectionTab === 'semua' || activeSectionTab === 'senaraiSemak') && (
            <>
              {/* Active Student Header Card */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Borang Pemerhatian Individu Murid:
                  </div>
                  <h2 className="font-fun text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                    <span>{students.find((s) => s.id === selectedStudentId)?.avatar || '👦'}</span>
                    <span>{currentRecord.studentName}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-sans font-semibold">
                      {currentRecord.className}
                    </span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-500">Kumpulan:</span>
                      <select
                        value={currentRecord.groupName}
                        onChange={(e) => handleUpdateGroupName(e.target.value)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-900 focus:outline-none cursor-pointer"
                      >
                        {DEFAULT_GROUPS.map((g, idx) => (
                          <option key={idx} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="text-slate-400">•</div>
                    <div>
                      <span className="font-bold text-slate-500">Tarikh:</span>{' '}
                      <span className="font-semibold text-slate-800">{activityDate}</span>
                    </div>

                    {/* Student Photo Tag Shortcut */}
                    {studentPhotos.length > 0 && (
                      <>
                        <div className="text-slate-400">•</div>
                        <button
                          type="button"
                          onClick={() => {
                            soundManager.playPop();
                            setGalleryStudentFilter(currentRecord.studentName);
                            setActiveSectionTab('galeriGambar');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 transition cursor-pointer"
                        >
                          📸 {studentPhotos.length} Gambar Murid Ini
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Score Ring */}
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">
                      Keputusan
                    </span>
                    <span className="font-fun text-lg font-extrabold text-emerald-900">
                      {countYa} / {totalItems} Ya
                    </span>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-fun font-bold text-sm flex items-center justify-center shadow-sm">
                    {percentageScore}%
                  </div>
                </div>
              </div>

              {/* EXACT 10-ITEM TABLE (Items 1, 8, 11 removed) */}
              <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-fun font-bold">
                        <th className="py-3 px-3.5 text-center w-12">Bil</th>
                        <th className="py-3 px-4 text-left">Aspek Pemerhatian</th>
                        <th className="py-3 px-3 text-center w-16">Ya</th>
                        <th className="py-3 px-3 text-center w-16">Tidak</th>
                        <th className="py-3 px-4 text-left min-w-[220px]">
                          Catatan / Ringkasan Ulasan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sections.map((section) => {
                        const sectionItems = OBSERVATION_CRITERIA_LIST.filter(
                          (item) => item.sectionCode === section.code
                        );

                        return (
                          <React.Fragment key={section.code}>
                            {/* Section Header Row */}
                            <tr className="bg-slate-50/80 font-fun font-bold text-slate-800">
                              <td colSpan={5} className="py-2.5 px-4 text-xs">
                                <span className="inline-flex items-center gap-1.5">
                                  <span className={`w-2.5 h-2.5 rounded-full ${section.color}`}></span>
                                  <span>{section.title}</span>
                                </span>
                              </td>
                            </tr>

                            {/* Items under this section */}
                            {sectionItems.map((item) => {
                              const itemAnswer = currentRecord.items[item.id] || {
                                status: true,
                                catatan: '',
                              };
                              const isYa = itemAnswer.status === true;

                              return (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                  {/* Bil */}
                                  <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                                    {item.id}
                                  </td>

                                  {/* Aspek Pemerhatian */}
                                  <td className="py-3 px-4 font-medium text-slate-800 leading-relaxed">
                                    {item.aspekPemerhatian}
                                  </td>

                                  {/* Ya */}
                                  <td className="py-3 px-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleStatus(item.id, true)}
                                      className={`w-8 h-8 rounded-xl font-bold transition flex items-center justify-center mx-auto cursor-pointer ${
                                        isYa
                                          ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                      }`}
                                      title="Tandakan Ya"
                                    >
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    </button>
                                  </td>

                                  {/* Tidak */}
                                  <td className="py-3 px-3 text-center">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleStatus(item.id, false)}
                                      className={`w-8 h-8 rounded-xl font-bold transition flex items-center justify-center mx-auto cursor-pointer ${
                                        !isYa
                                          ? 'bg-rose-600 text-white shadow-xs scale-105'
                                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                      }`}
                                      title="Tandakan Tidak"
                                    >
                                      <X className="w-4 h-4 stroke-[3]" />
                                    </button>
                                  </td>

                                  {/* Catatan / Ringkasan Ulasan */}
                                  <td className="py-3 px-4">
                                    <input
                                      type="text"
                                      value={itemAnswer.catatan || ''}
                                      onChange={(e) =>
                                        handleUpdateItemNote(item.id, e.target.value)
                                      }
                                      placeholder="Taip ulasan aspek ini..."
                                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-emerald-500"
                                    />

                                    {/* Quick Note Chips */}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {QUICK_NOTES[item.id]?.map((qk, qIdx) => (
                                        <button
                                          key={qIdx}
                                          type="button"
                                          onClick={() => handleUpdateItemNote(item.id, qk)}
                                          className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition cursor-pointer"
                                        >
                                          +{qk}
                                        </button>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Overall Teacher Note Section */}
                <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    📝 Catatan & Ringkasan Keseluruhan Guru (Cikgu Adila):
                  </label>
                  <textarea
                    rows={2}
                    value={currentRecord.catatanKeseluruhan || ''}
                    onChange={(e) => handleUpdateOverallNote(e.target.value)}
                    placeholder="Rumusan keseluruhan tingkah laku, minat dan pencapaian murid..."
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Cikgu Melati's Pedagogical Encouragement */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-200 shadow-sm flex items-start gap-3.5">
                <span className="text-3xl flex-shrink-0">🌸</span>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <h4 className="font-fun text-sm font-bold text-amber-950 mb-0.5">
                    Ulasan Bimbingan Cikgu Melati untuk {currentRecord.studentName}:
                  </h4>
                  <p>
                    {percentageScore >= 85
                      ? `Masya-Allah, ${currentRecord.studentName} sangat fokus dan teruja belajar Kata Pemeri hari ini! Semua 10 aspek dicapai dengan cemerlang. Cikgu Adila boleh berikan lencana bintang emas kepadanya!`
                      : `${currentRecord.studentName} mempunyai minat yang baik. Jika ada soalan yang belum tepat, Cikgu Melati akan terus temani dan beri tips petua emas kata pemeri ya!`}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* SECTION B: RUANG MUAT NAIK & GALERI GAMBAR EVIDENS */}
          {(activeSectionTab === 'semua' || activeSectionTab === 'galeriGambar') && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-indigo-200 space-y-5">
              {/* Gallery Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl shadow-xs">
                    📸
                  </div>
                  <div>
                    <h3 className="font-fun text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                      Galeri & Ruang Muat Naik Evidens Bergambar
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {photos.length} Gambar Tersimpan
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Semua foto yang telah dimuat naik tersimpan secara automatik dan boleh dipratonton saiz penuh, dimuat turun, atau dicetak.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCompressing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-bold text-xs shadow transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Muat Naik Gambar Baru</span>
                  </button>
                </div>
              </div>

              {/* Gallery Controls & Filters */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-slate-400" /> Tapis:
                  </span>

                  {/* Filter by Student */}
                  <select
                    value={galleryStudentFilter}
                    onChange={(e) => setGalleryStudentFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Semua">Semua Murid</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.name}>
                        {st.name}
                      </option>
                    ))}
                  </select>

                  {/* Filter by Group */}
                  <select
                    value={galleryGroupFilter}
                    onChange={(e) => setGalleryGroupFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Semua">Semua Kumpulan</option>
                    {DEFAULT_GROUPS.map((grp, idx) => (
                      <option key={idx} value={grp}>
                        {grp}
                      </option>
                    ))}
                  </select>

                  {(galleryStudentFilter !== 'Semua' || galleryGroupFilter !== 'Semua' || gallerySearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryStudentFilter('Semua');
                        setGalleryGroupFilter('Semua');
                        setGallerySearch('');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold"
                    >
                      Reset Penapis
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    placeholder="Cari tajuk / huraian gambar..."
                    className="w-full pl-8 pr-2.5 py-1 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Photos Gallery Grid */}
              {isLoadingPhotos ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
                  <p>Memuatkan arkib gambar evidens...</p>
                </div>
              ) : filteredGalleryPhotos.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-500 flex items-center justify-center text-2xl">
                    🖼️
                  </div>
                  <div className="text-slate-600 text-xs max-w-md mx-auto">
                    <p className="font-bold text-sm text-slate-800">
                      {photos.length === 0
                        ? 'Belum ada gambar evidens aktiviti dimuat naik.'
                        : 'Tiada gambar yang sepadan dengan tapisan carian anda.'}
                    </p>
                    <p className="mt-1 text-slate-500">
                      Klik butang <strong>"Muat Naik Gambar Baru"</strong> untuk memuat naik foto aktiviti dari telefon atau komputer anda.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  {filteredGalleryPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-slate-50 rounded-2xl p-3 border border-slate-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail Container (Clickable to enlarge) */}
                        <div
                          onClick={() => {
                            soundManager.playPop();
                            setPreviewingPhoto(photo);
                          }}
                          className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200 cursor-pointer group"
                        >
                          <img
                            src={photo.dataUrl}
                            alt={photo.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                          />

                          {/* Hover / Tap overlay with "Klik untuk lihat" indicator */}
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 font-fun font-bold text-xs shadow-lg flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition">
                              <Eye className="w-4 h-4 text-indigo-600" />
                              <span>Klik Lihat Penuh</span>
                            </span>
                          </div>

                          {/* Date badge */}
                          <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-semibold backdrop-blur-xs">
                            📅 {photo.date}
                          </div>
                        </div>

                        {/* Title & Caption */}
                        <div className="mt-3 space-y-1">
                          <h4 className="font-fun text-sm font-bold text-slate-900 leading-snug">
                            {photo.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {photo.caption}
                          </p>
                        </div>
                      </div>

                      {/* Footer: Meta & Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-semibold gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                            👥 {photo.groupName || currentRecord.groupName}
                          </span>
                          {photo.studentName && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold truncate max-w-[140px]">
                              👤 {photo.studentName}
                            </span>
                          )}
                        </div>

                        {/* Direct action buttons: View, Download, Delete */}
                        <div className="flex items-center justify-between gap-1.5 pt-1 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              soundManager.playPop();
                              setPreviewingPhoto(photo);
                            }}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Lihat Penuh</span>
                          </button>

                          <a
                            href={photo.dataUrl}
                            download={`evidens-${photo.title.replace(/\s+/g, '_')}.png`}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Muat Turun Fail Gambar"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Padam Foto Ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL DIALOG: SAVE & CONFIGURE NEW PHOTO UPLOAD */}
      {/* ======================================================== */}
      {isUploadingOpen && pendingImageDataUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => {
            setPendingImageDataUrl(null);
            setIsUploadingOpen(false);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📸</span>
                <h4 className="font-fun text-lg font-bold text-slate-900">
                  Tetapkan Maklumat & Simpan Gambar Evidens
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPendingImageDataUrl(null);
                  setIsUploadingOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Image Preview Box */}
              <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 bg-slate-900 flex items-center justify-center min-h-[200px] p-2">
                <img
                  src={pendingImageDataUrl}
                  alt="Pratonton Muat Naik"
                  className="max-h-56 max-w-full object-contain rounded-lg"
                />
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tajuk Gambar Aktiviti:
                  </label>
                  <input
                    type="text"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="Cth: Sesi Menjawab Kata Pemeri Secara Berpasangan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kapsyen / Huraian PdP:
                  </label>
                  <textarea
                    rows={2}
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Cth: Murid berjaya membezakan frasa nama (ialah) dan frasa adjektif (adalah)."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kumpulan:</label>
                    <select
                      value={newPhotoGroup}
                      onChange={(e) => setNewPhotoGroup(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      {DEFAULT_GROUPS.map((g, idx) => (
                        <option key={idx} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Murid Utama:</label>
                    <select
                      value={newPhotoStudent}
                      onChange={(e) => setNewPhotoStudent(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:border-indigo-500 focus:outline-none cursor-pointer"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                💡 Foto disimpan ke dalam arkib sistem secara kekal dan boleh ditengok semula bila-bila masa.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPendingImageDataUrl(null);
                    setIsUploadingOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSavePhotoEvidence}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Simpan & Tengok Gambar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. FULLSCREEN IMAGE ZOOM MODAL (WITH PREV/NEXT SLIDESHOW) */}
      {/* ======================================================== */}
      {previewingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewingPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📸</span>
                  <h3 className="font-fun text-lg md:text-xl font-bold text-slate-900">
                    {previewingPhoto.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>
                    👥 Kumpulan: <strong>{previewingPhoto.groupName}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    👤 Murid: <strong>{previewingPhoto.studentName || 'Semua'}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    📅 Tarikh: <strong>{previewingPhoto.date}</strong>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewingPhoto(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-base cursor-pointer"
                title="Tutup Pratonton"
              >
                ✕
              </button>
            </div>

            {/* Main Image Display with Prev/Next buttons */}
            <div className="relative w-full min-h-[300px] max-h-[58vh] flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden p-2">
              <img
                src={previewingPhoto.dataUrl}
                alt={previewingPhoto.title}
                className="max-h-[54vh] max-w-full object-contain rounded-lg"
              />

              {/* Prev Button */}
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer"
                  title="Gambar Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer"
                  title="Gambar Seterusnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Caption */}
            <div className="p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-700 leading-relaxed border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">
                Kapsyen & Catatan PdP:
              </span>
              <p>{previewingPhoto.caption}</p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDeletePhoto(previewingPhoto.id)}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Padam Foto Ini
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={previewingPhoto.dataUrl}
                  download={`evidens-${previewingPhoto.title.replace(/\s+/g, '_')}.png`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  Muat Turun Fail
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewingPhoto(null)}
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-fun font-bold text-xs shadow cursor-pointer transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
