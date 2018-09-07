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

        // Define dependencies for the scaffolding.
        this.npmDependencies = [];
        this.npmDevDependencies = [
            "@types/chai",
            "@types/express",
            "@types/mocha",
            "@types/node",
            "@types/numeral",
            "@types/webpack",
            "@types/webpack-dev-middleware",
            "babel-cli",
            "babel-core",
            "babel-preset-env",
            "browser-sync",
            "chai",
            "chalk",
            "compression",
            "css-loader",
            "eslint",
            "eslint-plugin-import",
            "eslint-watch",
            "express",
            "extract-text-webpack-plugin",
            "gulp",
            "gulp-clean",
            "gulp-debug",
            "gulp-exec",
            "gulp-flatten",
            "gulp-mocha",
            "gulp-sourcemaps",
            "gulp-tslint",
            "gulp-typescript",
            "html-loader",
            "html-webpack-plugin",
            "mocha",
            "nodemon",
            "numeral",
            "path",
            "style-loader",
            "ts-loader",
            "tslint",
            "typescript",
            "webpack",
            "webpack-dev-middleware",
            "webpack-md5-hash"
        ];

        // Get the latest of a list of dependencies.
        this.getDeps = deps => deps.map(dep => {
            // Enforce version 4 of gulp.
            if (dep === "gulp") {
                return "gulp@4.0.0";
            } else if (dep === "extract-text-webpack-plugin") {
                return "extract-text-webpack-plugin@next";
            }
            return dep + "@latest";
        });

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
        this.sourceRoot(path.join(__dirname, "/templates"));
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
        this.render("_package.json", "package.json", { appName: this.appName });
        this.copy(".babelrc", ".babelrc", false);
        this.copy(".editorconfig", ".editorconfig", false);
        this.copy(".gitignore", ".gitignore", false);
        this.copy("tsconfig.json", "tsconfig.json", false);
        this.copy("tslint.json", "tslint.json", false);
        this.copy("gulpfile.babel.js", "gulpfile.babel.js", false);
        this.copy("webpack.config.dev.js", "webpack.config.dev.js", false);
        this.copy("webpack.config.dev.js", "webpack.config.prod.js", false);
        this.copy("src/", "src/", false);
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
