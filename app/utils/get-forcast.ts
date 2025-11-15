import { ForcastObject } from '../interface/forcast-array';
import 'dotenv/config';

export async function getForcast(lat: number, lon: number): Promise<ForcastObject> {
    const apiKey = process.env.OPENWEATHER_API_KEY; // Secure this with environment variables
    const baseUrl = process.env.OPENWEATHER_BASE_URL;
    const url = `${baseUrl}/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&units=metric&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch forcast: ${response.statusText}`);
    }

    const data = await response.json() as ForcastObject;

    return data;
}