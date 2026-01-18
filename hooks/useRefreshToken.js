import axios from "../utils/axios";
import useAuth from "./useAuth";
const USER_REFRESH_TOKEN_ENDPOINT = "/api/user/refreshToken";
const RESTAURANT_REFRESH_TOKEN_ENDPOINT = "/api/restaurant/refreshToken";

/**
 * @desc   Use refresh token endpoint
 */
const useRefreshToken = () => {
  const { setAuth } = useAuth();
  let endpoint;
  let accountType;

  if (typeof window !== "undefined") {
    accountType = localStorage.getItem("accountType");
  }

  if (accountType === "User") {
    endpoint = USER_REFRESH_TOKEN_ENDPOINT;
  } else if (accountType === "Restaurant") {
    endpoint = RESTAURANT_REFRESH_TOKEN_ENDPOINT;
  } else {
    return;
  }

  const refresh = async () => {
    try {
      const response = await axios.get(endpoint, {
        withCredentials: true,
      });

      if (response.data?.accessToken) {
        setAuth((prev) => ({ ...prev, accessToken: response.data.accessToken }));
        return response.data.accessToken;
      }
      throw new Error("No access token in response");
    } catch (error) {
      console.error("Refresh token error:", error.response?.data || error.message);
      // If refresh fails, clear auth state
      setAuth((prev) => ({ ...prev, accessToken: null }));
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
