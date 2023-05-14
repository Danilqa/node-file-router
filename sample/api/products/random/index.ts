export default function randomHandler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end('random');
}
