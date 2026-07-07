// Notifie le ws-server après une écriture confirmée en base de données.
// Le ws-server diffuse ensuite l'événement aux rooms Socket.IO concernées.
// Les erreurs sont loguées mais ne bloquent jamais la réponse HTTP principale.

const WS_INTERNAL_URL = process.env.WS_INTERNAL_URL ?? "http://ws:3001";

export async function notifyWs(
  type: string,
  payload: Record<string, unknown>
): Promise<void> {
  try {
    await fetch(`${WS_INTERNAL_URL}/internal/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, ...payload }),
    });
  } catch (err) {
    console.error(`[notifyWs] échec pour "${type}":`, err);
  }
}
