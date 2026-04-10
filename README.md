# node-lts

[![NPM Downloads](https://img.shields.io/npm/dm/node-lts?style=for-the-badge)](https://www.npmjs.com/package/node-lts)
[![NPM Version](https://img.shields.io/npm/v/node-lts?style=for-the-badge)](https://www.npmjs.com/package/node-lts)
[![NPM License](https://img.shields.io/npm/l/node-lts?style=for-the-badge)](https://github.com/OzzyCzech/node-lts/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/OzzyCzech/node-lts?style=for-the-badge)](https://github.com/OzzyCzech/node-lts/commits/main)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/OzzyCzech/node-lts/main.yml?style=for-the-badge)](https://github.com/OzzyCzech/node-lts/actions)

> Get active Node.js LTS and current version numbers.

## Usage

### CLI via npx

```sh
npx node-lts
```

Output:

```json
{
  "active": [20, 22, 24, 25],
  "lts": 24,
  "current": 25
}
```

| Field     | Description                                             |
|-----------|---------------------------------------------------------|
| `active`  | All major versions within their support window          |
| `lts`     | Highest major version in Active LTS phase               |
| `current` | Highest released major version                          |

### Library

```sh
npm install node-lts
```

```ts
import { getNodeVersions } from 'node-lts';

const { active, lts, current } = await getNodeVersions();
console.log(active);  // [20, 22, 24, 25]
console.log(lts);     // 24
console.log(current); // 25
```

## Data source

Version data is fetched from the official Node.js Release Working Group schedule:  
`https://raw.githubusercontent.com/nodejs/Release/main/schedule.json`

## License

[MIT](./LICENSE)

Made with ❤️ by [Roman Ožana](https://ozana.cz)
