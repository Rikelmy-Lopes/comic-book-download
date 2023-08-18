import { jsPDF } from 'jspdf';
import sharp from 'sharp';
import { getComicTitle, getImgStream, getImgsLinks } from './images.js';
import { mkdirSync } from 'fs';


async function getImgMetadata(imageBuffer: ArrayBuffer) {
  const { width, height } = await sharp(imageBuffer).metadata();
  return { 
    width: width || 0,
    height: height || 0,
  };
}


const generatePDF = async (imgLinks: string[], comicName: string): Promise<void> => {
  const doc = new jsPDF();
  doc.deletePage(1);

  for (let i = 0; i < imgLinks.length; i += 1) {
    const imgStream = await getImgStream(imgLinks[i]);
    const { width, height } = await getImgMetadata(imgStream);
    const imgBuffer = `data:image/jpeg;base64,${Buffer.from(imgStream).toString('base64')}`;
    const aspectRatio = width / height;

    if (aspectRatio < 1) {
      doc.addPage([width, height], 'portrait');
    } else {
      doc.addPage([width, height], 'landscape');
    }
    doc.addImage(imgBuffer, 0, 0, width, height);
  }
  mkdirSync('../pdf');
  doc.save(`../pdf/${comicName}.pdf`);
  console.log('PDF Generated!!!');
};

const main = async (url: string) => {
  const imgsLinks = await getImgsLinks(url);
  const comicName = await getComicTitle(url);
  generatePDF(imgsLinks, comicName);
};

export {
  main
};