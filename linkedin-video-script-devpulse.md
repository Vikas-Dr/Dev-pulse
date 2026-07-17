# LinkedIn Video Script — DevPulse

## Shot-by-shot teleprompter script (~55 seconds)

---

### Shot 1 — Talking head (0:00-0:05)

**Visual**: You, camera at eye level. Serious but warm.
**Text overlay**: *"The Tutorial Hell Cycle"*

**Script**:
> "Six months of YouTube tutorials.
> Zero projects built.
> Same loop every single night."

---

### Shot 2 — Screen share: VS Code (0:05-0:12)

**Visual**: Open DevPulse project in VS Code. Slowly scroll through `backend/src/` files (auth, routes, services). Doesn't need to show much — just prove it's real code.

**Script**:
> "Then I stopped watching and started building.
> Three problems nearly killed the project before it shipped."

---

### Shot 3 — Talking head (0:12-0:22)

**Visual**: Hold up 3 fingers. Lower one at a time as you list problems.
**Text overlay**: *"Problem 1: Where to start?"*

**Script**:
> "Problem one — analysis paralysis.
> Frontend? Backend? Database schema? I froze for three days.
> The fix: pick ONE file. Just the API. Ignore everything else."

---

### Shot 4 — Screen share: 401 error (0:22-0:32)

**Visual**: Show Postman or browser returning 401. Then cut to the JWT auth code that fixes it.

**Script**:
> "Problem two — JWT token rotation.
> Locked myself out of my own app on a Friday night.
> Every request: 401. Wasted a whole Saturday on a bug I created by blindly following tutorials."

---

### Shot 5 — Talking head (0:32-0:40)

**Visual**: Fold down second finger. Hold up one.
**Text overlay**: *"Problem 3: Schema hell"*

**Script**:
> "Problem three — the database model.
> Wrote it on day one. Rewrote on day seven. Rewrote again the week after.
> Each time the app broke. Each time I fixed it."

---

### Shot 6 — Screen share: Demo (0:40-0:50)

**Visual**: Terminal — run `docker compose up --build` (or just show the command typed out). Then show the DevPulse dashboard UI.

**Script**:
> "Shipped it anyway. It's called DevPulse.
> Scans your local projects for vulnerabilities.
> You patch everything in one click. One command to run."

---

### Shot 7 — Talking head, closer frame (0:50-0:55)

**Visual**: Direct eye contact, lean in slightly.
**Text overlay**: *"Your turn"*

**Script**:
> "Pick one file. No courses. No playlists. Just start.
> Drop a comment — what's blocking you from building?"

---

## 📦 Assets you need to prepare

| # | What | How to get it |
|---|---|---|
| 1 | Your face, good lighting, phone or laptop camera | Natural light from a window in front of you |
| 2 | VS Code with DevPulse open | `code /Users/viki/DevPulse` |
| 3 | Terminal showing `docker compose up --build` | Open a terminal window |
| 4 | DevPulse dashboard in browser | `http://localhost:3000` after running the project |
| 5 | A 401 error screen | Call an API without a token — Postman or curl |

---

## Recording tips for one-take (no editing needed)

**Option A — Just talking head (easiest, works great)**
- Skip the screen share shots (shots 2, 4, 6)
- Record one continuous take looking at camera
- Upload directly to LinkedIn, add captions there
- **Time**: ~5 min setup, 2 min recording

**Option B — Talking head + screen share (better)**
- Record your talking head shots first (shots 1, 3, 5, 7)
- Then screen record the code/terminal/demo clips
- Use iMovie (free) or CapCut (free mobile) to splice them
- Add the text overlays
- **Time**: ~15 min total

---

## Captions (copy-paste these into LinkedIn's caption editor after upload)

```
Six months of YouTube tutorials. Zero projects built. Same loop every single night.

Then I stopped watching and started building. Three problems nearly killed the project before it shipped.

Problem one — analysis paralysis. Frontend? Backend? Database? I froze for three days. The fix: pick ONE file. Just the API. Ignore everything else.

Problem two — JWT token rotation. Locked myself out of my own app on a Friday night. Every request returned 401.

Problem three — the database model. Wrote it on day one. Rewrote on day seven. Each time the app broke. Each time I fixed it.

Shipped anyway. DevPulse scans your local projects for vulnerabilities, patching in one click. One command to run.

Pick one file. No courses. No playlists. Just start.
```
