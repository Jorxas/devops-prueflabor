(function () {
  'use strict';

  var T = {
    de: {
      skip: 'Zur Demo springen', mikro: 'Lernprojekt', code: 'Code auf GitHub',
      titel: 'Lokales DevOps-Prüflabor',
      unter: 'Ein Dienst muss auch Fehler erklären: gebaut, gestartet, geprüft, gestoppt und wieder gestartet.',
      kurz: 'Kurz erklärt',
      aufgabe_h: 'Aufgabe',
      aufgabe_t: 'Ein kleiner Dienst (Mini-DataHub mit FastAPI) soll reproduzierbar als Docker-Image gebaut und gestartet werden. Bereit, falsch konfiguriert und ausgefallen sollen sich an der Gesundheitsprüfung unterscheiden lassen.',
      daten_h: 'Daten',
      daten_t: 'Drei synthetische Logereignisse (davon eine absichtlich fehlerhafte Eingabe) im Dienst und drei Szenarien aus beispieldaten/szenarien.json. Keine echten Daten.',
      ergebnis_h: 'Ergebnis',
      ergebnis_t: 'Der Lauf unten zeigt: Nur DIENST_UMGEBUNG=lokal ergibt HTTP 200. Fehlt die Variable, ist sie leer oder hat einen anderen Wert, antwortet der Dienst mit HTTP 503. Ein gestoppter Container ist an einem Verbindungsfehler erkennbar.',
      grenzen_h: 'Grenzen',
      grenzen_t: 'Lernprojekt: keine AWS- oder Azure-Ausführung und keine entfernte CI-Plattform. Die Seite startet im Browser keine Container, sie zeigt gespeicherte Ausgaben. Stoppen und Neustart hat das Demo-Skript ausgeführt; die entsprechende Projektphase 4 ist noch nicht veröffentlicht.',
      demo_h: 'Anwendungsfall: Dienst starten und seinen Zustand prüfen',
      lade: 'Lade die gespeicherte Ausgabe …',
      echt_label: 'Ausgabe eines echten Laufs des Projekts',
      echt_meta: 'erzeugt am {datum}, Docker {docker}, Node {node}, Image {image}, Nutzer im Container {nutzer}',
      s1_h: 'Konfiguration wählen',
      s1_t: 'Der Dienst liest die Umgebungsvariable DIENST_UMGEBUNG. Jede Auswahl entspricht einem eigenen, wirklich gestarteten Container.',
      s1_label: 'Konfigurationsvariante',
      startbefehl: 'Startbefehl',
      v_lokal: 'gesetzt auf lokal', v_fehlt: 'nicht gesetzt', v_leer: 'gesetzt, aber leer', v_produktion: 'gesetzt auf produktion',
      s2_h: 'Zustand mit der Diagnose des Projekts abfragen',
      ph_laeuft: '1. Container läuft', ph_gestoppt: '2. Nach docker stop', ph_neu: '3. Nach docker start',
      phase_label: 'Phase',
      befehl: 'Befehl', exitcode: 'Exitcode', ausgabe: 'Ausgabe der Diagnose', http_roh: 'Rohe HTTP-Antwort von /gesundheit',
      http_status: 'HTTP-Status', inhaltstyp: 'Inhaltstyp',
      ung_h: 'Gegenprobe mit ungültiger Eingabe (Szenario ungueltige-eingabe)',
      ung_befehl: 'Befehl mit leerer Umgebungsangabe',
      port_hinweis: 'Der Port wurde beim Start zufällig vergeben und nur an 127.0.0.1 gebunden.',
      z_betriebsbereit: 'betriebsbereit', z_konfigurationsfehler: 'Konfigurationsfehler', z_verbindungsfehler: 'Verbindungsfehler', z_eingabefehler: 'Eingabefehler', z_antwortfehler: 'Antwortfehler',
      e_betriebsbereit: 'Der Dienst läuft und meldet sich bereit (HTTP 200). Exitcode 0.',
      e_konfigurationsfehler: 'Der Dienst läuft, meldet aber HTTP 503 mit dem Zustand konfigurationsfehler: Die Konfiguration fehlt oder wird nicht akzeptiert. Exitcode 1 bedeutet: Dienst erreicht, aber nicht gesund.',
      e_verbindungsfehler: 'Es kommt keine Verbindung zustande, weil der Container gestoppt ist. Exitcode 3 unterscheidet das von einem Dienst, der läuft und HTTP 503 meldet.',
      e_eingabefehler: 'Die Diagnose lehnt die Eingabe ab, bevor sie eine Anfrage sendet. Exitcode 2.',
      e_neu: 'Nach dem Neustart des gleichen Containers meldet der Dienst dasselbe wie vor dem Stopp.',
      s3_h: 'Weitere echte Ausgaben',
      d_status: 'Ereignisse im Dienst (HTTP-Abfrage /ereignisse?umgebung=test)',
      d_status_roh: 'Zusammenfassung des Dienstes (HTTP-Abfrage /status)',
      d_log: 'Containerprotokoll dieses Laufs', d_build: 'Protokoll des Imagebaus (docker build)', d_docker: 'Dockerfile des Projekts (Eingabe des Baus)',
      th_id: 'Kennung', th_zeit: 'Zeitpunkt (UTC)', th_umgebung: 'Umgebung', th_stufe: 'Stufe', th_nachricht: 'Nachricht', th_zeit_ue: 'Zeitüberschreitung',
      ja: 'ja', nein: 'nein',
      ereignis_note: 'Die Inhalte der Ereignisse sind synthetische Beispieldaten des Mini-DataHub und bleiben unübersetzt.',
      nw_h: 'Was wirklich ausgeführt wurde',
      nw1: 'Ausgeführt für diese Seite: docker build des Projekt-Dockerfiles, vier Container mit je einer Konfiguration, die Diagnose src/gesundheit.cjs, docker stop und docker start. Docker {docker} mit Linux-Containern auf einem Windows-Rechner.',
      nw2: 'Aus dem Projekt unverändert verwendet: Dockerfile, Dienstcode (übernommen vom Mini-DataHub), src/gesundheit.cjs und beispieldaten/szenarien.json.',
      nw3: 'Nicht ausgeführt: Azure Pipelines, AWS oder eine andere entfernte Plattform. Die Pipeline-Datei im Projekt ist nur eine Vorlage.',
      nw4: 'Nachvollziehen: im Repository node demo/erzeugen.cjs ausführen (benötigt Docker, Node 24 und Internet beim ersten Bau). Die Datei demo/daten/lauf.json wird dabei neu erzeugt.',
      fuss: 'Eigenes Lernprojekt, mit KI-Unterstützung entwickelt und geprüft. Alle Daten sind synthetisch. Keine Aussage über Berufserfahrung im Cloud- oder Produktivbetrieb.',
      fehler: 'Die gespeicherte Ausgabe konnte nicht geladen werden.'
    },
    fr: {
      skip: 'Aller à la démo', mikro: "Projet d'apprentissage", code: 'Code sur GitHub',
      titel: 'Laboratoire DevOps local',
      unter: "Un service doit aussi savoir expliquer ses pannes : construit, démarré, contrôlé, arrêté puis redémarré.",
      kurz: 'En bref',
      aufgabe_h: 'Objectif',
      aufgabe_t: "Un petit service (Mini-DataHub avec FastAPI) doit être construit et démarré de façon reproductible comme image Docker. Les états prêt, mal configuré et en panne doivent se distinguer par le contrôle de santé.",
      daten_h: 'Données',
      daten_t: "Trois événements de journal synthétiques (dont une saisie volontairement erronée) dans le service, et trois scénarios de beispieldaten/szenarien.json. Aucune donnée réelle.",
      ergebnis_h: 'Résultat',
      ergebnis_t: "L'exécution ci-dessous montre : seul DIENST_UMGEBUNG=lokal donne HTTP 200. Si la variable manque, est vide ou a une autre valeur, le service répond HTTP 503. Un conteneur arrêté se reconnaît à une erreur de connexion.",
      grenzen_h: 'Limites',
      grenzen_t: "Projet d'apprentissage : pas d'exécution sur AWS ou Azure, pas de plateforme CI distante. La page ne démarre aucun conteneur dans le navigateur, elle montre des sorties enregistrées. L'arrêt et le redémarrage ont été faits par le script de démo ; la phase 4 du projet n'est pas encore publiée.",
      demo_h: "Cas d'usage : démarrer un service et vérifier son état",
      lade: 'Chargement de la sortie enregistrée …',
      echt_label: "Sortie d'une vraie exécution du projet",
      echt_meta: 'générée le {datum}, Docker {docker}, Node {node}, image {image}, utilisateur dans le conteneur {nutzer}',
      s1_h: 'Choisir la configuration',
      s1_t: "Le service lit la variable d'environnement DIENST_UMGEBUNG. Chaque choix correspond à un conteneur réellement démarré.",
      s1_label: 'Variante de configuration',
      startbefehl: 'Commande de démarrage',
      v_lokal: 'définie sur lokal', v_fehlt: 'non définie', v_leer: 'définie mais vide', v_produktion: 'définie sur produktion',
      s2_h: "Interroger l'état avec le diagnostic du projet",
      ph_laeuft: '1. Conteneur en marche', ph_gestoppt: '2. Après docker stop', ph_neu: '3. Après docker start',
      phase_label: 'Phase',
      befehl: 'Commande', exitcode: 'Code de sortie', ausgabe: 'Sortie du diagnostic', http_roh: 'Réponse HTTP brute de /gesundheit',
      http_status: 'Statut HTTP', inhaltstyp: 'Type de contenu',
      ung_h: "Contre-épreuve avec une saisie invalide (scénario ungueltige-eingabe)",
      ung_befehl: "Commande avec indication d'environnement vide",
      port_hinweis: "Le port a été attribué au hasard au démarrage et lié uniquement à 127.0.0.1.",
      z_betriebsbereit: 'prêt', z_konfigurationsfehler: 'erreur de configuration', z_verbindungsfehler: 'erreur de connexion', z_eingabefehler: 'erreur de saisie', z_antwortfehler: 'erreur de réponse',
      e_betriebsbereit: "Le service tourne et se déclare prêt (HTTP 200). Code de sortie 0.",
      e_konfigurationsfehler: "Le service tourne mais répond HTTP 503 avec l'état konfigurationsfehler : la configuration manque ou n'est pas acceptée. Le code 1 signifie : service joint, mais pas en bonne santé.",
      e_verbindungsfehler: "Aucune connexion n'aboutit parce que le conteneur est arrêté. Le code 3 le distingue d'un service qui tourne et répond HTTP 503.",
      e_eingabefehler: "Le diagnostic refuse la saisie avant d'envoyer une requête. Code de sortie 2.",
      e_neu: "Après le redémarrage du même conteneur, le service indique la même chose qu'avant l'arrêt.",
      s3_h: "Autres sorties réelles",
      d_status: "Événements dans le service (requête HTTP /ereignisse?umgebung=test)",
      d_status_roh: 'Résumé du service (requête HTTP /status)',
      d_log: "Journal du conteneur pour cette exécution", d_build: "Journal de construction de l'image (docker build)", d_docker: "Dockerfile du projet (entrée de la construction)",
      th_id: 'Identifiant', th_zeit: 'Horodatage (UTC)', th_umgebung: 'Environnement', th_stufe: 'Niveau', th_nachricht: 'Message', th_zeit_ue: "Dépassement de délai",
      ja: 'oui', nein: 'non',
      ereignis_note: "Le contenu des événements est constitué de données d'exemple synthétiques du Mini-DataHub et reste en allemand.",
      nw_h: "Ce qui a vraiment été exécuté",
      nw1: "Exécuté pour cette page : docker build du Dockerfile du projet, quatre conteneurs avec une configuration chacun, le diagnostic src/gesundheit.cjs, docker stop et docker start. Docker {docker} avec des conteneurs Linux sur un PC Windows.",
      nw2: "Repris du projet sans modification : Dockerfile, code du service (repris du Mini-DataHub), src/gesundheit.cjs et beispieldaten/szenarien.json.",
      nw3: "Non exécuté : Azure Pipelines, AWS ou une autre plateforme distante. Le fichier de pipeline du projet n'est qu'un modèle.",
      nw4: "Pour reproduire : dans le dépôt, lancer node demo/erzeugen.cjs (nécessite Docker, Node 24 et Internet pour la première construction). Le fichier demo/daten/lauf.json est alors régénéré.",
      fuss: "Projet d'apprentissage personnel, développé et vérifié avec l'aide d'une IA. Toutes les données sont synthétiques. Aucune affirmation d'expérience en exploitation cloud ou en production.",
      fehler: "La sortie enregistrée n'a pas pu être chargée."
    }
  };

  var lang = 'de', daten = null, variante = 'lokal', phase = 'laeuft', texte = {};
  var $ = function (id) { return document.getElementById(id); };
  var t = function (k) { return (T[lang] && T[lang][k]) || T.de[k] || k; };
  var fill = function (s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k]; }); };
  var locale = function () { return lang === 'fr' ? 'fr-FR' : 'de-DE'; };

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function json(o) { return JSON.stringify(o, null, 2); }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }

  function startLang() {
    var p = '';
    try { p = new URLSearchParams(location.search).get('lang') || ''; } catch (e) { /* ohne URL */ }
    setLang(p === 'fr' ? 'fr' : 'de', false);
  }
  function setLang(l, schreiben) {
    lang = l;
    document.documentElement.lang = l;
    document.title = l === 'fr' ? 'Démo labo DevOps' : 'DevOps-Prüflabor Demo';
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i18n')); });
    if (schreiben) {
      try { var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u); } catch (e) { /* egal */ }
    }
    render();
  }

  function zustandKlasse(z) { return z === 'betriebsbereit' ? 'gut' : z === 'konfigurationsfehler' ? 'warn' : 'schlecht'; }
  function pille(z) { return el('span', { class: 'pille ' + zustandKlasse(z), text: t('z_' + z) }); }

  function befehlZeile(label, text) {
    return el('p', { class: 'befehl-zeile' }, [el('span', { text: label + ': ' }), el('code', { text: text })]);
  }

  function renderPhase(v) {
    var p = $('phase'), d, port, code, zustand, roh = null;
    clear(p);
    if (phase === 'laeuft') { d = v.laeuft.diagnose; port = v.laeuft.port; roh = v.laeuft.gesundheit; }
    else if (phase === 'gestoppt') { d = v.gestoppt.diagnose; port = v.laeuft.port; }
    else { d = v.neuGestartet.diagnose; port = v.neuGestartet.port; roh = v.neuGestartet.gesundheit; }
    code = d.code; zustand = d.zustand;
    p.setAttribute('aria-labelledby', 'tab-' + phase);
    p.appendChild(el('p', {}, [pille(zustand), el('span', { text: '  ' + t('exitcode') + ' ' + code })]));
    var erkl = t('e_' + zustand);
    if (phase === 'neu') erkl = erkl + ' ' + t('e_neu');
    p.appendChild(el('p', { class: 'erklaerung', text: erkl }));
    p.appendChild(befehlZeile(t('befehl'), 'node src/gesundheit.cjs lokal http://127.0.0.1:' + port + '/gesundheit'));
    var raster = el('div', { class: 'raster' });
    raster.appendChild(el('div', {}, [el('h4', { text: t('ausgabe') }), el('pre', { tabindex: '0', text: json(d) })]));
    if (roh) {
      raster.appendChild(el('div', {}, [el('h4', { text: t('http_roh') }),
        el('pre', { tabindex: '0', text: t('http_status') + ': ' + roh.httpStatus + '\n' + t('inhaltstyp') + ': ' + roh.inhaltstyp + '\n' + json(roh.koerper) })]));
    }
    p.appendChild(raster);
    p.appendChild(el('p', { class: 'klein', text: t('port_hinweis') }));
    if (phase === 'laeuft') {
      var u = v.laeuft.diagnoseLeereEingabe;
      p.appendChild(el('h4', { text: t('ung_h'), class: 'klein' }));
      p.appendChild(befehlZeile(t('ung_befehl'), 'node src/gesundheit.cjs "" http://127.0.0.1:' + port + '/gesundheit'));
      p.appendChild(el('p', {}, [pille(u.zustand), el('span', { text: '  ' + t('exitcode') + ' ' + u.code }), el('span', { text: '  ' }), el('code', { text: json(u).replace(/\s+/g, ' ') })]));
      p.appendChild(el('p', { class: 'klein', text: t('e_eingabefehler') }));
    }
  }

  function renderEreignisse(v) {
    var box = $('ereignisse'); clear(box);
    var k = v.laeuft.ereignisse.koerper, fmt = new Intl.DateTimeFormat(locale(), { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'UTC' });
    var kopf = el('tr', {}, ['th_id', 'th_zeit', 'th_umgebung', 'th_stufe', 'th_nachricht', 'th_zeit_ue'].map(function (c) { return el('th', { scope: 'col', text: t(c) }); }));
    var zeilen = k.ereignisse.map(function (e) {
      return el('tr', {}, [e.ereignis_id, fmt.format(new Date(e.zeitpunkt)), e.umgebung, e.stufe, e.nachricht, e.ist_zeitueberschreitung ? t('ja') : t('nein')].map(function (c) { return el('td', { text: c }); }));
    });
    box.appendChild(el('div', { class: 'tabellenrahmen' }, [el('table', {}, [el('thead', {}, [kopf]), el('tbody', {}, zeilen)])]));
    box.appendChild(el('p', { class: 'klein', text: t('ereignis_note') }));
  }

  function render() {
    if (!daten) return;
    var v = daten.lauf.varianten.filter(function (x) { return x.id === variante; })[0];
    var l = daten.lauf;
    var datum = new Intl.DateTimeFormat(locale(), { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(l.erzeugt)) + ' UTC';
    $('echt').textContent = '';
    $('echt').appendChild(el('strong', { text: t('echt_label') }));
    $('echt').appendChild(document.createTextNode(': ' + fill(t('echt_meta'), { datum: datum, docker: l.docker, node: l.node, image: l.imageId.replace('sha256:', '').slice(0, 12), nutzer: l.benutzer })));

    var wahl = $('varianten'); clear(wahl);
    daten.lauf.varianten.forEach(function (x) {
      var input = el('input', { type: 'radio', name: 'variante', value: x.id });
      if (x.id === variante) input.checked = true;
      input.addEventListener('change', function () { variante = x.id; render(); });
      wahl.appendChild(el('label', {}, [input, el('span', { class: 'opt' }, [el('code', { text: 'DIENST_UMGEBUNG' }), el('small', { text: t('v_' + x.id) })])]));
    });
    $('startbefehl').textContent = v.startbefehl;

    var tabs = $('phasen'); clear(tabs);
    tabs.setAttribute('aria-label', t('phase_label'));
    [['laeuft', 'ph_laeuft'], ['gestoppt', 'ph_gestoppt'], ['neu', 'ph_neu']].forEach(function (x, i, alle) {
      var b = el('button', { type: 'button', role: 'tab', id: 'tab-' + x[0], 'aria-selected': String(phase === x[0]), tabindex: phase === x[0] ? '0' : '-1', text: t(x[1]) });
      b.addEventListener('click', function () { phase = x[0]; render(); $('tab-' + x[0]).focus(); });
      b.addEventListener('keydown', function (ev) {
        var d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        ev.preventDefault(); phase = alle[(i + d + alle.length) % alle.length][0]; render(); $('tab-' + phase).focus();
      });
      tabs.appendChild(b);
    });
    renderPhase(v);
    renderEreignisse(v);
    $('statusroh').textContent = json(v.laeuft.status.koerper);
    $('log').textContent = v.laeuft.containerprotokoll.join('\n');
    $('bau').textContent = daten.bau;
    $('dockerfile').textContent = daten.dockerfile;

    var nw = $('nw'); clear(nw);
    ['nw1', 'nw2', 'nw3', 'nw4'].forEach(function (k) { nw.appendChild(el('li', { text: fill(t(k), { docker: l.docker }) })); });
  }

  function laden() {
    var holen = function (u, art) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(u); return art === 'json' ? r.json() : r.text(); }); };
    return Promise.all([holen('daten/lauf.json', 'json'), holen('daten/docker-build.txt'), holen('daten/Dockerfile.txt')]).then(function (a) {
      daten = { lauf: a[0], bau: a[1], dockerfile: a[2] };
      $('lade').hidden = true; $('inhalt').hidden = false; render();
    }).catch(function () {
      $('lade').hidden = true; var f = $('fehler'); f.hidden = false; f.textContent = t('fehler');
    });
  }

  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  startLang();
  laden();
})();
