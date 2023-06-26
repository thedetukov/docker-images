#!/usr/bin/env node

"use strict";

const { FCancellationTokenSourceManual, FConfigurationChain, FConfigurationException, sleep, FLogger, FCancellationException, FExecutionContext } = require("@freemework/common");
const { FConfigurationEnv, FConfigurationDirectory } = require("@freemework/hosting");
const { FSqlMigrationSources } = require("@freemework/sql.misc.migration");
const { PostgresProviderFactory, PostgresMigrationManager } = require("@freemework/sql.postgres");

const path = require("path");

const { version: packageVersion } = require("../package.json");

const appLogger = FLogger.create(`SQL Migration Builder v${packageVersion}`);

// const appLogger = rootLogger.getLogger("install");
const appCancellationTokenSource = new FCancellationTokenSourceManual();

let destroyRequestCount = 0
const shutdownSignals = Object.freeze(["SIGTERM", "SIGINT"]);

async function gracefulShutdown(signal) {
	if (destroyRequestCount++ === 0) {
		appCancellationTokenSource.cancel();

		if (appLogger.isInfoEnabled) {
			appLogger.info(`Interrupt signal received: ${signal}`);
		}
	} else {
		if (appLogger.isInfoEnabled) {
			appLogger.info(`Interrupt signal (${destroyRequestCount}) received: ${signal}`);
		}
	}
}
shutdownSignals.forEach((signal) => process.on(signal, () => gracefulShutdown(signal)));

async function main() {
	let executionContext = FExecutionContext.Default;

	const mainLogger = appLogger;

	const startDate = new Date();

	const config = await readConfiguration();

	mainLogger.info(executionContext, "Validating input directory...");

	const sqlMigrationSources = await FSqlMigrationSources.loadFromFilesystem(executionContext, path.join(config.inputDirectory, "migration"));

	sqlMigrationSources.map((inputContent, info) => {
		console.log(info.versionName, info.itemName);
		return inputContent;
	});

	const endDate = new Date();
	const secondsDiff = (endDate.getTime() - startDate.getTime()) / 1000;
	mainLogger.info(`Done in ${secondsDiff} seconds.`);
}

async function readConfiguration() {
	const configParts = [];

	configParts.push(new FConfigurationEnv());

	const config = new FConfigurationChain(...configParts);

	const inputDirectory = config.get("sqlmigrationbuilder.directory.input").asString;
	const destDirectory = config.get("sqlmigrationbuilder.directory.dist").asString;

	return Object.freeze({ inputDirectory, destDirectory });
}

main().then(
	function () { process.exit(0); }
).catch(
	function (reason) {
		let exitCode;
		if (reason instanceof FConfigurationException) {
			appLogger.fatal(FExecutionContext.Default, `Wrong configuration. Cannot continue. ${reason.message}`);
			exitCode = 1;
		} else if (reason instanceof FCancellationException) {
			appLogger.warn(FExecutionContext.Default, "Application cancelled by user");
			exitCode = 42;
		} else {
			appLogger.fatal(FExecutionContext.Default, "Application crashed", reason);
			exitCode = 127;
		}
		const timeout = setTimeout(guardForMissingLoggerCallback, 5000);
		const finalExitCode = exitCode;
		function guardForMissingLoggerCallback() {
			// This guard resolve promise, if log4js does not call shutdown callback
			process.exit(finalExitCode);
		}
		require('log4js').shutdown(function (log4jsErr) {
			if (log4jsErr) {
				console.error("Failure log4js.shutdown:", log4jsErr);
			}
			clearTimeout(timeout);
			process.exit(finalExitCode);
		});
	}
);
