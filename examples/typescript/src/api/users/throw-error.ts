export default async function UsersWithError() {
  throw new Error('Some error in route');
}