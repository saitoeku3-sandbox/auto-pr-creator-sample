import atob from 'atob'

export const base64Encode = (...parts: string[]) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        const offset = result.indexOf(',') + 1
        resolve(result.slice(offset))
      }
    }
    reader.readAsDataURL(new Blob(parts))
  })
}

export const base64Decode = (text: string) => {
  return decodeURIComponent(escape(atob(text)))
}
