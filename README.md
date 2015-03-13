# Pockets [![Build Status](https://travis-ci.org/joola/pockets.svg)](https://travis-ci.org/joola/pockets) [![Coverage Status](https://coveralls.io/repos/joola/pockets/badge.svg)](https://coveralls.io/r/joola/pockets) [![Inline docs](http://inch-ci.org/github/joola/pockets.svg?branch=develop)](http://inch-ci.org/github/joola/pockets)

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

### Running from the browser

### Running on your phone

## How does it work?

Pockets uses a simple JSON structure to describe the pocket collection and the relationship between sibling pockets.

```js
{
  name: 'root',
  pockets: {
    savings: {
      name: 'savings',
      level_ratio: 0.5,
      pockets: {
        house: {
          name: 'house'
        },
        pension: {
          name: 'pension',
          level_ratio: 0.7
        }
      }
    },
    ongoing: {
      name: 'ongoing',
      pockets: {
        rent: {
          name: 'rent',
          limit: 2.5
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