# AI Agent Instructions for Cinextma

## Project Overview
Cinextma is a Next.js application integrated with Supabase for authentication and data storage. It appears to be a streaming/media platform with features for tracking watch history and managing watchlists.

## Architecture & Key Components

### Authentication & Authorization
- Uses Supabase SSR (Server-Side Rendering) authentication
- Protected routes are managed through middleware at `src/utils/supabase/middleware.ts`
- Protected paths are configured through environment variables (`PROTECTED_PATHS`)
- Authentication state redirects:
  - Unauthenticated users attempting to access protected paths are redirected to `/auth`
  - Authenticated users accessing `/auth` are redirected to `/`

### Database Structure
Key tables in Supabase (defined in `types.ts`):
1. `histories` - Tracks user viewing progress
   - Stores media details, progress (last_position), and completion status
   - Handles both movies and episodic content (season/episode)
2. `profiles` - User profile information
3. `watchlist` - User's saved media items

### Client-Server Architecture
- Browser client initialization: `src/utils/supabase/client.ts`
- Server-side client initialization: `src/utils/supabase/server.ts`
  - Supports both regular and admin (service role) access
- Type-safe database interactions using generated types from `types.ts`

## Development Patterns

### Supabase Client Usage
1. Client-side: Use `createClient()` from `client.ts`
2. Server-side: Use `createClient(admin?: boolean)` from `server.ts`
   - Pass `admin: true` for service role access when needed

### Type Safety
- Database types are defined in `types.ts`
- Use the `Database` type for Supabase client initialization
- Tables have typed Row, Insert, and Update interfaces
- Example: `Tables<"histories">` gives you the type for history records

### Authentication Flow
1. Middleware (`middleware.ts`) checks protected routes
2. Session updates are handled automatically through cookie management
3. Proper error handling for cookie operations in server components

## Common Tasks

### Adding Protected Routes
1. Add the route prefix to `PROTECTED_PATHS` environment variable
2. Middleware will automatically handle authentication checks

### Working with Database
- Use generated types for type safety:
  ```typescript
  type HistoryRow = Tables<"histories">
  type HistoryInsert = TablesInsert<"histories">
  type HistoryUpdate = TablesUpdate<"histories">
  ```

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin access)
- `PROTECTED_PATHS` (comma-separated list)