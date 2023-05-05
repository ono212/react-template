import ejs from 'ejs';
import { resolve } from 'path';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { getRoot } from '../utils/get-root.util';
import { promisify } from 'util';
import glob from 'glob';

const globPromisified = promisify(glob);

export const copyTemplate = async (
  appRootPath: string,
  packageName: string
) => {
  await mkdir(appRootPath, { recursive: true });

  const templateAbsolutePath = resolve(getRoot(), 'templates/react');
  const templateAbsoluteFilePaths = await globPromisified(
    `${templateAbsolutePath}/**/*`,
    {
      dot: true,
    }
  );

  const promises = templateAbsoluteFilePaths.map(
    async (templateAbsoluteFilePath) => {
      const templateFilePath = templateAbsoluteFilePath.replace(
        templateAbsolutePath,
        appRootPath
      );
      const absoluteAppFilePath = resolve(appRootPath, templateFilePath);

      const stats = await stat(templateAbsoluteFilePath);
      if (stats.isDirectory()) {
        await mkdir(absoluteAppFilePath, { recursive: true });
        return;
      }

      const templateSource = await readFile(templateAbsoluteFilePath, 'utf8');

      return writeFile(
        absoluteAppFilePath,
        ejs.render(templateSource, { packageName })
      );
    }
  );

  await Promise.all(promises);
};
