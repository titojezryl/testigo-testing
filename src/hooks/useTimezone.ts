import { useState } from "react"
import { useAxios } from "./useAxios"

export const useTimezone = () => {
  const [timezones, setTimezones] = useState([])
  const { $http } = useAxios()

  async function load () {
    try {
      const { data } = await $http.get('/timezones')
      setTimezones(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    timezones,
    load
  }
}
