"""Den echten kleinen P02-Dienst um einen überprüfbaren Gesundheitsendpunkt ergänzen."""
import json
import os
import sqlite3
import sys
from pathlib import Path
from datetime import datetime, timezone
from fastapi.responses import JSONResponse

P02 = Path(__file__).resolve().parents[1] / "bereitstellung/p02"
sys.path.insert(0, str(P02 / "src"))
from api import anwendung_erstellen
from pipeline import protokoll_importieren

datenbank = Path(os.environ.get("MINIDATAHUB_DATENBANK", "/tmp/protokolle.sqlite"))
datenbank.parent.mkdir(parents=True, exist_ok=True)
importergebnis = protokoll_importieren(P02 / "beispieldaten/logs.jsonl", datenbank)
print(json.dumps({"ereignis": "synthetischer_import", "eingefuegt": importergebnis["eingefuegt"],
                  "eingabefehler": len(importergebnis["fehler"])}, ensure_ascii=False), flush=True)
anwendung = anwendung_erstellen(datenbank)


@anwendung.get("/gesundheit")
def gesundheit():
    zustand, status = "betriebsbereit", 200
    if os.environ.get("DIENST_UMGEBUNG") != "lokal":
        zustand, status = "konfigurationsfehler", 503
    else:
        try:
            with sqlite3.connect(datenbank.as_uri() + "?mode=ro", uri=True) as verbindung:
                verbindung.execute("SELECT COUNT(*) FROM ereignisse").fetchone()
        except sqlite3.Error:
            zustand, status = "datenbankfehler", 503
    print(json.dumps({"zeit": datetime.now(timezone.utc).isoformat(), "ereignis": "gesundheitspruefung",
                      "zustand": zustand, "httpStatus": status}, ensure_ascii=False), flush=True)
    return JSONResponse(status_code=status, content={"dienst": "P02", "zustand": zustand})
