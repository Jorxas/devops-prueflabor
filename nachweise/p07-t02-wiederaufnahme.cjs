// Wiederaufnahme: nur zugängliche Docker-Laufzeit und Originalbeispiele prüfen.
const dateisystem = require('node:fs');
const pfade = require('node:path');
const { spawnSync: ausfuehren } = require('node:child_process');
const { createHash: hashErstellen } = require('node:crypto');

const wurzel = pfade.resolve(__dirname, '..');
const beginn = new Date();
const daten = dateisystem.readFileSync(pfade.join(wurzel, 'beispieldaten/szenarien.json'));
const beispielanzahl = JSON.parse(daten.toString('utf8')).length;
const beispieleSha256 = hashErstellen('sha256').update(daten).digest('hex');
const dockerKonfiguration = pfade.join(wurzel, 'ausgabe/docker-konfiguration');
const dockerAdresse = 'npipe:////./pipe/dockerDesktopLinuxEngine';
const docker = ausfuehren('docker', ['version'], {
  cwd: wurzel, encoding: 'utf8', timeout: 30000,
  env: { ...process.env, DOCKER_CONFIG: dockerKonfiguration, DOCKER_HOST: dockerAdresse }
});
const originaldatenErhalten = beispielanzahl === 3 &&
  beispieleSha256 === '8c5ed1290a16dd789398112eed6f25b12e8f17ba2b5925fcbabb7f75529f9b9a';
const ende = new Date();
const bericht = {
  projekt: 'P07', ticket: 'P07-T02', versuch: 'Wiederaufnahme nach erstem blockiertem Lauf',
  beginn: beginn.toISOString(), ende: ende.toISOString(),
  pruefdauerMillisekunden: ende - beginn, nodeVersion: process.version,
  pruefbefehl: 'node nachweise/p07-t02-wiederaufnahme.cjs',
  docker: {
    befehl: 'docker version', konfiguration: 'ausgabe/docker-konfiguration', adresse: dockerAdresse,
    prozessstatus: docker.status, standardausgabe: docker.stdout ?? '',
    fehlerausgabe: docker.stderr ?? '', startfehler: docker.error?.message ?? null
  },
  beispielanzahl, beispieleSha256, originaldatenErhalten,
  voraussetzungenErfuellt: docker.status === 0 && originaldatenErhalten,
  grenze: 'Nur Voraussetzung geprüft. Kein Imagebau, Containerstart oder HTTP-Test. Keine Berechtigungen geändert.',
  wiederholungDateien: [
    'nachweise/p07-t02-wiederaufnahme.cjs', 'beispieldaten/szenarien.json',
    'ausgabe/docker-konfiguration/config.json'
  ],
  konfigurationsinhaltZurWiederholung: 'Leeres JSON-Objekt {}; keine Zugangsdaten erforderlich.'
};
dateisystem.writeFileSync(pfade.join(__dirname, 'P07-T02-wiederaufnahme.json'),
  JSON.stringify(bericht, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(bericht, null, 2));
process.exitCode = bericht.voraussetzungenErfuellt ? 0 : 1;
