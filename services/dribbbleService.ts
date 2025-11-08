import type { DribbbleShot } from '../types';

declare global {
  interface Window {
    proxy: {
      fetch: (args: { url: string; headers?: Record<string, string> }) => Promise<Response>;
    };
  }
}

const ACCESS_TOKEN = '1mkRtQT0L6OPD2VoAMtrkeazsa-fXWsTegYOr4nqFog';

export const searchDribbble = async (query: string): Promise<DribbbleShot[]> => {
  if (!query.trim()) {
    return [];
  }

  const url = `https://api.dribbble.com/v2/search/shots?q=${encodeURIComponent(query)}&per_page=30`;

  try {
    const response = await window.proxy.fetch({
      url,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Dribbble API Error:', errorBody.message || response.statusText);
      throw new Error(errorBody.message || `Failed to fetch from Dribbble. Status: ${response.status}`);
    }

    const data = await response.json();
    return data as DribbbleShot[];
  } catch (error) {
    console.error('Error searching Dribbble:', error);
    throw error;
  }
};
