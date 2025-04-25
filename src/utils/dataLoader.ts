const dataCache: Record<string, any> = {};

export async function loadData(
  apiUrl: string,
  maxRetries = 3,
  retryDelay = 1000
): Promise<any> {
  if (!apiUrl) {
    throw new Error(`No API URL provided`);
  }

  if (dataCache[apiUrl]) {
    console.log(`Cache hit for: ${apiUrl}`);
    return dataCache[apiUrl];
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetching data from: ${apiUrl} (Attempt ${attempt})`);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          `Fetch failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (
        data == null ||
        (typeof data === "object" &&
          !Array.isArray(data) &&
          Object.keys(data).length === 0)
      ) {
        throw new Error(`Received empty or invalid JSON`);
      }

      if (Array.isArray(data)) {
        console.log(`Received JSON array with ${data.length} items`);
      } else if (typeof data === "object") {
        console.log(
          `Received JSON object with ${Object.keys(data).length} keys`
        );
      }

      dataCache[apiUrl] = data;
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, retryDelay));
      } else {
        throw new Error(
          `Failed to load data from ${apiUrl} after ${maxRetries} attempts`
        );
      }
    }
  }
}
