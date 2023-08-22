import { getComicTitle, getImageLinks, getUrlFromArgs } from './utils/utils';
import { generatePDF } from './pdf';
import chalk from 'chalk';
const SUCCESS_STYLE = chalk.white.bgGreen.bold;
const WARNING_STYLE = chalk.white.bgYellow.bold;
const ERROR_STYLE = chalk.white.bgRed.bold;

const downloadComic = async (): Promise<void> => {
  try {
    const url = getUrlFromArgs();
    console.log(WARNING_STYLE('Generating PDF... \n'));
    const imgsLinks = await getImageLinks(url);
    const comicName = await getComicTitle(url);
    await generatePDF(imgsLinks, comicName);
    console.log('\n');
    console.log(SUCCESS_STYLE('PDF Generated!!!'));
  } catch (error) {
    console.log(ERROR_STYLE(`\n An error occurred: ${(error as Error).message} \n`));
  }
};

downloadComic();

export {
  downloadComic
};