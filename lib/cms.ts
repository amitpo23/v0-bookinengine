// lib/cms.ts

export async function fetchRoomsFromCMS(hotelId: string) {
  const res = await fetch(`${process.env.CMS_BASE_URL}/hotels/${hotelId}/rooms`);
  if (!res.ok) throw new Error("Failed to fetch CMS rooms");
  return res.json();
}
