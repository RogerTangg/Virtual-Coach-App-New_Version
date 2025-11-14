# Virtual-Coach-App Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-14

## Active Technologies

- **Language**: JavaScript ES2022+ with TypeScript 5.8.3 (React 19.2.0)
- **Frontend**: Vite 7.2.2, React 19.2.0, Tailwind CSS 3.4.20
- **Backend**: Supabase PostgreSQL (BaaS, free tier)
- **Testing**: Vitest 3.0.0, React Testing Library 16.1.0, MSW 2.8.0
- **Feature**: 001-virtual-coach-mvp

## Project Structure

```text
virtual_coach_app_frontend/
├── src/
│   ├── components/       # React components (common, preferences, workout, player)
│   ├── services/         # Supabase client, API services
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React Context providers
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── tests/            # Test files
├── public/               # Static assets
└── vite.config.ts        # Vite configuration
```

## Commands

npm test; npm run lint

## Code Style

JavaScript ES2022+ (React 19.2.0): Follow standard conventions

## Recent Changes

- 001-virtual-coach-mvp: Added JavaScript ES2022+ (React 19.2.0)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
