import { exec } from 'child_process';
import { promisify } from 'util';

const execPromisified = promisify(exec);

export const updatePackageJson = async (packageName: string) => {
  await execPromisified(`npm i ${packageName}`);
  await execPromisified(`npm i -w="${packageName}"`);
};
