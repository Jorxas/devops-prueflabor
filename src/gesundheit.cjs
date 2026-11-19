/** Den echten lokalen Gesundheitsendpunkt mit begrenzter Wartezeit abfragen. */
async function gesundheitszustand(umgebung, adresse = 'http://127.0.0.1:3000/gesundheit') {
  let ziel;
  try { ziel = new URL(adresse); } catch { return { code: 2, zustand: 'eingabefehler' }; }
  if (umgebung !== 'lokal' || ziel.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(ziel.hostname)
    || ziel.pathname !== '/gesundheit' || ziel.username || ziel.password || ziel.search || ziel.hash) {
    return { code: 2, zustand: 'eingabefehler' };
  }
  try {
    const antwort = await fetch(ziel, { signal: AbortSignal.timeout(2000), redirect: 'error' });
    const daten = await antwort.json();
    if (daten.dienst !== 'P02' || typeof daten.zustand !== 'string') return { code: 1, zustand: 'antwortfehler', httpStatus: antwort.status };
    return { code: antwort.status === 200 && daten.zustand === 'betriebsbereit' ? 0 : 1,
      dienst: daten.dienst, zustand: daten.zustand, httpStatus: antwort.status };
  } catch (fehler) { return { code: 3, zustand: 'verbindungsfehler', fehler: fehler.name }; }
}
module.exports = { gesundheitszustand };
if (require.main === module) gesundheitszustand(process.argv[2], process.argv[3]).then(ergebnis => {
  console.log(JSON.stringify(ergebnis)); process.exitCode = ergebnis.code;
});
