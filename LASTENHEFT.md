# Lastenheft — P07

## Zielgruppe und Problem

Ein Team möchte einen Dienst reproduzierbar starten und Fehler schnell nachvollziehen.

## Studentischer Umfang

Lokaler Container, beschriebene Pipeline, Diagnose und ein Fehlerszenario für P02.

Lokale Einzelbenutzung, synthetische Daten und ein vorführbarer kleiner Ablauf. Umfang bewusst begrenzen, damit eine erste Version innerhalb der Zielwoche möglich bleibt.

## Abnahmekriterien

- [x] A1 — Dienst mit einer dokumentierten Befehlsfolge bauen und Gesundheitsendpunkt abfragen.
- [x] A2 — Ein provozierter Fehler erzeugt ein nutzbares Protokoll und einen Wiederherstellungsweg.
- [x] A3 — Ungültige Eingabe und fehlende Konfiguration gezielt prüfen.
- [x] A4 — Eine CI-Datei ist kein Ausführungsnachweis; tatsächlichen lokalen Runner-Lauf sichern.

## Voraussetzungen

- Docker Desktop oder vergleichbare Containerlaufzeit
- WSL oder Linux für die Linux-Variante

## Fünfminütige Vorführung

Dienst bauen, Gesundheit prüfen, Konfigurationsfehler auslösen und beheben.

Eine gültige Eingabe, einen Fehlerfall, das Ergebnis und die zuständige Quellcodedatei zeigen. Eine technische Entscheidung und eine Grenze erklären.

## Lieferumfang

- Genaue Startbefehle, verwendete Versionen und Beispieldaten.
- Tatsächlich durchgeführte Abnahme mit Ergebnissen und einem geeigneten Nachweis.
- Aktualisierte Tickets und Journal sowie ein lokaler Commit zum realen Fortschritt.
- Verständlicher Quellcode und nachvollziehbare Unterstützung durch den Assistenten.

## Grenzen

Öffentliche Bereitstellung und Produktivbetrieb gehören nicht zur Basis. Jede Werkzeugvariante benötigt einen eigenen Ausführungsnachweis. Zertifizierung, Berufserfahrung, Sprachniveau und Teamarbeit folgen nicht automatisch aus dieser Übung.

## Spätere Verwendung im Lebenslauf

Lokales Docker- und Automatisierungslabor; keine Erfahrung mit produktivem Cloudbetrieb daraus ableiten.

Derzeit zutreffend: „Eigenes Lernprojekt in Vorbereitung: Lokale Bereitstellung und API-Diagnose“. „Umgesetzt“ setzt die tatsächliche Abnahme voraus.

Abnahme 17. November 2026 durch tatsächlichen Containerbau, Gesundheitsabfrage, negative Eingaben/Konfiguration, echten Ausfall/Wiederanlauf und vierstufigen lokalen Runner. Belege: `nachweise/P07-T04-runner.json` und `nachweise/P07-T04-wiederherstellung.json`. Azure-Vorlage nicht ausgeführt.
