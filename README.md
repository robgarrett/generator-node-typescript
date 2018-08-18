# generator-node-typescript
My own Yeoman generator for TypeScript and NodeJS scaffolding.

## Usage:
1. Clone this repo.
2. npm i
3. npm run build
4. Run yo from a new folder.

## Details
This generator contains the following files, and decription of each, as follows:
* README.md - This read me file.
* .babelrc - Config file for babel - babel transpiles ES6 to ES5 since Yeoman generators don't yet work with ES6.
* .editorconfig - My standard editor config.
* .eslintignore - Folders for ESLINT to ignore.
* .eslintrc - Config file for ESLINT to lint our ES6 code.
* .gitignore - Files ignored by GIT.
* .yo-rc.json - Configuration for this Yeoman generator.
* gulpfile.babel.js - ES6 version of our Gulp file - Babel will transpile this file before running it.
* package-lock.json - Lock of package versions.
* package.json - NPM configuration of packages.
* generators/app/index.js - Created when we transpile the ES6 version of the file in the src folder.

...and the folders:
* src/app - Contains the main generator code in ES6 format - Gulp wil transpile this.
* generators/app - The main generator folder - Yeoman looks for this folder and for containing index.js file.
* generators/app/templates - The templates in use in the generator.

