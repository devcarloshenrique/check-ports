import fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { FastifyReply, FastifyRequest } from 'fastify';  // Importando tipos de resposta e requisição do Fastify
import { getIpsWithPortStatus } from './fetch-ip';

// Criando a instância do Fastify
const app = fastify();

// Configuração para servir arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'), // Caminho absoluto para a pasta 'public' dentro de 'dist'
  prefix: '/', // Prefixo para acessar arquivos estáticos (exemplo: '/script.js')
});

// Rota principal para servir o HTML
app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.sendFile('index.html'); // Serve o arquivo index.html
});

// Rota adicional (exemplo /down)
app.get('/down', async (request: FastifyRequest, reply: FastifyReply) => {

  try {
    const results = await getIpsWithPortStatus(12801);
    
    
    console.log(typeof results)
    console.log(results)

    return reply.send({
      message: results
    }); // Retorna um objeto com IPs e status da porta
  } catch (error) {
    console.error('Erro ao verificar os IPs:', error);
    return reply.status(500).send({
      message: 'Erro interno ao verificar os IPs'
    });
  }
});

// Iniciar o servidor
const start = async () => {
  try {
    // Inicia o servidor na porta 3333
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('Servidor rodando em http://localhost:3333');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Inicia o servidor
start();
