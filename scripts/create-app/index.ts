import { existsSync } from 'fs';
import { getAppInfo } from '../utils/get-app-info.util';
import { copyTemplate } from '../copy-template';
import { updatePackageJson } from '../utils/update-package-json';
import chalk from 'chalk';
import { installAppPackage } from '../utils/install-app-package';

type Command = { name: string; description: string };

const isMonorepoDisabled =
  process.argv.includes('--monorepo=false') ||
  (process.argv.includes('--monorepo') &&
    process.argv[process.argv.indexOf('--monorepo') + 1] === 'false');

(async function main() {
  const { packageName, appRootPath } = getAppInfo();

  if (existsSync(appRootPath)) {
    console.log(`\n${chalk.yellow(`이미 존재하는 app 이름입니다:`)}\n`);
    console.log(`   ${chalk.magenta(packageName)}`);
    process.exit(1);
  }

  console.log(`Creating a new React app in ${chalk.green(appRootPath)}.\n`);

  const stopProgress = printProgress('In progess');

  await copyTemplate(appRootPath, packageName);

  if (isMonorepoDisabled) {
    installAppPackage(appRootPath);

    stopProgress();

    const message = `Success! Created ${packageName} at ${appRootPath}\n\nInside that directory, you can run several commands:\n`;
    const commands = [
      { name: 'npm run dev', description: 'Starts the development server.' },
      {
        name: 'npm run build',
        description: 'Bundles the app into static files for production.',
      },
      { name: 'npm run test', description: 'Starts the test runner.' },
    ];
    printMessageWithCommands(message, commands);
  } else {
    await updatePackageJson(packageName);

    stopProgress();

    const message = `Success! Created ${packageName} at ${appRootPath}\n\nYou can run several commands:\n`;
    const commands = [
      {
        name: `npm run dev -w ${packageName}`,
        description: 'Starts the development server.',
      },
      {
        name: `npm run build -w ${packageName}`,
        description: 'Bundles the app into static files for production.',
      },
      {
        name: `npm run test -w ${packageName}`,
        description: 'Starts the test runner.',
      },
    ];
    printMessageWithCommands(message, commands);
  }
})();

function printMessageWithCommands(message: string, commands: Command[]) {
  console.log(`✨ ${message}`);
  commands.forEach((command) => {
    console.log(chalk.cyan(`  ${command.name}`));
    console.log(`    ${command.description}\n`);
  });
}

function printProgress(message: string) {
  let index = 0;
  const dotsInterval = setInterval(() => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`${message}${'.'.repeat(index % 4)}`);
    index++;
  }, 500);

  return () => {
    clearInterval(dotsInterval);
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  };
}
