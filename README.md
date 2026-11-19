# Lokale Bereitstellung und API-Diagnose

Stand: 1. November 2026 — **P07-T01 erledigt: Gesundheitsvertrag und drei Fehlerfälle für den späteren Dienst P02 lokal geprüft; Fachfunktionen offen**. Geplanter Abschluss der Basis: 2026-11-06, spätestens 8. November 2026. Geschätzter Basisaufwand: 4 Stunden ohne Einrichtung und Erweiterungen.

Aktualisierung 10. November 2026, Wiederaufnahme: **P07-T02 weiterhin blockiert**. P02-T03 ist laut vorhandenem Abnahmeprotokoll geprüft. Der Koordinator hat den Docker-Motor außerhalb dieses Laufs erreicht; in der bestehenden Sandbox verweigert `docker version` auch mit der vorbereiteten projektlokalen Konfiguration den Zugriff auf `dockerDesktopLinuxEngine`. Dockerfile, Konfigurationsbeispiel und Gesundheitsendpunkt bleiben offen. [Erster Versuch](nachweise/P07-T02-voraussetzungen.json), [Wiederaufnahme](nachweise/P07-T02-wiederaufnahme.json) und [Ticket](tickets/P07-T02.md) unterscheiden die Befunde. Nach dem Fortsetzungsplan gilt: Entwicklung bis 15. November, spätere Commitfolge bis 22. November.

Ein Team möchte einen Dienst reproduzierbar starten und Fehler schnell nachvollziehen.

Geplantes Gesamtergebnis: Lokaler Container, beschriebene Pipeline, Diagnose und ein Fehlerszenario für P02.

Jetzt vorhanden: Gesundheitsvertrag in `projekt.json`, drei festgelegte Fehlerfälle und ein reproduzierbarer lokaler Konsistenzcheck. Der bestehende Node-Einstieg meldet weiterhin den Initialisierungsstand. [Startanleitung](START.md) und [Prüfbericht](nachweise/P07-T01-pruefung.json) erklären Ausführung und Grenzen. Keine laufende DataHub-API, kein Docker- oder CI-Ausführungsnachweis; Lastenheft A1 bis A4 bleiben offen.

Vorgesehene Technologien: Docker, CI/CD, Git, Linux, Tests/QA, Security/GRC, Azure DevOps. Eine Nennung ist kein Nachweis einer Umsetzung.

## Einstieg

1. [Lastenheft](LASTENHEFT.md) lesen.
2. [Erstes Ticket](tickets/P07-T01.md) öffnen.
3. [Technischen Einstieg](START.md) prüfen und ein Ticket nach dem anderen bearbeiten.
4. [Arbeitsjournal](ARBEITSJOURNAL.md) und echte Nachweise aktualisieren.

Abhängigkeiten: Für P07-T01 genügt das geprüfte P02-T01; die spätere Umsetzung P07-T02 benötigt zusätzlich P02-T03.

[Erweiterungen](VARIANTEN.md) haben einen eigenen Umsetzungsstand. [Private Unternehmenszuordnung](UNTERNEHMEN.lokal.md) bleibt außerhalb der Git-Verwaltung.

## Projektsprache

Dokumentation, selbst gewählte Bezeichner, Kommentare, Meldungen und Beispieldaten werden auf Deutsch geschrieben. Festgelegte API-Schlüssel, Sprachsyntax und Produktnamen bleiben unverändert.

## Tatsächlicher Containerbetrieb vom 17. November 2026

P07-T02 lokal geprüft durch den Koordinator im vorhandenen autorisierten Ausführungskontext. Der frühere verweigerte Docker-Zugriff des isolierten Hintergrundarbeiters bleibt als eigener Befund erhalten. Keine Sandbox- oder Systemrechte geändert. Verwendet wird dieselbe lokale Docker-Desktop-Laufzeit, nicht ein Ersatzdienst.

Dockerfile mit festem Python-3.12-Image-Digest und FastAPI/Uvicorn-Versionen erstellt. Vier unveränderte kleine P02-Dateien (API, Import, Schema, synthetische Logs) mit Herkunft und Prüfsummen unter `bereitstellung/p02/` übernommen. Der Container importiert echte Beispieldaten nach SQLite und startet die echte P02-FastAPI. Der ergänzte Endpunkt `GET /gesundheit` prüft lokale Konfiguration und Datenbankzugriff. Image kopiert ausdrücklich nur die freigegebenen Dateien; keine Git-, Benutzer-, Docker-Konfiguration oder .env-Datei eingebaut. Keine Zugangsdaten erforderlich.

Tatsächlich Image gebaut und eigenen Testcontainer gestartet: Benutzer 10001:10001, ein CPU-Kern, 256 MB und ausschließlich lokaler zufälliger Hostport. Gesundheitsantwort 200 mit `P02/betriebsbereit`; `/status` meldet drei gespeicherte Ereignisse und einen ERROR. [Lauf und Imagekennung](nachweise/P07-T02-container.json), [echtes Buildprotokoll](nachweise/P07-T02-docker-build.txt), [Dienstprotokoll](nachweise/P07-T02-container-protokoll.txt). Nur der selbst erzeugte Container wurde nach Labelprüfung entfernt; Image und fremde Dienste bleiben erhalten.

Wiederholung: `node nachweise/P07-T02-container-pruefen.cjs`. Docker muss für den aufrufenden Kontext zugänglich sein. Das Skript verwendet unter Windows den vorhandenen Docker-Desktop-Linux-Motor und eine leere projektlokale Konfiguration unter `ausgabe/docker-konfiguration/config.json`. Falls diese Datei fehlt, ausschließlich einen leeren lokalen Ordner mit `{}` anlegen; keine privaten Zugangsdaten kopieren. Die Beispiel-Dienstkonfiguration steht in `bereitstellung/dienst.env.beispiel` und wird beim Test als gewöhnliche Umgebungsvariable gesetzt. Direkte Diagnose: `node src/gesundheit.cjs lokal http://127.0.0.1:HOSTPORT/gesundheit` mit dem tatsächlich angezeigten Port.

Diagnosecodes: 0 betriebsbereit, 1 fehlerhafte Dienstantwort, 2 ungültige Diagnoseeingabe, 3 Verbindung nicht möglich beziehungsweise Zeitlimit. Bisher in T02 tatsächlich nur Normalbetrieb geprüft; gezielte Fehler und Runner folgen in T03/T04. Kein Cloudbetrieb, Azure-DevOps-Lauf oder Produktivbetrieb behauptet. Studentische Schätzung 90 Minuten, keine separat gemessene Koordinator-Gesamtdauer und keine menschliche Eigenleistung. Dokumentiert 2026-11-17T18:02:35.612Z.

Gelesene Primärquellen: [Docker-Build](https://docs.docker.com/build/building/best-practices/), [Container starten](https://docs.docker.com/engine/containers/run/).
