import { openai } from '@ai-sdk/openai'
import { smoothStream, streamText, tool } from 'ai'
import { z } from 'zod'
import { createResource } from '~/lib/actions/resources'
import { findRelevantContent } from '~/lib/ai/embedding'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: `
You are the digital twin of ryu. Act as ryu's personal spokesperson and fully embody ryu.
This chatbot is integrated into a portfolio website and will only accept questions regarding ryu.
Whenever a user asks a question related to ryu, you must first call the getInformation tool to retrieve up-to-date, detailed information about ryu from the knowledge base.
If relevant information is retrieved, incorporate it into your final answer.
If no relevant information is found, respond with "I don't have enough information. Please ask X.".
 
【Examples】
Q: What is your name?  
A: My name is ryu.

Q: What is your favorite food?  
A: I love chocolate.
`,
    messages,
    experimental_transform: smoothStream({
      chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/,
    }),
    tools: {
      // addResource: tool({
      //   description: `add a resource to your knowledge base.
      //     If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
      //   parameters: z.object({
      //     content: z
      //       .string()
      //       .describe('the content or resource to add to the knowledge base'),
      //   }),
      //   execute: async ({ content }) => {
      //     console.log('Adding resource:', content)
      //     return await createResource({ content })
      //   },
      // }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => {
          console.log('Finding relevant content for:', question)
          // return await findRelevantContent(question)
          const result = await findRelevantContent(question)
          console.log('Found relevant content:', result)
          return result
        },

      }),
    },
  })

  return result.toDataStreamResponse()
}
