# GameBuilder

GameBuilder is created using React for Social Multiplayer Games course at NYU.

## Installation

- Clone the repo
- Do `npm install` or `yarn install`
- Copy `sample.config.json` to `src/config.json` and update the config with credentials that you get from firebase console's web setup
- In config, also set `basename` to the subfolder in which you are deploying the app. For e.g. for our github pages, project is deployed at `/GameBuilder` so `basename` is set to `GameBuilder`.

## Running

- Run using `npm start` or `yarn start`
- Test using `npm test` or `yarn test`

## Build

- Build for production using `npm run build` or `yarn build`
- For building and deploying at gh-pages follow [link](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages)
