import { CheerioAPI, load } from 'cheerio';
import { fetchHtml  } from '../fetch';
import sharp from 'sharp';

const parseHtml = (htmlString: string): CheerioAPI => {
  return load(htmlString);
};

const getComicTitle = async (url: string): Promise<string> => {
  const html = await fetchHtml(url);
  const parsedHtml = parseHtml(html);
  return parsedHtml('div.title').children('h1').text();
};

const getImageLinks = async (url: string): Promise<string[]> => {
  const html = await fetchHtml(url);
  const parsedHtml = parseHtml(html);
  const imagesLinks = parsedHtml('.chapter_img').map((_, element) => {
    return element.attribs.src;
  }).toArray();
  return imagesLinks;
};

async function getImageMetadata(imageBuffer: ArrayBuffer) {
  const { width, height } = await sharp(imageBuffer).metadata();
  return { 
    width: width || 0,
    height: height || 0,
  };
}

export {
  parseHtml,
  getComicTitle,
  getImageLinks,
  getImageMetadata
};