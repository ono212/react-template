import { existsSync } from 'fs';
import { getAppInfo } from '../utils/get-app-info.util';
import { copyTemplate } from '../copy-template';
import { updatePackageJson } from '../utils/update-package-json';

(async function main() {
  const { packageName, appRootPath } = getAppInfo();

  if (existsSync(appRootPath)) {
    throw new Error('해당 app이 이미 존재합니다.');
  }

  await copyTemplate(appRootPath, packageName);
  await updatePackageJson(packageName);
})();
