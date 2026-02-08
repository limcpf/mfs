#!/usr/bin/env bun
import { buildSite, cleanBuildArtifacts } from "./build";
import { parseCliArgs, loadUserConfig, printHelp, resolveBuildOptions } from "./config";
import { runDev } from "./dev";

async function main(): Promise<void> {
  const cli = parseCliArgs(process.argv.slice(2));

  if (cli.help) {
    printHelp();
    return;
  }

  const userConfig = await loadUserConfig();
  const buildOptions = resolveBuildOptions(cli, userConfig);

  if (cli.command === "clean") {
    await cleanBuildArtifacts(buildOptions.outDir);
    console.log(`[clean] removed ${buildOptions.outDir} and .cache`);
    return;
  }

  if (cli.command === "dev") {
    await runDev(buildOptions, { port: cli.port ?? 3000 });
    return;
  }

  const result = await buildSite(buildOptions);
  console.log(`[build] total=${result.totalDocs} rendered=${result.renderedDocs} skipped=${result.skippedDocs}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
