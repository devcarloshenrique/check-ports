import { exec } from 'child_process';
import { Socket } from 'net';

// Função para verificar se a porta está aberta
function checkPort(ip: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new Socket();

    socket.setTimeout(2000); // Timeout de 2 segundos

    socket.on('connect', () => {
      resolve(true);
      socket.destroy();
    });

    socket.on('timeout', () => {
      resolve(false);
      socket.destroy();
    });

    socket.on('error', () => {
      resolve(false);
    });

    socket.connect(port, ip);
  });
}

// Função para obter IPs da tabela ARP e verificar a porta
export async function getIpsWithPortStatus(port: number): Promise<{ ip: string, portOpen: boolean }[]> {
  return new Promise((resolve, reject) => {
    exec('arp -a', async (err, stdout, stderr) => {
      if (err || stderr) {
        console.error('Erro ao executar comando ARP:', err || stderr);
        return reject(err || stderr);
      }

      // Filtra os IPs da tabela ARP
      const ips = stdout
        .split('\n')
        .map(line => line.match(/(\d{1,3}\.){3}\d{1,3}/)) // Encontra os IPs
        .filter(Boolean) // Remove linhas sem IPs
        .map(match => match![0]); // Extrai os IPs

      const results = [];

      // Testa cada IP para a porta
      for (const ip of ips) {
        const isOpen = await checkPort(ip, port);
        results.push({ ip, portOpen: isOpen });
      }

      resolve(results);
    });
  });
}

