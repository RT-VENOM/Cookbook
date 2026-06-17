// src/lib/api.js

/**
 * A helper function to process the backend's response.
 * If the backend sends an error (like "Username taken"), this forces React to catch it.
 */
async function handleResponse(response) {
  const data = await response.json();
  
  // If the status code is 400 or 500, throw the error message we wrote in the backend
  if (!response.ok) {
    throw new Error(data.error || data.message || "An unexpected error occurred");
  }
  
  return data;
}

/**
 * Used for fetching data (e.g., checking if a username exists)
 */
export async function getRequest(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`[GET] Failed at ${url}:`, error);
    throw error; // Re-throw so your React components can show error messages
  }
}

/**
 * Used for sending secure data (e.g., registering or logging in)
 */
export async function postRequest(url, payload) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tells the backend to expect JSON
      },
      // Convert our JavaScript object into a JSON string for the network
      body: JSON.stringify(payload), 
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`[POST] Failed at ${url}:`, error);
    throw error;
  }
}