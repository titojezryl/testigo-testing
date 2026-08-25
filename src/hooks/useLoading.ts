import { useState } from "react"

export const useLoading = () => {
  const [loading, setLoading] = useState(false)

  function loadingStart () {
    setLoading(true)
  }

  function loadingStop () {
    setLoading(false)
  }

  return {
    loading,
    loadingStart,
    loadingStop
  }
}
