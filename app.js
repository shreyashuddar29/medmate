const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongoose = require('mongoose');
const path = require('path'); 
const bodyParser = require('body-parser');

const encodedPassword = encodeURIComponent('#Mkd29112002');
const mongoURI = `mongodb+srv://madhudixit2911:${encodedPassword}@medmate.mwdxn8t.mongodb.net/MedMate?retryWrites=true&w=majority&appName=MedMate`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Database connection successful'))
.catch(err => console.error('Database connection error:', err));


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/data', async (req, res) => {
  const collectionName = req.body.value;
  console.log('Collection name received:', collectionName);

  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    res.json({ message: 'Data retrieved successfully', documents });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

http.listen(3000, function() {
  console.log("Server is running at http://localhost:3000");
});
