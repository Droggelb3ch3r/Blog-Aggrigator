import fs from "fs";
import os from "os";
import path from "path";

type Config = {
	dbUrl : string;
	currentUserName?: string;
};

export function setUser(username: string): void {
	const config = readConfig();
	config.currentUserName = username;
	writeConfig(config);
	
}

export function readConfig(): Config {
	const rawConfigString = fs.readFileSync(getConfigFilePath(), {encoding: `utf-8`});
	const rawConfig = JSON.parse(rawConfigString);
	const config = validateConfig(rawConfig);
	return config;
}



function getConfigFilePath(): string {
	return path.join(os.homedir(),".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
	const configString =  JSON.stringify({db_url: cfg.dbUrl, current_user_name: cfg.currentUserName});
	fs.writeFileSync(getConfigFilePath(), configString, {encoding: `utf-8`})
}

function validateConfig(rawConfig: any): Config {
	if (rawConfig === null || typeof rawConfig != `object`) {
		throw new Error("Config ungültig oder nicht vorhanden")
	}
	if (typeof rawConfig.db_url != `string`) {
		throw new Error("Die db URL ist nicht vorhanden oder hat ein ungültiges vormat (sollte string sein)");
	}
	// ein nicht vorhadene url entspricht undefined !


	const configObj: Config = {dbUrl: rawConfig.db_url};
	if (rawConfig.current_user_name) {
		configObj.currentUserName = rawConfig.current_user_name;
	}
	return configObj;
}


