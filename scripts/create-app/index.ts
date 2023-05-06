import { existsSync } from 'fs';
import { getAppInfo } from '../utils/get-app-info.util';
import { copyTemplate } from '../copy-template';
import { updatePackageJson } from '../utils/update-package-json';
import chalk from 'chalk';
import { installAppPackage } from '../utils/install-app-package';

(async function main() {
  const { packageName, appRootPath } = getAppInfo();

  if (existsSync(appRootPath)) {
    console.log(`\n${chalk.yellow(`이미 존재하는 app 이름입니다:`)}\n`);
    console.log(`   ${chalk.magenta(packageName)}`);
    process.exit(1);
  }

  await copyTemplate(appRootPath, packageName);

  if (process.argv.includes('--monorepo')) {
    await updatePackageJson(packageName);
    return;
  }

  installAppPackage(appRootPath);
})();
