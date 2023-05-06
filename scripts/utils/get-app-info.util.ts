import { resolve } from 'path';
import chalk from 'chalk';

export const getAppInfo = () => {
  if (process.argv.length < 3) {
    console.log(`\n${chalk.yellow('패키지 이름을 입력해주세요:')}\n`);
    console.log(`   ${chalk.green('npm run create <app-name>')}`);
    process.exit(1);
  }

  const [, , packageName] = process.argv;

  return {
    packageName,
    appRootPath: resolve(process.cwd(), 'packages', packageName),
  };
};
