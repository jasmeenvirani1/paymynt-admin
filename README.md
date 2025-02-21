
### Quick Start
* Install node.js: https://nodejs.org​ `(compatible version 16.17.0)`
* Install yarn package manager: https://yarnpkg.com/getting-started/install
* Install node modules by running terminal command `yarn install`

### For Production Run
* Run the app `yarn start` (DO NOT USE NPM)

### For Development Run
* Copy env `.env.dev` into `.env` file
* Run the app `yarn start`

### For development build
* Run `yarn build`

### Note
1. For pipeline we will need KEY_FILE and the same can be obtained as explained here Create service account for Firebase - https://cloud.google.com/iam/docs/creating-managing-service-account-keys
1. If you see any error on CI deployment then create env as "CI=false". This will allows deploying code even though there are build warnings

