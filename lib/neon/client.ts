import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.NEON_POSTGRES_URL!)

export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(query, params)
    return result as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
