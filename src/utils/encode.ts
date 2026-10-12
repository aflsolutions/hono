/**
 * @module
 * Encode utility.
 */

export const base64UrlDecode = (str: string): Uint8Array<ArrayBuffer> => {
  return base64Decode(str.replace(/_|-/g, (m) => ({ _: '/', '-': '+' })[m] ?? m))
}

export const base64UrlEncode = (buf: ArrayBufferLike, padding = true): string => {
  const encoded = base64Encode(buf).replace(/\/|\+/g, (m) => ({ '/': '_', '+': '-' })[m] ?? m)
  return padding ? encoded : encoded.replace(/=+$/, '')
}

// This approach is written in MDN.
// btoa does not support utf-8 characters. So we need a little bit hack.
export const base64Encode = (buf: ArrayBufferLike): string => {
  let binary = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0, len = bytes.length; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// atob does not support utf-8 characters. So we need a little bit hack.
export const base64Decode = (str: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(str)
  const bytes = new Uint8Array<ArrayBuffer>(new ArrayBuffer(binary.length))
  const half = binary.length / 2
  for (let i = 0, j = binary.length - 1; i <= half; i++, j--) {
    bytes[i] = binary.charCodeAt(i)
    bytes[j] = binary.charCodeAt(j)
  }
  return bytes
}
