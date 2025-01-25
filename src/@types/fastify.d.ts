// fastify.d.ts
import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    sendFile(file: string): Promise<void>;
  }
}
