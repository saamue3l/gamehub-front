import { httpBackend } from '@/lib/utils'

const BASE_CLASS = 'max-w-full max-h-[500px] my-3 rounded'

export const MEDIAS_HTML = {
  VIDEO: (info: LinkExport, classNames?: string) =>
    `<video controls class="block ${BASE_CLASS} ${classNames}"><source src="${info.url}">Votre navigateur ne supporte pas la vidéo.</video>`,
  AUDIO: (info: LinkExport, classNames?: string) =>
    `<audio controls class="block ${BASE_CLASS} ${classNames}"><source src="${info.url}">Votre navigateur ne supporte pas l'audio.</audio>`,
  IMAGE: (info: LinkExport, classNames?: string) =>
    `<a href="${info.url}" target="_blank" class="inline-block ${BASE_CLASS} ${classNames}"><img src="${info.images && info.images[0] ? info.images[0] : info.url}" alt="${info.description ?? 'image'}" class="${BASE_CLASS}" /></a>`,
  LINK: (info: LinkExport, classNames?: string) => {
    let linkHtml = `<a href="${info.url}" class="group/link ${classNames}" target="_blank">`
    const addFavicon = info.favicons?.length > 0
    if (addFavicon) {
      linkHtml += `<img src="${info.favicons[0]}" class="inline-block w-4 h-4 rounded-full mr-1 group-hover/link:brightness-75" style="vertical-align: sub;"/>`
    }
    linkHtml += `${info.title != null && info.title != '' ? info.title : info.url}</a>`
    return linkHtml
  }
}

export const MEDIA_TYPES = {
  'video.other': MEDIAS_HTML.IMAGE, // Can be gif
  image: MEDIAS_HTML.IMAGE,
  audio: MEDIAS_HTML.AUDIO,
  video: MEDIAS_HTML.VIDEO,
  application: MEDIAS_HTML.LINK,
  website: MEDIAS_HTML.LINK
}


export async function textToMedia(text: string, classNames?: string): Promise<string> {
  const url = text.trim()
  if (!url) return text
  let linkResponse: LinkExport
  let media: Function = MEDIAS_HTML.LINK
  try {
    linkResponse = await getLinkPreview(url)
    media = MEDIA_TYPES[linkResponse.mediaType]
  } catch (_) {
    return text
  }
  if (!media) return MEDIAS_HTML.LINK({ url: url } as LinkExport, classNames)
  return media(linkResponse, classNames)
}

async function getLinkPreview(url: string) {
  return httpBackend<LinkExport>(`/api/link-preview?url=${encodeURIComponent(url)}`)
}

type LinkExport =
  | {
      url: string
      title: string
      siteName: string | undefined
      description: string | undefined
      mediaType: string
      contentType: string | undefined
      images: string[]
      videos: {
        url: string | undefined
        secureUrl: string | null | undefined
        type: string | null | undefined
        width: string | undefined
        height: string | undefined
      }[]
      favicons: string[]
    }
  | {
      charset: string | null
      url: string
      mediaType: string
      contentType: string
      favicons: string[]
    }
  | {
      charset: string | null
      url: string
      title: string
      siteName: string | undefined
      description: string | undefined
      mediaType: string
      contentType: string | undefined
      images: string[]
      videos: {
        url: string | undefined
        secureUrl: string | null | undefined
        type: string | null | undefined
        width: string | undefined
        height: string | undefined
      }[]
      favicons: string[]
    }
