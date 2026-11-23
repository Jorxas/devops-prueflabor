# Lokales DevOps-Prüflabor

Ein Dienst soll reproduzierbar gebaut und gestartet werden; Gesundheitsprüfung, Konfigurationsfehler und Wiederherstellung müssen beobachtbar sein.

![Projektaufbau](dokumentation/ueberblick.svg)

**Veröffentlichungsstand: Phase 4/4.** Dieses eigenständige Repository veröffentlicht zuvor lokal entwickelte, geprüfte und unveränderlich gesicherte Stände. Alle vier dokumentierten Basisphasen sind veröffentlicht. Die technische Entwicklung und die öffentliche Veröffentlichung haben unterschiedliche echte Zeitpunkte.

## Was hier zu sehen ist

| Schritt | Inhalt | Hier veröffentlicht |
|---|---|---|
| 1 | Gesundheitsvertrag und Szenarien | Ja |
| 2 | Docker-Imagebau mit Mini-DataHub | Ja |
| 3 | Lokaler Runner und Fehlerfälle | Ja |
| 4 | Ausfall, Neustart und Wiederherstellung | Ja |

## Fachlicher Nutzen

Containerisierung, automatisierte lokale Prüfungen und Fehlerdiagnose.

## Lokal starten

Im geklonten Repository ausführen; die benötigte Laufzeit muss installiert sein. Python-Beispiele verwenden 3.12, Node-Beispiele 24 und C# die im Projekt angegebene .NET-Version. Befehle mit uv laden die dort genau bezeichneten Pakete bei Bedarf.

```powershell
git clone https://github.com/Jorxas/mini-datahub-api.git ../02-mini-datahub
node nachweise/p07-t01-pruefen.cjs
node pipeline/lokal.cjs --gesamt
```

Ausführliche technische Befehle: [START.md](START.md). [Öffentlicher Prüfstand](ABNAHME.json) und [Quellphasen](VERLAUF.json) dokumentieren Herkunft und echte Ausführungsdaten. Eine neue Repositorykopie ist kein neuer nativer Desktoplauf.

## Demo

Live: https://jorxas.github.io/devops-prueflabor/ (Deutsch, per Schalter DE | FR auch Französisch)

Die Demo zeigt einen Anwendungsfall mit der Ausgabe eines echten Laufs: Das Projekt-Dockerfile wird gebaut, der Dienst mit vier Konfigurationen von `DIENST_UMGEBUNG` als Container gestartet, mit `src/gesundheit.cjs` abgefragt, gestoppt und wieder gestartet. Die Seite selbst startet keine Container; sie zeigt die gespeicherten Ausgaben aus `demo/daten/`. Stoppen und Neustart führt das Demo-Skript aus, nicht eine veröffentlichte Projektphase.

Neu erzeugen (benötigt Docker mit Linux-Containern, Node 24 und beim ersten Bau Internet):

```powershell
node demo/erzeugen.cjs
```

Browserprüfung der Seite (benötigt `puppeteer-core` und einen installierten Chrome oder Edge): `node tools/browser-pruefen.cjs`. Die Veröffentlichung erfolgt aus `demo/` auf den Zweig `gh-pages`.

## Ergebnis des lokal geprüften Schlussstands

Echter Imagebau, HTTP-503-Fehler, Konfigurationsfehler sowie Stoppen und Wiederherstellen geprüft.

## Grenzen

Keine AWS-/Azure-Ausführung und keine entfernte CI-Plattform. Ab Phase 2 wird das separat veröffentlichte Mini-DataHub als dokumentierte Dienstabhängigkeit benötigt.

Eigenes kleines Lernprojekt mit synthetischen Daten, mit KI-Unterstützung entwickelt und geprüft. Keine Aussage über Berufserfahrung, menschliche Arbeitsstunden oder praktische Verwendung weiterer nur geplanter Produkte.

## Entwicklungshistorie

[Entwicklungshistorie](HISTORIE.md): die vorhandenen lokalen Änderungen, ihre ursprünglichen Daten und die spätere GitHub-Übernahme.
