import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { useAxios } from '~/hooks/useAxios'
import { AuthTokens } from '~/api-services/types'

interface User {
  id?: string
  name?: string
  email?: string
  first_name?: string
  last_name?: string
  role?: string
  role_name?: string
  active_roles?: string[]
  mfaEnabled?: boolean
}

interface AuthErrors {
  errors?: Record<string, any>
  [key: string]: any
}

interface AuthenticationState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  mfaEnabled: boolean
  user: User
  errors: AuthErrors
  activeRole: string
  authenticate: (tokens: AuthTokens, user: any) => void
  login: (username: string, password: string) => Promise<void>
  fetchAuthUser: () => Promise<void>
  setProfilePhoto: (userInfo: any) => void
  setUser: (data: any) => void
  setMfaEnabled: (mfaEnabled: boolean) => void
  logout: () => void
  clearError: (key: string) => void
  setActiveRole: (role: string) => void
  setTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthenticationStore = create<AuthenticationState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false as boolean,
      accessToken: null as string | null,
      refreshToken: null as string | null,
      mfaEnabled: false as boolean,
      user: {} as User,
      errors: {} as AuthErrors,
      activeRole: '' as string,

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken: accessToken, refreshToken: refreshToken })
      },

      setActiveRole: (role: string) => {
        set({ activeRole: role })
        Cookies.set('active_role', role, { expires: 30 })
      },

      authenticate: (tokens: AuthTokens, user: any) => {
        const activeRole = get().activeRole
        // Store tokens in session storage for useSession hook
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          mfaEnabled: user.mfaEnabled,
          user: {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role,
            role_name: user.roleName,
            active_roles: user.activeRoles,
            mfaEnabled: user.mfaEnabled,
          }
        })
      },

      login: async (username: string, password: string) => {
        try {
          const { $http } = useAxios()
          const { data } = await $http.post('/auth/login', { username, password })
          get().authenticate(data.tokens, data.user)
          window.location.href = `/${data.data.user.role}/dashboard`
        } catch (error: any) {
          set({ errors: error.response?.data || {} })
          throw error
        }
      },

      fetchAuthUser: async () => {
        try {
          const { $http } = useAxios()
          const { data } = await $http.get('/auth/user')
          if (data) {
            const activeRole = get().activeRole
            set({
              isAuthenticated: true,
              mfaEnabled: data.mfaEnabled,
              user: {
                id: data.id,
                name: data.firstName + ' ' + data.lastName,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                role: data.role,
                role_name: data.roleName,
                active_roles: data.activeRoles,
                mfaEnabled: data.mfaEnabled,
              }
            })
          }
        } catch (error) {
          console.log(error)
        }
      },

      setProfilePhoto: (userInfo: any) => {
        set((state) => ({
          user: {
            ...state.user,
            profile_photo_path: userInfo.profile_photo_path,
            profile_photo_url: userInfo.profile_photo_url
          }
        }))
      },

      setUser: (data: any) => {
        set((state) => ({
          user: {
            ...state.user,
            first_name: data.user.firstName,
            last_name: data.user.lastName,
            email: data.user.email,
            name: data.user.firstName + ' ' + data.user.lastName,
          }
        }))
      },

      setMfaEnabled: (mfaEnabled: boolean) => {
        set({ mfaEnabled: mfaEnabled })
      },

      logout: () => {
        // Clear session storage
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          mfaEnabled: false,
          user: {},
          errors: {}
        })
        Cookies.remove('active_role')
      },

      clearError: (key: string) => {
        set((state) => {
          if (state.errors.errors && state.errors.errors[key]) {
            const newErrors = { ...state.errors.errors }
            delete newErrors[key]
            return { errors: { ...state.errors, errors: newErrors } }
          }
          return state
        })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        mfaEnabled: state.mfaEnabled,
        user: state.user,
        activeRole: state.activeRole
      })
    }
  )
)
