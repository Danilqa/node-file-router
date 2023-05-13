export default function productsHandler(req, res) {
  const { id } = req.query;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ id, name: `getting hard ${id}` }));
}
