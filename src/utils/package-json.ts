import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

type PackageJson = {
  version: string;
};

const readFile = promisify(fs.readFile);
const PACKAGE_JSON_PATH = path.resolve(process.cwd(), 'package.json');
let pkg: PackageJson | null;

const PackageJson = async (): Promise<PackageJson> => {
  if (!pkg) {
    pkg = JSON.parse((await readFile(PACKAGE_JSON_PATH)).toString('utf-8'));
  }
  return pkg as PackageJson;
};

export default PackageJson;
