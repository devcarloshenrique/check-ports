import * as http from 'node:http';

interface RequestData {
  type: string;
  packages: string[];
}

// Função para fazer a requisição HTTP
export function sendRequest(ip: string, port: number, packageUrl: string): void {
  const data: string = JSON.stringify({
    type: 'direct',
    packages: [packageUrl]
  });

  const options: http.RequestOptions = {
    hostname: ip,
    port: port,
    path: '/api/install',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    }
  };

  const req = http.request(options, (res) => {
    let responseData: string = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Resposta do servidor:', responseData);
    });
  });

  req.on('error', (error: Error) => {
    console.error('Erro na requisição:', error.message);
  });

  // Enviar os dados
  req.write(data);
  req.end();
}

// Exemplo de chamada da função
// sendRequest('192.168.137.84', 12801, '/api/install', 'http://download1085.mediafire.com/.../God+of+War-%5BSCUS97399%5D.pkg');
