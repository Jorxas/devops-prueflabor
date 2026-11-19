// Nur Voraussetzungen prüfen; keine Container- oder API-Abnahme ersetzen.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');

const wurzel = path.resolve(__dirname, '..');
const beginn = new Date();
const daten = fs.readFileSync(path.join(wurzel, 'beispieldaten/szenarien.json'));
const pruefsumme = createHash('sha256').update(daten).digest('hex');
const beispielanzahl = JSON.parse(daten.toString('utf8')).length;
const docker = spawnSync('docker', ['version'], { cwd: wurzel, encoding: 'utf8' });
const originaldatenErhalten = beispielanzahl === 3 &&
  pruefsumme === '8c5ed1290a16dd789398112eed6f25b12e8f17ba2b5925fcbabb7f75529f9b9a';
const ende = new Date();
const bericht = {
  projekt: 'P07', ticket: 'P07-T02', beginn: beginn.toISOString(), ende: ende.toISOString(),
  pruefdauerMillisekunden: ende - beginn, nodeVersion: process.version,
  pruefbefehl: 'node nachweise/p07-t02-voraussetzungen.cjs',
  docker: {
    befehl: 'docker version', prozessstatus: docker.status,
    standardausgabe: docker.stdout ?? '', fehlerausgabe: docker.stderr ?? '',
    startfehler: docker.error?.message ?? null
  },
  beispielanzahl, beispieleSha256: pruefsumme, originaldatenErhalten,
  voraussetzungenErfuellt: docker.status === 0 && originaldatenErhalten,
  grenze: 'Nur Docker-Erreichbarkeit und Originalbeispiele geprüft; kein Imagebau, Containerstart oder HTTP-Test.',
  wiederholungDateien: ['nachweise/p07-t02-voraussetzungen.cjs', 'beispieldaten/szenarien.json']
};
fs.writeFileSync(path.join(__dirname, 'P07-T02-voraussetzungen.json'), JSON.stringify(bericht, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(bericht, null, 2));
process.exitCode = bericht.voraussetzungenErfuellt ? 0 : 1;
