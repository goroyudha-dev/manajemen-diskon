import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'manajemen_diskon'
});

db.connect((err) => {
  if (err) return console.error('Gagal koneksi ke MySQL:', err);
  console.log('Koneksi ke MySQL Berhasil!');
});

app.get('/api/discounts', (req, res) => {
  const { store_id } = req.query; 
  
  db.query('SELECT * FROM discounts WHERE store_id = ?', [store_id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/api/discounts', (req, res) => {
  const { store_id, name, value, type } = req.body;

  db.query('SELECT * FROM discounts WHERE name = ? AND store_id = ?', [name, store_id], (err, results) => {
    if (err) return res.status(500).send(err);
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Nama diskon sudah digunakan di toko ini.' });
    }

    db.query('INSERT INTO discounts (store_id, name, value, type) VALUES (?, ?, ?, ?)', [store_id, name, value, type], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, store_id, name, value, type });
    });
  });
});

app.put('/api/discounts/:id', (req, res) => {
  const { id } = req.params;
  const { store_id, name, value, type } = req.body;

  db.query('SELECT * FROM discounts WHERE name = ? AND store_id = ? AND id != ?', [name, store_id, id], (err, results) => {
    if (err) return res.status(500).send(err);
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Nama diskon sudah digunakan di toko ini.' });
    }

    db.query('UPDATE discounts SET name = ?, value = ?, type = ? WHERE id = ?', [name, value, type, id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Diskon berhasil diperbarui' });
    });
  });
});

app.delete('/api/discounts/:id', (req, res) => {
  db.query('DELETE FROM discounts WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Diskon berhasil dihapus' });
  });
});

app.post('/api/discounts/bulk-delete', (req, res) => {
  const { ids } = req.body;
  db.query('DELETE FROM discounts WHERE id IN (?)', [ids], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Diskon terpilih berhasil dihapus.' });
  });
});

app.listen(3000, () => {
  console.log('Backend Server berjalan di http://localhost:3000');
});