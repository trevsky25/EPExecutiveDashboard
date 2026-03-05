'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadPDF(
  elementId: string,
  filename: string,
  title?: string,
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const originalOverflow = element.style.overflow;
  element.style.overflow = 'visible';

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  element.style.overflow = originalOverflow;

  const imgData = canvas.toDataURL('image/png');
  const imgW = canvas.width;
  const imgH = canvas.height;

  const pdf = new jsPDF({
    orientation: imgW > imgH ? 'landscape' : 'portrait',
    unit: 'px',
    format: [imgW / 2, imgH / 2 + (title ? 40 : 0)],
  });

  if (title) {
    pdf.setFontSize(14);
    pdf.setTextColor(100);
    pdf.text(title, 20, 24);
  }

  pdf.addImage(imgData, 'PNG', 0, title ? 36 : 0, imgW / 2, imgH / 2);
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
