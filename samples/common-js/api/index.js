function indexHandler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello!</h1>');
}

module.exports = indexHandler;
