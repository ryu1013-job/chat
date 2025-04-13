import { index, pgTable, text, timestamp, varchar, vector } from 'drizzle-orm/pg-core'

export const resources = pgTable('resources', {
  id: varchar('id', { length: 191 }).primaryKey().notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
})

export const embeddings = pgTable('embeddings', {
  id: varchar('id', { length: 191 }).primaryKey().notNull(),
  resource_id: varchar('resource_id', { length: 191 }).references(() => resources.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }).notNull(),
}, (table) => {
  return {
    embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  }
})
