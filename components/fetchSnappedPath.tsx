async function fetchSnappedPath(
  coords: { latitude: number; longitude: number }[],
  apiKey: string
): Promise<{ latitude: number; longitude: number }[]> {
  const body = {
    coordinates: coords.map(({ latitude, longitude }) => [longitude, latitude]),
    instructions: false,
  };

  const res = await fetch('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  const coordinates: [number, number][] = json.features[0].geometry.coordinates;

  return coordinates.map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));
}
