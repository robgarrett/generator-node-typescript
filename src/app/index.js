import Generator from "yeoman-generator";
import yosay from "yosay";
import chalk from "chalk";
import shift from "change-case";
import shell from "shelljs";
import path from "path";

/*
 * My Yeoman generator.
 * Influenced from: https://github.com/alexfedoseev/generator-react-sandbox-server
 */
export default class MyGenerator extends Generator {
    constructor(...args) {
        super(...args);

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
            this.fs.copy(this.templatePath(src), this.destinationPath(dest));
            this.say.status(show || dest, "✓ ");
        };

        // Render a template file to a real file.
        this.render = (src, dest, params = {}) => {
            this.fs.copyTpl(
                this.templatePath(src),
                this.destinationPath(dest),
                params
            );
            this.say.status(dest, "✓ ");
        };

        // Execute a shell command.
        this.shellExec = cmd => {
            this.say.cmd(cmd);
            shell.exec(cmd);
            this.say.info("Completed");
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
            },
            {
                type: "list",
                name: "appType",
                message: "Select application type:",
                default: "console-app",
                choices: [
                    "web-app",
                    "server-app",
                    "node-app",
                    "azure-func",
                    "console-app"
                ]
            }
        ];

        /*
         *  Ask Yeoman to prompt the user.
         *  Return a promise so the run loop waits until
         *  we've finished.
         */
        return this.prompt(prompts).then(props => {
            // Props are the return prompt values.
            this.appName = shift.param(props.appName);
            this.appType = shift.param(props.appType);
        });
    }

    writing() {
        this.say.info("Setting up project...");
        this.say.info("App type is " + this.appType);
        if (this.appType === "web-app") {
            this.sourceRoot(path.join(__dirname, "/templates/web-app"));
        } else if (this.appType === "node-app") {
            this.sourceRoot(path.join(__dirname, "/templates/node-app"));
        } else if (this.appType === "azure-func") {
            this.sourceRoot(path.join(__dirname, "/templates/azure-func"));
        } else if (this.appType === "server-app") {
            this.sourceRoot(path.join(__dirname, "/templates/server-app"));
        } else {
            this.sourceRoot(path.join(__dirname, "/templates/console-app"));
        }
        shell.mkdir(this.appName);
        this.destinationRoot(this.appName);
        this.render("_package.json", "package.json", { appName: this.appName });
        if (this.appType !== "console-app") {
            this.render("_docker-compose.yml", "docker-compose.yml", { appName: this.appName });
            this.copy(".dockerignore", ".dockerignore", false);
            this.copy("Dockerfile", "Dockerfile", false);
        }
        this.copy(".babelrc", ".babelrc", false);
        this.copy(".eslintrc", ".eslintrc", false);
        this.copy(".editorconfig", ".editorconfig", false);
        this.copy(".gitignore", ".gitignore", false);
        this.copy("tsconfig.json", "tsconfig.json", false);
        this.copy("tslint.json", "tslint.json", false);
        this.copy("gulpfile.babel.js", "gulpfile.babel.js", false);
        if (this.appType !== "server-app" &&
            this.appType !== "azure-func" &&
            this.appType !== "console-app") {
            this.copy("webpack.config.dev.js", "webpack.config.dev.js", false);
            this.copy("webpack.config.prod.js", "webpack.config.prod.js", false);
        } else if (this.appType === "azure-func") {
            this.copy("host.json", "host.json", false);
            this.copy("local.settings.json", "local.settings.json", false);
            this.copy(".funcignore", ".funcignore", false);
            this.copy("echo/", "echo/", false);
        }
        if (this.appType !== "azure-func") {
            this.copy("src/", "src/", false);
        }
    }

    install() {
        // Install NPM packages.
        this.npmInstall();
    }

    end() {
        this.allDone();
    }
}
