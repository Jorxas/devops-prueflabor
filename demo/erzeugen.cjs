/**
 * Erzeugt die Daten der Demo aus echten Läufen des Projekts.
 * Voraussetzung: erreichbarer Docker-Daemon (Linux-Container), Node 24, Internet für das Basisimage beim ersten Bau.
 * Aufruf im Projektordner: node demo/erzeugen.cjs
 * Ergebnis: demo/daten/lauf.json, demo/daten/docker-build.txt (plus Kopien von Dockerfile und szenarien.json)
 *
 * Ablauf: Das Projekt-Dockerfile wird gebaut (eigener Imagename). Für jede Konfigurationsvariante wird ein
 * eigener Testcontainer gestartet, mit der echten Diagnose src/gesundheit.cjs abgefragt, gestoppt, erneut
 * abgefragt und wieder gestartet. Entfernt werden nur Container mit dem Label prueflabor.demo=1.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { gesundheitszustand } = require('../src/gesundheit.cjs');

const projekt = path.resolve(__dirname, '..');
const ausgabe = path.join(__dirname, 'daten');
const image = 'devops-prueflabor-demo:lokal';
const dockerKonfig = fs.mkdtempSync(path.join(os.tmpdir(), 'prueflabor-docker-'));
fs.writeFileSync(path.join(dockerKonfig, 'config.json'), '{}\n');
const umgebung = {
  ...process.env, DOCKER_CONFIG: dockerKonfig,
  DOCKER_HOST: process.env.DOCKER_HOST || (process.platform === 'win32' ? 'npipe:////./pipe/dockerDesktopLinuxEngine' : 'unix:///var/run/docker.sock'),
};

function docker(...argumente) {
  const lauf = spawnSync('docker', argumente, { cwd: projekt, env: umgebung, encoding: 'utf8', windowsHide: true, timeout: 420000, maxBuffer: 16 * 1024 * 1024 });
  if (lauf.status !== 0) throw new Error('docker ' + argumente.join(' ') + ' fehlgeschlagen\n' + lauf.stderr);
  return (lauf.stdout + (argumente[0] === 'logs' ? lauf.stderr : '')).trim();
}
const warte = ms => new Promise(erfuellt => setTimeout(erfuellt, ms));

async function port_lesen(id) {
  const treffer = docker('port', id, '3000/tcp').match(/127\.0\.0\.1:(\d+)/);
  if (!treffer) throw new Error('Port nicht ausschließlich lokal gebunden');
  return treffer[1];
}
async function bereit_abwarten(id) {
  const port = await port_lesen(id);
  for (let i = 0; i < 150; i++) {
    try {
      const antwort = await fetch('http://127.0.0.1:' + port + '/gesundheit', { signal: AbortSignal.timeout(500) });
      if ([200, 503].includes(antwort.status)) return port;
    } catch { /* noch nicht bereit */ }
    await warte(200);
  }
  throw new Error('Container nicht bereit\n' + docker('logs', id));
}
async function roh_abfragen(port, pfad) {
  const antwort = await fetch('http://127.0.0.1:' + port + pfad, { signal: AbortSignal.timeout(2000) });
  return { httpStatus: antwort.status, inhaltstyp: antwort.headers.get('content-type'), koerper: await antwort.json() };
}
function zeilen_ohne_zeit(text) {
  return text.split(/\r?\n/).filter(Boolean);
}

const varianten = [
  { id: 'lokal', beschriftung: 'DIENST_UMGEBUNG=lokal', env: ['-e', 'DIENST_UMGEBUNG=lokal'] },
  { id: 'fehlt', beschriftung: 'DIENST_UMGEBUNG nicht gesetzt', env: [] },
  { id: 'leer', beschriftung: 'DIENST_UMGEBUNG leer', env: ['-e', 'DIENST_UMGEBUNG='] },
  { id: 'produktion', beschriftung: 'DIENST_UMGEBUNG=produktion', env: ['-e', 'DIENST_UMGEBUNG=produktion'] },
];

