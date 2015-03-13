# Pockets 

>
This is an experimental POC part of a demo presented in [Decentralize This hackaton](http://www.meetup.com/BTCHACKIL/events/220646630/).

Pockets is a Bitcoin based hierarchical wallet application offering advanced
rule sets to manage relationships and balances.

## Getting started

Getting started is easy, clone this repository and build the project.

```bash
$ git clone https://github.com/joola/pockets
$ cd pockets
$ npm install && bower install
$ npm run build
```

### Running using emulator
We used [ionic](http://ionicframework.com/) as the framework for building the Pockets app. In order to use the emulator, please follow these steps after you clone the repository.

```bash
$ npm install -g cordova ionic
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios
```

### Running from the browser

Since Pockets is a client-side only application/system, this means you can load the entire thing within your browser.
Navigate to `file:///<where-you-installed>/pockets/app/www/index.html`

You should be able to start the Start page.

### Running on your phone

To deploy the application to your phone simply download and install the `apk` from `platforms/android/ant-build/pockets.apk`.

The application should now be available in your phone menu.

## How does it work?

Pockets uses a simple JSON structure to describe the pocket collection and the relationship between sibling pockets.

```js
{
  name: 'root',
  pockets: {
    savings: {
      name: 'savings',
      level_ratio: 0.5, //limit pension to 50% of the level
      pockets: {
        house: {
          name: 'house'
        },
        pension: {
          name: 'pension',
          level_ratio: 0.7 //limit pension to 70% of the level
        }
      }
    },
    ongoing: {
      name: 'ongoing',
      pockets: {
        rent: {
          name: 'rent',
          limit: 2.5 //limit rent to 2.5 btc
        },
        food: {
          name: 'food',
          pockets:{
            vitamins:{
              name: 'vitamins'
            },
            beer:{
              name: 'beer'
            }
          }
        }
      }
    }
  }
}
```

Pockets monitors the wallets in the collection for any balance updates, when a new update is discovered, Pockets will balance the collection according to the logic defined.

## To do
- HD wallets
- Better test coverage and use cases
- Minor bug fixes
- Support for using your existing wallet via import
- Security and authentication mechanism
- Backup/restore capability

## License

Copyright (c) 2015 Joola Smart Solutions. MIT Licensed, see [LICENSE][license] for details.

[license]: https://github.com/joola/pockets/blob/develop/LICENSE.md