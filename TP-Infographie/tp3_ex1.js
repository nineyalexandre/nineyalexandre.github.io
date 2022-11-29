"use strict";

let scene, camera, renderer;  // Bases pour le rendu Three.js
let controls; // Pour l'interaction avec la souris
let canvas;  // Le canevas où est dessinée la scène
let brainMaterial; // Matériau pour la surface du cerveau
let overallBrainPosition = {x:0, y:0, z:0};

/* Création de la scène 3D */
function createScene() {
    scene = new THREE.Scene();

    // TODO: Créer une caméra, sur l'axe des Z positif
    //camera
    camera = new THREE.PerspectiveCamera( 45, canvas.width/canvas.height, 0.1, 100 );
    camera.position.set(-1, 2, 2);
 
    // TODO: Ajout d'une lumière liée à la caméra
    let light = new THREE.DirectionalLight( 0xffffff, 0.8 ) 
    light.position.set(-1, 2, 2);
    camera.add(light);
    scene.add(light);

    // TODO: Ajout d'une lumière ambiante
    scene.add( new THREE.AmbientLight(0x111111, 0.2) );

    // Modélisation du cerveau
    add_brainMesh("./allenMouseBrain.obj") // TODO: Décommenter à l'exercice 1.b
    

    // Test avec un cube témoin vert
    let cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    let cubeMaterial = new THREE.MeshPhongMaterial( {
        color: 0x0088aa,
        specular: 0x003344,
        shininess: 100,
        flatShading: true, // flat shading
        side: THREE.DoubleSide // 2 côtés des faces
        } );
    /*let cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.set(0,0,-20);
    scene.add(cube);*/

    

    //Changement couleur de la scene pour verifications
    //scene.background = new THREE.Color( 0x999999 );

    // Modelisation du volume d'injection
    add_injectionVolumeMesh("./volumeInjection.obj"); // TODO: Décommenter à l'exercice 1.c

    // Modélisation des streamlines
    add_streamlines("./streamlines_100149109.json") // TODO: Décommenter à l'exercice 1.d
}

// TODO: COMPLÉTEZ CE CODE (exerice 1.b)
function add_brainMesh(url){
    // Importation de la surface du cerveau
    let brainIFS = loadBrain(url);

    let brainGeom = new THREE.BufferGeometry();

    // TODO: Ajout des sommets

    let brainVertices = new Float32Array(brainIFS.vertexPositions.flat());
    brainGeom.setAttribute('position', new THREE.BufferAttribute((brainVertices), 3));

    // TODO: Ajout des faces
    let brainFaces = brainIFS.faces.flat();
    brainGeom.setIndex(brainFaces);

    // TODO: Calcul des normales
    brainGeom.computeVertexNormals();

    // TODO: Création du matériau
    brainMaterial = new THREE.MeshPhongMaterial( {
        color: 0x909090,
        opacity: 0.25,
        transparent: true,
        flatShading : true,
        reflectivity : 1.0,
        refractionRatio: 0.25
        } );

    // TODO: Création du maillage
    let cerveau = new THREE.Mesh(brainGeom,brainMaterial);

    // Rotation pour s'assurer que le dessus du cerveau est vers le haut.
    cerveau.rotateX(Math.PI) // TODO: Décommentez cette ligne

    cerveau.position.set(overallBrainPosition.x,
                        overallBrainPosition.y,
                        overallBrainPosition.z);

    // TODO: Ajout du modèle à la scène.
    scene.add(cerveau);
}

