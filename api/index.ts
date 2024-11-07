const API_KEY = "46895701-b1f5ec3d3a5ef61339eee2858";
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

export const apiCall = async (params: any) => {
  try {
    const res = await fetch(formatUrl(params));
    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    console.log("got error", error.message);
    return { success: false, msg: error.message };
  }
};

function formatUrl(params: any): string {
  // Start with the base URL and default parameters
  let url = `${apiUrl}&per_page=25&safesearch=true&editors_choice=true`;

  if (params) {
    // Add each param as a URL parameter, encoding the 'q' (query) value
    Object.keys(params).forEach((key) => {
      const value = key === "q" ? encodeURIComponent(params[key]) : params[key];
      url += `&${key}=${value}`;
    });
  }

  return url;
}
