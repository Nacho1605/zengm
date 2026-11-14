// Valida un archivo de liga con el mismo esquema JSON que usa
// play.basketball-gm.com al subirlo ("JSON schema validation errors"). Uso:
//
//   node tools/argentina/validar.ts ARCHIVO.json [ESQUEMA.json]
//
// El esquema por defecto es build/files/league-schema.json del juego oficial.

import { readFileSync } from "node:fs";
import Ajv from "ajv";

const [file, schemaFile = "build/files/league-schema.json"] =
	process.argv.slice(2);
const schema: any = JSON.parse(readFileSync(schemaFile, "utf8"));
const league = JSON.parse(readFileSync(file, "utf8"));

// Igual que el juego: cada parte se valida por separado
const CUMULATIVE = new Set([
	"gameAttributes",
	"meta",
	"startingSeason",
	"version",
]);
const ajv = new Ajv({ allErrors: true });
const base = {
	$schema: schema.$schema,
	$id: schema.$id,
	definitions: schema.definitions,
};

let total = 0;
for (const [part, def] of Object.entries<any>(schema.properties)) {
	if (!(part in league)) {
		continue;
	}
	const cumulative = CUMULATIVE.has(part);
	const validate = ajv.compile({
		...base,
		$id: `${schema.$id}#${part}`,
		...(cumulative ? def : def.items),
	});
	const values = cumulative ? [league[part]] : league[part];
	for (const value of values) {
		if (!validate(value)) {
			total += validate.errors!.length;
			const who =
				part === "players"
					? `${value.firstName} ${value.lastName} (pid ${value.pid})`
					: part === "teams"
						? value.abbrev
						: part;
			for (const e of validate.errors!) {
				console.log(
					`${part} | ${who} | ${e.instancePath} ${e.message} ${JSON.stringify(e.params)}`,
				);
			}
		}
	}
}
console.log(`Errores: ${total}`);
