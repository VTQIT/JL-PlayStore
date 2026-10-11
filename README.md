# JL PlayStore
1. Create a **public** GitHub repo; on a Release, attach your APK. Copy the asset's download link.
2. Push this project to GitHub, import it in Vercel.
3. Add Upstash Redis (Vercel Marketplace) and set env vars from `.env.example`. Generate the PIN hash with the command in that file.
4. Open `/admin`, log in, paste the APK link, icon URL (e.g. an image attached to the same release), save.
Untested: not built or run against live Redis/GitHub yet. Run `npm install && npm run build` first.
