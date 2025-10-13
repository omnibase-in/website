import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);


const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));
const PORT = parseInt(pkg.config.port, 10) || 3000;

const app = fastify();

// __dirname = dirname(__filename) + './';

const ROUTES = {
  '/': 'index.html',
  '/contact-us': 'contact-us/index.html',
  '/privacy-policy': 'privacy-policy/index.html',
  '/terms-and-conditions': 'terms-and-conditions/index.html',
};

app.register(fastifyStatic, {
  root: join(__dirname),
  prefix: '/',
  index: false,
});

const sendHtml = (reply, filePath) => {
  try {
    const html = readFileSync(join(__dirname, filePath), 'utf-8');
    reply.type('text/html').send(html);
  } catch {
    reply.code(404).type('text/html').send('Page not found');
  }
};

// register and server routes
for (const [route, file] of Object.entries(ROUTES)) {
  app.get(route, (req, reply) => sendHtml(reply, file));
}

// not found handler
app.setNotFoundHandler((req, reply) => {
  const notFoundPath = join(__dirname, './404.html');
  try {
    const html = readFileSync(notFoundPath, 'utf-8');
    reply.code(404).type('text/html').send(html);
  } catch {
    reply.code(404).type('text/plain').send('404 - Page not found');
  }
});

// server
app.listen({ port: PORT }, (err, address) => {
  if (err) throw err;
  console.log(`🚀 Omnibase landing page server running at ${address}`);
});
