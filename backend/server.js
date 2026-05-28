const app = require('./src/app');
const { connectDB} = require('./src/config/database');
const { iniciarWorker } = require('./src/workers/notificaciones.worker');

const PORT = process.env.PORT || 3001;

const start = async () => {
  await connectDB();
  iniciarWorker();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

start();