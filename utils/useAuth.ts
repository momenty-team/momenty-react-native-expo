import { useState, useEffect } from 'react';
import { getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken, removeAccessToken, removeRefreshToken } from '@/utils/tokenStorage';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      const storedAccessToken = await getAccessToken();
      const storedRefreshToken = await getRefreshToken();
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    };
    loadTokens();
  }, []);

  const setTokens = async (newAccessToken: string, newRefreshToken: string) => {
    await saveAccessToken(newAccessToken);
    await saveRefreshToken(newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
  };

  const clearTokens = async () => {
    await removeAccessToken();
    await removeRefreshToken();
    setAccessToken(null);
    setRefreshToken(null);
  };

  return { accessToken, refreshToken, setTokens, clearTokens };
};
