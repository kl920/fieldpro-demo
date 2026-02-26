# FieldPro Demo — Field Service App

**Live URL:** https://kl920.github.io/fieldpro-demo/  
**Lokal sti:** `C:\AI\fieldpro-demo\fieldpro-demo`  
**Stack:** Vanilla JS, HTML5, CSS3, localStorage — intet framework, ingen build-step  
**Deploy:** GitHub Pages — push til `master` → live på ~30 sekunder

---

## Sidst opdateret: 26. februar 2026

### Hvad er bygget ✅

**Generel arkitektur**
- Single-page app med hash-router (`router.js`)
- Al data i `localStorage` via `AppData` (data.js)
- Globale hjælpefunktioner i `utils.js` (bl.a. `compressImage`, `generateId`)
- `LocationService` og `showToast` i `components.js`
- Admin-panel til at konfigurere job-typer, foto-kategorier og materialer

**Order Detail (`pages/order-detail.js` v=28)**
- Foto-grid med kategorier (hentes fra admin job-type config)
- GPS-stempel brændt direkte på billedpixels via Canvas API
  - GPS-prefetch starter i det øjeblik brugeren trykker på et foto-slot (`openPhotoSlot`)
  - Reverse geocoding via BigDataCloud API (dansk lokale)
  - Stemplet placeres øverst på billedet (synligt i square-crop thumbnail)
  - Fallback til koordinater hvis geocoding fejler
- Foto-thumbnail bruger `object-position: top` så stemplet altid er synligt
- Checklist, materialer, aktivitetslog

**Work Note (`pages/work-note.js` v=18)**
- Tidsregistrering: ét-række layout med Start / End / Pause
  - Labels (START, END, PAUSE) er top-aligned
  - `→` separator er bottom-aligned (følger input-felterne)
- Workers: Kenneth Larsen, Alexander Petersen (hardcoded konstant `WORKERS`)
- Entry-visning: arbejdernavn + blåt tid-badge til venstre, total timer + pause til højre
- Materialer: native `<select>` (ikke `<datalist>`) — virker på iOS Safari
  - Henter materialeliste fra admin job-type config
  - Falder tilbage til fri tekst-input hvis ingen materialer er konfigureret
- Ingen `confirm()` dialogs (MVP)

---

## Fil-versioner

| Fil | Version | Seneste ændring |
|-----|---------|-----------------|
| styles.css | v=19 | Time reg label alignment, photo object-position |
| config.js | v=5 | — |
| utils.js | v=5 | — |
| data.js | v=6 | — |
| components.js | v=10 | LocationService, reverseGeocode |
| router.js | v=5 | — |
| main.js | v=6 | — |
| pages/home.js | v=8 | — |
| pages/orders.js | v=5 | — |
| pages/order-detail.js | v=28 | GPS stamp øverst, debug-log fjernet |
| pages/work-note.js | v=18 | iOS material-fix (select i stedet for datalist) |
| pages/calendar.js | v=6 | — |
| pages/route.js | v=8 | — |
| pages/time.js | v=5 | — |
| pages/more.js | v=6 | — |
| pages/admin.js | v=16 | — |

---

## GPS-foto flow (teknisk)

```
Bruger trykker på foto-slot
  → openPhotoSlot() starter getLocationWithTimeout(20000) med det samme
  → GPS kører mens kamera-appen er åben (20 sek vindue)
  → Bruger tager billede, vender tilbage til browser
  → addPhotos() awaiter _pendingLocationPromise (allerede i gang)
  → Hvis GPS OK: reverseGeocode() → adresse (maks 4 sek timeout)
  → stampLocationOnImage() tegner sort bar øverst + hvid tekst via Canvas
  → compressImage() → stampLocationOnImage() → localStorage via AppData
```

---

## Kendte begrænsninger / næste skridt

- [ ] Foto-HTML og grid kan forbedres (var i gang da session sluttede)
- [ ] `openPhotoSlot()` kan evt. refaktoreres
- [ ] Ingen backend — al data lever kun i browserens localStorage
- [ ] Ingen login / bruger-auth
- [ ] PDF-rapport generering (jsPDF er allerede loaded)
- [ ] Offline PWA support

---

## Deploy-kommando

```powershell
cd C:\AI\fieldpro-demo\fieldpro-demo
git add -A
git commit -m "Beskrivelse"
git push
```

Bump versionsnummer i `app.html` på den relevante `<script src="...?v=XX">` linje før push.

