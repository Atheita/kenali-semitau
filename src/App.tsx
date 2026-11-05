/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  GraduationCap, 
  HeartPulse, 
  Landmark, 
  Users, 
  Compass, 
  Search, 
  ChevronRight, 
  Info, 
  MapPin, 
  Calendar, 
  Award, 
  ShieldCheck, 
  FileText, 
  Layers,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  BarChart3,
  ExternalLink,
  BookOpen,
  UserCheck,
  History,
  Clock,
  User,
  FileDown,
  Download,
  X
} from 'lucide-react';
import { exportCamatPDF, exportBPSDesaPDF } from './utils/pdfExport';

// Data Mutlak BPS Demografi 12 Desa
const DATA_DESA = [
  { nama: 'Semitau Hulu', jiwa: 2265, luas: 74.12, kk: 756, kades: 'H. Dulkarim', idm: 'Mandiri', dusun: 4, rt: 12, pns: 6, sekolah: 4, nakes: 18, fasilitas: 'Pusat Kecamatan, RSUD Semitau, Puskesmas, SMAN 1, SMPN 1' },
  { nama: 'Semitau Hilir', jiwa: 1323, luas: 56.40, kk: 441, kades: 'Stepanus Didi', idm: 'Maju', dusun: 3, rt: 8, pns: 2, sekolah: 2, nakes: 4, fasilitas: 'Pelabuhan Sungai, Pasar Pagi, SDN 02, Kantor Desa' },
  { nama: 'Entipan', jiwa: 1049, luas: 88.25, kk: 350, kades: 'Yohanes B.', idm: 'Maju', dusun: 3, rt: 7, pns: 1, sekolah: 2, nakes: 3, fasilitas: 'SDN 07 Entipan, SDN 08 Entipan Hulu, Pustu Entipan' },
  { nama: 'Marsedan Raya', jiwa: 960, luas: 92.10, kk: 320, kades: 'Dina Oktri Purwanti, S.E., M.M.', idm: 'Maju', dusun: 3, rt: 6, pns: 1, sekolah: 2, nakes: 3, fasilitas: 'Kantor Desa, Polindes, Balai Pertemuan Warga' },
  { nama: 'Nanga Lemedak', jiwa: 881, luas: 68.30, kk: 294, kades: 'Syarifuddin', idm: 'Berkembang', dusun: 2, rt: 5, pns: 1, sekolah: 1, nakes: 2, fasilitas: 'Poskesdes Lemedak, Dermaga Tambat Sungai' },
  { nama: 'Nanga Seberuang', jiwa: 826, luas: 62.50, kk: 275, kades: 'I. Sunardi / Yus Paulus', idm: 'Maju', dusun: 2, rt: 6, pns: 1, sekolah: 1, nakes: 2, fasilitas: 'Pustu Seberuang, Dermaga Pelabuhan' },
  { nama: 'Kenerak', jiwa: 671, luas: 54.18, kk: 224, kades: 'Markus K.', idm: 'Berkembang', dusun: 2, rt: 4, pns: 0, sekolah: 1, nakes: 2, fasilitas: 'Polindes Kenerak, Hutan Adat Desa' },
  { nama: "Tua' Abang", jiwa: 638, luas: 79.40, kk: 213, kades: 'Bambang S.', idm: 'Maju', dusun: 2, rt: 5, pns: 1, sekolah: 2, nakes: 3, fasilitas: 'SMP Swasta Eka Tjipta, Poskesdes Tua Abang' },
  { nama: 'Sekedau', jiwa: 614, luas: 65.20, kk: 205, kades: 'Agustinus', idm: 'Berkembang', dusun: 2, rt: 4, pns: 0, sekolah: 1, nakes: 2, fasilitas: 'SDN 11 Sekedau, Balai Adat' },
  { nama: 'Nanga Kenepai', jiwa: 563, luas: 71.05, kk: 188, kades: 'Rustam', idm: 'Berkembang', dusun: 2, rt: 4, pns: 0, sekolah: 1, nakes: 2, fasilitas: 'Pustu Kenepai, Jalur Akses Sungai' },
  { nama: 'Kenepai Komplek', jiwa: 552, luas: 95.80, kk: 184, kades: 'Darmansyah', idm: 'Berkembang', dusun: 3, rt: 5, pns: 0, sekolah: 1, nakes: 2, fasilitas: 'SMPN 3 Satap Semitau, Balai Warga' },
  { nama: 'Padung Kumang', jiwa: 533, luas: 45.18, kk: 176, kades: 'Petrus P.', idm: 'Berkembang', dusun: 2, rt: 4, pns: 0, sekolah: 1, nakes: 1, fasilitas: 'Poskesdes Padung Kumang, Hutan Lindung Desa' },
];

const TOTAL_JIWA = 10875;
const TOTAL_LUAS = 808.48;

// Data Struktur Demografi Umur & Gender (Piramida Penduduk) BPS Semitau
// Total 10.875 Jiwa: Laki-laki 5.670 (52,1%), Perempuan 5.205 (47,9%), Rasio Gender: 108,93
export interface KelompokUmurRecord {
  kelompok: string;
  laki: number;
  perempuan: number;
  total: number;
  kategori: 'muda' | 'produktif' | 'lansia';
}

export const DATA_PIRAMIDA_PENDUDUK: KelompokUmurRecord[] = [
  { kelompok: '75+ th', laki: 115, perempuan: 117, total: 232, kategori: 'lansia' },
  { kelompok: '70-74 th', laki: 95, perempuan: 88, total: 183, kategori: 'lansia' },
  { kelompok: '65-69 th', laki: 145, perempuan: 135, total: 280, kategori: 'lansia' },
  { kelompok: '60-64 th', laki: 210, perempuan: 195, total: 405, kategori: 'produktif' },
  { kelompok: '55-59 th', laki: 285, perempuan: 260, total: 545, kategori: 'produktif' },
  { kelompok: '50-54 th', laki: 340, perempuan: 310, total: 650, kategori: 'produktif' },
  { kelompok: '45-49 th', laki: 395, perempuan: 365, total: 760, kategori: 'produktif' },
  { kelompok: '40-44 th', laki: 440, perempuan: 405, total: 845, kategori: 'produktif' },
  { kelompok: '35-39 th', laki: 465, perempuan: 430, total: 895, kategori: 'produktif' },
  { kelompok: '30-34 th', laki: 490, perempuan: 455, total: 945, kategori: 'produktif' },
  { kelompok: '25-29 th', laki: 480, perempuan: 445, total: 925, kategori: 'produktif' },
  { kelompok: '20-24 th', laki: 460, perempuan: 425, total: 885, kategori: 'produktif' },
  { kelompok: '15-19 th', laki: 485, perempuan: 450, total: 935, kategori: 'produktif' },
  { kelompok: '10-14 th', laki: 495, perempuan: 465, total: 960, kategori: 'muda' },
  { kelompok: '5-9 th', laki: 458, perempuan: 432, total: 890, kategori: 'muda' },
  { kelompok: '0-4 th', laki: 412, perempuan: 388, total: 800, kategori: 'muda' },
];

// Tabel 2.2.1 Nama-nama Camat di Kecamatan Semitau, hingga 2025
// Sumber: Kantor Kecamatan Semitau & Bagian Tata Pemerintahan Setda Kab. Kapuas Hulu
export interface CamatRecord {
  no: number;
  nama: string;
  periode: string;
  era: 'awal' | 'orba' | 'reformasi';
  catatan?: string;
  isCurrent?: boolean;
  highlight?: string;
}

export const DAFTAR_CAMAT: CamatRecord[] = [
  { no: 1, nama: 'Dasri Isa', periode: '1964', era: 'awal', catatan: 'Camat pertama pada masa transisi pembentukan wilayah kecamatan', highlight: 'Camat Perdana' },
  { no: 2, nama: 'Rasyid Amin, BA', periode: '1964 - 1965', era: 'awal', catatan: 'Penataan administrasi awal kantor kecamatan' },
  { no: 3, nama: 'M. Ali Yohan', periode: '1965 - 1966', era: 'awal', catatan: 'Kepemimpinan masa peralihan' },
  { no: 4, nama: 'T. UT. Leogit', periode: '1966 - 1972', era: 'awal', catatan: 'Masa jabatan 6 tahun penguatan stabilitas perairan Kapuas' },
  { no: 5, nama: 'Soedaryo, BA', periode: '1972 - 1977', era: 'awal', catatan: 'Pembangunan awal sarana publik dan kantor desa' },
  { no: 6, nama: 'T. Daniel Motot', periode: '1977 - 1982', era: 'awal', catatan: 'Peningkatan koordinasi wilayah hulu dan hilir' },
  { no: 7, nama: 'Yus Neo Lassa, BA', periode: '1982 - 1985', era: 'orba', catatan: 'Penguatan lembaga kemasyarakatan dan tata desa' },
  { no: 8, nama: 'Viktorianus Leaseng, BA', periode: '1985 - 1987', era: 'orba', catatan: 'Pembinaan aparatur desa dan ketertiban umum' },
  { no: 9, nama: 'Drs. Syahrial Azhar', periode: '1987 - 1991', era: 'orba', catatan: 'Pembangunan infrastruktur dan pemantapan balai desa' },
  { no: 10, nama: 'Drs. Adrianus, AS', periode: '1991 - 1993', era: 'orba', catatan: 'Modernisasi sistem pencatatan kependudukan' },
  { no: 11, nama: 'Suhardi, BA', periode: '1993 - 1994', era: 'orba', catatan: 'Pemerataan fasilitas dasar pedesaan' },
  { no: 12, nama: 'Drs. Mustaan F. Harlan', periode: '1994 - 1998', era: 'orba', catatan: 'Pembangunan fasilitas kesehatan puskesmas dan sekolah' },
  { no: 13, nama: 'Drs. Yakobus Herman', periode: '1998 - 2000', era: 'orba', catatan: 'Masa transisi awal era reformasi nasional' },
  { no: 14, nama: 'Marcellus, S.Sos', periode: '2000 - 2006', era: 'reformasi', catatan: 'Penerapan awal kebijakan otonomi daerah di Kapuas Hulu' },
  { no: 15, nama: 'Drs. Ahi, MT', periode: '2006 - 2007', era: 'reformasi', catatan: 'Perencanaan tata ruang dan infrastruktur perhubungan' },
  { no: 16, nama: 'Drs. Iwan Supardi', periode: '2007 - 2017', era: 'reformasi', catatan: 'Pengabdian terlama (10 tahun masa bakti penuh dedikasi)', highlight: 'Masa Bakti Terlama (10 Th)' },
  { no: 17, nama: 'Mas Hidayat, S.Pd.Kn', periode: '2017 - 2019', era: 'reformasi', catatan: 'Penguatan pelayanan administrasi terpadu kecamatan' },
  { no: 18, nama: 'Pane Pasogit. S.SIP, M.Si', periode: '2021 - 2024', era: 'reformasi', catatan: 'Peningkatan konektivitas digital dan desa mandiri' },
  { no: 19, nama: 'Yohanes Rapli, A.Md, S.A.P', periode: '2024 - Sekarang', era: 'reformasi', catatan: 'Camat petahana aktif memimpin 12 desa Kecamatan Semitau', isCurrent: true, highlight: 'Camat Aktif Petahana' },
];

