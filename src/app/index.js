import Generator from "yeoman-generator";
import yosay from "yosay";
import chalk from "chalk";
import shift from "change-case";
import shell from "shelljs";
import ejs from "ejs";
import fs from "fs";

/*
 * My Yeoman generator.
 * Influenced from: https://github.com/alexfedoseev/generator-react-sandbox-server
 */
export default class MyGenerator extends Generator {
    constructor(...args) {
        super(...args);

        // Define dependencies for the scaffolding.
        this.npmDependencies = [];
        this.npmDevDependencies = [];

        // Get the latest of a list of dependencies.
        this.getDeps = deps => deps.map(dep => dep + "@latest");

        // Various output statements.
        this.say = {
            arr: "----> ",
            tab: "    ",
            info(msg) {
                console.log("\n\n" + chalk.yellow(this.arr + msg) + "\n");
            },
            status(item, status) {
                console.log(`${this.tab}${chalk.green(status)} ${item}`);
            },
            cmd(cmd) {
                console.log("\n" + chalk.green("$ " + cmd));
            },
            done(status, msg) {
                console.log(`\n\n${this.tab}${chalk.green(status)} $ ${msg}\n`);
            }
        };

        // Copy from template src to destination.
        this.copy = (src, dest, show) => {
            shell.cp("-Rf", this.templatePath(src), this.destinationPath(dest));
            this.say.status(show || dest, "✓ ");
        };

        // Render a template file to a real file.
        this.render = (src, dest, params = {}) => {
            const output = ejs.render(this.read(this.templatePath(src)), params);
            fs.writeFileSync(this.destinationPath(dest), output);
            this.say.status(dest, "✓ ");
        };

        // Exwecute a shell command.
        this.shellExec = cmd => {
            this.say.cmd(cmd);
            shell.exec(cmd);
            console.log("Completed.");
        };

        // Operation complete.
        this.allDone = () => {
            this.say.done("All done!", `cd ${this.appName}/`);
        };
    }

    // Called when prompting the user.
    prompting() {
        this.log(yosay(`Welcome to ${chalk.white("node-typescript generator")}`));
        // Get the default name of the app and skip prompts option.
        const defaultAppName = shift.param(this.rootGeneratorName()) || null;
        const prompts = [
            {
                type: "input",
                name: "appName",
                message: "Enter appName:",
                default: defaultAppName
            }
        ];
        // Ask Yeoman to prompt the user.
        return this.prompt(prompts).then(props => {
            // Props are the return prompt values.
            this.appName = shift.param(props.appName);
        });
    }

    writing() {
        this.say.info("Setting up project...");
        shell.mkdir(this.appName);
        this.destinationRoot(this.appName);
    }

    install() {
        const deps = this.getDeps(this.npmDependencies);
        const devDeps = this.getDeps(this.npmDevDependencies);
        this.say.info("Installing dependencies...");
        this.npmInstall(deps, { save: true });
        this.npmInstall(devDeps, { saveDev: true }, () => {
            this.shellExec("npm shrinkwrap --loglevel error");
            this.allDone();
        });
    }
}
