import React, { useState, useEffect } from "react";

import api from './services/api';
import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);
  const [message, setMessage] = useState('');
  const [ total, setTotal] = useState(0);

  async function handleAddRepository() {
    try {
      const { data, status } = await api.post('repositories', {
        "title": `My Awesome Repo! ${Date.now()}`,
        "url": "http://github.com/gpaiva00",
        "techs": [
          "ReactJs",
          "NodeJs"
        ]
      });

      if (status === 200) {
        setRepositories([...repositories, data]);
        setTotal(repositories.length + 1);
      }
    } catch(error) {
      console.error('Error trying to add repo', error);
      setMessage('Houve um erro ao tentar adicionar o repositório');
    }
  }

  async function handleRemoveRepository(id) {
    try {
      const { status } = await api.delete(`repositories/${id}`);
      
      if (status === 204) {
        const repoIndex = repositories.findIndex(repo => repo.id === id);
        repositories.splice(repoIndex, 1);
  
        return setTotal(repositories.length);
      }
    } catch (error) {
      console.error('Error trying to remove repo', error);
      setMessage('Houve um erro ao carregar os repositórios');
    }
  }

  async function loadRepositories() {
    const { data } = await api.get('repositories');

    setRepositories([...repositories, ...data]);
    setTotal(data.length);
  }

  useEffect(() => {
    loadRepositories();
  }, []);

  return (
    <div>
      <ul data-testid="repository-list">
        
        {total === 0 && (<>{message}</>)}
        
        {repositories.map(({ title, id }) => (
          <li key={id}>
            {title}

            <button onClick={() => handleRemoveRepository(id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
      <footer>
        <p>Total de {total} repositórios</p>
      </footer>
    </div>
  );
}

export default App;
