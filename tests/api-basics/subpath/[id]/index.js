export default function rootHandler(req, res) {
  console.log(import.meta.url);
  res.end(import.meta.url);
}
