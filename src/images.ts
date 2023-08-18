import axios, { AxiosError } from 'axios';
import { CheerioAPI, load } from 'cheerio';

async function fetchHtml(url: string): Promise<CheerioAPI> {
  try {
    const { data } = await axios.get(url);
    const html = load(data);
    return html;
  } catch (error) {
    throw new Error(`Failed to retrieve HTML from "${url}": ${(error as Error).message}`);
  }
}

async function fetchImage(imgUrl: string): Promise<ArrayBuffer> {
  try {
    const { data } = await axios.get<ArrayBuffer>(imgUrl, { responseType: 'arraybuffer'});
    return data;
  } catch (error) {
    throw new Error(`Failed to download image from "${imgUrl}": ${(error as AxiosError).message}`);
  }
}

const getComicTitle = async (url: string): Promise<string> => {
  const html = await fetchHtml(url);
  return html('div.title').children('h1').text();
};

async function getImgsLinks(url: string): Promise<string[]> {
  const html = await fetchHtml(url);
  const imagesLinks = html('.chapter_img').map((_, element) => {
    return element.attribs.src;
  }).toArray();
  return imagesLinks;
}

export { 
  fetchImage,
  getImgsLinks,
  getComicTitle
};