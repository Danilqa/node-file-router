export default function notFoundHandler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end('404');
}
