import type { ChatAttachment } from './types'

/**
 * 预签名直传目标
 * 描述业务后端为单个文件签发的上传地址，以及上传完成后的可访问地址
 */
export type ChatUploadTarget = {
  /** 预签名直传地址，无默认值（必填） */
  url: string
  /** 上传完成后文件的可访问地址，不要使用带签名的直传地址，无默认值（必填） */
  publicUrl: string
  /** 上传请求方法，默认为 'PUT' */
  method?: 'PUT' | 'POST'
  /** 直传请求头（如 Content-Type、x-oss-*），默认为 undefined */
  headers?: Record<string, string>
  /** POST 表单字段（如 policy、signature），默认为 undefined */
  fields?: Record<string, string>
  /** 附件补充信息（id、宽高、时长、缩略图），默认为 undefined */
  attachment?: Partial<ChatAttachment>
}

/**
 * 预签名回调
 * 接收待上传文件，返回业务后端签发的直传目标
 */
export type ChatUploadPresign = (file: File) => ChatUploadTarget | Promise<ChatUploadTarget>

/**
 * 文件直传配置
 */
export type ChatUploadOptions = {
  /** 预签名回调，无默认值（必填） */
  presign: ChatUploadPresign
  /** 上传进度回调，参数为 0-100 的百分比，默认为 undefined */
  onProgress?: (percent: number) => void
}

function createAttachmentId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function hasHeader(headers: Record<string, string> | undefined, name: string): boolean {
  if (!headers) {
    return false
  }
  return Object.keys(headers).some(key => key.toLowerCase() === name)
}

function createFormData(file: File, target: ChatUploadTarget): FormData {
  const form = new FormData()
  for (const [key, value] of Object.entries(target.fields ?? {})) {
    form.append(key, value)
  }
  form.append('file', file)
  return form
}

function toAttachment(file: File, target: ChatUploadTarget): ChatAttachment {
  return {
    ...target.attachment,
    id: target.attachment?.id ?? createAttachmentId(),
    url: target.publicUrl,
    mimeType: target.attachment?.mimeType ?? (file.type || 'application/octet-stream'),
    size: file.size,
    name: target.attachment?.name ?? file.name,
  }
}

function uploadWithXhr(
  file: File,
  target: ChatUploadTarget,
  onProgress: ((percent: number) => void) | undefined,
): Promise<ChatAttachment> {
  return new Promise((resolve, reject) => {
    const method = target.method ?? 'PUT'
    const xhr = new XMLHttpRequest()
    xhr.open(method, target.url)
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100))
        }
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(toAttachment(file, target))
        return
      }
      reject(new Error(`upload failed with status ${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error('upload failed'))
    if (method === 'POST') {
      xhr.send(createFormData(file, target))
      return
    }
    for (const [key, value] of Object.entries(target.headers ?? {})) {
      xhr.setRequestHeader(key, value)
    }
    if (!hasHeader(target.headers, 'content-type')) {
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    }
    xhr.send(file)
  })
}

async function uploadWithFetch(
  file: File,
  target: ChatUploadTarget,
  onProgress: ((percent: number) => void) | undefined,
): Promise<ChatAttachment> {
  const method = target.method ?? 'PUT'
  const response = await fetch(target.url, method === 'POST'
    ? { method, body: createFormData(file, target) }
    : {
        method,
        body: file,
        headers: { 'Content-Type': file.type || 'application/octet-stream', ...target.headers },
      })
  if (!response.ok) {
    throw new Error(`upload failed with status ${response.status}`)
  }
  onProgress?.(100)
  return toAttachment(file, target)
}

/**
 * 通过预签名地址直传文件
 *
 * 先调用业务提供的 presign 获取直传目标，再把文件直接上传到对象存储，
 * 成功后返回可直接写入消息的附件描述。浏览器环境使用 XMLHttpRequest 以支持进度回调，
 * 非浏览器环境回退到 fetch。
 *
 * @example
 * ```ts
 * const attachment = await uploadChatFile(file, {
 *   presign: async (file) => {
 *     const response = await fetch('/api/presign', {
 *       method: 'POST',
 *       body: JSON.stringify({ name: file.name, type: file.type }),
 *     })
 *     return response.json()
 *   },
 *   onProgress: percent => console.log(`上传进度 ${percent}%`),
 * })
 * ```
 */
export async function uploadChatFile(file: File, options: ChatUploadOptions): Promise<ChatAttachment> {
  const target = await options.presign(file)
  if (typeof XMLHttpRequest === 'undefined') {
    return uploadWithFetch(file, target, options.onProgress)
  }
  return uploadWithXhr(file, target, options.onProgress)
}
