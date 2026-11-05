import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface CamatPDFData {
  no: number;
  nama: string;
  periode: string;
  catatan?: string;
  isCurrent?: boolean;
}

export interface DesaPDFData {
  nama: string;
  jiwa: number;
  luas: number;
  kk: number;
  kades: string;
  idm: string;
  dusun: number;
  rt: number;
  fasilitas: string;
}

/**
 * Ekspor Laporan Resmi Nama-nama Camat di Kecamatan Semitau (Tabel 2.2.1)
 */
export function exportCamatPDF(camatList: CamatPDFData[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header / Kop Dokumen Resmi
  doc.setFillColor(245, 243, 238);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Garis Aksen Emas BPS
  doc.setFillColor(234, 179, 8);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text('PEMERINTAH KABUPATEN KAPUAS HULU', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text('KECAMATAN SEMITAU', pageWidth / 2, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Kantor Kecamatan Semitau: Jl. Merdeka, Semitau Hulu, Kapuas Hulu, Kalimantan Barat', pageWidth / 2, 23, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(135, 82, 46); // River amber
  doc.text('TABEL 2.2.1: DAFTAR NAMA CAMAT DI KECAMATAN SEMITAU', pageWidth / 2, 31, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text('Names of District Head in Semitau District, hingga 2025', pageWidth / 2, 36, { align: 'center' });

  // Metadata Dokumen
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  const tglCetak = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Tanggal Unduh: ${tglCetak}`, 14, 50);
  doc.text('Penyusun Data: Ahkram Fatih Dehirtan', 14, 55);
  doc.text('Total Kepemimpinan: 19 Camat Terdaftar', pageWidth - 14, 50, { align: 'right' });
  doc.text('Status Terkini: Yohanes Rapli, A.Md, S.A.P (Aktif)', pageWidth - 14, 55, { align: 'right' });

  // Tabel Data Camat
  const tableRows = camatList.map((c) => [
    c.no.toString(),
    c.isCurrent ? `${c.nama} (Petahana Aktif)` : c.nama,
    c.periode,
    c.catatan || '-',
  ]);

  autoTable(doc, {
    startY: 60,
    head: [
      [
        { content: 'No\n(1)', styles: { halign: 'center' } },
        { content: 'Nama Camat\nNames of District Head', styles: { halign: 'left' } },
        { content: 'Periode\nPeriod (2)', styles: { halign: 'center' } },
        { content: 'Catatan Historis & Kepemimpinan\nHistorical Notes', styles: { halign: 'left' } },
      ],
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [234, 179, 8], // Gold BPS
      textColor: [30, 30, 30],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [250, 248, 245],
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 32, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      // Highlight baris Camat aktif
      if (data.section === 'body' && data.row.index === camatList.length - 1) {
        data.cell.styles.fillColor = [220, 252, 231]; // emerald light
        data.cell.styles.fontStyle = 'bold';
      }
    },
  });

  // Footer Dokumen
  // @ts-ignore
  const finalY = doc.lastAutoTable?.finalY || 240;
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  doc.text(
    'Sumber / Source: Kantor Kecamatan Semitau & Bagian Tata Pemerintahan Setda Kabupaten Kapuas Hulu',
    14,
    finalY + 8
  );
  doc.text(
    'Dokumen ini diekspor secara otomatis melalui Portal Kenali Semitau (Karya: Ahkram Fatih Dehirtan).',
    14,
    finalY + 12
  );

  doc.save('Laporan_Resmi_Camat_Kecamatan_Semitau_1964-2025.pdf');
}

/**
 * Ekspor Laporan Resmi Data Demografi & Pemerintahan 12 Desa BPS
 */
export function exportBPSDesaPDF(desaList: DesaPDFData[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header / Kop Dokumen Resmi
  doc.setFillColor(245, 243, 238);
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Garis Aksen Hijau Kapuas
  doc.setFillColor(36, 75, 54);
  doc.rect(0, 36, pageWidth, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text('BADAN PUSAT STATISTIK (BPS) KABUPATEN KAPUAS HULU', pageWidth / 2, 10, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text('LAPORAN DATA KEPENDUDUKAN & PEMERINTAHAN 12 DESA KECAMATAN SEMITAU', pageWidth / 2, 17, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Publikasi: Kecamatan Semitau Dalam Angka 2026 · Sumber Mutlak Sensus Penduduk & Dinas Dukcapil', pageWidth / 2, 22, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(135, 82, 46);
  doc.text('Total Populasi: 10.875 Jiwa (5.670 L / 5.205 P) | Luas Wilayah: 808,48 km² | 3.626 KK | 12 Desa', pageWidth / 2, 29, { align: 'center' });

  // Metadata Dokumen
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  const tglCetak = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Tanggal Unduh: ${tglCetak}`, 14, 43);
  doc.text('Penyusun Data Portal: Ahkram Fatih Dehirtan', 14, 47);
  doc.text('Pusat Pemerintahan: Desa Semitau Hulu', pageWidth - 14, 43, { align: 'right' });
  doc.text('Camat Aktif: Yohanes Rapli, A.Md, S.A.P', pageWidth - 14, 47, { align: 'right' });

  // Total Jiwa untuk Persentase
  const totalJiwa = 10875;

  const tableRows = desaList.map((d, idx) => [
    (idx + 1).toString(),
    d.nama,
    d.kades,
    `${d.jiwa.toLocaleString('id-ID')} Jiwa`,
    `${((d.jiwa / totalJiwa) * 100).toFixed(1)}%`,
    `${d.luas} km²`,
    `${d.kk} KK`,
    `${d.dusun} Dusun / ${d.rt} RT`,
    d.idm,
    d.fasilitas,
  ]);

  autoTable(doc, {
    startY: 51,
    head: [
      [
        'No',
        'Nama Desa',
        'Kepala Desa (Kades)',
        'Populasi',
        'Porsi %',
        'Luas (km²)',
        'Jumlah KK',
        'Dusun / RT',
        'Status IDM',
        'Fasilitas Utama Terdata',
      ],
    ],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [36, 75, 54], // Hijau Kapuas
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2.5,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [250, 248, 245],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 20, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 16, halign: 'center' },
      5: { cellWidth: 18, halign: 'right' },
      6: { cellWidth: 18, halign: 'right' },
      7: { cellWidth: 24, halign: 'center' },
      8: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      9: { cellWidth: 'auto' },
    },
  });

  // @ts-ignore
  const finalY = doc.lastAutoTable?.finalY || 165;

  // Ringkasan Sektoral di bawah tabel
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  doc.text('Ringkasan Layanan Publik & Sektoral Kecamatan Semitau:', 14, finalY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('• Pendidikan: 17 Satuan Pendidikan (12 SD, 4 SMP, 1 SMAN 1 Semitau) · 2.348 Peserta Didik · 168 Tenaga Guru (Rasio 14:1)', 14, finalY + 12);
  doc.text('• Kesehatan: RSUD Semitau (Tipe D, Rawat Inap & IGD 24 Jam) · UPT Puskesmas Semitau (Akreditasi Paripurna) · 6 Pustu · 12 Poskesdes', 14, finalY + 16);
  doc.text('• Tata Kelola & Wilayah: 12 Desa Definitif (1 Mandiri, 4 Maju, 7 Berkembang) · 28 Dusun · 80 RT · 18 Masjid · 14 Gereja', 14, finalY + 20);

  // Footer Dokumen
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Sumber Resmi: Badan Pusat Statistik (BPS) Kabupaten Kapuas Hulu & Dinas Kependudukan dan Pencatatan Sipil 2026. Portal Kenali Semitau (Karya: Ahkram Fatih Dehirtan).',
    14,
    finalY + 26
  );

  doc.save('Laporan_Resmi_Demografi_12_Desa_Kecamatan_Semitau_BPS_2026.pdf');
}
