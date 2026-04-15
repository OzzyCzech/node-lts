# node-versions-info

[![NPM Downloads](https://img.shields.io/npm/dm/node-versions-info?style=for-the-badge)](https://www.npmjs.com/package/node-versions-info)
[![NPM Version](https://img.shields.io/npm/v/node-versions-info?style=for-the-badge)](https://www.npmjs.com/package/node-versions-info)
[![NPM License](https://img.shields.io/npm/l/node-versions-info?style=for-the-badge)](https://github.com/OzzyCzech/node-versions-info/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/OzzyCzech/node-versions-info?style=for-the-badge)](https://github.com/OzzyCzech/node-versions-info/commits/main)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/OzzyCzech/node-versions-info/main.yml?style=for-the-badge)](https://github.com/OzzyCzech/node-versions-info/actions)

Get active Node.js LTS and [current](https://nodejs.org/en/about/releases/) version numbers.

## Usage

### CLI via npx

```sh
npx node-versions-info
```

Output:

```json
{
  "active": [20, 22, 24, 25],
  "lts": 24,
  "maintenance": [20, 25],
  "current": 25,
  "next": 26
}
```

| Field         | Description                                             |
|---------------|---------------------------------------------------------|
| `active`      | All major versions within their support window          |
| `maintenance` | Major versions in Maintenance LTS (critical fixes only) |
| `lts`         | Highest major version in Active LTS phase               |
| `current`     | Highest released major version                          |
| `next`        | Next upcoming version (not yet released), or `null`     |

### Library

```sh
npm install node-versions-info
```

```ts
import { getNodeVersions } from 'node-versions-info';

const { active, lts, maintenance, current, next } = await getNodeVersions();
console.log(active);       // [20, 22, 24, 25]
console.log(lts);          // 24
console.log(maintenance);  // [20, 25]
console.log(current);      // 25
console.log(next);         // 26
```

## Data source

Version data is fetched from the official Node.js Release Working Group schedule:

```
https://raw.githubusercontent.com/nodejs/Release/main/schedule.json
```

## License

[MIT](./LICENSE)

Made with ❤️ by [Roman Ožana](https://ozana.cz)
