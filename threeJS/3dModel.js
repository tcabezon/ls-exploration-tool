
/*inpired by
https://tonybox.net/posts/simple-stl-viewer/
parameter to change: camera.position.z = largestDimension * 3;
scene.background = new THREE.Color( 0xf4f4f4  );
*/
// console.log('in stlLoader ')

function OBJViewer_Rotate(model, elementID) {
    // console.log('----->in STL Viewer<-----')
    // console.log(model,elementID)
    var elem = document.getElementById(elementID)

    
    const scene = new THREE.Scene()
        // scene.add(new THREE.AxesHelper(5))
        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.75);
        scene.add(ambientLight);
        const light = new THREE.PointLight()
        light.position.set(0, 0, 2)
        scene.add(light)

        const camera = new THREE.PerspectiveCamera(
            30,
            elem.clientWidth/elem.clientHeight,
            0.5,
            1000
        )
        camera.position.z = 2

        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(elem.clientWidth*0.98, elem.clientHeight*0.98);
        elem.appendChild(renderer.domElement);

        
        const controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })

        const objLoader = new THREE.OBJLoader()
        // manager

        function loadModel() {

            object.traverse(function (child) {

                if (child.isMesh) child.material.map = texture;

            });

            object.position.y = - 95;
            scene.add(object);

        }

        const manager = new THREE.LoadingManager(loadModel);
        // texture

        const textureLoader = new THREE.TextureLoader(manager);
        const texture = textureLoader.load(model+'.png');

        objLoader.load(
            model+'.obj',
            (object) => {

                object.traverse(function (child) {

                    if (child.isMesh) child.material.map = texture;

                });
                object.rotation.x= 15 * (Math.PI/180);;
                object.rotation.y= -150 * (Math.PI/180);;
                scene.add(object)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )

        window.addEventListener('resize', onWindowResize, false)
        function onWindowResize() {
            camera.aspect = elem.clientWidth / elem.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(elem.clientWidth, elem.clientHeight);
            // renderer.setSize(window.innerWidth, window.innerHeight)
            render()
        }

        function animate() {
            requestAnimationFrame(animate)

            controls.update()

            render()

        }

        function render() {
            renderer.render(scene, camera)
        }

        animate()
}
