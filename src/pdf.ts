import { jsPDF } from 'jspdf';
import { fetchImage } from './fetch';
import { mkdirSync, existsSync  } from 'fs';
import { join } from 'path';
import { getImageMetadata  } from './utils/utils';
import CLIProgress from 'cli-progress';
const OUTPUT_PDF = '../pdf';

const progressBar = new CLIProgress.SingleBar({
  format: 'Progress |{bar}| {percentage}% | ETA: {eta_formatted} | {value}/{total}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

const createPdfFolder = (): void => {
  const path = join(__dirname, OUTPUT_PDF);
  if (!existsSync(path)) {
    mkdirSync(path);
  }
};


const generatePDF = async (imgLinks: string[], comicName: string): Promise<void> => {
  const pdf = new jsPDF();
  pdf.deletePage(1);
  progressBar.start(imgLinks.length, 0);

  for (const imgLink of imgLinks) {
    const imgArrayBuffer = await fetchImage(imgLink);
    const { width, height, format } = await getImageMetadata(imgArrayBuffer);
    const imgBase64 = `data:image/${format};base64,${Buffer.from(imgArrayBuffer).toString('base64')}`;
    const aspectRatio = width / height;
    if (aspectRatio < 1) {
      pdf.addPage([width, height], 'portrait');
    } else {
      pdf.addPage([width, height], 'landscape');
    }
    pdf.addImage(imgBase64, 0, 0, width, height);
    progressBar.increment();
  }
  createPdfFolder();
  pdf.save(join(__dirname, `${OUTPUT_PDF}/${comicName}.pdf`));
  progressBar.stop();
};



export {
  generatePDF
};