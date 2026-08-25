import axios, { AxiosInstance } from 'axios'
import { useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthenticationStore } from '~/store/useAuthenticationStore'
import { toast } from 'sonner'
import { TokenUtils } from '~/api-services/token.utils'

interface UseAxiosReturn {
  $http: AxiosInstance
  fetchData: <T>(url: string, params?: object) => Promise<T>
}

export const useAxios = (): UseAxiosReturn => {
  const navigate = useNavigate()
  const authStore = useAuthenticationStore()

  const $http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })

  // Add a request interceptor
  $http.interceptors.request.use(
    async function (config) {
      const token = authStore.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`

        // Only refresh if token is about to expire (within 5 minutes)
        if (TokenUtils.willExpireSoon(token, 5)) {
          try {
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
            const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
              refreshToken: authStore.refreshToken
            }, {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${authStore.accessToken}`
              }
            })

            const { accessToken, refreshToken } = refreshResponse.data || {}

            if (accessToken && refreshToken) {
              authStore.setTokens(accessToken, refreshToken)
              // Update the Authorization header with new token
              config.headers.Authorization = `Bearer ${accessToken}`
            }
          } catch (refreshError: any) {
            // If refresh fails, fall through to logout handling below
            console.log('Refresh token request failed:', refreshError?.response || refreshError)
          }
        }
      }


      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  $http.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {

      // Only redirect if already authenticated and session expires or refresh fails
      // Don't redirect on login failures (401 from /auth/login endpoint)
      if (error && error.response && error.response.status === 401 && authStore.isAuthenticated) {
        toast.error('Your session has expired. Please log in again.', {
          position: 'top-right'
        })
        authStore.logout()
        navigate({ to: '/auth/signin' })
      }

      if (error.response?.status === 429) {
        toast.error('Too many requests. Please try again later.', {
          position: 'top-right'
        })
      }

      return Promise.reject(error)
    }
  )

  const fetchData = useCallback(<T,>(url: string, params?: object): Promise<T> => {
    return new Promise((resolve, reject) => {
      $http
        .get(url, {
          params
        })
        .then((data) => {
          if (data.data && data.data.data) {
            resolve(data.data.data)
          } else {
            resolve(data.data)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }, [$http])

  return {
    $http,
    fetchData
  }
}

