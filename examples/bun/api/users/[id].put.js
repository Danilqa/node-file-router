const db = {
  13: { id: '13', name: 'Dan' }
}

export default async function CreateOrUpdateUser(req, routeParams) {
  db[routeParams.id] = await req.json();

  return new Response(
    JSON.stringify(db[routeParams.id]),
    { headers: { 'Content-Type': 'application/json' } }
  );
}