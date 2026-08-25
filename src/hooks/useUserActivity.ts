import { useRouterState } from '@tanstack/react-router'
import { useAxios } from './useAxios'

export const useUserActivity = () => {
  const { $http } = useAxios()

  const routerState = useRouterState()

  const createSession = async (
    eventName: string,
    action: string,
    modelType: string,
    modelId: string
  ) => {
    try {
      const { pathname, search } = routerState.location

      const data = {
        query: search,
        path: pathname,
      }

      const response = await $http.post('/user/session', {
        eventName,
        action,
        pageUrl: pathname,
        data,
        modelType,
        modelId,
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  return { createSession }
}
