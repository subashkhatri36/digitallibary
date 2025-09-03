// Mock Supabase client for compatibility
// This project uses Neon database instead of Supabase
export function createClient() {
  return {
    from: (table: string) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
    },
  }
}