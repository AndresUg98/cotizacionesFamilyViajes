import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

function waitForImages(element) {
  const imgs = element.querySelectorAll('img');
  return Promise.all(
    Array.from(imgs).map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        if (img.complete) resolve();
      });
    })
  );
}

function getGalleryCanvasTop(element, canvasHeight) {
  const el = element.querySelector('[data-pdf-gallery]');
  if (!el) return Infinity;
  const elementRect = element.getBoundingClientRect();
  const galleryRect = el.getBoundingClientRect();
  const relativeTop = galleryRect.top - elementRect.top + element.scrollTop;
  return relativeTop * (canvasHeight / element.scrollHeight);
}

function captureToCanvas(element) {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });
}

function sliceAndAddToPdf(pdf, canvas, pdfW, pdfH, galleryCanvasTop, isNewDoc) {
  const imgW = pdfW;
  const imgH = (canvas.height * imgW) / canvas.width;
  let remaining = imgH;
  let srcY = 0;

  while (remaining > 0) {
    let sliceH = Math.min(remaining, pdfH);
    const sliceEndCanvas = srcY + (sliceH / imgH) * canvas.height;

    if (srcY < galleryCanvasTop && sliceEndCanvas > galleryCanvasTop) {
      const adjustedSrc = galleryCanvasTop - srcY;
      if (adjustedSrc > 10) {
        sliceH = (adjustedSrc / canvas.height) * imgH;
      }
    }

    const srcSliceH = (sliceH / imgH) * canvas.height;
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = srcSliceH;
    const ctx = pageCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, srcY, canvas.width, srcSliceH, 0, 0, canvas.width, srcSliceH);

    const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);

    if (!isNewDoc || srcY > 0) pdf.addPage();
    pdf.addImage(pageImgData, 'JPEG', 0, 0, imgW, sliceH);

    srcY += srcSliceH;
    remaining -= sliceH;
  }
}

export async function generateSinglePDF(quote, filename = 'cotizacion-viaje', elementId = 'pdf-content') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Elemento PDF #${elementId} no encontrado`);

  await waitForImages(element);
  const canvas = await captureToCanvas(element);

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfW = 210;
  const pdfH = 297;
  const galleryCanvasTop = getGalleryCanvasTop(element, canvas.height);

  sliceAndAddToPdf(pdf, canvas, pdfW, pdfH, galleryCanvasTop, true);
  pdf.save(`${filename}.pdf`);
}

export async function generateConsolidatedPDF(quotes, globalFilename = 'cotizacion-viaje', elementIdPrefix = 'pdf-content') {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfW = 210;
  const pdfH = 297;
  let isFirstDoc = true;

  for (let i = 0; i < quotes.length; i++) {
    const elementId = `${elementIdPrefix}-${quotes[i].id}`;
    const element = document.getElementById(elementId);
    if (!element) continue;

    await waitForImages(element);
    const canvas = await captureToCanvas(element);
    const galleryCanvasTop = getGalleryCanvasTop(element, canvas.height);

    const imgW = pdfW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let remaining = imgH;
    let srcY = 0;

    while (remaining > 0) {
      let sliceH = Math.min(remaining, pdfH);
      const sliceEndCanvas = srcY + (sliceH / imgH) * canvas.height;

      if (srcY < galleryCanvasTop && sliceEndCanvas > galleryCanvasTop) {
        const adjustedSrc = galleryCanvasTop - srcY;
        if (adjustedSrc > 10) {
          sliceH = (adjustedSrc / canvas.height) * imgH;
        }
      }

      const srcSliceH = (sliceH / imgH) * canvas.height;
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = srcSliceH;
      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcSliceH, 0, 0, canvas.width, srcSliceH);

      const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);

      if (!isFirstDoc || srcY > 0) pdf.addPage();
      isFirstDoc = false;

      pdf.addImage(pageImgData, 'JPEG', 0, 0, imgW, sliceH);

      srcY += srcSliceH;
      remaining -= sliceH;
    }
  }

  pdf.save(`${globalFilename}.pdf`);
}
