# SteamEdge 1.2.0 — English fixes

This is an editable SteamEdge 1.2.0 source project. It was recovered from the Windows 1.2.0 release archive after the source page returned 404, then updated with the English UI fixes from the previous project.

## Run it

1. Extract this folder somewhere you can write to, such as `C:\Users\BraxF\steamedge-1.2.0`.
2. Open PowerShell in that folder and run:

   ```powershell
   npm install
   npm start
   ```

If npm reports that Electron's install script is not approved, run `npm install-scripts approve electron`, then run `npm install` again.

## Build a Windows app

After installing dependencies, run `npm run build:win`.

The project keeps the same SteamEdge product name. Running it with `npm start` uses the normal per-user app data location; keep the old project folder until you have confirmed the updated app opens and your settings are present.
