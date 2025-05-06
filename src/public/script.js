// public/script.js
document
  .getElementById('formUser')
  .addEventListener('submit', async e => {
    e.preventDefault();                  // não recarregar a página
    const form = e.target;
    const data = {
      nome: form.nome.value,
      email: form.email.value,
      idade: Number(form.idade.value)
    };
    try {
      const resp = await fetch('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      if (resp.ok) {
        document.getElementById('mensagem').innerText =
          `✔️ Usuário criado com ID ${json._id}`;
        form.reset();
      } else {
        document.getElementById('mensagem').innerText =
          `❌ Erro: ${json.erro}`;
      }
    } catch (err) {
      document.getElementById('mensagem').innerText =
        `❌ Falha na requisição: ${err.message}`;
    }
  });

// Função para buscar e mostrar todos os usuários

const btnToggle = document.getElementById('btnShow');
const tabela   = document.getElementById('tabelaUsuarios');
const tbody    = tabela.querySelector('tbody');

let tabelaVisivel = false;

btnToggle.addEventListener('click', async () => {
  if (!tabelaVisivel) {
    // 1) buscar os usuários
    try {
      const resp = await fetch('/usuarios');
      if (!resp.ok) throw new Error(`Status ${resp.status}`);
      const usuarios = await resp.json();

      // 2) limpar linhas antigas
      tbody.innerHTML = '';

      // 3) povoar
      usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="border: 1px solid #ccc; padding: 0.5rem;">${u.nome}</td>
          <td style="border: 1px solid #ccc; padding: 0.5rem;">${u.email}</td>
          <td style="border: 1px solid #ccc; padding: 0.5rem;">${u.idade}</td>
        `;
        tbody.appendChild(tr);
      });

      // 4) exibir
      tabela.style.display = 'table';
      btnToggle.textContent = 'Ocultar usuários';
      tabelaVisivel = true;

    } catch (err) {
      console.error(err);
      alert('Erro ao carregar usuários');
    }

  } else {
    // esconder
    tabela.style.display = 'none';
    btnToggle.textContent = 'Exibir todos os usuários';
    tabelaVisivel = false;
  }
});
