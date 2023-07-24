const express = require('express');
const socket = require('socket.io');
const path = require('path');
const db = require('./db');

const app = express();


app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  io.to(socket.id).emit('updateData', db.tasks);
  socket.on('addTask', (task) => {
    db.tasks.push({ id: task.id, name: task.name });
    socket.broadcast.emit('addTask', task);
    console.log(db.tasks);
  });
  socket.on('removeTask', (id) => {
    if (id !== -1) {
      socket.broadcast.emit('removeTask', db.tasks[id]);
      db.tasks.splice(id, 1);
      console.log(db.tasks);
    }
  });
});
