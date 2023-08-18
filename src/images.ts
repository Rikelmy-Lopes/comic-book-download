import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';

async function getHtml(url: string): Promise<CheerioAPI> {
  try {
    const { data } = await axios.get(url);
    const html = load(data);
    return html;
  } catch (error) {
    throw new Error(`HTML not Downloaded: ${(error as Error).message}`);
  }
}   

const getComicTitle = async (url: string): Promise<string> => {
  const html = await getHtml(url);

  return html('div.title').children('h1').text();
};

async function getImgsLinks(url: string): Promise<string[]> {
  const html = await getHtml(url);
  const imagesLinks = html('.chapter_img').map((_, element) => {
    return element.attribs.src;
  }).toArray();
  return imagesLinks;
}

async function getImgStream(imgUrl: string): Promise<ArrayBuffer> {
  try {
    const { data } = await axios<ArrayBuffer>({
      url: imgUrl,
      method: 'GET',
      responseType: 'arraybuffer',
    });
    return data;
  } catch (error) {
    throw new Error(`Image not Downloaded: ${(error as Error).message}, Image URL: ${imgUrl}`);
  }
}

export { 
  getImgStream,
  getImgsLinks,
  getComicTitle
};