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
    console.log(WARNING_STYLE('Comic name not found. Using the default name "comic." \n'));
    title = 'comic';
  }
  return title;
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