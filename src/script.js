import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from "lil-gui"

THREE.ColorManagement.enabled = false

// Debug
const gui = new GUI()

// Textures
const textureLoader = new THREE.TextureLoader()

const baseTexture = textureLoader.load("/owntexture/BaseTexture.jpg")
const middleTexture = textureLoader.load("/owntexture/MiddleTexture.jpg")
const topTexture = textureLoader.load("/owntexture/TopTexture.jpg")

const alphaBaseTexture = textureLoader.load("/owntexture/AlphaBase.jpg")
const alphaMiddleTexture = textureLoader.load("/owntexture/AlphaMiddle.jpg")
const alphaTopTexture = textureLoader.load("/owntexture/AlphaTop.jpg")

const gradientTexture = textureLoader.load("/textures/gradients/3.jpg")

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Material 
// Materiale Base
const materialBase = new THREE.MeshPhongMaterial()
materialBase.map = baseTexture
materialBase.aoMapIntensity = 1
materialBase.displacementScale = 0.2
materialBase.normalScale.set(0.5, 0.5)
materialBase.transparent = true
materialBase.shininess = 100
materialBase.alphaMap = alphaBaseTexture

// MaterialMiddle
const materialMiddle = new THREE.MeshStandardMaterial()
materialMiddle.map = middleTexture
materialMiddle.aoMapIntensity = 1
materialMiddle.roughness = 0.4
materialMiddle.alphaMap = alphaMiddleTexture
materialMiddle.normalScale.set(0.5, 0.5)
materialMiddle.transparent = true

// MaterialeTop
const materialTop = new THREE.MeshStandardMaterial()
materialTop.map = topTexture
materialTop.aoMapIntensity = 1
materialTop.alphaMap = alphaTopTexture
materialTop.normalScale.set(0.5, 0.5)
materialTop.transparent = true

// Gui 
// gui.add(material, "displacementScale").min(0).max(5).step(0.01)

// Objects

const planeBase = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.2, 100, 100),
    materialBase
)

const planeMiddle = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.2, 100, 100),
    materialMiddle
)

const planeTop = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.2, 100, 100),
    materialTop
)

planeBase.position.z = 0
planeMiddle.position.z = 0.05
planeTop.position.z = 0.10

// Ambient light 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Pointer light 
const pointLight = new THREE.PointLight(0x00ffff, 0.5)
pointLight.position.x = 1
pointLight.position.y = 1
pointLight.position.z = 5
scene.add(pointLight)

scene.add(planeBase, planeMiddle, planeTop)

/**
 * Cursor 
 */
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)

    console.log(cursor.x, cursor.y)
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera

// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1,)

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1.5
camera.lookAt(planeTop.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // plane.rotation.y = 0.15 * elapsedTime

    // Update camera
    camera.position.x = cursor.x
    camera.position.y = cursor.y

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()