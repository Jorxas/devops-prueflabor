// Browserprüfung der Demo. Die Seite wird wie auf GitHub Pages unter /devops-prueflabor/ ausgeliefert.
// Aufruf im Projektordner: node tools/browser-pruefen.cjs [--bild=<ordner>] [--wurzel=<ordner mit index.html>]
// Braucht puppeteer-core (NODE_PATH) und einen installierten Chrome oder Edge (BROWSER_PFAD).
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');
const arg = name => process.argv.find(a => a.startsWith('--' + name + '='))?.slice(name.length + 3);
const wurzel = path.resolve(arg('wurzel') || path.join(__dirname, '../demo'));
const bildordner = arg('bild') && path.resolve(arg('bild'));
const typen = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer((q, r) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname);
  if (!p.startsWith('/devops-prueflabor/')) { r.statusCode = 404; return r.end('nicht gefunden'); }
  p = p.slice('/devops-prueflabor'.length); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(wurzel, p);
  if (!f.startsWith(wurzel) || !fs.existsSync(f)) { r.statusCode = 404; return r.end('nicht gefunden'); }
  r.setHeader('Content-Type', typen[path.extname(f)] || 'application/octet-stream');
  r.end(fs.readFileSync(f));
});
const browserPfad = process.env.BROWSER_PFAD || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(f => fs.existsSync(f));
if (!browserPfad) throw new Error('BROWSER_PFAD auf einen installierten Chrome oder Edge setzen.');
const warte = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const basis = `http://127.0.0.1:${server.address().port}/devops-prueflabor/`;
  const browser = await puppeteer.launch({ executablePath: browserPfad, headless: true });
  const fehler = [], extern = [];
  try {
    const s = await browser.newPage();
    s.on('pageerror', e => fehler.push('Seitenfehler: ' + e.message));
    s.on('console', m => { if (m.type() === 'error') fehler.push('Konsole: ' + m.text()); });
    s.on('response', r => { if (r.status() >= 400) fehler.push('HTTP ' + r.status() + ' ' + r.url()); });
    s.on('request', r => { const u = new URL(r.url()); if (u.protocol !== 'data:' && u.hostname !== '127.0.0.1') extern.push(r.url()); });
    await s.setViewport({ width: 1280, height: 1000 });
    await s.goto(basis, { waitUntil: 'networkidle0' });
    await s.waitForSelector('#inhalt:not([hidden])');
    const text = () => s.$eval('body', e => e.innerText);
    const lang = () => s.evaluate(() => document.documentElement.lang);
    const ueberlauf = () => s.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    const phase = name => s.evaluate(n => document.getElementById('tab-' + n).click(), name);
    const waehle = id => s.evaluate(i => document.querySelector('input[value="' + i + '"]').click(), id);

    // Deutsch ist Standard
    assert.equal(await lang(), 'de'); let t = await text();
    for (const w of ['Aufgabe', 'Daten', 'Ergebnis', 'Grenzen', 'Ausgabe eines echten Laufs des Projekts', 'betriebsbereit', 'Exitcode 0']) assert(t.includes(w), 'DE enthält ' + w);
    assert(!t.includes('Objectif'), 'kein Französisch im Standard');
    if (bildordner) { fs.mkdirSync(bildordner, { recursive: true }); await s.screenshot({ path: path.join(bildordner, 'desktop-de.png'), fullPage: true }); }

    // Konfigurationsfehler und Ausfall
    await waehle('fehlt'); await warte(100); t = await text();
    assert(t.includes('Konfigurationsfehler') && t.includes('Exitcode 1'), 'fehlende Variable: Konfigurationsfehler, Exitcode 1');
    assert(t.includes('HTTP-Status: 503'), 'HTTP 503 sichtbar');
    await phase('gestoppt'); await warte(100); t = await text();
    assert(t.includes('Verbindungsfehler') && t.includes('Exitcode 3'), 'gestoppt: Verbindungsfehler, Exitcode 3');
    await s.focus('#tab-gestoppt'); await s.keyboard.press('ArrowRight'); await warte(100);
    assert((await text()).includes('Nach docker start'), 'Pfeiltaste wechselt die Phase');
    assert.equal(await s.evaluate(() => document.activeElement.id), 'tab-neu', 'Fokus folgt der Phase');
    await waehle('lokal'); await phase('laeuft'); await warte(100);
    assert((await text()).includes('betriebsbereit'), 'lokal: betriebsbereit');

    // Französisch
    await s.click('[data-lang="fr"]'); await warte(150);
    assert.equal(await lang(), 'fr'); t = await text();
    for (const w of ['Objectif', 'Données', 'Résultat', 'Limites', "Sortie d'une vraie exécution du projet", 'prêt']) assert(t.includes(w), 'FR enthält ' + w);
    assert(!t.includes('Ausgabe eines echten Laufs'), 'kein Deutsch in der Beschriftung');
    assert(s.url().includes('lang=fr'), 'URL trägt lang=fr');
    await waehle('fehlt'); await phase('gestoppt'); await warte(100);
    assert((await text()).includes('erreur de connexion'), 'FR: Zustand übersetzt');
    if (bildordner) await s.screenshot({ path: path.join(bildordner, 'desktop-fr.png'), fullPage: true });

    // Zurück auf Deutsch
    await s.click('[data-lang="de"]'); await warte(150);
    assert.equal(await lang(), 'de'); assert((await text()).includes('Aufgabe')); assert(!(await text()).includes('Objectif'));

    // ?lang=fr direkt
    await s.goto(basis + '?lang=fr', { waitUntil: 'networkidle0' }); await s.waitForSelector('#inhalt:not([hidden])');
    assert.equal(await lang(), 'fr'); assert((await text()).includes('Objectif'));

    // Handy: kein horizontaler Überlauf in beiden Sprachen und allen Phasen
    await s.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    for (const l of ['fr', 'de']) {
      await s.click('[data-lang="' + l + '"]'); await warte(150);
      for (const v of ['lokal', 'fehlt']) { await waehle(v); for (const p of ['laeuft', 'gestoppt', 'neu']) { await phase(p); await warte(80); assert(!(await ueberlauf()), `Überlauf bei 390 px (${l}, ${v}, ${p})`); } }
      await s.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; })); await warte(100);
      assert(!(await ueberlauf()), 'Überlauf bei 390 px mit geöffneten Details (' + l + ')');
    }
    if (bildordner) { await phase('laeuft'); await s.screenshot({ path: path.join(bildordner, 'handy-de.png'), fullPage: true }); }
  } finally { await browser.close(); server.close(); }
  assert.deepEqual(fehler, [], 'keine Laufzeitfehler: ' + fehler.join(' | '));
  assert.deepEqual(extern, [], 'keine externen Anfragen');
  console.log('Browserprüfung bestanden: DE Standard, Wechsel auf FR und zurück, ?lang=fr, Konfigurationsvarianten und Phasen, Tastaturbedienung, 390 px ohne Überlauf; keine Fehler, keine externen Anfragen.');
})().catch(e => { console.error(e); process.exitCode = 1; server.close(); });
