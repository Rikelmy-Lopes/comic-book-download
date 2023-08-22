import { getComicTitle, getImageLinks, getUrlFromArgs } from './utils/utils';
import { generatePDF } from './pdf';
import chalk from 'chalk';
const SUCCESS_STYLE = chalk.white.bgGreen.bold;
const WARNING_STYLE = chalk.white.bgYellow.bold;
const ERROR_STYLE = chalk.white.bgRed.bold;
const LOG_MESSAGES = {
  generatingPDF: '\n Generating PDF... \n',
  pdfGenerated: '\n PDF Generated!!!',
  errorOccurred: 'An error occurred:',
};

const handleError = (error: Error): void => {
  console.log(ERROR_STYLE(`\n ${LOG_MESSAGES.errorOccurred} ${error.message} \n`));
};

const main = async (): Promise<void> => {
  try {
    const url = getUrlFromArgs();
    console.log(WARNING_STYLE(LOG_MESSAGES.generatingPDF));
    const imgsLinks = await getImageLinks(url);
    const comicName = await getComicTitle(url);
    await generatePDF(imgsLinks, comicName);
    console.log(SUCCESS_STYLE(LOG_MESSAGES.pdfGenerated));
  } catch (error) {
    handleError(error as Error);
  }
};

main();

export default main;