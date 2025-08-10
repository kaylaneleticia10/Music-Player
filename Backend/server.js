const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Buscar músicas
app.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Faltou a busca (q)' });

  try {
    const response = await axios.get('https://api.deezer.com/search', { params: { q } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar músicas' });
  }
});

// Buscar álbum por id
app.get('/album/:id', async (req, res) => {
  const albumId = req.params.id;
  try {
    const response = await axios.get(`https://api.deezer.com/album/${albumId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar álbum' });
  }
});

// Buscar artista por id
app.get('/artist/:id', async (req, res) => {
  const artistId = req.params.id;
  try {
    const response = await axios.get(`https://api.deezer.com/artist/${artistId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar artista' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
