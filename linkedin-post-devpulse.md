# LinkedIn Post — DevPulse

```
I spent 6 months watching tutorials. Built nothing.

Every night the same loop:
Open YouTube → "React Full Course" → watch for 2 hours → feel productive → close laptop.

Six months later I had bookmarks. Not a single real project.

The anxiety was real. What if I'm just not good enough to build something from scratch? What if I start and fail?

Last month I decided to find out.

I built DevPulse — a dashboard that scans your local projects for dependency vulnerabilities and lets you patch them in one click. React + TypeScript + Node.js + PostgreSQL. Dockerized.

The worst part wasn't the code. It was starting.

Problem #1: Where do you even begin?
Frontend? Backend? Database? I froze for 3 days.
What helped: picking ONE piece (the API) and ignoring everything else until it worked.

Problem #2: JWT refresh tokens
I implemented token rotation on a Friday night. Locked myself out of my own app. Every request returned 401. Spent Saturday debugging a bug I created by blindly following a tutorial — the exact thing I was trying to escape.

Problem #3: The database schema from hell
Day 1 schema: 4 tables, felt great.
Day 7: rewriting everything because I didn't think about scan history needing its own model.

I rewrote Prisma models three times. Each time the app broke. Each time I fixed it.

Here's what nobody tells you about building your first real project:

The tutorial doesn't exist for YOUR specific bug.
You'll write code, delete it, write it again.
The feeling of shipping > the feeling of watching.

DevPulse is live. Open source. One command to run:

docker compose up --build

https://github.com/Vikas-Dr/Dev-pulse

If you're stuck in tutorial hell right now, just pick ONE file and start. Not a course. Not a playlist. One file.

What's holding you back from building your first real project?

#buildinpublic #react #typescript #fullstack #developer #indiedev
```
