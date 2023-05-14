export default function usersHandler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify([{ id: 1, name: 'Phone' }, { id: 2, name: 'Gamebnoy' }]));
}
