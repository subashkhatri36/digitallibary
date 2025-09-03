import { sql } from "./client"

export interface DatabaseClient {
  from: (table: string) => QueryBuilder
  auth: {
    getUser: () => Promise<{ data: { user: any } | null; error: any }>
  }
}

export class QueryBuilder {
  private tableName: string
  private selectFields: string = "*"
  private whereConditions: string[] = []
  private orderByClause: string = ""
  private limitClause: string = ""
  private insertData: any = null
  private updateData: any = null
  private deleteFlag: boolean = false
  private params: any[] = []

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(fields: string = "*", options?: { count?: string; head?: boolean }): QueryBuilder {
    if (options?.count === "exact" && options?.head) {
      this.selectFields = "COUNT(*)"
    } else {
      this.selectFields = fields
    }
    return this
  }

  eq(column: string, value: any): QueryBuilder {
    let formattedValue: string
    if (typeof value === 'string') {
      formattedValue = `'${value.replace(/'/g, "''")}'`
    } else if (typeof value === 'boolean') {
      formattedValue = value.toString()
    } else if (value === null) {
      formattedValue = 'NULL'
    } else {
      formattedValue = value.toString()
    }
    this.whereConditions.push(`${column} = ${formattedValue}`)
    return this
  }

  order(column: string, options?: { ascending?: boolean }): QueryBuilder {
    const direction = options?.ascending === false ? "DESC" : "ASC"
    this.orderByClause = `ORDER BY ${column} ${direction}`
    return this
  }

  limit(count: number): QueryBuilder {
    this.limitClause = `LIMIT ${count}`
    return this
  }

  insert(data: any): QueryBuilder {
    this.insertData = data
    return this
  }

  update(data: any): QueryBuilder {
    this.updateData = data
    return this
  }

  delete(): QueryBuilder {
    this.deleteFlag = true
    return this
  }

  async single(): Promise<{ data: any; error: any }> {
    try {
      this.limitClause = "LIMIT 1"
      const result = await this.execute()
      return { data: result[0] || null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  async execute(): Promise<any[]> {
    if (this.insertData) {
      const columns = Object.keys(this.insertData)
      const values = Object.values(this.insertData).map(v => 
        typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
      )
      const query = `INSERT INTO ${this.tableName} (${columns.join(", ")}) VALUES (${values.join(", ")}) RETURNING *`

      const result = await sql.unsafe(query)
      return result as unknown as any[]
    } else if (this.updateData) {
      const updates = Object.keys(this.updateData).map(key => {
        const value = this.updateData[key]
        const formattedValue = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value
        return `${key} = ${formattedValue}`
      })
      let query = `UPDATE ${this.tableName} SET ${updates.join(", ")}`
      
      if (this.whereConditions.length > 0) {
        query += ` WHERE ${this.whereConditions.join(" AND ")}`
      }
      query += " RETURNING *"

      const result = await sql.unsafe(query)
      return result as unknown as any[]
    } else if (this.deleteFlag) {
      let query = `DELETE FROM ${this.tableName}`
      if (this.whereConditions.length > 0) {
        query += ` WHERE ${this.whereConditions.join(" AND ")}`
      }
      query += " RETURNING *"

      const result = await sql.unsafe(query)
      return result as unknown as any[]
    } else {
      let query = `SELECT ${this.selectFields} FROM ${this.tableName}`
      if (this.whereConditions.length > 0) {
        query += ` WHERE ${this.whereConditions.join(" AND ")}`
      }
      if (this.orderByClause) {
        query += ` ${this.orderByClause}`
      }
      if (this.limitClause) {
        query += ` ${this.limitClause}`
      }

      const result = await sql.unsafe(query)
      return result as unknown as any[]
    }
  }
}

export function createClient(): DatabaseClient {
  return {
    from: (table: string) => new QueryBuilder(table),
    auth: {
      getUser: async () => {
        // Mock implementation to avoid server-side dependency
        return { data: null, error: null }
      }
    }
  }
}

export async function createServerClient(): Promise<DatabaseClient> {
  return createClient()
}