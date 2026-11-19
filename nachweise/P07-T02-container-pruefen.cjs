/** Nur eigene eindeutig bezeichnete Testcontainer erstellen und entfernen. */
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { gesundheitszustand } = require('../src/gesundheit.cjs');
const projekt = path.resolve(__dirname, '..');
const umgebung = { ...process.env, DOCKER_CONFIG: path.join(projekt, 'ausgabe/docker-konfiguration'),
  DOCKER_HOST: process.env.DOCKER_HOST || (process.platform === 'win32' ? 'npipe:////./pipe/dockerDesktopLinuxEngine' : 'unix:///var/run/docker.sock') };
const image = 'epp-p07:studentisch';
function docker(...argumente) {
  const lauf = spawnSync('docker', argumente, { cwd: projekt, env: umgebung, encoding: 'utf8', windowsHide: true, timeout: 360000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(lauf.status, 0, 'Docker-Befehl fehlgeschlagen: ' + argumente[0] + '\n' + lauf.stderr + '\n' + lauf.stdout);
  return lauf.stdout.trim();
}
async function container_starten(mitKonfiguration = true) {
  const name = 'epp-p07-pruefung-' + Date.now() + '-' + Math.random().toString(16).slice(2, 8);
  const id = docker('run', '-d', '--name', name, '--label', 'epp.projekt=P07', '--label', 'epp.pruefung=lokal',
    '--cpus', '1', '--memory', '256m', '-p', '127.0.0.1::3000',
    ...(mitKonfiguration ? ['-e', 'DIENST_UMGEBUNG=lokal'] : []), image);
  try {
    const bindung = docker('port', id, '3000/tcp');
    const port = bindung.match(/^127\.0\.0\.1:(\d+)$/)?.[1];
    assert(port, 'Containerport nicht ausschließlich lokal gebunden.');
    const adresse = 'http://127.0.0.1:' + port;
    for (let versuch = 0; versuch < 150; versuch++) {
      try { const antwort = await fetch(adresse + '/gesundheit', { signal: AbortSignal.timeout(500) }); if ([200, 503].includes(antwort.status)) return { id, name, adresse }; }
      catch {}
      await new Promise(erfuellt => setTimeout(erfuellt, 200));
    }
    throw new Error('Container nicht bereit.\n' + docker('logs', id));
  } catch (fehler) { container_entfernen(id); throw fehler; }
}
function container_entfernen(id) {
  const daten = JSON.parse(docker('inspect', id))[0];
  assert.equal(daten.Config.Labels['epp.projekt'], 'P07');
  assert.equal(daten.Config.Labels['epp.pruefung'], 'lokal');
  docker('rm', '-f', id);
}
async function pruefen() {
  const build = spawnSync('docker', ['build', '--label', 'epp.projekt=P07', '-t', image, '.'],
    { cwd: projekt, env: umgebung, encoding: 'utf8', windowsHide: true, timeout: 360000, maxBuffer: 8 * 1024 * 1024 });
  fs.writeFileSync(path.join(__dirname, 'P07-T02-docker-build.txt'), (build.stdout || '') + (build.stderr || ''));
  assert.equal(build.status, 0, build.stderr);
  const container = await container_starten();
  try {
    const diagnostik = await gesundheitszustand('lokal', container.adresse + '/gesundheit');
    assert.equal(diagnostik.code, 0); assert.equal(diagnostik.zustand, 'betriebsbereit');
    const antwort = await fetch(container.adresse + '/status');
    assert.equal(antwort.status, 200);
    const daten = await antwort.json();
    assert.equal(daten.ereignisanzahl, 3); assert.equal(daten.fehleranzahl, 1);
    const inspect = JSON.parse(docker('inspect', container.id))[0];
    assert.equal(inspect.Config.User, '10001:10001');
    fs.writeFileSync(path.join(__dirname, 'P07-T02-container.json'), JSON.stringify({ zeit: new Date().toISOString(),
      dockerServer: docker('version', '--format', '{{.Server.Version}}'), imageId: inspect.Image,
      container: container.name, localhostAdresse: container.adresse, benutzer: inspect.Config.User,
      gesundheit: diagnostik, echterP02Status: daten, grenze: 'T02 prüft normalen Containerbetrieb; Fehler- und Runnerfälle folgen separat.' }, null, 2) + '\n');
    fs.writeFileSync(path.join(__dirname, 'P07-T02-container-protokoll.txt'), docker('logs', container.id) + '\n');
    console.log('BESTANDEN: Image wirklich gebaut; eigener Container als Nicht-Root; Gesundheit 200 und echter P02-Datenbankstatus 3/1.');
  } finally { container_entfernen(container.id); }
}
module.exports = { docker, container_starten, container_entfernen, image };
if (require.main === module) pruefen().catch(fehler => { console.error(fehler); process.exitCode = 1; });
