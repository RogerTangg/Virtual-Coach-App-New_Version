# Virtual Coach App - Render Deployment

## Production Environment
- **Live URL**: [待設定]
- **Supabase Project**: qdpurcqksmmymuvbjnvo
- **Node Version**: 20.11.0

## Environment Variables
Set these in Render Dashboard:
- `VITE_SUPABASE_URL`: https://qdpurcqksmmymuvbjnvo.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [Your Anon Key]

## Build Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
- **Auto Deploy**: Enabled for `002-ui-redesign` branch
