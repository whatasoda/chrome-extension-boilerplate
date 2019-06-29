import { publish } from 'gh-pages';
import archiver from 'archiver';
import path from 'path';
import { createWriteStream } from 'fs';
import mkdirp from 'mkdirp';
import { promisify } from 'util';
import PackageJson from '../src/utils/package-json';

const DIST_DIR = path.resolve(__dirname, '../dist');
const ZIP_DIR = path.resolve(__dirname, '../zip');

const mkdir = promisify(mkdirp);

const main = async () => {
  const { version } = await PackageJson();

  await mkdir(ZIP_DIR);
  const output = createWriteStream(path.resolve(ZIP_DIR, `v${version}.zip`));
  const archive = archiver('zip');
  archive.pipe(output);
  archive.directory(DIST_DIR, false);

  /* eslint-disable no-console */
  archive.on('warning', (err) => console.warn(err));
  archive.on('error', (err) => {
    throw err;
  });

  await new Promise((resolve) => {
    output.on('close', () => {
      console.log(`${archive.pointer()} total bytes`);
      console.log('archiver has been finalized and the output file descriptor has closed.');
      resolve();
    });
    archive.finalize();
  });

  publish(ZIP_DIR, { branch: 'archives', add: true }, (err) => {
    if (err) console.error(err);
    else console.log('Published');
  });
  /* eslint-enable no-console */
};

main();
