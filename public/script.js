document.getElementById('downButton').addEventListener('click', async () => {
  try {
    // Fazendo a requisição para a rota /down
    const response = await fetch('/down');
    const data = await response.json();

    console.log(typeof data.message)

    
    const ipsTable = document.getElementById('ipsTable').getElementsByTagName('tbody')[0];

    ipsTable.innerHTML = '';

    

    data.message.forEach(({ ip, portOpen }) => {
      const row = ipsTable.insertRow();
      const ipCell = row.insertCell(0);
      const portStatusCell = row.insertCell(1);

      ipCell.textContent = ip;
      portStatusCell.textContent = portOpen ? 'Aberta' : 'Fechada';
      
      // Adiciona uma classe dependendo do status da porta
      if (portOpen) {
        row.classList.add('open');
      } else {
        row.classList.add('closed');
      }
    });
    
    // document.getElementById('resultDiv').innerText = data.message;
    
  } catch (error) {
    console.error('Erro ao chamar a rota /down:', error);
    document.getElementById('resultDiv').innerText = 'Erro ao conectar com o servidor.';
  }
});


