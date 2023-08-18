import { jsPDF } from 'jspdf';
import { fetchImage } from './fetch';
import { mkdirSync, existsSync  } from 'fs';
import { join } from 'path';
import { getImageMetadata  } from './utils/utils';
const OUTPUT_PDF = '../pdf';

const createPdfFolder = (): void => {
  const path = join(__dirname, OUTPUT_PDF);
  if (!existsSync(path)) {
    mkdirSync(path);
  }
};


const generatePDF = async (imgLinks: string[], comicName: string): Promise<void> => {
  const pdf = new jsPDF();
  pdf.deletePage(1);

  for (let i = 0; i < imgLinks.length; i += 1) {
    const imgStream = await fetchImage(imgLinks[i]);
    const { width, height } = await getImageMetadata(imgStream);
    const imgBuffer = `data:image/jpeg;base64,${Buffer.from(imgStream).toString('base64')}`;
    const aspectRatio = width / height;

    if (aspectRatio < 1) {
      pdf.addPage([width, height], 'portrait');
    } else {
      pdf.addPage([width, height], 'landscape');
    }
    pdf.addImage(imgBuffer, 0, 0, width, height);
  }
  createPdfFolder();
  pdf.save(join(__dirname, `${OUTPUT_PDF}/${comicName}.pdf`));
  console.log('PDF Generated!!!');
};



export {
  generatePDF
};