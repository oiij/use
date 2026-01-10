import type { Group, LoadingManager, MeshStandardMaterialParameters, Object3DEventMap, Texture } from 'three'
import { CubeTextureLoader, MeshStandardMaterial, TextureLoader } from 'three'

import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { isMesh } from './index'

type LoaderOptions = {
  manager?: LoadingManager
  onProgress?: (event: ProgressEvent) => void
}
type GLTFLoaderOptions = LoaderOptions & {
  draco?: boolean
  dracoDecoderPath?: string
}
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

type OBJLoaderOptions = LoaderOptions & {
  mapPath?: string
  meshOptions?: MeshStandardMaterialParameters
}
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

type TextureLoaderOptions = LoaderOptions & {

}
type PathMapsKeys = 'map' | 'alphaMap' | 'normalMap' | 'bumpMap' | 'displacementMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap' | 'envMap' | 'iridescenceMap' | 'emissiveMap' | 'clearcoatMap' | 'sheenMap' | 'gradientMap' | 'matcap'

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

type CubeTextureLoaderOptions = LoaderOptions & {

}
export async function useCubeTextureLoader(paths: string[], options?: CubeTextureLoaderOptions) {
  const { manager, onProgress } = options ?? {}
  const loader = new CubeTextureLoader(manager)
  const cubeTexture = await loader.loadAsync(paths, onProgress)
  return {
    loader,
    cubeTexture,
  }
}
