// lib/medici.ts

const MEDICI_HEADERS = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.MEDICI_API_KEY}`,
};

export async function mediciSearch(payload: any) {
  const res = await fetch(`${process.env.MEDICI_BASE_URL}/GetInnstantSearchPrice`, {
    method: "POST",
    headers: MEDICI_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Medici Search failed");
  return res.json();
}

export async function mediciPreBook(payload: any) {
  const res = await fetch(`${process.env.MEDICI_BASE_URL}/PreBook`, {
    method: "POST",
    headers: MEDICI_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Medici PreBook failed");
  return res.json();
}

export async function mediciBook(payload: any) {
  const res = await fetch(`${process.env.MEDICI_BASE_URL}/Book`, {
    method: "POST",
    headers: MEDICI_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Medici Book failed");
  return res.json();
}

export async function mediciCancel(payload: any) {
  const res = await fetch(`${process.env.MEDICI_BASE_URL}/CancelRoomDirectJson`, {
    method: "POST",
    headers: MEDICI_HEADERS,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Medici Cancel failed");
  return res.json();
}
