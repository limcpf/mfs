import path from "node:path";
import { pathToFileURL } from "node:url";
import type { BuildOptions, UserConfig } from "./types";

export interface CliArgs {
  command: "build" | "dev" | "clean";
  vaultDir?: string;
  outDir?: string;
  exclude: string[];
  newWithinDays?: number;
  recentLimit?: number;
  port?: number;
  help: boolean;
}

const DEFAULTS = {
  vaultDir: ".",
  outDir: "dist",
  exclude: [".obsidian/**"],
  newWithinDays: 7,
  recentLimit: 5,
  wikilinks: true,
  imagePolicy: "omit-local" as const,
  gfm: true,
  shikiTheme: "github-dark",
};

export function parseCliArgs(argv: string[]): CliArgs {
  const [first] = argv;
  const command = first === "build" || first === "dev" || first === "clean" ? first : "build";
  const rest = first === command ? argv.slice(1) : argv;

  const parsed: CliArgs = {
    command,
    exclude: [],
    help: false,
  };

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (token === "--help" || token === "-h") {
      parsed.help = true;
      continue;
    }
    if (token === "--vault") {
      parsed.vaultDir = rest[++i];
      continue;
    }
    if (token === "--out") {
      parsed.outDir = rest[++i];
      continue;
    }
    if (token === "--exclude") {
      parsed.exclude.push(rest[++i]);
      continue;
    }
    if (token === "--new-within-days") {
      parsed.newWithinDays = Number(rest[++i]);
      continue;
    }
    if (token === "--recent-limit") {
      parsed.recentLimit = Number(rest[++i]);
      continue;
    }
    if (token === "--port") {
      parsed.port = Number(rest[++i]);
      continue;
    }
    throw new Error(`Unknown option: ${token}`);
  }

  return parsed;
}

export async function loadUserConfig(cwd = process.cwd()): Promise<UserConfig> {
  const candidates = ["blog.config.ts", "blog.config.js", "blog.config.mjs", "blog.config.cjs"];

  for (const fileName of candidates) {
    const absolute = path.join(cwd, fileName);
    const file = Bun.file(absolute);
    if (!(await file.exists())) {
      continue;
    }

    const imported = await import(pathToFileURL(absolute).href);
    const config = (imported.default ?? imported) as UserConfig;
    return config ?? {};
  }

  return {};
}

export function resolveBuildOptions(cli: CliArgs, userConfig: UserConfig, cwd = process.cwd()): BuildOptions {
  const cfgExclude = userConfig.exclude ?? [];
  const cliExclude = cli.exclude ?? [];
  const mergedExclude = Array.from(new Set([...DEFAULTS.exclude, ...cfgExclude, ...cliExclude]));

  return {
    vaultDir: path.resolve(cwd, cli.vaultDir ?? userConfig.vaultDir ?? DEFAULTS.vaultDir),
    outDir: path.resolve(cwd, cli.outDir ?? userConfig.outDir ?? DEFAULTS.outDir),
    exclude: mergedExclude,
    newWithinDays: cli.newWithinDays ?? userConfig.ui?.newWithinDays ?? DEFAULTS.newWithinDays,
    recentLimit: cli.recentLimit ?? userConfig.ui?.recentLimit ?? DEFAULTS.recentLimit,
    wikilinks: userConfig.markdown?.wikilinks ?? DEFAULTS.wikilinks,
    imagePolicy: userConfig.markdown?.images ?? DEFAULTS.imagePolicy,
    gfm: userConfig.markdown?.gfm ?? DEFAULTS.gfm,
    shikiTheme: userConfig.markdown?.highlight?.theme ?? DEFAULTS.shikiTheme,
  };
}

export function printHelp(): void {
  console.log(`
Usage:
  blog build [options]
  blog dev [options]
  blog clean [options]

Options:
  --vault <path>            Vault root directory (default: .)
  --out <path>              Output directory (default: dist)
  --exclude <glob>          Exclude glob pattern (repeatable)
  --new-within-days <n>     NEW badge threshold days (default: 7)
  --recent-limit <n>        Recent virtual folder item count (default: 5)
  --port <n>                Dev server port (default: 3000)
  -h, --help                Show help
`);
}
