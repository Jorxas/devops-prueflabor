# Lokale Bereitstellung und API-Diagnose

Stand: 1. November 2026 — **P07-T01 erledigt: Gesundheitsvertrag und drei Fehlerfälle für den späteren Dienst P02 lokal geprüft; Fachfunktionen offen**. Geplanter Abschluss der Basis: 2026-11-06, spätestens 8. November 2026. Geschätzter Basisaufwand: 4 Stunden ohne Einrichtung und Erweiterungen.

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
