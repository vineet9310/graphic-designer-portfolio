const apiBaseUrl = '/api';

/**
 * Perform a fetch request to the Next.js API route.
 * Encapsulates the request headers and handles authorization tokens.
 */
const api = async (endpoint, options = {}) => {
  const url = `${apiBaseUrl}${endpoint}`;
  
  const headers = {
    ...options.headers,
  };

  // Attach JWT token if it exists in local storage
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('adminToken');
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Determine if it's a FormData request or JSON
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions = {
    cache: 'no-store', // Disable Next.js data cache to prevent stale API responses
    ...options,
    headers,
  };

  // Convert JSON body to string
  if (options.body && !isFormData && typeof options.body === 'object') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    // Check if the response is JSON or empty
    const contentType = response.headers.get('content-type');
    let json = {};
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    } else {
      const text = await response.text();
      json = { success: response.ok, message: text };
    }

    if (!response.ok) {
      const errorMsg = json.message || 'Something went wrong';
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = json;
      throw error;
    }

    return json;
  } catch (error) {
    // Only log server errors (5xx) or unexpected network/runtime failures
    if (!error.status || error.status >= 500) {
      console.error(`API Fetch Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
    }
    throw error;
  }
};

export default api;
