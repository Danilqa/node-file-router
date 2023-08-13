module.exports = function indexHandler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Welcome to CDN!</h1>');
}
