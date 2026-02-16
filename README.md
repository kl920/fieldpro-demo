# Field Service App - MVP

En simpel field service web-app til håndværkere.

## Funktioner

✅ **Opgaveoversigt**
- Liste over dagens opgaver
- Status indikatorer (Igång, Ikke startet, Afsluttet)
- Lokation og tidsrum for hver opgave

✅ **Opgave detaljer**
- Vis opgave information
- Tidsregistrering (start, slut, pause)
- Automatisk beregning af total tid
- Tilføj materialer med antal og enhed
- Upload før/efter billeder
- Send opgave når færdig

✅ **Data håndtering**
- Bruger localStorage til at gemme data
- Ingen login krævet (MVP)
- Data persisteres mellem sessioner

## Teknologi

- Pure HTML/CSS/JavaScript
- Responsive design (mobil-first)
- Moderne, rent UI inspireret af Apacta/Viktech
- LocalStorage for data persistence

## Sådan bruges appen

1. Åbn `index.html` i en browser
2. Vælg en opgave fra listen
3. Registrer tider, materialer og billeder
4. Tryk "Send" når opgaven er færdig

## Filer

- `index.html` - Opgaveliste (forsiden)
- `task.html` - Opgave detaljer
- `style.css` - Styling
- `app.js` - Logik for opgaveliste
- `task.js` - Logik for opgave detaljer

## Fremtidige forbedringer

- [ ] Backend integration
- [ ] Bruger login
- [ ] GPS lokation tracking
- [ ] Offline support (PWA)
- [ ] Push notifikationer
- [ ] Signatur funktion
- [ ] PDF rapport generering
- [ ] Admin dashboard til at se indsendte opgaver
