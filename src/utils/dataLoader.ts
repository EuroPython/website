const mode = import.meta.env.MODE;
export async function loadData(apiUrl: any) {
  if (!apiUrl) {
    console.warn(`No API URL provided`);
    return {};
  }

  try {
    console.log(`Fetching data from: ${apiUrl}`);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error loading data:`, error);
    return {};
  }
}
