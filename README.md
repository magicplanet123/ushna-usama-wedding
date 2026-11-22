# Ushna & Usama — Royal Wedding Website

A luxury, royal-style static wedding website for the wedding of **Ushna Irfan** and **Usama Zia** — emerald, maroon, ivory and gold, with a Three.js golden particle field, 3D-tilt event cards, parallax hero, live countdown, invitation gallery with lightbox, and an RSVP form.

No build step, no backend. Deploy as a static site on Vercel.

## The Celebrations

| Event | Day & Date | Time | Venue |
|---|---|---|---|
| **Baraat** | Thursday, 17 December 2026 | 7:00 PM onwards | Evention Marquee Multan, Haans Plaza, Bosan Road, Near Shalimar, Multan, Pakistan — hosted by Mr. & Mrs. Irfan Ali |
| **Walima** | Sunday, 20 December 2026 | 7:00 PM onwards | BJ Lawn Marriage Hall, Education Avenue, Near Shell Petrol Pump, New Shalimar Colony, Multan, Pakistan — hosted by Mr. & Mrs. Yousuf Zia |

- Bride: Ushna Irfan, daughter of Mr. & Mrs. Irfan Ali
- Groom: Usama Zia, son of Mr. & Mrs. Yousuf Zia
- Dates verified: 17 December 2026 is a Thursday; 20 December 2026 is a Sunday.
- Countdown targets the Baraat: `2026-12-17T19:00:00+05:00` (7:00 PM PKT).

## Files

```
ushna-usama-wedding/
├── index.html          # All sections: preloader, hero, countdown, story, events, timeline, gallery, info, RSVP, footer
├── styles.css          # Royal emerald / maroon / ivory / gold theme, responsive, mobile-first
├── script.js           # Countdown, Three.js gold dust, 3D tilt, parallax, reveal, lightbox, RSVP
├── assets/
│   ├── baraat-emerald.jpg   # Baraat card — emerald & gold (from the original invitation)
│   ├── baraat-maroon.jpg    # Baraat card — maroon & gold (from the original invitation)
│   └── walima-ivory.jpg     # Walima card — ivory & gold (from the original invitation)
├── baraat.ics          # Add-to-calendar: Baraat, 17 Dec 2026, 14:00–18:00 UTC (= 7–11 PM PKT)
├── walima.ics          # Add-to-calendar: Walima, 20 Dec 2026, 14:00–18:00 UTC (= 7–11 PM PKT)
├── vercel.json         # Static config: cleanUrls + security/cache headers
├── .gitignore
└── README.md
```

## Features

- **Preloader** with gold monogram U & U
- **Hero** — Bismillah, "The Wedding of", Ushna & Usama in Great Vibes gold script, rotating gold mandala ring, live countdown, View Events / RSVP buttons
- **Three.js golden particle field** (CDN) + floating gold petals, parallax hero
- **Events** — two 3D-tilt cards (mousemove) with date, venue, address, hosts, Add to Calendar (.ics) and View on Google Maps links
- **Timeline** — Baraat Thu 17 Dec → Walima Sun 20 Dec
- **Invitations gallery** — all three original cards, click to open full-size lightbox
- **Dress code / Good to know** — emerald/gold for Baraat, ivory/maroon/gold for Walima; arrive by 7 PM; photography welcome; December evenings in Multan are cool — bring a shawl/jacket
- **RSVP form** — name, Baraat / Walima / Both / Regretfully can't attend, guest count, message. On submit it is sent automatically to the families at **isuya01@gmail.com** via FormSubmit (`https://formsubmit.co/ajax/isuya01@gmail.com`) — the guest never enters an email address. A copy is also saved in the guest's browser (`localStorage`, key `ushna-usama-rsvps`). If the send fails, the confirmation offers a mailto fallback to isuya01@gmail.com. **One-time activation required:** the first RSVP triggers a confirmation email from FormSubmit to isuya01@gmail.com — click the activation link in it once, and all RSVPs after that arrive automatically.
- **Footer** — Ushna • Usama, Bismillah line, "Your presence will be our greatest blessing."

## Deploy to Vercel

### Option A — Vercel dashboard (easiest)
1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework Preset: **Other** (static). No build command, no output directory needed.
4. Deploy. The site serves `index.html` at the root.

### Option B — Vercel CLI
```bash
cd ushna-usama-wedding
npx vercel        # follow the prompts; accept the defaults for a static site
npx vercel --prod # promote to production
```

### Preview locally
```bash
cd ushna-usama-wedding
python3 -m http.server 8000
# open http://localhost:8000
```

## Credits

- Invitation artwork: the three original cards supplied by the family. They are embedded once in `index.html` (`#card-images`, as data URIs) so the site is fully self-contained; the compressed originals also live in `assets/` as the source files.
- Fonts: Google Fonts — Great Vibes, Playfair Display, Cormorant Garamond, Marcellus, Jost.
- 3D particles: Three.js r128 via CDN (cdnjs). If the CDN is unreachable, the site still works — the particle field is decorative only.
- All event facts (names, dates, times, venues, hosts) are taken only from the invitation cards. No other dates, venues, phone numbers or personal facts were added.
