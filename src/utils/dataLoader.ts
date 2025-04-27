// Define a more specific response type or use generics
type DataResponse = unknown;

const dataCache: Record<string, DataResponse> = {};
const inFlightCache: Record<string, Promise<DataResponse>> = {};

export async function loadData(
  apiUrl: string,
  maxRetries = 3,
  retryDelay = 1000
): Promise<DataResponse> {
  if (!apiUrl) {
    throw new Error(`No API URL provided`);
  }

  if (dataCache[apiUrl]) {
    console.log(`✅ Cache hit for: ${apiUrl}`);
    return dataCache[apiUrl];
  }

  if (inFlightCache[apiUrl]) {
    console.log(`⏳ Waiting for in-flight fetch of: ${apiUrl}`);
    return inFlightCache[apiUrl];
  }

  const fetchPromise = (async () => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📡 Fetching data from: ${apiUrl} (Attempt ${attempt})`);
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
          console.log(`📦 Received JSON array with ${data.length} items`);
        } else if (typeof data === "object") {
          console.log(
            `📦 Received JSON object with ${Object.keys(data).length} keys`
          );
        }

        // Store in final cache
        dataCache[apiUrl] = data;
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`❌ Attempt ${attempt} failed:`, error);

        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, retryDelay));
        } else {
          throw new Error(
            `Failed to load data from ${apiUrl} after ${maxRetries} attempts: ${lastError.message}`,
            { cause: lastError }
          );
        }
      }
    }

    // This ensures TypeScript knows we always return something or throw
    throw new Error(`Unexpected execution path in loadData for ${apiUrl}`);
  })();

  // Store the in-flight promise
  inFlightCache[apiUrl] = fetchPromise;

  try {
    return await fetchPromise;
  } finally {
    // Remove from in-flight cache once done
    delete inFlightCache[apiUrl];
  }
}
