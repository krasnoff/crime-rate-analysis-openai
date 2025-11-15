import 'dotenv/config';

export async function getCoords(location: string): Promise<{ lat: number; lon: number }> {
    const apiKey = process.env.OPENWEATHER_API_KEY; // Secure this with environment variables
    const baseUrl = process.env.OPENWEATHER_BASE_URL_DIRECT;
    const url = `${baseUrl}?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch coordinates: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.length === 0) {
        throw new Error('Location not found');
    }

    return {
        lat: data[0].lat,
        lon: data[0].lon,
    };
}