// TODO: COMPLÉTEZ CE CODE (exerice 1.c)
function add_injectionVolumeMesh(url){
    // Importation du volume d'injection
    let injectionIFS = loadInjection(url);

    let injGeom = new THREE.BufferGeometry();

    // TODO: Ajout des sommets

    let injVertices = new Float32Array(injectionIFS.vertexPositions.flat());
    injGeom.setAttribute('position', new THREE.BufferAttribute((injVertices), 3));

    // TODO: Ajout des faces
    let injFaces = injectionIFS.faces.flat();
    injGeom.setIndex(injFaces);

    // TODO: Calcul des normales
    injGeom.computeVertexNormals();

    // TODO: Création du matériau
    let material = new THREE.MeshPhongMaterial( {
        color: 0x00ff00,
        flatShading : true,
        shininess : 30
        } );

    // TODO: Création du maillage
    let injection = new THREE.Mesh(injGeom,material);

    // Rotation pour s'assurer que le dessus du cerveau est vers le haut.
    injection.rotateX(Math.PI) // TODO: Décommentez cette ligne
    injection.position.set(overallBrainPosition.x,
        overallBrainPosition.y,
        overallBrainPosition.z);

    // TODO: Ajout du modèle à la scène.
    scene.add(injection);
}

/* Fonction ajoutant à la scène 3D toutes les streamlines 
   contenues dans le fichier fourni */
function add_streamlines(url){
    let streamlines = loadStreamlines(url)

    for (let i=0; i < streamlines.length; i++){
        add_singleStreamline(streamlines[i]);
    }
}

/* Fonction permettant d'ajouter un seul streamline à la scène 3D */
// TODO: COMPLÉTEZ CE CODE (exerice 1-d)
function add_singleStreamline(line){
    // line est un array dont chaque élément est un object JavaScript ayant les 
    // propriété x, y et z pour la position d'un point de ce streamline.
    const points = new Float32Array(line.length * 3);
    const colors = new Float32Array(line.length * 3);
    let r, g, b;
    for (let i = 0; i < line.length; i++){
        let j = i*3
        //TODO: Ajout d'un point dans l'array points.
        points[j]= line[i].x;
        points[j+1]= line[i].y;
        points[j+2]= line[i].z;
        // TODO: Calcul de la couleur du point
        if( i !== 0 && i !== line.length-1){
            let rgb = new THREE.Vector3(Math.abs(line[i+1].z-line[i-1].z),
                                        Math.abs(line[i+1].y-line[i-1].y),
                                        Math.abs(line[i+1].x-line[i-1].x));
            rgb.normalize();
            colors[j]= rgb.x;
            colors[j+1]= rgb.y;
            colors[j+2]= rgb.z;
        }else{
            colors[j]= 1;
            colors[j+1]= 1;
            colors[j+2]= 1;
        }
    }
    //console.log(points);
    // Pour s'assurer que le 1er et le dernier point du streamline utilisent
    // bonne couleur
    colors[0] = colors[1]
    colors[colors.length-1] = colors[colors.length-2]

    // TODO: Création d'une géométrie pour contenir les sommets et les couleurs

    let lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    lineGeom.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3));
    // TODO: Création d'un matériau de type LineBasicMaterial


    let matLineBasic = new THREE.LineBasicMaterial( {linewidth: 2, vertexColors: true } );
    
    // TODO: Création d'un modèle
    let model = new THREE.Line(lineGeom, matLineBasic);

    // Rotation pour s'assurer que le dessus du cerveau est vers le haut.
    model.rotateX(Math.PI); // TODO: Décommentez cette ligne
    model.position.set(overallBrainPosition.x,
        overallBrainPosition.y,
        overallBrainPosition.z);

    // TODO: Ajout du modèle à la scène.
    scene.add(model);
}

// Fontion d'initialisation. Elle est appelée lors du chargement du body html.
function init() {
    try {
        canvas = document.getElementById("glcanvas");
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<h3><b>Sorry, WebGL is required but is not available.</b><h3>";
        return;
    }

    // Création de la scène 3D
    createScene();

    // TODO: Texture cubemap
    const loader = new THREE.CubeTextureLoader();
    loader.setPath( '' );

    const textureCube = loader.load( [
        'negx.png', 'posx.png',
        'negy.png', 'posy.png',
        'negz.png', 'posz.png'
    ] );

    const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
    
    scene.background = textureCube;

    // Ajout de l'interactivité avec la souris
    controls = new THREE.TrackballControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    
    // Animation de la scène (appelée toute les 30 millisecondes)
    animate();
}

/* Animation de la scène */
function animate()
{
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
