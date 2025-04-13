'use server'

import type {
  NewResourceParams,
} from '~/lib/db/schema/resources'
import { embeddings as embeddingsTable } from '~/lib/db/schema/embeddings'
import {
  insertResourceSchema,
  resources,
} from '~/lib/db/schema/resources'
import { generateEmbeddings } from '../ai/embedding'
import { db } from '../db'

export async function createResource(input: NewResourceParams) {
  try {
    const { content } = insertResourceSchema.parse(input)

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning()

    const embeddings = await generateEmbeddings(content)
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    )

    return 'Resource successfully created and embedded.'
  }
  catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'Error, please try again.'
  }
}
