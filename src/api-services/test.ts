const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUser(users: string): Promise<any> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from endpoint: ${users}`);
  }
  return response.json();
}