(async () => {
  fs.mkdirSync(ausgabe, { recursive: true });
  fs.copyFileSync(path.join(projekt, 'Dockerfile'), path.join(ausgabe, 'Dockerfile.txt'));
  fs.copyFileSync(path.join(projekt, 'beispieldaten/szenarien.json'), path.join(ausgabe, 'szenarien.json'));
  const bau = spawnSync('docker', ['build', '--progress=plain', '--no-cache', '-t', image, '.'],
    { cwd: projekt, env: umgebung, encoding: 'utf8', windowsHide: true, timeout: 420000, maxBuffer: 32 * 1024 * 1024 });
  const bauprotokoll = (bau.stdout || '') + (bau.stderr || '');
  if (bau.status !== 0) throw new Error('Imagebau fehlgeschlagen\n' + bauprotokoll);
  fs.writeFileSync(path.join(ausgabe, 'docker-build.txt'), bauprotokoll);

  const ergebnis = {
    erzeugt: new Date().toISOString(), node: process.version, docker: docker('version', '--format', '{{.Server.Version}}'),
    laufzeitsystem: process.platform, imageId: JSON.parse(docker('image', 'inspect', image))[0].Id,
    benutzer: JSON.parse(docker('image', 'inspect', image))[0].Config.User,
    varianten: [],
  };

  for (const variante of varianten) {
    const name = 'prueflabor-demo-' + variante.id + '-' + Date.now();
    const id = docker('run', '-d', '--name', name, '--label', 'prueflabor.demo=1', '--cpus', '1', '--memory', '256m',
      '-p', '127.0.0.1::3000', ...variante.env, image);
    try {
      const eintrag = { id: variante.id, beschriftung: variante.beschriftung,
        startbefehl: 'docker run -d --cpus 1 --memory 256m -p 127.0.0.1::3000 ' + variante.env.join(' ') + ' ' + image };
      const port = await bereit_abwarten(id);
      eintrag.laeuft = {
        port,
        diagnose: await gesundheitszustand('lokal', 'http://127.0.0.1:' + port + '/gesundheit'),
        diagnoseLeereEingabe: await gesundheitszustand('', 'http://127.0.0.1:' + port + '/gesundheit'),
        gesundheit: await roh_abfragen(port, '/gesundheit'),
        status: await roh_abfragen(port, '/status'),
        ereignisse: await roh_abfragen(port, '/ereignisse?umgebung=test'),
        containerprotokoll: zeilen_ohne_zeit(docker('logs', id)),
      };
      docker('stop', '-t', '2', id);
      eintrag.gestoppt = { diagnose: await gesundheitszustand('lokal', 'http://127.0.0.1:' + port + '/gesundheit') };
      docker('start', id);
      const neuerPort = await bereit_abwarten(id);
      eintrag.neuGestartet = {
        port: neuerPort,
        diagnose: await gesundheitszustand('lokal', 'http://127.0.0.1:' + neuerPort + '/gesundheit'),
        gesundheit: await roh_abfragen(neuerPort, '/gesundheit'),
      };
      ergebnis.varianten.push(eintrag);
      console.log(variante.id, eintrag.laeuft.diagnose.code, eintrag.gestoppt.diagnose.code, eintrag.neuGestartet.diagnose.code);
    } finally {
      const daten = JSON.parse(docker('inspect', id))[0];
      if (daten.Config.Labels['prueflabor.demo'] === '1') docker('rm', '-f', id);
    }
  }
  fs.writeFileSync(path.join(ausgabe, 'lauf.json'), JSON.stringify(ergebnis, null, 2) + '\n');
  try { docker('image', 'rm', image); } catch { /* Image darf bleiben */ }
  fs.rmSync(dockerKonfig, { recursive: true, force: true });
  console.log('Fertig: demo/daten/lauf.json');
})().catch(fehler => { console.error(fehler); process.exitCode = 1; });
