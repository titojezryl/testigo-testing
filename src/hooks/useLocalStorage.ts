export const useLocalStorage = () => {
  const getItem = (key : any) => {
    const value = localStorage.getItem(key)

    if (typeof value !== 'undefined' && value) {
      return value
    }
    return null
  }

  const getObject = (key : any) => {
    const value = localStorage.getItem(key)

    if (typeof value !== 'undefined' && value) {
      return JSON.parse(value)
    }
    return null
  }

  const setItem = (key : string, value: any) => {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, value)
    }
  }

  const removeItem = (key : string) => {
    localStorage.removeItem(key)
  }

  return {
    getItem,
    getObject,
    setItem,
    removeItem
  }
}
