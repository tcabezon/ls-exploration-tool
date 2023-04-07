// from: https://douglasduhaime.com/posts/visualizing-tsne-maps-with-three-js.html

var chosen = [3, 4, 49, 57, 94, 115, 131, 166, 206, 213]
let camera, scene, renderer, controls;

var raycaster = new THREE.Raycaster();

var photoMaterial, photoMaterial_chosen;

let plane_chosen, line;

var imageSize = { width: 1.2, height: 1.2 };

function init() {
    myDiv = document.getElementById('myDiv')
    console.log(window.innerWidth, window.innerHeight)
    // $("#myDiv").width(window.innerWidth)
    $("#myDiv").height(window.innerHeight)
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(23, 24, 25)");
    var fieldOfView = 75;
    var nearPlane = 0.1;
    var farPlane = 1000;
    var aspectRatio = myDiv.offsetWidth / myDiv.offsetHeight;
    


    camera = new THREE.PerspectiveCamera(
        fieldOfView, aspectRatio, nearPlane, farPlane
    );

    camera.position.z = 21;



    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(myDiv.offsetWidth, myDiv.offsetHeight);
    myDiv.appendChild(renderer.domElement);


    var g = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xffff00 })




    // texture
    var loader = new THREE.TextureLoader();
    var grid = 'grid_50_reversed_0.png';
    photoMaterial = new THREE.MeshLambertMaterial({
        map: loader.load(grid), transparent: true,
        opacity: 1
    });





    photoMaterial_chosen = new THREE.MeshLambertMaterial({
        map: loader.load(grid), transparent: true,
        opacity: 1
    });

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    


    var atlas = { width: 5000, height: 5000, cols: 16, rows: 16 };
    var image = { width: atlas.width / atlas.cols, height: atlas.height / atlas.rows };
    // console.log(atlas.cols * atlas.rows, atlas, image)


    var imagePositions

    var loader = new THREE.FileLoader();
    loader.load('image_tsne_projections_0.json', function (data) {
        imagePositions = JSON.parse(data);
        useData(imagePositions)
    })

    function useData(data) {
        // create buffer geometry
        const geometry = new THREE.BufferGeometry();
        var positions = [];
        var normals = [];
        var uvs = [];
        for (let i = 0; i < (atlas.cols * atlas.rows); i++) {

            var coords = { x: imagePositions[i]['x'], y: imagePositions[i]['y'], z: 0 };

            var xOffset = (i % atlas.cols) * (image.width / atlas.width);
            var yOffset = Math.floor(i / atlas.rows) * (image.height / atlas.height);
            var vertices = [

                { pos: [coords.x, coords.y, coords.z], norm: [0, 0, 1], uv: [xOffset, yOffset], },
                { pos: [coords.x + imageSize.width, coords.y, coords.z], norm: [0, 0, 1], uv: [xOffset + 0.0625, yOffset], },
                { pos: [coords.x + imageSize.width, coords.y + imageSize.height, coords.z], norm: [0, 0, 1], uv: [xOffset + 0.0625, yOffset + 0.0625], },

                { pos: [coords.x, coords.y, coords.z], norm: [0, 0, 1], uv: [xOffset, yOffset], },
                { pos: [coords.x + imageSize.width, coords.y + imageSize.height, coords.z], norm: [0, 0, 1], uv: [xOffset + 0.0625, yOffset + 0.0625], },
                { pos: [coords.x, coords.y + imageSize.height, coords.z], norm: [0, 0, 1], uv: [xOffset, yOffset + 0.0625], },

            ]

            for (const vertex of vertices) {
                positions.push(...vertex.pos);
                normals.push(...vertex.norm);
                uvs.push(...vertex.uv);
            }



        }

        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));

        const plane = new THREE.Mesh(geometry, photoMaterial);
        scene.add(plane);

        // create buffer geometry
        const geometry_chosen = new THREE.BufferGeometry();
        var positions = [];
        var normals = [];
        var uvs = [];

        // add chosen as different layer
        for (let i of chosen) {

            var coords = { x: imagePositions[i]['x'], y: imagePositions[i]['y'], z: 0 };
            // console.log(i, coords)
            var xOffset = (i % atlas.cols) * (image.width / atlas.width);
            var yOffset = Math.floor(i / atlas.rows) * (image.height / atlas.height);
            const vertices = [

                { pos: [coords.x, coords.y, coords.z], norm: [0, 0, 1], uv: [xOffset, yOffset], },
                { pos: [coords.x + imageSize.width, coords.y, coords.z], norm: [0, 0, 1], uv: [xOffset + 0.0625, yOffset], },
                { pos: [coords.x + imageSize.width, coords.y + imageSize.height, coords.z], norm: [0, 0, 1], uv: [xOffset + 0.0625, yOffset + 0.0625], },

                { pos: [coords.x, coords.y, coords.z], norm: [0, 0, 1], uv: [xOffset, yOffset], },
                { pos: [coords.x + imageSize.width, coords.y + imageSize.height, coords.z], norm: [0, 0, 1], uv: [xOffset + 0.0625, yOffset + 0.0625], },
                { pos: [coords.x, coords.y + imageSize.height, coords.z], norm: [0, 0, 1], uv: [xOffset, yOffset + 0.0625], },

            ]

            for (const vertex of vertices) {
                positions.push(...vertex.pos);
                normals.push(...vertex.norm);
                uvs.push(...vertex.uv);
            }



        }

        geometry_chosen.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry_chosen.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        geometry_chosen.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
        geometry.computeBoundingSphere();
        plane_chosen = new THREE.Mesh(geometry_chosen, photoMaterial_chosen);
        scene.add(plane_chosen);

        

    }

    // light
    var light = new THREE.PointLight(0xffffff, .7, 0);
    light.position.set(1, 1, 100);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);

    //line - rectangle
    geometry = new THREE.PlaneGeometry(imageSize.width, imageSize.height);
    material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true });
    line = new THREE.Mesh(geometry, material);
    line.visible=false
    console.log('line',line)
    scene.add(line);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.noRotate = true;

    // renderer.render(scene, camera);






}

