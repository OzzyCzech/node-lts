# node-versions-info

[![NPM Downloads](https://img.shields.io/npm/dm/node-versions-info?style=for-the-badge)](https://www.npmjs.com/package/node-versions-info)
[![NPM Version](https://img.shields.io/npm/v/node-versions-info?style=for-the-badge)](https://www.npmjs.com/package/node-versions-info)
[![NPM License](https://img.shields.io/npm/l/node-versions-info?style=for-the-badge)](https://github.com/OzzyCzech/node-versions-info/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/OzzyCzech/node-versions-info?style=for-the-badge)](https://github.com/OzzyCzech/node-versions-info/commits/main)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/OzzyCzech/node-versions-info/main.yml?style=for-the-badge)](https://github.com/OzzyCzech/node-versions-info/actions)

Get Node.js [release](https://nodejs.org/en/about/releases/) info as structured data — one field per question, so you can wire it straight into CI matrices, Dockerfiles, or AI tooling.

## Usage

### CLI via npx

```sh
npx node-versions-info
```

Output:

```json
{
  "lts": 24,
  "activeLts": [22, 24],
  "maintenanceLts": [20],
  "current": 25,
  "supported": [20, 22, 24, 25],
  "next": 26
}
```

| Field            | Answers                                   | Typical use                                        |
|------------------|-------------------------------------------|----------------------------------------------------|
| `lts`            | Which single version should I target?     | `FROM node:{lts}`, AI tool defaults, docs          |
| `activeLts`      | What should I test in CI?                 | GitHub Actions `node-version` matrix               |
| `maintenanceLts` | Which LTS lines are winding down?         | Deprecation notices, security advisories           |
| `current`        | What's the newest release line?           | Bleeding-edge testing                              |
| `supported`      | What still receives any updates at all?   | Minimum-support matrices, fallback lists           |
| `next`           | What major is coming next?                | Pre-flight CI, release planning                    |

Every major falls into exactly one of `activeLts`, `maintenanceLts`, `current` (non-LTS) or `next` — the sets don't overlap. `supported` is the union of the first three. `lts` equals `max(activeLts)`.

### Library

```sh
npm install node-versions-info
```

```ts
import { getNodeVersions } from 'node-versions-info';

const v = await getNodeVersions();
console.log(v.lts);             // 24
console.log(v.activeLts);       // [22, 24]
console.log(v.maintenanceLts);  // [20]
console.log(v.current);         // 25
console.log(v.supported);       // [20, 22, 24, 25]
console.log(v.next);            // 26
```

### GitHub Actions matrix

```yaml
- id: node
  run: echo "matrix=$(npx -y node-versions-info | jq -c .activeLts)" >> $GITHUB_OUTPUT

test:
  strategy:
    matrix:
      node: ${{ fromJson(needs.node.outputs.matrix) }}
```

## Data source

Version data is fetched from the official Node.js Release Working Group schedule:

```
https://raw.githubusercontent.com/nodejs/Release/main/schedule.json
```

## License

[MIT](./LICENSE)

Made with ❤️ by [Roman Ožana](https://ozana.cz)
