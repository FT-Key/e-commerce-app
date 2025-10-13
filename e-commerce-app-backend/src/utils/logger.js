import chalk from "chalk";

export const info = (msg) => console.log(chalk.blue("[INFO]"), msg);
export const success = (msg) => console.log(chalk.green("[SUCCESS]"), msg);
export const warn = (msg) => console.log(chalk.yellow("[WARN]"), msg);
export const error = (msg) => console.log(chalk.red("[ERROR]"), msg);
