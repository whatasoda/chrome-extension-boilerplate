import JSONFile from '../utils/val-loader-helper';
import { Manifest } from './decls';
import PackageJson from '../utils/package-json';

export = JSONFile<Manifest>(true, async () => ({
  manifest_version: 2,
  version: (await PackageJson()).version,
  default_locale: 'en',
  name: 'Hello, World.',
  author: 'whatasoda <https://github.com/whatasoda>',
  content_scripts: [
    {
      matches: ['*'],
      js: ['content.js'],
    },
  ],
}));