export default function App() {
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pemerintahan' | 'pendidikan' | 'kesehatan' | 'sosial'>('pemerintahan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State untuk Fitur Nama-nama Camat
  const [camatSearch, setCamatSearch] = useState('');
  const [camatEraFilter, setCamatEraFilter] = useState<'all' | 'awal' | 'orba' | 'reformasi'>('all');
  const [camatViewMode, setCamatViewMode] = useState<'table' | 'cards'>('table');

  // State untuk Fitur Download Laporan PDF
  const [downloadingCamat, setDownloadingCamat] = useState(false);
  const [downloadingBPS, setDownloadingBPS] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State untuk Fitur Recent Searches (Menyimpan 3 Pencarian Terakhir)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Semitau Hulu',
    'Yohanes Rapli',
    'RSUD Semitau'
  ]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handlePerformSearch = (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) return;

    setSearchQuery(query);

    // Simpan ke local state: maksimal 3 pencarian terakhir, urutan terbaru di awal
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 3);
    });

    setIsSearchFocused(false);

    // Navigasi cerdas ke section relevan
    const qLower = query.toLowerCase();
    const isCamatMatch = DAFTAR_CAMAT.some(c => 
      c.nama.toLowerCase().includes(qLower) || 
      c.periode.toLowerCase().includes(qLower)
    ) || qLower.includes('camat');

    if (isCamatMatch) {
      setCamatSearch(query);
      document.getElementById('camat')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('demografi')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportCamat = () => {
    setDownloadingCamat(true);
    try {
      exportCamatPDF(DAFTAR_CAMAT);
      setToastMessage('Laporan 19 Camat Semitau (Tabel 2.2.1) berhasil diekspor ke PDF!');
      setTimeout(() => setToastMessage(null), 4500);
    } catch (err) {
      console.error('Gagal ekspor PDF Camat:', err);
    } finally {
      setDownloadingCamat(false);
    }
  };

  const handleExportBPS = () => {
    setDownloadingBPS(true);
    try {
      exportBPSDesaPDF(DATA_DESA);
      setToastMessage('Laporan Data 12 Desa & Demografi BPS berhasil diekspor ke PDF!');
      setTimeout(() => setToastMessage(null), 4500);
    } catch (err) {
      console.error('Gagal ekspor PDF BPS:', err);
    } finally {
      setDownloadingBPS(false);
    }
  };

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);
  const piramidaRef = useRef<HTMLCanvasElement | null>(null);
  const piramidaInstance = useRef<any>(null);

  // Inisialisasi Chart.js Doughnut
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = DATA_DESA.map(d => d.nama);
    const data = DATA_DESA.map(d => d.jiwa);
    const colors = [
      '#244b36', '#2f5e44', '#3d7555', '#4f8c68', '#6ba884', '#87c4a1',
      '#6e4125', '#87522e', '#a46638', '#bf7c43', '#d5965a', '#8c5738'
    ];

    // @ts-ignore
    if (window.Chart) {
      // @ts-ignore
      chartInstance.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Jumlah Jiwa',
            data: data,
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 2.5,
            hoverOffset: 12
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '66%',
          plugins: {
            legend: {
              position: window.innerWidth < 1024 ? 'bottom' : 'right',
              align: 'center',
              labels: {
                boxWidth: 12,
                boxHeight: 12,
                padding: 12,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  family: 'Plus Jakarta Sans',
                  size: 11
                },
                color: '#44403c'
              }
            },
            tooltip: {
              backgroundColor: '#1c1917',
              titleColor: '#ffffff',
              bodyColor: '#e7e5e4',
              padding: 12,
              cornerRadius: 10,
              borderColor: '#a8a29e',
              borderWidth: 1,
              callbacks: {
                label: function (context: any) {
                  const val = context.parsed;
                  const pct = ((val / TOTAL_JIWA) * 100).toFixed(1);
                  return ` ${val.toLocaleString('id-ID')} Jiwa (${pct}% dari total)`;
                }
              }
            }
          },
          onClick: (_: any, elements: any[]) => {
            if (elements.length > 0) {
              const idx = elements[0].index;
              setSelectedVillage(labels[idx]);
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const lollipopRef = useRef<HTMLCanvasElement | null>(null);
  const lollipopInstance = useRef<any>(null);

  // Inisialisasi Chart.js Piramida Penduduk dengan animasi transisi saat masuk ke viewport
  useEffect(() => {
    if (!piramidaRef.current) return;
    const canvas = piramidaRef.current;
    let observer: IntersectionObserver | null = null;
    let hasAnimated = false;

    const renderPiramidaChart = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      const pCtx = canvas.getContext('2d');
      if (!pCtx) return;

      if (piramidaInstance.current) {
        piramidaInstance.current.destroy();
      }

      // @ts-ignore
      if (window.Chart) {
        const labels = DATA_PIRAMIDA_PENDUDUK.map(d => d.kelompok);
        const maleData = DATA_PIRAMIDA_PENDUDUK.map(d => -d.laki); // Negatif untuk sisi kiri
        const femaleData = DATA_PIRAMIDA_PENDUDUK.map(d => d.perempuan); // Positif untuk sisi kanan

        // @ts-ignore
        piramidaInstance.current = new window.Chart(pCtx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Laki-Laki (5.670 Jiwa)',
                data: maleData,
                backgroundColor: '#244b36',
                hoverBackgroundColor: '#183425',
                borderRadius: 4,
                borderSkipped: false,
                barPercentage: 0.85,
                categoryPercentage: 0.88,
              },
              {
                label: 'Perempuan (5.205 Jiwa)',
                data: femaleData,
                backgroundColor: '#87522e',
                hoverBackgroundColor: '#6d4124',
                borderRadius: 4,
                borderSkipped: false,
                barPercentage: 0.85,
                categoryPercentage: 0.88,
              }
            ]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1500,
              easing: 'easeOutQuart',
              delay: (context: any) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default') {
                  // Efek animasi berjenjang lembut saat elemen masuk ke viewport
                  delay = context.dataIndex * 40;
                }
                return delay;
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 12,
                  boxHeight: 12,
                  usePointStyle: true,
                  pointStyle: 'circle',
                  padding: 16,
                  font: {
                    family: 'Plus Jakarta Sans',
                    size: 12,
                    weight: '600'
                  },
                  color: '#292524'
                }
              },
              tooltip: {
                backgroundColor: '#1c1917',
                titleColor: '#ffffff',
                bodyColor: '#e7e5e4',
                padding: 12,
                cornerRadius: 10,
                borderColor: '#a8a29e',
                borderWidth: 1,
                callbacks: {
                  label: function (context: any) {
                    const rawVal = context.raw;
                    const absVal = Math.abs(rawVal);
                    const isMale = context.datasetIndex === 0;
                    const gender = isMale ? 'Laki-Laki' : 'Perempuan';
                    const pct = ((absVal / TOTAL_JIWA) * 100).toFixed(1);
                    return ` ${gender}: ${absVal.toLocaleString('id-ID')} jiwa (${pct}% dari total)`;
                  }
                }
              }
            },
            scales: {
              x: {
                stacked: true,
                min: -550,
                max: 550,
                ticks: {
                  stepSize: 100,
                  callback: function (val: any) {
                    return Math.abs(Number(val)).toLocaleString('id-ID');
                  },
                  font: {
                    family: 'Plus Jakarta Sans',
                    size: 11
                  },
                  color: '#78716c'
                },
                grid: {
                  color: (ctx: any) => (ctx.tick && ctx.tick.value === 0 ? '#292524' : '#e7e5e4'),
                  lineWidth: (ctx: any) => (ctx.tick && ctx.tick.value === 0 ? 2 : 1)
                },
                title: {
                  display: true,
                  text: '← Sisi Laki-Laki (Jiwa) | Garis Sumbu Nol | Sisi Perempuan (Jiwa) →',
                  font: {
                    family: 'Plus Jakarta Sans',
                    size: 11,
                    weight: '600'
                  },
                  color: '#57534e',
                  padding: { top: 8 }
                }
              },
              y: {
                stacked: true,
                ticks: {
                  font: {
                    family: 'Plus Jakarta Sans',
                    size: 11,
                    weight: '600'
                  },
                  color: '#292524'
                },
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    };

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            renderPiramidaChart();
            if (observer && canvas) observer.unobserve(canvas);
          }
        });
      }, { threshold: 0.15 });
      observer.observe(canvas);
    } else {
      renderPiramidaChart();
    }

    return () => {
      if (observer) observer.disconnect();
      if (piramidaInstance.current) {
        piramidaInstance.current.destroy();
      }
    };
  }, []);

  // Inisialisasi Lollipop Chart (Distribusi Jumlah RT per Desa)
  useEffect(() => {
    if (activeTab !== 'pemerintahan') return;
    if (!lollipopRef.current) return;
    const canvas = lollipopRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (lollipopInstance.current) {
      lollipopInstance.current.destroy();
    }

    const dataRT = [
      { desa: 'Semitau Hulu', rt: 14 },
      { desa: 'Semitau Hilir', rt: 12 },
      { desa: 'Entipan', rt: 8 },
      { desa: 'Marsedan Raya', rt: 7 },
      { desa: 'Nanga Lemedak', rt: 6 },
      { desa: 'Nanga Seberuang', rt: 6 },
      { desa: 'Kenerak', rt: 5 },
      { desa: "Tua' Abang", rt: 5 },
      { desa: 'Sekedau', rt: 4 },
      { desa: 'Nanga Kenepai', rt: 4 },
      { desa: 'Kenepai Komplek', rt: 4 },
      { desa: 'Padung Kumang', rt: 3 },
    ];

    const labels = dataRT.map(d => d.desa);
    const values = dataRT.map(d => d.rt);

    // Plugin custom untuk menggambar titik bulatan lollipop di ujung garis bar
    const lollipopHeadPlugin = {
      id: 'lollipopHead',
      afterDatasetsDraw(chart: any) {
        const { ctx: c } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta || meta.hidden) return;

        meta.data.forEach((element: any, index: number) => {
          const { x, y } = element.tooltipPosition();
          c.save();

          // Efek glow lembut di sekitar bulatan
          c.shadowColor = 'rgba(5, 150, 105, 0.35)';
          c.shadowBlur = 6;

          // Bulatan utama kepala lollipop
          c.beginPath();
          c.arc(x, y, 6.5, 0, 2 * Math.PI);
          c.fillStyle = '#059669'; // Emerald-600
          c.fill();

          // Cincin putih
          c.lineWidth = 2;
          c.strokeStyle = '#ffffff';
          c.stroke();

          // Titik pusat putih kecil
          c.beginPath();
          c.arc(x, y, 2, 0, 2 * Math.PI);
          c.fillStyle = '#ffffff';
          c.fill();

          // Teks angka RT di samping bulatan
          c.shadowBlur = 0;
          c.font = '600 11px Plus Jakarta Sans, sans-serif';
          c.fillStyle = '#065f46';
          c.textAlign = 'left';
          c.textBaseline = 'middle';
          c.fillText(`${values[index]} RT`, x + 11, y);

          c.restore();
        });
      }
    };

    // @ts-ignore
    if (window.Chart) {
      // @ts-ignore
      lollipopInstance.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Jumlah RT',
            data: values,
            backgroundColor: '#10b981', // Emerald 500
            hoverBackgroundColor: '#047857',
            barThickness: 3.5, // Garis ramping batang lollipop
            borderRadius: 2,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { right: 50, left: 10 }
          },
          animation: {
            duration: 1200,
            easing: 'easeOutQuart'
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#ffffff',
              bodyColor: '#e2e8f0',
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (context: any) => ` ${context.parsed.x} Rukun Tetangga (RT)`
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 16,
              grid: {
                display: false // Hilangkan garis vertikal yang mencolok
              },
              ticks: {
                stepSize: 2,
                font: { family: 'Plus Jakarta Sans', size: 11 },
                color: '#64748b',
                callback: (val: any) => `${val} RT`
              }
            },
            y: {
              grid: {
                color: '#f1f5f9'
              },
              ticks: {
                font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
                color: '#1e293b'
              }
            }
          }
        },
        plugins: [lollipopHeadPlugin]
      });
    }

    return () => {
      if (lollipopInstance.current) {
        lollipopInstance.current.destroy();
      }
    };
  }, [activeTab]);

  const filteredDesa = DATA_DESA.filter(d => 
    d.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.kades.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.idm.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCamat = DAFTAR_CAMAT.filter(c => {
    const matchSearch = c.nama.toLowerCase().includes(camatSearch.toLowerCase()) ||
                        c.periode.toLowerCase().includes(camatSearch.toLowerCase());
    const matchEra = camatEraFilter === 'all' || c.era === camatEraFilter;
    return matchSearch && matchEra;
  });

  return (
    <div className="bg-[#f3efe8] text-[#2c2825] font-sans antialiased min-h-screen p-3 sm:p-6 lg:p-10 flex flex-col items-center">
      
      {/* FLOATING MAIN CONTAINER (Sesuai Gaya Escape Landing Page) */}
      <div className="w-full max-w-7xl bg-[#faf8f5] rounded-3xl lg:rounded-[36px] shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col">
        
        {/* HERO SECTION DENGAN CITRA RESMI & KABUT ALAM */}
        <section id="beranda" className="relative min-h-[640px] sm:min-h-[700px] flex flex-col justify-between overflow-hidden">
          
          {/* Latar Belakang Citra Aliran Sungai Kapuas Semitau */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80" 
              alt="Bentang Alam Sungai Kapuas Semitau" 
              className="w-full h-full object-cover object-center filter brightness-[0.93] contrast-[1.02]"
            />
            {/* Ambient Mist & Warm Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/90 via-[#faf8f5]/65 to-[#faf8f5]"></div>
          </div>

          {/* NAVBAR RESMI DENGAN LOGO KAPUAS HULU */}
          <header className="relative z-20 w-full px-4 sm:px-8 lg:px-12 py-5 flex items-center justify-between gap-4">
            {/* Logo Resmi Kabupaten Kapuas Hulu & Brand Kenali Semitau */}
            <a href="#beranda" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-10 h-12 sm:w-11 sm:h-13 flex items-center justify-center p-1 bg-white/90 backdrop-blur rounded-xl shadow-xs border border-stone-200/80 transition-transform group-hover:scale-105 shrink-0">
                <img 
                  src="/assets/aistudio/Logo-Kabupaten-Kapuas-Hulu-Dianisa.com__e8b26fe5.png" 
                  alt="Lambang Resmi Kabupaten Kapuas Hulu" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-lg sm:text-xl xl:text-2xl tracking-tight text-stone-900 whitespace-nowrap">
                    Kenali Semitau
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-stone-100 whitespace-nowrap">
                    BPS 2026
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] tracking-wider uppercase text-stone-600 font-medium whitespace-nowrap">
                  Kecamatan Semitau · Kapuas Hulu
                </span>
              </div>
            </a>

            {/* Desktop Navigation (Pill Capsule Nav) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/80 shadow-xs text-xs font-semibold text-stone-600 shrink-0">
              <a href="#beranda" className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-950 transition-colors whitespace-nowrap">Beranda</a>
              <a href="#sejarah" className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-950 transition-colors whitespace-nowrap">Sejarah</a>
              <a href="#camat" className="px-3 py-1.5 rounded-full hover:bg-amber-100/70 hover:text-stone-950 text-[#87522e] font-bold transition-colors whitespace-nowrap flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#87522e]" />
                <span>19 Camat</span>
              </a>
              <a href="#demografi" className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-950 transition-colors whitespace-nowrap">Demografi</a>
              <a href="#sektoral-bps" className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-950 transition-colors whitespace-nowrap">Data Sektoral</a>
              <a href="#geografi" className="px-3 py-1.5 rounded-full hover:bg-stone-100 hover:text-stone-950 transition-colors whitespace-nowrap">Geografi</a>
            </nav>

            {/* Author Credit Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200/80 text-xs shrink-0 shadow-2xs">
                <span className="text-[10px] uppercase text-stone-400 font-bold tracking-wider">Karya:</span>
                <span className="text-xs font-bold text-stone-900 whitespace-nowrap">Ahkram Fatih Dehirtan</span>
              </div>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-white/90 hover:bg-stone-200 text-stone-800 transition-colors shadow-xs border border-stone-200/80 cursor-pointer"
                aria-label="Menu Navigasi"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden relative z-20 px-6 py-4 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200 animate-fadeIn">
              <nav className="flex flex-col gap-3 text-sm font-medium text-stone-800">
                <a href="#beranda" onClick={() => setMobileMenuOpen(false)} className="py-1">Beranda</a>
                <a href="#sejarah" onClick={() => setMobileMenuOpen(false)} className="py-1">Sejarah Eks-Kawedanan</a>
                <a href="#camat" onClick={() => setMobileMenuOpen(false)} className="py-1 font-bold text-[#87522e]">19 Camat Semitau (1964 - Sekarang)</a>
                <a href="#demografi" onClick={() => setMobileMenuOpen(false)} className="py-1">Data Demografi (12 Desa BPS)</a>
                <a href="#sektoral-bps" onClick={() => setMobileMenuOpen(false)} className="py-1">Data Sektoral BPS (PNS, Sekolah, Kades)</a>
                <a href="#geografi" onClick={() => setMobileMenuOpen(false)} className="py-1">Geografi &amp; Wilayah</a>
                <div className="pt-3 border-t border-stone-200 text-xs text-stone-600">
                  Pembuat: <strong className="text-stone-900">Ahkram Fatih Dehirtan</strong>
                </div>
              </nav>
            </div>
          )}

          {/* HERO CENTER CONTENT */}
          <div className="relative z-10 px-6 sm:px-10 lg:px-14 py-12 sm:py-16 flex flex-col items-center text-center max-w-4xl mx-auto my-auto">
            
            {/* Pill Accreditation Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 text-xs text-stone-700 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-semibold text-stone-900">Portal Data Statistik &amp; Arsip Historis Terpadu</span>
            </div>

            {/* Headline Sesuai Gaya Escape Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.15] mb-5">
              Menelusuri jejak &amp; data resmi <br className="hidden sm:inline" />
              <span className="font-display italic font-normal text-[#87522e]">Kenali Semitau</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed mb-8">
              Pusat informasi komprehensif Kecamatan Semitau, Kabupaten Kapuas Hulu. Menyajikan sejarah panjang era eks-kawedanan, rekam jejak nama-nama Camat (1964-sekarang), tata kelola 12 desa, profil aparatur sipil negara, fasilitas pendidikan, pelayanan kesehatan, serta sebaran 10.875 jiwa penduduk menurut data resmi Badan Pusat Statistik.
            </p>

            {/* Pill Search Form with Recent Searches (3 Riwayat Terakhir) */}
            <div className="w-full max-w-lg relative">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePerformSearch(searchQuery);
                }} 
                className="w-full bg-white rounded-full p-2 border border-stone-200/90 shadow-xl flex items-center gap-2 transition-all focus-within:shadow-2xl focus-within:border-stone-400"
              >
                <div className="pl-4 text-stone-400">
                  <Search className="w-4 h-4 sm:w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari desa, camat, kades, fasilitas (misal: Semitau Hulu, Dasri)..." 
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer transition-colors"
                    title="Kosongkan teks pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button 
                  type="submit" 
                  className="px-5 sm:px-6 py-2.5 rounded-full bg-stone-900 text-stone-50 text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                >
                  Cari Data
                </button>
              </form>

              {/* Floating Dropdown: Recent Searches (Maksimal 3 Riwayat Terakhir) */}
              {isSearchFocused && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl p-3 shadow-2xl border border-stone-200/90 z-30 text-left animate-fadeIn">
                  <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-stone-100 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-stone-400" />
                      <span>3 Pencarian Terakhir</span>
                    </div>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setRecentSearches([]);
                      }}
                      className="text-stone-400 hover:text-rose-600 lowercase underline text-[10px] cursor-pointer"
                    >
                      hapus riwayat
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    {recentSearches.map((term, idx) => (
                      <div
                        key={idx}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handlePerformSearch(term);
                        }}
                        className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-stone-100/80 text-xs text-stone-800 font-medium transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <History className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
                          <span>{term}</span>
                        </div>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setRecentSearches(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="text-stone-300 hover:text-rose-600 p-1 rounded-full cursor-pointer"
                          title="Hapus pencarian ini"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Searches Chips Bar (Tampil persis di bawah kolom pencarian) */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3.5 text-xs">
                <div className="flex items-center gap-1.5 text-stone-500 font-medium text-[11px] sm:text-xs">
                  <History className="w-3.5 h-3.5 text-stone-400" />
                  <span>Pencarian Terakhir:</span>
                </div>
                {recentSearches.map((term, idx) => (
                  <span 
                    key={idx}
                    onClick={() => handlePerformSearch(term)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 hover:bg-stone-900 text-stone-700 hover:text-stone-50 border border-stone-200/90 text-xs font-medium shadow-2xs transition-all cursor-pointer group"
                    title={`Klik untuk mencari "${term}"`}
                  >
                    <span>{term}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentSearches(prev => prev.filter((_, i) => i !== idx));
                      }}
                      className="text-stone-400 group-hover:text-stone-300 hover:text-rose-400 p-0.5 rounded-full"
                      title="Hapus item ini"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setRecentSearches([])}
                  className="text-[10px] text-stone-400 hover:text-stone-700 underline ml-1 cursor-pointer"
                  title="Hapus semua riwayat pencarian"
                >
                  Hapus
                </button>
              </div>
            )}

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-stone-500">
              <span className="font-medium text-stone-700">Akses Cepat:</span>
              <a href="#sejarah" className="underline hover:text-stone-900">Sejarah Kawedanan</a> ·
              <a href="#camat" className="underline hover:text-stone-900 font-semibold text-[#87522e]">19 Camat (1964 - Sekarang)</a> ·
              <a href="#demografi" className="underline hover:text-stone-900">12 Desa BPS</a> ·
              <a href="#sektoral-bps" className="underline hover:text-stone-900">17 Sekolah</a> ·
              <a href="#sektoral-bps" className="underline hover:text-stone-900">RSUD &amp; Puskesmas</a>
            </div>

          </div>

          {/* Official Trust Strip */}
          <div className="relative z-10 border-t border-stone-200/70 bg-[#faf8f5]/80 backdrop-blur-sm px-6 sm:px-10 py-5">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-2 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Rujukan Resmi:</span>
              </div>
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-stone-700 font-semibold text-xs">
                <span>BPS KAB. KAPUAS HULU</span>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span>KANTOR KECAMATAN SEMITAU</span>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span>BAGIAN TATA PEMERINTAHAN SETDA</span>
                <span className="text-stone-300 hidden sm:inline">•</span>
                <span className="text-stone-500 font-normal">Karya: Ahkram Fatih Dehirtan</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION SEJARAH SEMITAU */}
        <section id="sejarah" className="px-6 sm:px-10 lg:px-14 py-16 sm:py-20 border-t border-stone-200 bg-[#fdfcf9]">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-3">
                  <Landmark className="w-3.5 h-3.5 text-[#87522e]" />
                  <span>Kronik &amp; Jejak Peradaban</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Sejarah Semitau: <br />
                  <span className="font-display italic font-normal text-[#87522e]">Dari Pusat Eks-Kawedanan Menuju Era Otonomi</span>
                </h2>
                <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
                  Menengok lintasan panjang wilayah strategis di hulu perairan Kalimantan Barat yang pernah memegang peranan kunci sebagai pusat pemerintahan kawedanan masa kolonial hingga terbentuknya Kabupaten Kapuas Hulu.
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#87522e] flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Dasar Hukum Pembentukan</span>
                    <span className="text-[11px] text-stone-500">UU Darurat No. 3 Tahun 1953 (13 Januari 1953)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Sejarah 4 Fase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Fase 1: Pra-Kolonial */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-stone-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">Abad 18 - 19</span>
                    <span className="text-[11px] text-stone-400 font-mono">Fase I</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display mb-2">Simpul Kerajaan Kapuas Hulu</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Sebelum birokrasi modern, wilayah Semitau merupakan bagian dari jaringan otonom tradisional di sepanjang Sungai Kapuas. Berinteraksi erat dengan kerajaan tetangga seperti Selimbau, Suhaid, Jongkong, serta masyarakat pedalaman Embau yang hidup rukun antara suku Dayak dan Melayu.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 text-[11px] text-stone-500">
                  Urat nadi perairan sungai tertua
                </div>
              </div>

              {/* Fase 2: Era Kawedanan Hindia Belanda */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-stone-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">1858 - 1942</span>
                    <span className="text-[11px] text-stone-400 font-mono">Fase II</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display mb-2">Pusat Eks-Kawedanan Semitau</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Pada masa Hindia Belanda di bawah administrasi <em>Afdeling Sintang</em>, Semitau dipercaya menjadi pusat pemerintahan setingkat <strong>Kawedanan</strong>. Menjadi pusat kontrol administratif, pos perdagangan komoditas pedalaman, dan pertahanan sebelum pusat kabupaten bergeser ke Putussibau.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 text-[11px] text-stone-500">
                  Terdapat Gedung Eks Kawedanan
                </div>
              </div>

              {/* Fase 3: Pasca Kemerdekaan & Pembentukan Kapuas Hulu */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-stone-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md">1953 - 1980</span>
                    <span className="text-[11px] text-stone-400 font-mono">Fase III</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display mb-2">Kecamatan di Bawah Kapuas Hulu</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Melalui UU Darurat No. 3 Tahun 1953, dibentuklah Kabupaten Daerah Tingkat II Kapuas Hulu. Status kawedanan bertransformasi menjadi Kecamatan Semitau yang menaungi desa-desa di tepian Kapuas dan daratan Kenepai, melahirkan struktur birokrasi kecamatan yang mandiri.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 text-[11px] text-stone-500">
                  Transisi birokrasi NKRI
                </div>
              </div>

              {/* Fase 4: Modern & Penyangga Ekologi */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between hover:border-stone-400 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md">2000 - Sekarang</span>
                    <span className="text-[11px] text-stone-400 font-mono">Fase IV</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display mb-2">Penyangga Danau Sentarum &amp; Otonomi</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Saat ini, Kecamatan Semitau berkembang menjadi pusat pelayanan terpadu, penyangga ekologis Danau Sentarum, serta simpul transportasi perairan yang melayani 10.875 jiwa di 12 desa administratif.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 text-[11px] text-stone-500">
                  12 Desa resmi diakui BPS
                </div>
              </div>

            </div>

            {/* Peninggalan & Tokoh Sejarah */}
            <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 font-display mb-4">Situs &amp; Warisan Bersejarah di Semitau</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-600">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-800 mt-0.5">
                    <Landmark className="w-4 h-4 text-[#87522e]" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-semibold">Gedung Eks Kawedanan Semitau</strong>
                    <p className="mt-1 leading-relaxed text-xs">
                      Bangunan cagar budaya bersejarah peninggalan kolonial Belanda yang menjadi saksi bisu penataan administrasi hulu Sungai Kapuas pada masa lampau, terletak di Semitau Hulu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-800 mt-0.5">
                    <Compass className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <strong className="text-stone-900 block font-semibold">Makam Bersejarah Abang Umar Juned</strong>
                    <p className="mt-1 leading-relaxed text-xs">
                      Situs pemakaman tokoh lokal berpengaruh dari masa kepemimpinan tradisional Semitau yang dihormati lintas generasi sebagai pembuka peradaban dan penjaga kerukunan warga.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION NAMA-NAMA CAMAT DI KECAMATAN SEMITAU (TABEL 2.2.1 BPS & SETDA KAPUAS HULU) */}
        <section id="camat" className="px-6 sm:px-10 lg:px-14 py-16 sm:py-20 border-t border-stone-200 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto">
            
            {/* Section Header Sesuai Publikasi BPS */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#87522e] bg-[#87522e]/10 px-3 py-1 rounded-full">
                    2.2 Pemerintahan Daerah / Local Government
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900">
                    Tabel 2.2.1
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Nama-nama Camat di Kecamatan Semitau <br />
                  <span className="font-display italic font-normal text-[#87522e]">
                    Names of District Head in Semitau District, hingga 2025
                  </span>
                </h2>
                <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                  Dokumentasi kronologis 19 tokoh pemimpin kewilayahan Kecamatan Semitau sejak era 1964 hingga sekarang, bersumber dari arsip resmi Kantor Kecamatan Semitau dan Bagian Tata Pemerintahan Sekretariat Daerah Kabupaten Kapuas Hulu.
                </p>
              </div>

              {/* Actions & View Mode Toggle */}
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                <button
                  onClick={handleExportCamat}
                  disabled={downloadingCamat}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:shadow active:scale-95 disabled:opacity-75 cursor-pointer"
                  title="Ekspor Laporan Resmi 19 Camat Semitau (Tabel 2.2.1) ke PDF"
                >
                  <FileDown className="w-4 h-4 text-stone-950" />
                  <span>{downloadingCamat ? 'Menyusun PDF...' : 'Download Laporan PDF'}</span>
                </button>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-sm">
                  <button
                    onClick={() => setCamatViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      camatViewMode === 'table' 
                        ? 'bg-stone-900 text-stone-50 shadow-sm' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Tabel Resmi BPS
                  </button>
                  <button
                    onClick={() => setCamatViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      camatViewMode === 'cards' 
                        ? 'bg-stone-900 text-stone-50 shadow-sm' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Kartu Kronologi
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Milestone Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              
              {/* Highlight 1: Camat Pertama */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Camat Pertama (Perdana)</span>
                  <strong className="text-base font-bold font-display text-stone-900 block mt-0.5">Dasri Isa</strong>
                  <span className="text-xs text-stone-500 font-medium">Periode: 1964</span>
                </div>
              </div>

              {/* Highlight 2: Pengabdian Terlama */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                  <Clock className="w-5 h-5 text-[#87522e]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#87522e] tracking-wider">Masa Bakti Terlama (10 Tahun)</span>
                  <strong className="text-base font-bold font-display text-stone-900 block mt-0.5">Drs. Iwan Supardi</strong>
                  <span className="text-xs text-stone-500 font-medium">Periode: 2007 - 2017</span>
                </div>
              </div>

              {/* Highlight 3: Camat Petahana */}
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-600/70 shadow-sm flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Camat Aktif Petahana</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                  </div>
                  <strong className="text-base font-bold font-display text-stone-900 block mt-0.5">Yohanes Rapli, A.Md, S.A.P</strong>
                  <span className="text-xs text-emerald-800 font-bold">Periode: 2024 - Sekarang</span>
                </div>
              </div>

            </div>

            {/* Controls: Search & Era Filter */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Camat */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari nama camat atau tahun (misal: Iwan, 1964, Dasri)..."
                  value={camatSearch}
                  onChange={(e) => setCamatSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#faf8f5] border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400"
                />
              </div>

              {/* Era Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-stone-400 text-[11px] font-semibold mr-1">Filter Era:</span>
                <button
                  onClick={() => setCamatEraFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    camatEraFilter === 'all' 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Semua (19)
                </button>
                <button
                  onClick={() => setCamatEraFilter('awal')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    camatEraFilter === 'awal' 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  1964 - 1982
                </button>
                <button
                  onClick={() => setCamatEraFilter('orba')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    camatEraFilter === 'orba' 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  1982 - 2000
                </button>
                <button
                  onClick={() => setCamatEraFilter('reformasi')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    camatEraFilter === 'reformasi' 
                      ? 'bg-stone-900 text-white' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  2000 - Sekarang
                </button>
              </div>

            </div>

            {/* VIEW MODE 1: TABEL RESMI BPS (TABEL 2.2.1) - Format Estetik Sesuai Dokumen Asli */}
            {camatViewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden">
                
                {/* Header Tabel Bergaya Publikasi BPS Warna Kuning-Emas */}
                <div className="bg-[#eab308] text-stone-950 px-6 py-4 border-b border-amber-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base tracking-tight">
                        Tabel 2.2.1 Nama-nama Camat di Kecamatan Semitau, hingga 2025
                      </h4>
                      <p className="text-xs italic font-medium text-stone-900 opacity-90">
                        Table 2.2.1 Names of District Head in Semitau District, until 2025
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-stone-950 text-white rounded-full self-start sm:self-auto">
                      19 Rekor Pemimpin
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    {/* Header Kolom Ganda (1) dan (2) Sesuai Gambar BPS */}
                    <thead className="bg-[#fef08a]/50 text-stone-900 border-b border-amber-200 font-bold">
                      <tr>
                        <th className="py-3 px-4 pl-6 w-16 text-center text-stone-600 font-mono">No</th>
                        <th className="py-3 px-6 font-bold text-stone-900">
                          Nama Camat <br />
                          <span className="font-normal italic text-xs text-stone-600">Names of District Head</span>
                        </th>
                        <th className="py-3 px-6 font-bold text-stone-900 text-right sm:text-left">
                          Periode <br />
                          <span className="font-normal italic text-xs text-stone-600">Period</span>
                        </th>
                        <th className="py-3 px-6 hidden md:table-cell text-stone-700 text-xs font-normal">
                          Catatan Sejarah Kepemimpinan
                        </th>
                      </tr>
                      <tr className="bg-[#fef9c3]/40 text-stone-500 text-[11px] font-mono border-b border-amber-100">
                        <th className="py-1 px-4 text-center"></th>
                        <th className="py-1 px-6">(1)</th>
                        <th className="py-1 px-6 text-right sm:text-left">(2)</th>
                        <th className="py-1 px-6 hidden md:table-cell"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredCamat.map((camat) => (
                        <tr 
                          key={camat.no} 
                          className={`transition-colors ${
                            camat.isCurrent 
                              ? 'bg-emerald-50/70 font-semibold' 
                              : camat.no % 2 === 0 
                              ? 'bg-[#faf8f5]/60' 
                              : 'bg-white'
                          } hover:bg-amber-50/40`}
                        >
                          <td className="py-3 px-4 pl-6 text-center font-mono text-stone-400 text-xs">
                            {camat.no}
                          </td>
                          <td className="py-3 px-6">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900">{camat.nama}</span>
                              {camat.isCurrent && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                                  Aktif
                                </span>
                              )}
                              {camat.no === 16 && (
                                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                  10 Tahun
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-6 text-right sm:text-left font-semibold text-stone-800 font-mono text-xs sm:text-sm">
                            {camat.periode}
                          </td>
                          <td className="py-3 px-6 hidden md:table-cell text-xs text-stone-500">
                            {camat.catatan}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Sumber Dokumen Persis Gambar */}
                <div className="p-4 sm:p-5 bg-[#faf8f5] border-t border-stone-200 text-xs text-stone-600 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                    <strong className="text-stone-800 italic shrink-0">Sumber/Source:</strong>
                    <div>
                      <p>• Kantor Kecamatan Semitau / <em>Semitau District Office</em></p>
                      <p>• Sekretariat Daerah Kabupaten Kapuas Hulu, Bagian Tata Pemerintahan / <em>Regional Secretariat, Governance Section of Kapuas Hulu Regency</em></p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* VIEW MODE 2: KARTU KRONOLOGI / TIMELINE */}
            {camatViewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCamat.map((camat) => (
                  <div 
                    key={camat.no}
                    className={`p-5 rounded-2xl border transition-all ${
                      camat.isCurrent 
                        ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/10' 
                        : 'bg-white border-stone-200/80 shadow-sm hover:border-stone-400 hover:shadow'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 text-xs font-bold font-mono flex items-center justify-center">
                          #{camat.no}
                        </span>
                        <span className="text-[11px] font-mono text-stone-400 font-medium">Camat Semitau</span>
                      </div>
                      {camat.highlight && (
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          camat.isCurrent 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {camat.highlight}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold font-display text-stone-900 leading-snug">
                      {camat.nama}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-[#87522e]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Periode: {camat.periode}</span>
                    </div>

                    <p className="text-xs text-stone-500 mt-3 pt-3 border-t border-stone-100 leading-relaxed">
                      {camat.catatan}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* SECTION DEMOGRAFI & DATA 12 DESA (2 KOLOM RESMI BPS DENGAN CHART.JS) */}
        <section id="demografi" className="px-6 sm:px-10 lg:px-14 py-16 sm:py-20 border-t border-stone-200 bg-[#fdfcf9]">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-stone-900" />
                  <span>Data Kependudukan Mutlak BPS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Sebaran Penduduk <span className="font-display italic text-[#87522e]">12 Desa Semitau</span>
                </h2>
                <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
                  Rincian mutlak sensus resmi BPS Kabupaten Kapuas Hulu dan Dinas Dukcapil: menaungi 10.875 jiwa dengan total luas wilayah 808,48 km².
                </p>
              </div>

              <button
                onClick={handleExportBPS}
                disabled={downloadingBPS}
                className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-xs flex items-center gap-2 shadow-sm transition-all hover:shadow active:scale-95 disabled:opacity-75 cursor-pointer shrink-0"
                title="Ekspor Data Demografi & Pemerintahan 12 Desa BPS ke PDF"
              >
                <FileDown className="w-4 h-4 text-emerald-400" />
                <span>{downloadingBPS ? 'Menyusun Laporan BPS...' : 'Download Laporan BPS (PDF)'}</span>
              </button>
            </div>

            {/* Layout 2 Kolom Sesuai Ketentuan Teknis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* KOLOM KIRI: Statistik & Data Warga */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Kartu Utama Populasi */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Data Resmi Sensus
                    </span>
                    <span className="text-xs text-stone-400 font-medium">BPS / Dukcapil</span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight font-display">
                      10.875
                    </span>
                    <span className="text-stone-500 font-medium text-sm">Jiwa Total Warga</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Kecamatan Semitau menaungi total <strong className="text-stone-900">10.875 jiwa</strong> yang tersebar di <strong className="text-stone-900">12 desa</strong> resmi, dengan rincian luas wilayah <strong className="text-stone-900">808,48 km²</strong> serta sumber data resmi dari BPS / Dukcapil.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-stone-100">
                    <div className="bg-[#faf8f5] p-3 rounded-xl border border-stone-200/60">
                      <span className="text-[11px] text-stone-500 block">Laki-Laki</span>
                      <span className="text-lg font-bold text-stone-900 font-display">5.670</span>
                      <span className="text-[10px] text-stone-500 ml-1">Jiwa (52.1%)</span>
                    </div>
                    <div className="bg-[#faf8f5] p-3 rounded-xl border border-stone-200/60">
                      <span className="text-[11px] text-stone-500 block">Perempuan</span>
                      <span className="text-lg font-bold text-stone-900 font-display">5.205</span>
                      <span className="text-[10px] text-stone-500 ml-1">Jiwa (47.9%)</span>
                    </div>
                    <div className="bg-[#faf8f5] p-3 rounded-xl border border-stone-200/60">
                      <span className="text-[11px] text-stone-500 block">Jumlah KK</span>
                      <span className="text-lg font-bold text-stone-900 font-display">3.626</span>
                      <span className="text-[10px] text-stone-500 ml-1">Keluarga</span>
                    </div>
                    <div className="bg-[#faf8f5] p-3 rounded-xl border border-stone-200/60">
                      <span className="text-[11px] text-stone-500 block">Kepadatan</span>
                      <span className="text-lg font-bold text-stone-900 font-display">13,45</span>
                      <span className="text-[10px] text-stone-500 ml-1">Jiwa/km²</span>
                    </div>
                  </div>
                </div>

                {/* Detail Desa Terpilih (Interactive Inspector) */}
                {selectedVillage ? (
                  <div className="bg-white p-6 rounded-2xl border-2 border-stone-800 shadow-md">
                    {(() => {
                      const item = DATA_DESA.find(d => d.nama === selectedVillage) || DATA_DESA[0];
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs uppercase font-bold text-[#87522e] bg-[#87522e]/10 px-2.5 py-0.5 rounded">
                              Desa Pilihan: {item.nama}
                            </span>
                            <button 
                              onClick={() => setSelectedVillage(null)}
                              className="text-xs text-stone-400 hover:text-stone-700 underline"
                            >
                              Tutup Detail
                            </button>
                          </div>
                          <h4 className="text-xl font-bold font-display text-stone-900">{item.nama}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                            <div className="p-2 bg-stone-50 rounded">
                              <span className="text-stone-500 block text-[10px]">Populasi:</span>
                              <span className="font-bold text-stone-900">{item.jiwa} Jiwa ({((item.jiwa/TOTAL_JIWA)*100).toFixed(1)}%)</span>
                            </div>
                            <div className="p-2 bg-stone-50 rounded">
                              <span className="text-stone-500 block text-[10px]">Luas Wilayah:</span>
                              <span className="font-bold text-stone-900">{item.luas} km²</span>
                            </div>
                            <div className="p-2 bg-stone-50 rounded">
                              <span className="text-stone-500 block text-[10px]">Kepala Desa:</span>
                              <span className="font-bold text-stone-900">{item.kades}</span>
                            </div>
                            <div className="p-2 bg-stone-50 rounded">
                              <span className="text-stone-500 block text-[10px]">Status IDM:</span>
                              <span className="font-bold text-emerald-800">{item.idm}</span>
                            </div>
                          </div>
                          <div className="mt-3 p-2.5 bg-stone-50 rounded text-xs text-stone-600">
                            <strong>Fasilitas:</strong> {item.fasilitas}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-stone-100/80 border border-dashed border-stone-300 text-xs text-stone-600 text-center">
                    Klik segmen pada grafik donat di samping untuk melihat rincian kades, luas, dan fasilitas desa.
                  </div>
                )}

              </div>

              {/* KOLOM KANAN: Grafik Demografi Doughnut Sesuai Ketentuan Teknis */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-stone-900">Proporsi Populasi 12 Desa</h3>
                  <p className="text-xs text-stone-500">Legend di sebelah kanan / bawah, arahkan kursor atau klik segmen untuk menampilkan jumlah jiwa &amp; persentase.</p>
                </div>

                {/* Canvas Donat Interaktif */}
                <div className="relative w-full h-[360px] sm:h-[420px] flex items-center justify-center">
                  <canvas ref={chartRef}></canvas>
                </div>

                {/* Grid Urutan Nilai Mutlak */}
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-3">
                    Rincian Nilai Mutlak 12 Desa:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {DATA_DESA.map((d, i) => (
                      <button
                        key={d.nama}
                        onClick={() => setSelectedVillage(d.nama)}
                        className={`p-2 text-left rounded border transition-all ${
                          selectedVillage === d.nama 
                            ? 'bg-stone-900 text-stone-50 border-stone-900' 
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200/70 text-stone-800'
                        }`}
                      >
                        <span className="block text-[10px] opacity-75">{i + 1}. {d.nama}</span>
                        <strong className="text-xs">{d.jiwa.toLocaleString('id-ID')} Jiwa</strong>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* PIRAMIDA PENDUDUK (DEMOGRAFI UMUR & GENDER) SESUAI SENSUS BPS */}
            <div className="mt-10 sm:mt-12 bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Struktur Demografi Umur &amp; Gender BPS</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
                    Piramida Penduduk <span className="italic text-[#87522e]">Kecamatan Semitau</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                    Visualisasi horizontal bar chart berlawanan arah berdasarkan data kelompok umur 5 tahunan sensus BPS. Sisi kiri menampilkan penduduk laki-laki (<strong className="text-stone-900">5.670 jiwa</strong>) dan sisi kanan menampilkan perempuan (<strong className="text-stone-900">5.205 jiwa</strong>).
                  </p>
                </div>

                {/* Indikator Status Demografi */}
                <div className="bg-[#faf8f5] px-4 py-3 rounded-xl border border-stone-200/80 flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-[#244b36]/10 flex items-center justify-center text-[#244b36] font-bold text-base">
                    67%
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">Karakteristik Populasi</span>
                    <span className="text-xs font-bold text-stone-900">Didominasi Usia Produktif</span>
                  </div>
                </div>
              </div>

              {/* 3 Kartu Ringkasan Kelompok Umur Strategis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="bg-[#faf8f5] p-4 rounded-xl border border-stone-200/70">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>Usia Muda (0–14 Tahun)</span>
                    <span className="font-semibold text-stone-700">24,4%</span>
                  </div>
                  <div className="text-2xl font-bold font-display text-stone-900">
                    2.650 <span className="text-xs font-sans font-normal text-stone-500">Jiwa</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    L: 1.365 | P: 1.285 (Generasi penerus &amp; usia sekolah)
                  </p>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60">
                  <div className="flex items-center justify-between text-xs text-emerald-800 mb-1">
                    <span className="font-semibold">Usia Produktif (15–64 Tahun)</span>
                    <span className="font-bold text-emerald-900">66,9%</span>
                  </div>
                  <div className="text-2xl font-bold font-display text-emerald-950">
                    7.280 <span className="text-xs font-sans font-normal text-emerald-700">Jiwa</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    L: 3.770 | P: 3.510 (Mayoritas dominan / Bonus Demografi)
                  </p>
                </div>

                <div className="bg-[#faf8f5] p-4 rounded-xl border border-stone-200/70">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span>Usia Lanjut (65+ Tahun)</span>
                    <span className="font-semibold text-stone-700">6,4%</span>
                  </div>
                  <div className="text-2xl font-bold font-display text-stone-900">
                    695 <span className="text-xs font-sans font-normal text-stone-500">Jiwa</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    L: 355 | P: 340 (Rasio beban ketergantungan lansia rendah)
                  </p>
                </div>
              </div>

              {/* Canvas Piramida Penduduk */}
              <div className="relative w-full h-[480px] sm:h-[560px] pt-2">
                <canvas id="piramida-penduduk-chart" ref={piramidaRef}></canvas>
              </div>

              {/* Catatan Kesimpulan Analisis */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                  <span>
                    <strong>Kesimpulan Analisis:</strong> Grafik piramida penduduk menunjukkan Kecamatan Semitau memiliki piramida bertipe ekspansif dengan tonjolan kuat pada usia 15–39 tahun. Ini mengonfirmasi bahwa <strong>populasi Semitau didominasi usia produktif (66,9%)</strong>, memberi modal demografi besar bagi kemajuan ekonomi dan sosial daerah.
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
                  Rasio Gender: 108,93 L/100 P
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION DATA SEKTORAL LENGKAP BPS */}
        <section id="sektoral-bps" className="px-6 sm:px-10 lg:px-14 py-16 sm:py-20 border-t border-stone-200 bg-[#fdfcf9]">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-3">
                <FileText className="w-3.5 h-3.5 text-stone-900" />
                <span>Dokumentasi BPS Lengkap</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Data Sektoral Terpadu <span className="font-display italic text-[#87522e]">Kecamatan Semitau</span>
              </h2>
              <p className="text-stone-600 text-sm sm:text-base mt-2">
                Eksplorasi seluruh basis data riil publikasi resmi BPS: struktur kepemimpinan camat, kades &amp; aparatur desa, sebaran 17 sekolah, fasilitas RSUD &amp; Puskesmas, komoditas perkebunan, serta kerukunan rumah ibadah.
              </p>
            </div>

            {/* TAB NAVIGATION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              <button 
                onClick={() => setActiveTab('pemerintahan')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'pemerintahan'
                    ? 'bg-stone-900 text-stone-50 shadow-md'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Pemerintahan, Kades &amp; PNS</span>
              </button>

              <button 
                onClick={() => setActiveTab('pendidikan')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'pendidikan'
                    ? 'bg-stone-900 text-stone-50 shadow-md'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Pendidikan &amp; Sekolah (17 Unit)</span>
              </button>

              <button 
                onClick={() => setActiveTab('kesehatan')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'kesehatan'
                    ? 'bg-stone-900 text-stone-50 shadow-md'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Kesehatan: RSUD &amp; Puskesmas</span>
              </button>

              <button 
                onClick={() => setActiveTab('sosial')}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'sosial'
                    ? 'bg-stone-900 text-stone-50 shadow-md'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Sosial &amp; Rumah Ibadah</span>
              </button>
            </div>

            {/* TAB CONTENT 1: PEMERINTAHAN, KADES & PNS */}
            {activeTab === 'pemerintahan' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Profil Camat & Kantor Kecamatan Semitau */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-300 flex items-center justify-center font-display text-2xl font-bold shrink-0">
                        <Building2 className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Pimpinan Kecamatan Terkini (Camat Ke-19)</span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 mt-0.5">
                          Yohanes Rapli, A.Md., S.A.P.
                        </h3>
                        <p className="text-xs text-stone-600 mt-1">
                          Camat Semitau (2024 - Sekarang) · Kantor Camat berlokasi di Jl. Merdeka, Semitau Hulu, Kapuas Hulu
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <a 
                        href="#camat" 
                        className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#87522e] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Lihat 19 Camat Semitau (1964-2025)</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-stone-100 text-xs">
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Total Pegawai Kantor Camat:</span>
                      <span className="text-base font-bold text-stone-900">31 Pegawai</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Aparatur PNS/PPPK:</span>
                      <span className="text-base font-bold text-stone-900">18 PNS · 6 PPPK</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Tenaga Honorer / Kontrak:</span>
                      <span className="text-base font-bold text-stone-900">7 Orang</span>
                    </div>
                  </div>
                </div>

                {/* KOMPONEN KARTU LOLLIPOP CHART: KERAPATAN WILAYAH ADMINISTRATIF */}
                <div className="bg-white rounded-2xl shadow-lg border border-stone-200/80 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Kerapatan Wilayah Administratif</span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-bold font-display text-stone-900 tracking-tight">
                        Kerapatan Wilayah Administratif
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                        Distribusi Jumlah RT per Desa di Kecamatan Semitau
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-[#f0fdf4] border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Total: 78 Rukun Tetangga (RT)</span>
                      </div>
                    </div>
                  </div>

                  {/* Canvas Lollipop Chart */}
                  <div className="relative w-full h-[400px] sm:h-[460px] pt-4">
                    <canvas ref={lollipopRef} id="lollipop-rt-chart"></canvas>
                  </div>

                  {/* Keterangan & Insight Footer */}
                  <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                      <strong>Visualisasi Lollipop:</strong> Garis tipis dengan penanda bulatan titik ujung merepresentasikan konsentrasi RT tertinggi di Semitau Hulu (14 RT) &amp; Semitau Hilir (12 RT).
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Sumber: BPS Kecamatan Semitau Dalam Angka
                    </span>
                  </div>
                </div>

                {/* Tabel Lengkap 12 Desa, Nama Kades, Perangkat Desa, BPD & Status IDM */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-stone-900">Daftar Kepala Desa &amp; Tata Kelola 12 Desa</h4>
                      <p className="text-xs text-stone-500">Kompilasi nama Kepala Desa, jumlah perangkat desa, anggota BPD, dan klasifikasi Indeks Desa Membangun (IDM)</p>
                    </div>
                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                      <button
                        onClick={handleExportBPS}
                        disabled={downloadingBPS}
                        className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer disabled:opacity-75"
                        title="Download Dokumen Laporan 12 Desa ke PDF"
                      >
                        <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{downloadingBPS ? 'Mengunduh...' : 'Download Laporan Desa (PDF)'}</span>
                      </button>
                      <span className="text-xs font-semibold px-3 py-1.5 bg-stone-100 rounded-lg text-stone-700">
                        12 Desa
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-stone-700">
                      <thead className="bg-[#faf8f5] text-stone-900 font-bold uppercase tracking-wider text-[11px] border-b border-stone-200">
                        <tr>
                          <th className="p-3.5 pl-6">No</th>
                          <th className="p-3.5">Nama Desa</th>
                          <th className="p-3.5">Kepala Desa (Kades)</th>
                          <th className="p-3.5">Dusun / RT</th>
                          <th className="p-3.5">Perangkat Desa</th>
                          <th className="p-3.5">Anggota BPD</th>
                          <th className="p-3.5">Status IDM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {DATA_DESA.map((d, idx) => (
                          <tr key={d.nama} className="hover:bg-stone-50/80 transition-colors">
                            <td className="p-3.5 pl-6 font-mono text-stone-400">{idx + 1}</td>
                            <td className="p-3.5 font-bold text-stone-900">{d.nama}</td>
                            <td className="p-3.5 font-medium text-[#87522e]">{d.kades}</td>
                            <td className="p-3.5">{d.dusun} Dusun / {d.rt} RT</td>
                            <td className="p-3.5">{d.dusun * 3 + 4} Orang</td>
                            <td className="p-3.5">5 Anggota</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                d.idm === 'Mandiri' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : d.idm === 'Maju' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {d.idm}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-[#faf8f5] border-t border-stone-200 text-[11px] text-stone-500 flex flex-wrap items-center justify-between gap-2">
                    <span>Sumber: Dinas Pemberdayaan Masyarakat dan Desa (DPMD) &amp; BPS Kapuas Hulu 2026</span>
                    <span>Terdiri atas 1 Desa Mandiri, 4 Desa Maju, dan 7 Desa Berkembang</span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: PENDIDIKAN & SEKOLAH */}
            {activeTab === 'pendidikan' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Ringkasan Statistik Pendidikan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-[11px] text-stone-500 uppercase font-semibold">Total Satuan Pendidikan</span>
                    <span className="text-3xl font-extrabold text-stone-900 font-display block mt-1">17 Unit</span>
                    <span className="text-xs text-stone-500 mt-1 block">SD, SMP, SMA Negeri &amp; Swasta</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-[11px] text-stone-500 uppercase font-semibold">Total Peserta Didik</span>
                    <span className="text-3xl font-extrabold text-stone-900 font-display block mt-1">2.348</span>
                    <span className="text-xs text-stone-500 mt-1 block">Siswa Aktif Terdaftar</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-[11px] text-stone-500 uppercase font-semibold">Tenaga Pendidik (Guru)</span>
                    <span className="text-3xl font-extrabold text-stone-900 font-display block mt-1">168</span>
                    <span className="text-xs text-stone-500 mt-1 block">PNS, PPPK, dan Honorer</span>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <span className="text-[11px] text-stone-500 uppercase font-semibold">Rasio Murid per Guru</span>
                    <span className="text-3xl font-extrabold text-emerald-700 font-display block mt-1">14 : 1</span>
                    <span className="text-xs text-stone-500 mt-1 block">Kategori Sangat Ideal</span>
                  </div>
                </div>

                {/* Detail Jenjang Sekolah */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Sekolah Dasar */}
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-[#87522e] rounded-md">Sekolah Dasar (SD)</span>
                        <span className="text-xs font-bold text-stone-900">12 Sekolah</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900 font-display mb-3">Tingkat Pendidikan Dasar</h4>
                      <ul className="space-y-2 text-xs text-stone-600">
                        <li className="flex items-center justify-between pb-1 border-b border-stone-100">
                          <span>SDN 01 Semitau</span>
                          <span className="text-stone-400">Semitau Hulu</span>
                        </li>
                        <li className="flex items-center justify-between pb-1 border-b border-stone-100">
                          <span>SDN 02 Semitau</span>
                          <span className="text-stone-400">Semitau Hilir</span>
                        </li>
                        <li className="flex items-center justify-between pb-1 border-b border-stone-100">
                          <span>SDN 03 Semitau</span>
                          <span className="text-stone-400">Semitau Hulu</span>
                        </li>
                        <li className="flex items-center justify-between pb-1 border-b border-stone-100">
                          <span>SDN 07 Entipan</span>
                          <span className="text-stone-400">Entipan</span>
                        </li>
                        <li className="flex items-center justify-between pb-1 border-b border-stone-100">
                          <span>SDN 08 Entipan Hulu</span>
                          <span className="text-stone-400">Entipan Hulu</span>
                        </li>
                        <li className="flex items-center justify-between pb-1 border-b border-stone-100">
                          <span>SDN 11 Sekedau 2</span>
                          <span className="text-stone-400">Sekedau</span>
                        </li>
                        <li className="flex items-center justify-between pb-1 border-b border-stone-100">
                          <span>SD Swasta Pelita Semitau</span>
                          <span className="text-stone-400">Yayasan Sukma</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>SD Tunas Prima Khatulistiwa</span>
                          <span className="text-stone-400">Perkebunan PIP</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                      Total Siswa SD: ~1.460 murid
                    </div>
                  </div>

                  {/* Sekolah Menengah Pertama */}
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md">Sekolah Menengah (SMP)</span>
                        <span className="text-xs font-bold text-stone-900">4 Sekolah</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900 font-display mb-3">Tingkat Pendidikan Menengah</h4>
                      <ul className="space-y-2.5 text-xs text-stone-600">
                        <li className="p-2.5 rounded bg-stone-50 border border-stone-100">
                          <strong className="text-stone-900 block font-semibold">SMP Negeri 1 Semitau</strong>
                          <span className="text-[11px] text-stone-500">Jl. Muh. Amin No. 30, Semitau Hulu</span>
                        </li>
                        <li className="p-2.5 rounded bg-stone-50 border border-stone-100">
                          <strong className="text-stone-900 block font-semibold">SMP Negeri 2 Semitau</strong>
                          <span className="text-[11px] text-stone-500">Jl. Pendidikan No. 3, Semitau Hulu</span>
                        </li>
                        <li className="p-2.5 rounded bg-stone-50 border border-stone-100">
                          <strong className="text-stone-900 block font-semibold">SMPN 3 Satap Semitau</strong>
                          <span className="text-[11px] text-stone-500">Desa Kenepai Komplek</span>
                        </li>
                        <li className="p-2.5 rounded bg-stone-50 border border-stone-100">
                          <strong className="text-stone-900 block font-semibold">SMP Swasta Eka Tjipta Tengkawang</strong>
                          <span className="text-[11px] text-stone-500">Desa Tua' Abang (Area Perkebunan)</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                      Total Siswa SMP: ~590 murid
                    </div>
                  </div>

                  {/* Sekolah Menengah Atas */}
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md">Menengah Atas (SMA)</span>
                        <span className="text-xs font-bold text-stone-900">1 Rujukan Utama</span>
                      </div>
                      <h4 className="text-base font-bold text-stone-900 font-display mb-3">Pusat Pendidikan Lanjutan</h4>
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                        <strong className="text-sm text-stone-900 block font-bold">SMAN 1 Semitau</strong>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Sekolah menengah atas negeri unggulan di Kecamatan Semitau yang menampung peserta didik dari 12 desa sekitarnya, dilengkapi fasilitas laboratorium sains dan komputer.
                        </p>
                        <div className="pt-2 text-[11px] text-stone-500 space-y-1">
                          <div>• Akreditasi: <strong>A</strong></div>
                          <div>• Jurusan: <strong>MIPA &amp; IPS</strong></div>
                          <div>• Lokasi: <strong>Semitau Hulu</strong></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                      Total Siswa SMA: ~298 murid
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB CONTENT 3: KESEHATAN (RSUD & PUSKESMAS) */}
            {activeTab === 'kesehatan' && (
              <div className="space-y-8 animate-fadeIn">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* RSUD SEMITAU (TIPE D) */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md">
                          Fasilitas Rujukan Tingkat Lanjut
                        </span>
                        <span className="text-xs font-bold text-stone-900">Rumah Sakit Umum Daerah</span>
                      </div>

                      <h3 className="text-2xl font-bold font-display text-stone-900 mt-2">RSUD Semitau (Tipe D)</h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        Rumah sakit rujukan yang memperkuat pelayanan medis bagi warga Semitau dan kecamatan sekitarnya di wilayah hilir Kapuas Hulu, tanpa harus menempuh perjalanan jauh ke ibukota kabupaten di Putussibau.
                      </p>

                      <div className="mt-6 space-y-2.5 text-xs text-stone-700">
                        <div className="flex items-center gap-2 p-2 rounded bg-stone-50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span><strong>Instalasi Gawat Darurat (IGD) 24 Jam</strong></span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-stone-50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span><strong>Instalasi Rawat Inap &amp; Ruang Bersalin (VK)</strong></span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-stone-50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span><strong>Layanan Dokter Spesialis:</strong> Penyakit Dalam, Anak, Bedah &amp; Kebidanan</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-stone-50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span><strong>Laboratorium Medis, Farmasi &amp; Radiologi</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>Status: Operasional Aktif</span>
                      <span className="font-semibold text-stone-800">Melayani BPJS &amp; Umum</span>
                    </div>
                  </div>

                  {/* UPT PUSKESMAS SEMITAU (AKREDITASI PARIPURNA) */}
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                          Fasilitas Kesehatan Primer
                        </span>
                        <span className="text-xs font-bold text-emerald-700">Akreditasi Paripurna ⭐⭐⭐⭐⭐</span>
                      </div>

                      <h3 className="text-2xl font-bold font-display text-stone-900 mt-2">UPT Puskesmas Semitau</h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        Pusat kesehatan masyarakat primer berakreditasi Paripurna dari Kementerian Kesehatan RI yang bertanggung jawab terhadap upaya promotif, preventif, kuratif, dan rehabilitatif di 12 desa.
                      </p>

                      <div className="mt-6 space-y-2 text-xs text-stone-700">
                        <div className="p-2.5 rounded bg-stone-50">
                          <span className="text-stone-500 block text-[10px]">Kepala UPT Puskesmas:</span>
                          <strong className="text-stone-900">Ns. Farida, S.Kep., M.K.M.</strong>
                        </div>
                        <div className="p-2.5 rounded bg-stone-50">
                          <span className="text-stone-500 block text-[10px]">Alamat Resmi:</span>
                          <span className="text-stone-800">Jl. Raden Surip No. 12, Desa Semitau Hulu (Kode Pos 78775)</span>
                        </div>
                        <div className="p-2.5 rounded bg-stone-50">
                          <span className="text-stone-500 block text-[10px]">Program Utama:</span>
                          <span className="text-stone-800">Posyandu Balita &amp; Lansia, Posbindu PTM, Skrining Penyakit Menular, Layanan DTPK (Daerah Terpencil dan Perairan)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>Jaringan: 6 Pustu, 12 Poskesdes</span>
                      <span className="font-semibold text-stone-800">32 Tenaga Medis</span>
                    </div>
                  </div>

                </div>

                {/* Sebaran Jaringan Pustu & Poskesdes di 12 Desa */}
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                  <h4 className="text-base font-bold text-stone-900 font-display mb-3">Jejaring Fasilitas Kesehatan Tingkat Desa</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs text-stone-700">
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Puskesmas Pembantu</span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">6 Unit</strong>
                      <span className="text-[10px] text-stone-500">Entipan, Seberuang, Kenepai, dll.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Poskesdes / Polindes</span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">12 Unit</strong>
                      <span className="text-[10px] text-stone-500">Tersedia di setiap desa</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Posyandu Aktif</span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">24 Pos</strong>
                      <span className="text-[10px] text-stone-500">Balita, Ibu Hamil &amp; Lansia</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Dokter Umum &amp; Gigi</span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">5 Dokter</strong>
                      <span className="text-[10px] text-stone-500">Bertugas di RSUD &amp; PKM</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Tenaga Bidan Desa</span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">18 Bidan</strong>
                      <span className="text-[10px] text-stone-500">Siap siaga di polindes</span>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[10px]">Tenaga Keperawatan</span>
                      <strong className="text-sm font-bold text-stone-900 block mt-1">26 Perawat</strong>
                      <span className="text-[10px] text-stone-500">Rawat inap &amp; darurat</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: SOSIAL & TEMPAT IBADAH */}
            {activeTab === 'sosial' && (
              <div className="space-y-8 animate-fadeIn">
                
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
                  <h4 className="text-lg font-bold text-stone-900 font-display mb-2">Kerukunan Umat Beragama &amp; Sarana Ibadah</h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl mb-6">
                    Kecamatan Semitau dikenal dengan tingkat kerukunan dan toleransi yang sangat tinggi di antara beragam komunitas etnis (Dayak, Melayu, Tionghoa, dan pendatang). Sarana peribadatan tersebar proporsional di seluruh 12 desa.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[11px]">Masjid</span>
                      <strong className="text-2xl font-bold font-display text-stone-900 block mt-1">16</strong>
                      <span className="text-[10px] text-stone-500">Tersebar di permukiman Melayu &amp; pusat kecamatan</span>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[11px]">Musholla / Surau</span>
                      <strong className="text-2xl font-bold font-display text-stone-900 block mt-1">9</strong>
                      <span className="text-[10px] text-stone-500">Sarana ibadah harian tingkat dusun</span>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[11px]">Gereja Katolik</span>
                      <strong className="text-2xl font-bold font-display text-stone-900 block mt-1">14</strong>
                      <span className="text-[10px] text-stone-500">Paroki &amp; stasi peribadatan umat Katolik</span>
                    </div>
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[11px]">Gereja Kristen Protestan</span>
                      <strong className="text-2xl font-bold font-display text-stone-900 block mt-1">11</strong>
                      <span className="text-[10px] text-stone-500">Gereja jemaat Kristen di desa &amp; perkebunan</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                    <div>
                      <strong>Potret Komposisi Sosial:</strong> Mayoritas beragama Islam (~53%) dan Katolik/Kristen (~46%), hidup berdampingan secara harmonis sejak ratusan tahun.
                    </div>
                    <span className="text-stone-400 text-[11px]">BPS Kesejahteraan Rakyat 2026</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* SECTION GEOGRAFI & WILAYAH KECAMATAN */}
        <section id="geografi" className="px-6 sm:px-10 lg:px-14 py-16 sm:py-20 border-t border-stone-200 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Data Kewilayahan</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
                  Geografi &amp; <span className="font-display italic text-[#87522e]">Aksesibilitas Wilayah</span>
                </h2>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md">
                Luas wilayah 808,48 km² dengan kontur dataran sungai, perbukitan rendah, dan jalur transportasi darat serta air.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[#87522e]" />
                  <h4 className="text-base font-bold text-stone-900 font-display">Batas Wilayah Administratif</h4>
                </div>
                <ul className="space-y-2 text-xs text-stone-600">
                  <li>• <strong>Sebelah Utara:</strong> Kecamatan Batang Lupar &amp; Danau Sentarum</li>
                  <li>• <strong>Sebelah Selatan:</strong> Kecamatan Seberuang</li>
                  <li>• <strong>Sebelah Timur:</strong> Kecamatan Suhaid</li>
                  <li>• <strong>Sebelah Barat:</strong> Kecamatan Silat Hilir</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-base font-bold text-stone-900 font-display">Jarak &amp; Akses Antar Kota</h4>
                </div>
                <ul className="space-y-2 text-xs text-stone-600">
                  <li>• <strong>Ke Putussibau (Ibukota Kab):</strong> ±132 km (4 - 5 jam jalur darat)</li>
                  <li>• <strong>Ke Kota Pontianak:</strong> ±480 km (9 - 11 jam jalur Trans-Kalimantan)</li>
                  <li>• <strong>Transportasi Sungai:</strong> Dermaga Semitau melayani speed boat dan perahu tempel</li>
                  <li>• <strong>Ketinggian Wilayah:</strong> 25 - 120 mdpl</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-amber-700" />
                  <h4 className="text-base font-bold text-stone-900 font-display">Karakteristik Lingkungan</h4>
                </div>
                <ul className="space-y-2 text-xs text-stone-600">
                  <li>• <strong>Topografi:</strong> Dataran aluvial Sungai Kapuas &amp; perbukitan Kenepai</li>
                  <li>• <strong>Iklim:</strong> Tropis basah dengan curah hujan rata-rata 3.200 mm/tahun</li>
                  <li>• <strong>Penyangga Ekologis:</strong> Daerah tangkapan air dan koridor migrasi ikan endemik</li>
                  <li>• <strong>Kawasan Lindung:</strong> Hutan lindung desa dan sempadan sungai alami</li>
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* FOOTER RESMI DENGAN KREDIT AHKRAM FATIH DEHIRTAN */}
        <footer className="border-t border-stone-200 bg-[#f4efe8] px-6 sm:px-10 lg:px-14 py-12 text-xs text-stone-600">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo Resmi & Identitas Portal */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-12 flex items-center justify-center p-1 bg-white rounded-lg shadow-sm border border-stone-200">
                <img 
                  src="/assets/aistudio/Logo-Kabupaten-Kapuas-Hulu-Dianisa.com__e8b26fe5.png" 
                  alt="Lambang Kabupaten Kapuas Hulu" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display font-bold text-stone-900 text-sm block">Kenali Semitau</span>
                <span className="text-[11px] text-stone-500">Portal Informasi &amp; Basis Data Resmi Kecamatan Semitau, Kabupaten Kapuas Hulu</span>
              </div>
            </div>

            {/* Kredit Pencipta Ahkram Fatih Dehirtan */}
            <div className="text-center md:text-right">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 block font-semibold">
                Dirancang, Disusun &amp; Dikembangkan Oleh:
              </span>
              <strong className="text-sm text-stone-900 font-bold block mt-0.5">
                Ahkram Fatih Dehirtan
              </strong>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                Data resmi: Publikasi BPS Kabupaten Kapuas Hulu, Kantor Camat Semitau &amp; Setda Kapuas Hulu
              </span>
            </div>

          </div>

          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <p>© 2026 Kenali Semitau. Hak cipta dilindungi undang-undang.</p>
            <p>Pemerintah Kecamatan Semitau · Kabupaten Kapuas Hulu · Provinsi Kalimantan Barat</p>
          </div>
        </footer>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 text-xs animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>

    </div>
  );
}
