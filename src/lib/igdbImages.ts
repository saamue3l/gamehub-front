export enum IGDBImageSizes {
  COVER_SMALL = 'cover_small',
  SCREENSHOT_MEDIUM = 'screenshot_med',
  COVER_BIG = 'cover_big',
  LOGO_MEDIUM = 'logo_med',
  SCREENSHOT_BIG = 'screenshot_big',
  SCREENSHOT_HUGE = 'screenshot_huge',
  THUMBNAIL = 'thumb',
  MICRO = 'micro',
  HD_READY = '720p',
  HD = '1080p'
}

export function getImageSize(url: string, desiredImageSize: IGDBImageSizes) {
  return url.replace(/t_[^/]+/, `t_${desiredImageSize}`)
}
