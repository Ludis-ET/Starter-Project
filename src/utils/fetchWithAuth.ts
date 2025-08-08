// "use client";

// import { useSession, signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useCallback } from 'react';

// interface FetchOptions extends RequestInit {
//   headers?: Record<string, string>;
// }

// export const useFetchWithAuth = () => {
//   const { data: session, status, update } = useSession();
//   const router = useRouter();

//   const fetchWithAuth = useCallback(
//     async (url: string, options: FetchOptions = {}, maxRetries: number = 1): Promise<Response> => {
//       if (status !== 'authenticated' || !session?.accessToken) {
//         await signOut({ redirect: false });
//         router.push('/Signin');
//         throw new Error('You must be signed in to make this request');
//       }

//       let currentAccessToken = session.accessToken;

//       // Refresh if token near expiry
//       const currentTime = Math.floor(Date.now() / 1000);
//       if (session.exp && currentTime > session.exp - 30) {
//         const refreshedSession = await update();
//         if (!refreshedSession?.accessToken) {
//           await signOut({ redirect: false });
//           router.push('/Signin');
//           throw new Error('Session expired. Please sign in again.');
//         }
//         currentAccessToken = refreshedSession.accessToken;
//       }

//       const headers = {
//         ...options.headers,
//         Authorization: `Bearer ${currentAccessToken}`,
//       };

//       let response = await fetch(url, { ...options, headers });

//       // Retry once if unauthorized
//       if (response.status === 401 && session.refreshToken && maxRetries > 0) {
//         try {
//           const refreshedSession = await update();
//           if (!refreshedSession?.accessToken) {
//             throw new Error('Failed to refresh token');
//           }

//           const retryHeaders = {
//             ...options.headers,
//             Authorization: `Bearer ${refreshedSession.accessToken}`,
//           };
//           response = await fetch(url, { ...options, headers: retryHeaders });
//         } catch (error) {
//           console.error('Token refresh error:', error);
//           await signOut({ redirect: false });
//           router.push('/Signin');
//           throw new Error('Session expired. Please sign in again.');
//         }
//       }

//       return response;
//     },
//     [session, status, update, router]
//   );

//   return fetchWithAuth;
// };

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const useFetchWithAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const fetchWithAuth = useCallback(
    async (url: string, options: FetchOptions = {}, maxRetries: number = 1): Promise<Response> => {
      console.log('fetchWithAuth:', { url, status, session: session ? {
        email: session.user?.email,
        exp: session.exp,
        hasAccessToken: !!session.accessToken,
        hasRefreshToken: !!session.refreshToken,
        error: session.error,
      } : null });
      if (status !== 'authenticated' || !session?.accessToken) {
        console.error('Unauthenticated or missing accessToken');
        await signOut({ redirect: false });
        router.push('/Signin');
        throw new Error('You must be signed in to make this request');
      }

      let currentAccessToken = session.accessToken;
      const currentTime = Math.floor(Date.now() / 1000);

      if (session.exp && currentTime > session.exp - 30) {
        console.log('Token near expiry, refreshing...', { currentTime, exp: session.exp });
        const refreshedSession = await update();
        console.log('Refreshed session:', refreshedSession ? {
          email: refreshedSession.user?.email,
          exp: refreshedSession.exp,
          hasAccessToken: !!refreshedSession.accessToken,
          error: refreshedSession.error,
          errorDetails: refreshedSession.errorDetails,
        } : null);
        if (!refreshedSession?.accessToken) {
          console.error('Refresh failed: No access token');
          await signOut({ redirect: false });
          router.push('/Signin');
          throw new Error('Session expired. Please sign in again.');
        }
        currentAccessToken = refreshedSession.accessToken;
      }

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${currentAccessToken}`,
      };

      let response = await fetch(url, { ...options, headers });
      console.log('Initial response:', { status: response.status, url });

      if (response.status === 401 && session.refreshToken && maxRetries > 0) {
        console.log('401 received, attempting token refresh');
        try {
          const refreshedSession = await update();
          console.log('Refreshed session on 401:', refreshedSession ? {
            email: refreshedSession.user?.email,
            exp: refreshedSession.exp,
            hasAccessToken: !!refreshedSession.accessToken,
            error: refreshedSession.error,
            errorDetails: refreshedSession.errorDetails,
          } : null);
          if (!refreshedSession?.accessToken) {
            throw new Error('Failed to refresh token');
          }
          const retryHeaders = {
            ...options.headers,
            Authorization: `Bearer ${refreshedSession.accessToken}`,
          };
          response = await fetch(url, { ...options, headers: retryHeaders });
          console.log('Retry response:', { status: response.status, url });
        } catch (error) {
          console.error('Token refresh error:', error);
          await signOut({ redirect: false });
          router.push('/Signin');
          throw new Error('Session expired. Please sign in again.');
        }
      } else if (response.status === 401) {
        console.error('No refresh token or max retries exceeded');
        await signOut({ redirect: false });
        router.push('/Signin');
        throw new Error('Session expired. Please sign in again.');
      }

      return response;
    },
    [session, status, update, router]
  );

  return fetchWithAuth;
};