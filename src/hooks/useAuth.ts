import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { useAxios } from './useAxios'
import { useAuthenticationStore } from '~/store/useAuthenticationStore'
import { AuthTokens } from '~/api-services/types'

interface LoginForm {
  email: string | null
  password: string | null
  // token: string
}

interface SignUpForm {
  firstName: string | null
  lastName: string | null
  email: string | null
  password: string | null
  confirmPassword: string | null
}

interface LoginResponse {
  tokens: AuthTokens
  user: any
  mfaRequired: boolean
}

interface SignUpResponse {
  tokens: AuthTokens
  user: any
}

interface UseAuthReturn {
  login: () => Promise<LoginResponse>
  loginForm: LoginForm
  signUp: () => Promise<SignUpResponse>
  signUpForm: SignUpForm
  signUpFormError: Record<string, any>
  loginFormError: Record<string, any>
  loading: boolean
  logout: () => Promise<void>
  setLoginForm: React.Dispatch<React.SetStateAction<LoginForm>>
  setLoginFormError: React.Dispatch<React.SetStateAction<Record<string, any>>>
  setSignUpForm: React.Dispatch<React.SetStateAction<SignUpForm>>
  setSignUpFormError: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate()
  const { authenticate, logout: authLogout } = useAuthenticationStore()

  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: null,
    password: null,
    // token: 'web_token'
  })
  const [signUpForm, setSignUpForm] = useState<SignUpForm>({ firstName: null, lastName: null, email: null, password: null, confirmPassword: null })
  const [loginFormError, setLoginFormError] = useState<Record<string, any>>({})
  const [signUpFormError, setSignUpFormError] = useState<Record<string, any>>({})
  const { $http } = useAxios()

  const login = useCallback(async (): Promise<LoginResponse> => {
    setLoading(true)
    try {
      const { data } = await $http.post('/auth/login', loginForm)
      return data
    } catch (error: any) {
      if(error?.response?.data?.errors) {
        setLoginFormError(error.response.data.errors)
      } else if (error?.response?.statusCode === 401) {
        setLoginFormError({ password: error.response.data.message })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [loginForm])

  const signUp = useCallback(async (): Promise<SignUpResponse> => {
    setLoading(true)
    try {
      const { data } = await $http.post('/auth/register', signUpForm)
      return data
    } catch (error: any) {
      if(error?.response?.data?.errors) {
        setSignUpFormError(error.response.data.errors)
      }
      if(error?.response?.statusCode === 401) {
        setSignUpFormError({ email: error.response.data.message })
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [signUpForm])

  const logout = useCallback(async () => {
    authLogout()
    Cookies.remove('active_role')
    navigate({ to: '/' })
  }, [authLogout, navigate])

  return {
    login,
    loginForm,
    setLoginFormError,
    signUpForm,
    signUpFormError,
    signUp,
    loginFormError,
    loading,
    logout,
    setLoginForm,
    setSignUpForm,
    setSignUpFormError
  }
}

