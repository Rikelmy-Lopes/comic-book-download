import { getComicTitle, getImageLinks } from './utils/utils';
import { generatePDF } from './pdf';

const downloadComic = async (url: string) => {
  try {
    const imgsLinks = await getImageLinks(url);
    const comicName = await getComicTitle(url);
    await generatePDF(imgsLinks, comicName);
  } catch (error) {
    console.error('An error occurred:', (error as Error).message);
  }
};

export {
  downloadComic
};