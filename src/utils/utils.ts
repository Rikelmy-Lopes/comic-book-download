import { CheerioAPI, load } from 'cheerio';
import { fetchHtml  } from '../fetch';
import sharp from 'sharp';
import chalk from 'chalk';
const WARNING_STYLE = chalk.white.bgYellow.bold;

const parseHtml = (htmlString: string): CheerioAPI => {
  return load(htmlString);
};

const getComicTitle = async (url: string): Promise<string> => {
  const html = await fetchHtml(url);
  const parsedHtml = parseHtml(html);
  let title = parsedHtml('div.title').children('h1').text();
  if (!title) {
    console.log(WARNING_STYLE('Comic name not found. Using the default name "Comic" \n'));
    title = 'Comic';
  }
  return title;
};

const getImageLinks = async (url: string): Promise<string[]> => {
  const html = await fetchHtml(url);
  const parsedHtml = parseHtml(html);
  const imagesLinks = parsedHtml('.chapter_img').map((_, element) => {
    return element.attribs.src;
  }).toArray();

  if (imagesLinks.length === 0) {
    throw new Error('No images were found on the website.');
  }
  
  return imagesLinks;
};

async function getImageMetadata(imageBuffer: ArrayBuffer) {
  const { width, height, format } = await sharp(imageBuffer).metadata();
  return { 
    width: width || 0,
    height: height || 0,
    format: format || 'png'
  };
}

function isUrlValid(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

function getUrlFromArgs(): string {
  const url = process.argv[2];
  
  if (!url) {
    throw new Error('Link not provided in the arguments.');
  }
  if (!isUrlValid(url)) {
    throw new Error('Invalid link provided.');
  }
  
  return url;
}

export {
  parseHtml,
  getComicTitle,
  getImageLinks,
  getImageMetadata,
  getUrlFromArgs
};