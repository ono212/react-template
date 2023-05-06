import spawn from 'cross-spawn';

export const installAppPackage = (appRootPath: string) => {
  spawn.sync('npm', ['i'], {
    cwd: appRootPath,
    stdio: 'inherit',
  });
};
