import { getNodeVersions } from './index.js';

try {
  const versions = await getNodeVersions();
  console.log(JSON.stringify(versions, null, 2));
} catch (err) {
  process.stderr.write(`Error: ${(err as Error).message}\n`);
  process.exit(1);
}