window.addEventListener('resize', function () {
    camera.aspect = myDiv.offsetWidth / myDiv.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(myDiv.offsetWidth, myDiv.offsetHeight);
    controls.handleResize();
});

function animate() {
    requestAnimationFrame(animate);
    
    render();
    // 
    controls.update();

}

function buttonClicked() {
    console.log('button clicked')
    if (photoMaterial.opacity == 1) {
        photoMaterial.opacity = 0.2
    }
    else {
        photoMaterial.opacity = 1
    }
}



// light
// var light = new THREE.PointLight(0xff00ff, 1, 2);
// light.position.set(-15.180380821228027,  -4.345020294189453, 1);
// scene.add(light);


// intersection raycast

let INTERSECTED;
const pointer = new THREE.Vector2();

// chair hover when mouse over
document.addEventListener('mousemove', onPointerMove);

// pick chair when mouse click
document.addEventListener( 'pointerdown', onPointerDown );

function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(plane_chosen);


    if (intersects.length > 0) {

        const intersect = intersects[0];
        const face = intersect.face;

        const linePosition = line.geometry.attributes.position;
        const meshPosition = plane_chosen.geometry.attributes.position;
        // console.log('meshposition',meshPosition)
        let positionx= meshPosition.array[face.a*3]+imageSize.width/2
        let positiony= meshPosition.array[face.a*3+1]+imageSize.height/2

        line.position.set(positionx,positiony,0)
        line.visible = true;


    } else {

        line.visible = false;

    }

    render()

}

function onPointerDown(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(plane_chosen);


    if (intersects.length > 0) {
        
        const intersect = intersects[0];
        // console.log(intersect)
        const face = intersect.face;
        const elemIndex=chosen[Math.floor(intersect.faceIndex/2)];


        console.log('element',elemIndex,'cliked!')
        // line.visible = true;
        

    } else {

        console.log('no element clicked')

    }

    render()

}

function render() {
    
   

    renderer.render(scene, camera);

}

init();
animate();