# Super Shots


[![Node.js Package](https://github.com/samuelj90/super-shots/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/samuelj90/super-shots/actions/workflows/npm-publish-github-packages.yml)


A Nodejs utility program that accept a URL crawls all the links under the same domain and takes screenshots when load finishes.

## Run and Build

Following npm scripts

### npm start

This command will build the project and run the build

### npm start:dev

This command will start the project in development mode
Changes will be redeployed using nodemon

### npm run build

This command will build the project

## Usage
```
npm install super-shots --save
```

create a file and coppy below contents

```
import SuperShots from 'super-shots';

async function runCrawler(): Promise<void> {
  const superShots = new SuperShots();
  await superShots.initialize();

  const url = 'https://example.com'; // Replace with your desired URL
  await superShots.crawlAndScreenshot(url);

  await superShots.close();
}

runCrawler()
  .then(() => console.log('Crawl and screenshot complete.'))
  .catch((error) => console.error('Error:', error));
```

Command line usage
```
npm install super-shots -g --save
```
```
$ super-shots https://example.com
```



## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.
