export default function productsHandler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Products</h1>');
}
