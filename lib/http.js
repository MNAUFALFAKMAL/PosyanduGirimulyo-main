export async function readJsonResponse(response, fallbackMessage = "Respons server tidak valid.") {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(fallbackMessage);
  }
}
