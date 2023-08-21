import { getComicTitle, getImageLinks } from './utils/utils';
import { generatePDF } from './pdf';
import chalk from 'chalk';
const SUCCESS_STYLE = chalk.white.bgGreen.bold;
const WARNING_STYLE = chalk.white.bgYellow.bold;
const ERROR_STYLE = chalk.white.bgRed.bold;

const downloadComic = async (url: string): Promise<void> => {
  console.log(WARNING_STYLE('Generating PDF...'));
  try {
    const imgsLinks = await getImageLinks(url);
    const comicName = await getComicTitle(url);
    await generatePDF(imgsLinks, comicName);
    console.log(SUCCESS_STYLE('PDF Generated!!!'));
  } catch (error) {
    console.log(ERROR_STYLE(`An error occurred: ${(error as Error).message}`));
  }
};

export {
  downloadComic
};