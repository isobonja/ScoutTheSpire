import axios, { AxiosInstance } from 'axios';
import RateLimit from 'axios-rate-limit';
import { SPIRE_CODEX_API_URL, SPIRE_CODEX_RATE_LIMIT } from '../shared/constants';
import type { BadgeData } from '../shared/types/badges';
import type { ImageFileCategory } from '../shared/types/images';

const http: AxiosInstance = RateLimit(
  axios.create({ 
    baseURL: SPIRE_CODEX_API_URL 
  }), 
  { maxRequests: 1, perMilliseconds: SPIRE_CODEX_RATE_LIMIT }
);

async function fetchBadgeData(): Promise<BadgeData[]> {
  try {
    const res = await http.get('/badges');
    return res.data;
  } catch (error) {
    console.error('Error fetching badge data:', error);
    throw error;
  }
}

async function fetchImagesJSON(): Promise<ImageFileCategory[]> { 
  try {
    const res = await http.get('/images');
    return res.data;
  } catch (error) {
    console.error('Error fetching image data:', error);
    throw error;
  }
}

async function fetchExternalImage(url: string): Promise<Buffer> {
  try {
    const res = await http.get(
      url,
      {
        responseType: "arraybuffer",
      }
    );
    return Buffer.from(res.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

export { fetchBadgeData, fetchImagesJSON, fetchExternalImage };