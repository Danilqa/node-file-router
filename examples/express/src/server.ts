import { initFileRouter } from 'node-file-router';
import express from 'express';

async function run() {
  const fileRouter = await initFileRouter({ baseDir: './src/api' });

  const app = express();

  app.listen(4004);
  app.use(fileRouter);
}

run();
