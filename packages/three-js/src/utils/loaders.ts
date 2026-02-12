import type { Group, LoadingManager, MeshStandardMaterialParameters, Object3DEventMap, Texture } from 'three'
import { CubeTextureLoader, MeshStandardMaterial, TextureLoader } from 'three'

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { isMesh } from './index'

/**
 * 加载器选项
 */
type LoaderOptions = {
  /**
   * 加载管理器
   */
  manager?: LoadingManager
  /**
   * 进度回调
   */
  onProgress?: (event: ProgressEvent) => void
}

/**
 * GLTF 加载器选项
 */
type GLTFLoaderOptions = LoaderOptions & {
  /**
   * 是否使用 DRACO 压缩
   */
  draco?: boolean
  /**
   * DRACO 解码器路径
   */
  dracoDecoderPath?: string
}

/**
 * 加载 GLTF 模型
 *
 * @param path - 模型路径
 * @param options - 加载器选项
 * @returns 加载器实例、DRACO 加载器实例和 GLTF 模型
 *
 * @example
 * ```ts
 * import { gltfLoader } from '@oiij/three-js/utils'
 *
 * const { gltf } = await gltfLoader('model.gltf', {
 *   draco: true,
 *   onProgress: (event) => {
 *     console.log(`加载进度: ${Math.round((event.loaded / event.total) * 100)}%`)
 *   }
 * })
 *
 * // 添加到场景
 * scene.add(gltf.scene)
 * ```
 */
export async function gltfLoader(path: string, options?: GLTFLoaderOptions) {
  const { draco, dracoDecoderPath, manager, onProgress } = options ?? {}
  const loader = new GLTFLoader(manager)
  const dracoLoader = new DRACOLoader()
  dracoLoader.setPath(dracoDecoderPath ?? 'https://www.gstatic.com/draco/versioned/decoders/1.4.3/')
  if (draco) {
    loader.setDRACOLoader(dracoLoader)
  }
  const gltf = await loader.loadAsync(path, onProgress)
  return {
    loader,
    dracoLoader,
    gltf,
  }
}

/**
 * OBJ 加载器选项
 */
type OBJLoaderOptions = LoaderOptions & {
  /**
   * 纹理路径
   */
  mapPath?: string
  /**
   * 网格材质选项
   */
  meshOptions?: MeshStandardMaterialParameters
}

/**
 * 加载 OBJ 模型
 *
 * @param path - 模型路径
 * @param options - 加载器选项
 * @returns 加载器实例、OBJ 模型和纹理
 *
 * @example
 * ```ts
 * import { objLoader } from '@oiij/three-js/utils'
 *
 * // 带纹理的模型
 * const { obj } = await objLoader('model.obj', {
 *   mapPath: 'texture.jpg',
 *   meshOptions: {
 *     metalness: 0.5,
 *     roughness: 0.5
 *   }
 * })
 *
 * // 添加到场景
 * scene.add(obj)
 * ```
 */
export async function objLoader(path: string, options: OBJLoaderOptions & { mapPath: string }): Promise<{ loader: OBJLoader, obj: Group<Object3DEventMap>, map: Texture }>
export async function objLoader(path: string, options?: OBJLoaderOptions & { mapPath?: never }): Promise<{ loader: OBJLoader, obj: Group<Object3DEventMap>, map: null }>
export async function objLoader(path: string, options?: OBJLoaderOptions) {
  const { manager, onProgress, mapPath, meshOptions } = options ?? {}
  const loader = new OBJLoader(manager)
  let map: Texture | null = null
  if (mapPath) {
    map = (await textureLoader(mapPath)).texture
  }
  const obj = await loader.loadAsync(path, onProgress)
  if (map) {
    obj.traverse((child) => {
      if (isMesh(child)) {
        child.material = new MeshStandardMaterial({
          map,
          ...meshOptions,
        })
      }
    })
  }

  return {
    loader,
    obj,
    map,
  }
}

/**
 * 纹理加载器选项
 */
type TextureLoaderOptions = LoaderOptions & {

}

/**
 * 纹理路径键
 */
type PathMapsKeys = 'map' | 'alphaMap' | 'normalMap' | 'bumpMap' | 'displacementMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap' | 'envMap' | 'iridescenceMap' | 'emissiveMap' | 'clearcoatMap' | 'sheenMap' | 'gradientMap' | 'matcap'

/**
 * 加载纹理
 *
 * @param path - 纹理路径，可以是单个路径、路径数组或路径映射
 * @param options - 加载器选项
 * @returns 加载器实例和纹理
 *
 * @example
 * ```ts
 * import { textureLoader } from '@oiij/three-js/utils'
 *
 * // 加载单个纹理
 * const { texture } = await textureLoader('texture.jpg')
 *
 * // 加载多个纹理
 * const { texture: textures } = await textureLoader(['texture1.jpg', 'texture2.jpg'])
 *
 * // 加载材质纹理
 * const { texture: materialTextures } = await textureLoader({
 *   map: 'diffuse.jpg',
 *   normalMap: 'normal.jpg',
 *   roughnessMap: 'roughness.jpg'
 * })
 * ```
 */
export async function textureLoader(path: string, options?: TextureLoaderOptions): Promise<{ loader: TextureLoader, texture: Texture<HTMLImageElement> }>
export async function textureLoader(path: string[], options?: TextureLoaderOptions): Promise<{ loader: TextureLoader, texture: Texture<HTMLImageElement>[] }>
export async function textureLoader(path: Partial<Record<PathMapsKeys, string>>, options?: TextureLoaderOptions): Promise<{ loader: TextureLoader, texture: Partial<Record<PathMapsKeys, Texture<HTMLImageElement>>> }>
export async function textureLoader(path: string | string[] | Partial<Record<PathMapsKeys, string>>, options?: TextureLoaderOptions) {
  const { manager, onProgress } = options ?? {}
  const loader = new TextureLoader(manager)

  if (typeof path === 'string') {
    return {
      loader,
      texture: await loader.loadAsync(path, onProgress),
    }
  }
  if (Array.isArray(path)) {
    return {
      loader,
      texture: await Promise.all(path.map(m => loader.loadAsync(m, onProgress))),
    }
  }
  if (typeof path === 'object') {
    const paths = Object.entries(path).map(([key, path]) => loader.loadAsync(path, onProgress).then(texture => [key, texture] as const))
    return {
      loader,
      texture: await Promise.all(paths).then(entries => Object.fromEntries(entries)),
    }
  }
}

/**
 * 立方体贴图加载器选项
 */
type CubeTextureLoaderOptions = LoaderOptions & {

}

/**
 * 加载立方体贴图
 *
 * @param paths - 立方体贴图路径数组
 * @param options - 加载器选项
 * @returns 加载器实例和立方体贴图
 *
 * @example
 * ```ts
 * import { useCubeTextureLoader } from '@oiij/three-js/utils'
 *
 * const { cubeTexture } = await useCubeTextureLoader([
 *   'posx.jpg', 'negx.jpg',
 *   'posy.jpg', 'negy.jpg',
 *   'posz.jpg', 'negz.jpg'
 * ])
 *
 * // 设置为场景环境
 * scene.environment = cubeTexture
 * ```
 */
export async function useCubeTextureLoader(paths: string[], options?: CubeTextureLoaderOptions) {
  const { manager, onProgress } = options ?? {}
  const loader = new CubeTextureLoader(manager)
  const cubeTexture = await loader.loadAsync(paths, onProgress)
  return {
    loader,
    cubeTexture,
  }
}
