import fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';

import { FastifyReply, FastifyRequest } from 'fastify';  // Importando tipos de resposta e requisição do Fastify
import { getIpsWithPortStatus } from './fetch-ip';
import { sendRequest } from './send-pkg';

// Criando a instância do Fastify
const app = fastify();

app.register(fastifyCors, {
  origin: '*', // Permite qualquer origem
});

// Configuração para servir arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'), // Caminho absoluto para a pasta 'public' dentro de 'dist'
  prefix: '/', // Prefixo para acessar arquivos estáticos (exemplo: '/script.js')
});

// Rota principal para servir o HTML
app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.sendFile('index.html'); // Serve o arquivo index.html
});

app.get('/check-ips', async (request: FastifyRequest, reply: FastifyReply) => {

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

app.get('/donwload-pkg', async (request: FastifyRequest, reply: FastifyReply) => {

  try {
    const results = await sendRequest(
      '192.168.137.84',
      12801,
      'http://download1085.mediafire.com/dfn551rcdseglHIEdGwzvbN2ReBc5YjrltedYYHicRqaZXlmHBC-dZjSsyglDrpGne7e3unTLwIBtspdB2bvWgRJNVPVVspvyrfjLDHpTZoVjeoKJLvBe4xiDyCFP8IreAbQjOyhIGAS424RgQnyBtnifHDKBZZ_bWMuhvldXJTnqA/3szowt268tmjxa5/God+of+War-%5BSCUS97399%5D.pkg'
    );

    return reply.send({
      message: results
    }); // Retorna um objeto com IPs e status da porta
  } catch (error) {
    console.error('Erro ao verificar os IPs:', error);
    return reply.status(500).send({
      message: 'Erro no donwload'
    })
  }



})

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
