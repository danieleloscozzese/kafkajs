import { globSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const preloadProtocol = async (pattern) => {
  for (const file of globSync(pattern)) {
    await import(pathToFileURL(resolve(file)).href);
  }
};

export { preloadProtocol };
