// public/script.js
document
  .getElementById('formTask')
  .addEventListener('submit', async e => {
    e.preventDefault();                  // não recarregar a página
    const form = e.target;
    const data = {
      title: form.titulo.value,
      description: form.descricao.value
    };
    try {
      const resp = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      if (resp.ok) {
        document.getElementById('mensagem').innerText =
          `✔️ Tarefa Criada!`;
        form.reset();
        const tasks = await fetchTasks();
        renderTasks(tasks);

      } else {
        document.getElementById('mensagem').innerText =
          `❌ Erro: ${json.erro}`;
      }
    } catch (err) {
      document.getElementById('mensagem').innerText =
        `❌ Falha na requisição: ${err.message}`;
    }
  });

// Função para buscar e mostrar todas as tasks

const btnToggle = document.getElementById('btnShow');
const tabela   = document.getElementById('tabelaTasks');
const tbody    = tabela.querySelector('tbody');

let tabelaVisivel = false;

// 1) Função pra buscar do servidor
async function fetchTasks() {
  const resp = await fetch('/tasks');
  if (!resp.ok) throw new Error(`Status ${resp.status}`);
  return resp.json();
}

// 2) Função pra renderizar na tabela
function renderTasks(tasks) {
  tbody.innerHTML = '';
  tasks.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.title}</td>
      <td>${u.description}</td>
      <td>${new Date(u.createdAt).toLocaleDateString()}</td>
      <td 
        class="status-cell" 
        data-id="${u._id}" 
        style="cursor:pointer;${!u.completed
          ? 'background-color:#fff3cd;color:#856404;'
          : 'background-color:#d4edda;color:#155724;'}">
        ${u.completed ? 'Concluída' : 'Pendente'}
      </td>
      <td 
        class="delete-cell" 
        data-id="${u._id}" 
        data-title="${u.title}" 
        align="center" 
        style="cursor:pointer;">
        ❌
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// 3) Delegação de eventos – só uma vez!
tbody.addEventListener('click', async e => {
  const cell = e.target;
  
  // ATUALIZAR STATUS
  if (cell.classList.contains('status-cell')) {
    const id = cell.dataset.id;
    const novoStatus = cell.textContent.trim() !== 'Concluída';
    try {
      const resp = await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: novoStatus })
      });
      if (!resp.ok) throw new Error(resp.status);
      // atualiza estilo/texto
      cell.textContent = novoStatus ? 'Concluída' : 'Pendente';
      cell.style.backgroundColor = novoStatus
        ? '#d4edda'
        : '#fff3cd';
      cell.style.color = novoStatus ? '#155724' : '#856404';
    } catch {
      alert('Erro ao atualizar status');
    }
    return;
  }
  
  // DELETAR
  if (cell.classList.contains('delete-cell')) {
    const id = cell.dataset.id;
    const tr = cell.closest('tr');
    try {
      const resp = await fetch(`/tasks/${id}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error(resp.status);
      tr.remove();
    } catch {
      alert('Erro ao deletar tarefa');
    }
  }
});

// 4) Toggle que só chama as funções
btnToggle.addEventListener('click', async () => {
  if (!tabelaVisivel) {
    try {
      const tasks = await fetchTasks();
      renderTasks(tasks);
      tabela.style.display = 'table';
      btnToggle.textContent = 'Ocultar Tasks';
      tabelaVisivel = true;
    } catch {
      alert('Erro ao carregar tasks');
    }
  } else {
    tabela.style.display = 'none';
    btnToggle.textContent = 'Exibir todas as Tasks';
    tabelaVisivel = false;
  }
});

