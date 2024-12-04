const BASE_CLASS = 'max-w-full max-h-[500px] my-3 rounded'
const URL_PLACEHOLDER = 'URL_PLACEHOLDER'

export enum MEDIAS_HTML {
  VIDEO = `<video controls class="block ${BASE_CLASS}"><source src="${URL_PLACEHOLDER}">Your browser does not support the video tag.</video>`,
  IMAGE = `<a href="${URL_PLACEHOLDER}" target="_blank" class="inline-block ${BASE_CLASS}"><img src="${URL_PLACEHOLDER}" alt="Image" class="${BASE_CLASS}" /></a>`,
  LINK = `<a href="${URL_PLACEHOLDER}" class="text-primary hover:text-blue-700 transition ${BASE_CLASS}" target="_blank">${URL_PLACEHOLDER}</a>`
}

export enum MEDIA_FORMATS {
  JPG = MEDIAS_HTML.IMAGE,
  PNG = MEDIAS_HTML.IMAGE,
  GIF = MEDIAS_HTML.IMAGE,
  MP4 = MEDIAS_HTML.VIDEO,
  WEBM = MEDIAS_HTML.VIDEO,
  LINK = MEDIAS_HTML.LINK
}

export const fileFormats = {
  jpg: MEDIA_FORMATS.JPG,
  jpeg: MEDIA_FORMATS.JPG,
  png: MEDIA_FORMATS.PNG,
  gif: MEDIA_FORMATS.GIF,
  mp4: MEDIA_FORMATS.MP4,
  webm: MEDIA_FORMATS.WEBM
}

/**
 * Replace url to corresponding media format
 * @param text a url as string
 */
export async function textToMedia(text: string) {
  const url = text.trim()
  // Get the extension of the file
  let extension = url.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/)?.[1]?.toLowerCase()
  if (!extension) {
    // If the extension is not found in the url, fetch the url to see what format it is
    extension = await fetchUrlToGetFormat(url)
  }
  let media: string
  if (extension) {
    media = fileFormats[extension as keyof typeof fileFormats] || MEDIA_FORMATS.LINK
  } else {
    media = MEDIA_FORMATS.LINK
  }
  return media.replace(new RegExp(URL_PLACEHOLDER, 'g'), url)
}

/**
 * Fetch the url to get the format of the media (use the content-type header)
 * @param url a url as string
 */
async function fetchUrlToGetFormat(url: string) {
  try {
    const response = await fetch(url)

    const contentType = response.headers.get('content-type')
    const extension = contentType?.split('/')[1]
    return extension
  } catch (error) {
    return undefined
  }
}
