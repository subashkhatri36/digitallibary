// Mock Supabase server client for compatibility
// This project uses Neon database instead of Supabase

interface QueryResult<T = any> {
  data: T[] | T | null;
  error: any;
}

interface QueryBuilder {
  eq: (column: string, value: any) => QueryBuilder;
  or: (query: string) => QueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder;
  limit: (count: number) => QueryBuilder;
  range: (from: number, to: number) => Promise<QueryResult>;
  single: () => Promise<QueryResult>;
}

interface SupabaseTable {
  select: (columns?: string) => QueryBuilder;
  insert: (data: any) => Promise<QueryResult>;
  update: (data: any) => Promise<QueryResult>;
  delete: () => Promise<QueryResult>;
}

interface SupabaseClient {
  from: (table: string) => SupabaseTable;
  auth: {
    getUser: () => Promise<{ data: { user: any }, error: any }>;
  };
}

export async function createClient(): Promise<SupabaseClient> {
  // Create a chainable query builder that supports all operations
  const createQueryBuilder = (): QueryBuilder => {
    const queryBuilder: QueryBuilder = {
      eq: (column: string, value: any) => queryBuilder,
      or: (query: string) => queryBuilder,
      order: (column: string, options?: { ascending?: boolean }) => queryBuilder,
      limit: (count: number) => queryBuilder,
      range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null }),
    }
    return queryBuilder
  }

  return {
    from: (table: string): SupabaseTable => ({
      select: (columns?: string) => createQueryBuilder(),
      insert: (data: any) => Promise.resolve({ data: null, error: null }),
      update: (data: any) => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  }
}