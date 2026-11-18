// Konsistenzprüfung des Entwurfs; kein HTTP-Dienst und keine Fehlersimulation.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { spawnSync } = require('node:child_process');

const wurzel = path.resolve(__dirname, '..');
const beginn = new Date();
const lesen = datei => fs.readFileSync(path.join(wurzel, datei), 'utf8');
const pruefungen = [];
function pruefen(bezeichnung, pruefung) {
  try {
    pruefung();
    pruefungen.push({ bezeichnung, bestanden: true });
  } catch (fehler) {
    pruefungen.push({ bezeichnung, bestanden: false, fehler: fehler.message });
  }
}

const projekt = JSON.parse(lesen('projekt.json'));
const vertrag = projekt.gesundheitsvertrag;
const beispiele = JSON.parse(lesen(projekt.fixture));
const pruefsumme = () => createHash('sha256')
  .update(fs.readFileSync(path.join(wurzel, projekt.fixture))).digest('hex');
const vorher = pruefsumme();
const ursprung = '8c5ed1290a16dd789398112eed6f25b12e8f17ba2b5925fcbabb7f75529f9b9a';

pruefen('Dienstwahl, Voraussetzung und offener Umsetzungsstand', () => {
  assert.equal(vertrag.dienst, 'P02');
  assert.equal(vertrag.voraussetzung, 'P02-T01');
  assert.equal(vertrag.spaetereUmsetzungVoraussetzung, 'P02-T03');
  assert.equal(vertrag.stand, 'entwurf');
  assert.equal(projekt.businessImplemented, false);
});
pruefen('Lokaler Gesundheitsvertrag und Normalantwort', () => {
  assert.equal(vertrag.methode, 'GET');
  assert.equal(vertrag.adresse, 'http://127.0.0.1:3000/gesundheit');
  assert.equal(vertrag.zeitlimitMillisekunden, 2000);
  assert.equal(vertrag.inhaltstyp, 'application/json; charset=utf-8');
  assert.deepEqual(vertrag.konfiguration, { DIENST_UMGEBUNG: 'lokal' });
  assert.deepEqual(vertrag.diagnoseeingabe, { umgebung: 'lokal' });
  assert.deepEqual(vertrag.normalbetrieb, {
    httpStatus: 200, antwort: { dienst: 'P02', zustand: 'betriebsbereit' },
    prozessstatusDiagnose: 0
  });
});
pruefen('Genau drei Fehlerfälle mit unterscheidbaren Ergebnissen', () => {
  assert.deepEqual(vertrag.fehlerfaelle.map(fall => [fall.id, fall.httpStatus,
    fall.antwort?.zustand ?? fall.zustand, fall.prozessstatusDiagnose]), [
    ['fehlende-konfiguration', 503, 'konfigurationsfehler', 1],
    ['ungueltige-eingabe', null, 'eingabefehler', 2],
    ['dienst-nicht-erreichbar', null, 'verbindungsfehler', 3]
  ]);
  assert.equal(vertrag.fehlerfaelle[0].antwort.dienst, vertrag.dienst);
  for (const fall of vertrag.fehlerfaelle) {
    assert.ok(fall.ausloeser.length > 0);
    assert.ok(fall.wiederherstellung.length > 0);
  }
});
pruefen('Drei Originalbeispiele passen zum Vertrag', () => {
  assert.equal(projekt.expectedRecords, 3);
  assert.equal(beispiele.length, 3);
  assert.deepEqual(beispiele, [
    { id: 'normalbetrieb', konfiguration: 'gueltig', erwartet: vertrag.normalbetrieb.antwort.zustand },
    { id: 'fehlende-konfiguration', konfiguration: null, erwartet: vertrag.fehlerfaelle[0].antwort.zustand },
    { id: 'ungueltige-eingabe', anfrage: { umgebung: '' }, erwartet: vertrag.fehlerfaelle[1].zustand }
  ]);
});
const einstieg = spawnSync(process.execPath, [projekt.starter], { cwd: wurzel, encoding: 'utf8' });
pruefen('Vorhandener Node-Einstieg läuft und meldet nur Initialisierung', () => {
  assert.equal(projekt.starter, 'src/gesundheit.cjs');
  assert.equal(einstieg.status, 0);
  assert.equal(einstieg.stderr, '');
  assert.deepEqual(JSON.parse(einstieg.stdout), { zustand: 'initialisiert', fachfunktionUmgesetzt: false });
});
pruefen('Originaldatei vor und nach der Prüfung unverändert', () => {
  assert.equal(vorher, ursprung);
  assert.equal(pruefsumme(), ursprung);
});

const ende = new Date();
const bericht = {
  projekt: 'P07', ticket: 'P07-T01', beginn: beginn.toISOString(), ende: ende.toISOString(),
  pruefdauerMillisekunden: ende - beginn, nodeVersion: process.version,
  befehl: 'node nachweise/p07-t01-pruefen.cjs',
  einstieg: { befehl: projekt.command, prozessstatus: einstieg.status, ausgabe: einstieg.stdout, fehlerausgabe: einstieg.stderr },
  beispieldatensaetze: beispiele.length, sha256Vorher: vorher, sha256Nachher: pruefsumme(),
  pruefungen, bestanden: pruefungen.every(pruefung => pruefung.bestanden),
  grenze: 'Nur Vertragskonsistenz und Node-Einstieg geprüft; keine HTTP-Anfrage, kein Docker, keine CI, keine laufende P02-API.'
};
fs.writeFileSync(path.join(__dirname, 'P07-T01-pruefung.json'), JSON.stringify(bericht, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(bericht, null, 2));
process.exitCode = bericht.bestanden ? 0 : 1;
