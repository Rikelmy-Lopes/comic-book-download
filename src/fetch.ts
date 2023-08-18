import axios, { AxiosError } from 'axios';

async function fetchHtml(url: string): Promise<string> {
  try {
    const { data } = await axios.get<string>(url);
    return data;
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


export {
  fetchHtml,
  fetchImage
};