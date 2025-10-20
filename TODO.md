# TODO: Hide API Key and Update Configuration

## Tasks
- [x] Update README.md to reference .env instead of .env.local
- [x] Create .env.example file with GEMINI_API_KEY placeholder
- [x] Verify .env is in .gitignore (already done)
- [ ] Test that the application loads the API key correctly from .env

## Notes
- The .env file is already hidden in .gitignore, so it won't be committed to GitHub.
- The code already uses process.env.API_KEY, loaded from GEMINI_API_KEY in .env via vite.config.ts.
