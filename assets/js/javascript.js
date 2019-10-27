var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine
var fadeToLink = false; //Used for fade out 
var fadeFirst  = false; //Initialize fadout when it first starts.
var waitSlides = false; //Wait for slides to reanimate after fadeout.
var spotAnim;
var cameraAnim;

/************************************* Main Babylon Function *************************************/
var createScene = function ()
{
    // Create the scene space
    var scene = new BABYLON.Scene(engine);

    /****************************************** Camera *******************************************/
    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -11), scene);
    camera.angularSensibility = 5000;
    camera.speed     = .4;
    camera.keysDown  = [83, 40];
    camera.keysUp    = [87, 38];
    camera.keysLeft  = [37, 65];
    camera.keysRight = [39, 68];
    camera.rotation.y = Math.PI;
    
	/*************************************** Light Sources ***************************************/
    var light1 = new BABYLON.PointLight("light1", camera.position, scene);
    light1.diffuse = new BABYLON.Color3(.7, .7, .7);
    light1.specular = new BABYLON.Color3(.2, .2, .2);

    var light2 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(8, 2.2, -1), new BABYLON.Vector3(0, -1, 0), Math.PI / 1.5, 1, scene);
    light2.diffuse = new BABYLON.Color3(5, 0, 0);
    light2.specular = new BABYLON.Color3(1, 0, 0);

    var light3 = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(-8, 2.2, -1), new BABYLON.Vector3(0, -1, 0), Math.PI / 1.5, 1, scene);
    light3.diffuse = new BABYLON.Color3(5, 0, 0);
    light3.specular = new BABYLON.Color3(1, 0, 0);

    var gl = new BABYLON.GlowLayer("glow", scene);

    /***************************************** Materials *****************************************/
    var redMat = new BABYLON.StandardMaterial("redMat", scene);
    redMat.diffuseColor = new BABYLON.Color3(.5, 0, 0);
       
    var greenMat = new BABYLON.StandardMaterial("greenMat", scene);
    greenMat.diffuseColor = new BABYLON.Color3(0, .5, 0);

    var blueMat = new BABYLON.StandardMaterial("blueMat", scene);
    blueMat.diffuseColor = new BABYLON.Color3(0, 0, .5);

    var blackMat = new BABYLON.StandardMaterial("blackMat", scene);
    blackMat.diffuseColor = new BABYLON.Color3(.1, 0, 0);

    var redSpecMat = new BABYLON.StandardMaterial("redSpecMat", scene);
    redSpecMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
    redSpecMat.emissiveColor = new BABYLON.Color3(1, 0, 0);

    //-------------------- Walls, floor and ceiling --------------------
    var floorMat = new BABYLON.StandardMaterial("floorMat", scene);
    floorMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/floor4.png", scene);
    floorMat.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/floor4n.png", scene);

    var ceilMat = new BABYLON.StandardMaterial("ceilMat", scene);
    ceilMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/ceiling2.png", scene);
    ceilMat.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/ceiling2n.png", scene);

    var mat1 = new BABYLON.StandardMaterial("mat1", scene);
    mat1.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x2p5.png", scene);
    mat1.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x2p5n.png", scene);
    mat1.specularColor = new BABYLON.Color3(.5, .5, .5);

    var mat2 = new BABYLON.StandardMaterial("mat2", scene);
    mat2.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x6.png", scene);
    mat2.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x6n.png", scene);

    var mat3 = new BABYLON.StandardMaterial("mat3", scene);
    mat3.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1X3.png", scene);
    mat3.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1X3n.png", scene);

    var mat4 = new BABYLON.StandardMaterial("mat4", scene);
    mat4.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x2.png", scene);
    mat4.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x2n.png", scene);

    var mat5 = new BABYLON.StandardMaterial("mat5", scene);
    mat5.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x4.png", scene);
    mat5.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x4n.png", scene);

    var mat6 = new BABYLON.StandardMaterial("mat6", scene);
    mat6.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x1p5.png", scene);
    mat6.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x1p5n.png", scene);

    var mat7 = new BABYLON.StandardMaterial("mat7", scene);
    mat7.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x3p5.png", scene);
    mat7.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x3p5n.png", scene);

    var mat8 = new BABYLON.StandardMaterial("mat8", scene);
    mat8.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1X3b.png", scene);
    mat8.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1X3bn.png", scene);

    var mat9 = new BABYLON.StandardMaterial("mat9", scene);
    mat9.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x5.png", scene);
    mat9.bumpTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/doom_wall_1x5n.png", scene);

    //-------------------- Slides --------------------
    var webMat = new BABYLON.StandardMaterial("webMat", scene);
    webMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/web.png", scene);
    webMat.emissiveColor = new BABYLON.Color3(.1, .1, .1);

    var mastersMat = new BABYLON.StandardMaterial("mastersMat", scene);
    mastersMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/masters.png", scene);
    mastersMat.emissiveColor = new BABYLON.Color3(.1, .1, .1);

    var embeddedMat = new BABYLON.StandardMaterial("embeddedMat", scene);
    embeddedMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/embedded.png", scene);
    embeddedMat.emissiveColor = new BABYLON.Color3(.1, .1, .1);

    var dspMat = new BABYLON.StandardMaterial("dspMat", scene);
    dspMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/dsp.png", scene);
    dspMat.emissiveColor = new BABYLON.Color3(.1, .1, .1);

    var gameMat = new BABYLON.StandardMaterial("gameMat", scene);
    gameMat.diffuseTexture = new BABYLON.Texture("https://nmikstas.github.io/resources/images/game.png", scene);
    gameMat.emissiveColor = new BABYLON.Color3(.1, .1, .1);  
    
    /************************************* Walls and Floors **************************************/   
    var floorOptions =
    {
        width:     30,
		height:    30,
		tileSize:  1,
		tileWidth: 1
    };

    var floor = BABYLON.MeshBuilder.CreateTiledPlane("floor", floorOptions, scene);
    floor.position = new BABYLON.Vector3(0, 0, 0);
    floor.rotation.x = Math.PI / 2;
	floor.material = floorMat;

    var ceilOptions =
    {
        width:     30,
		height:    30,
		tileSize:  3,
		tileWidth: 3
    };

    var ceiling = BABYLON.MeshBuilder.CreateTiledPlane("ceiling", ceilOptions, scene);
    ceiling.position = new BABYLON.Vector3(0, 2, 0);
    ceiling.rotation.x = -Math.PI / 2;
    ceiling.material = ceilMat;
   
    //-------------------- Inner walls --------------------
    var iwall1 = BABYLON.MeshBuilder.CreatePlane("iwall1", {height: 2, width: 6}, scene);
    iwall1.position = new BABYLON.Vector3(0, 1, -6);
    iwall1.material = mat3;

    var iwall2 = BABYLON.MeshBuilder.CreatePlane("iwall2", {height: 2, width: 3 * Math.sqrt(2)}, scene);
    iwall2.position = new BABYLON.Vector3(-4.5, 1, -4.5);
    iwall2.rotation.y = Math.PI / 4;
    iwall2.material = mat4;

    var iwall3 = BABYLON.MeshBuilder.CreatePlane("iwall3", {height: 2, width: 12}, scene);
    iwall3.position = new BABYLON.Vector3(0, 1, -3);
    iwall3.rotation.y = Math.PI;
    iwall3.material = mat2;

    var iwall4 = BABYLON.MeshBuilder.CreatePlane("iwall4", {height: 2, width: 3 * Math.sqrt(2)}, scene);
    iwall4.position = new BABYLON.Vector3(4.5, 1, -4.5);
    iwall4.rotation.y = -Math.PI / 4;
    iwall4.material = mat4;

    var iwall5 = BABYLON.MeshBuilder.CreatePlane("iwall5", {height: 2, width: 4}, scene);
    iwall5.position = new BABYLON.Vector3(-1, 1, -1);
    iwall5.rotation.y = Math.PI / 2;
    iwall5.material = gameMat;

    var iwall6 = BABYLON.MeshBuilder.CreatePlane("iwall6", {height: 2, width: 4}, scene);
    iwall6.position = new BABYLON.Vector3(1, 1, -1);
    iwall6.rotation.y = -Math.PI / 2;
    iwall6.material = mastersMat;

    var iwall7 = BABYLON.MeshBuilder.CreatePlane("iwall7", {height: 2, width: 12}, scene);
    iwall7.position = new BABYLON.Vector3(0, 1, 1);
    iwall7.material = mat2;

    var iwall8 = BABYLON.MeshBuilder.CreatePlane("iwall8", {height: 2, width: 3 * Math.sqrt(2)}, scene);
    iwall8.position = new BABYLON.Vector3(-4.5, 1, 2.5);
    iwall8.rotation.y = 3 * Math.PI / 4;
    iwall8.material = mat4;

    var iwall9 = BABYLON.MeshBuilder.CreatePlane("iwall9", {height: 2, width: 3 * Math.sqrt(2)}, scene);
    iwall9.position = new BABYLON.Vector3(4.5, 1, 2.5);
    iwall9.rotation.y = - 3 * Math.PI / 4;
    iwall9.material = mat4;

    var iwall10 = BABYLON.MeshBuilder.CreatePlane("iwall10", {height: 2, width: 6}, scene);
    iwall10.position = new BABYLON.Vector3(0, 1, 4);
    iwall10.rotation.y = Math.PI
    iwall10.material = mat3;

    //-------------------- Outer walls --------------------
    var owall1 = BABYLON.MeshBuilder.CreatePlane("owall1", {height: 2, width: 5}, scene);
    owall1.position = new BABYLON.Vector3(-2, 1, -12.5);
    owall1.rotation.y = -Math.PI / 2;
    owall1.material = mat1;

    var owall2 = BABYLON.MeshBuilder.CreatePlane("owall2", {height: 2, width: 5}, scene);
    owall2.position = new BABYLON.Vector3(2, 1, -12.5);
    owall2.rotation.y = Math.PI / 2;
    owall2.material = mat1;

    var owall3 = BABYLON.MeshBuilder.CreatePlane("owall3", {height: 2, width: 4}, scene);
    owall3.position = new BABYLON.Vector3(0, 1, -15);
    owall3.rotation.y = Math.PI;
    owall3.material = webMat;

    var owall4 = BABYLON.MeshBuilder.CreatePlane("owall4", {height: 2, width: 3}, scene);
    owall4.position = new BABYLON.Vector3(-3.5, 1, -10);
    owall4.rotation.y = Math.PI;
    owall4.material = mat6;

    var owall5 = BABYLON.MeshBuilder.CreatePlane("owall5", {height: 2, width: 5 * Math.sqrt(2)}, scene);
    owall5.position = new BABYLON.Vector3(-7.5, 1, -7.5);
    owall5.rotation.y = -3 * Math.PI / 4;
    owall5.material = mat7;

    var owall6 = BABYLON.MeshBuilder.CreatePlane("owall6", {height: 2, width: 3}, scene);
    owall6.position = new BABYLON.Vector3(3.5, 1, -10);
    owall6.rotation.y = Math.PI;
    owall6.material = mat6;

    var owall7 = BABYLON.MeshBuilder.CreatePlane("owall7", {height: 2, width: 5 * Math.sqrt(2)}, scene);
    owall7.position = new BABYLON.Vector3(7.5, 1, -7.5);
    owall7.rotation.y = 3 * Math.PI / 4;
    owall7.material = mat7;

    var owall8 = BABYLON.MeshBuilder.CreatePlane("owall8", {height: 2, width: 8}, scene);
    owall8.position = new BABYLON.Vector3(-10, 1, -1);
    owall8.rotation.y = -Math.PI / 2;
    owall8.material = mat5;

    var owall9 = BABYLON.MeshBuilder.CreatePlane("owall9", {height: 2, width: 8}, scene);
    owall9.position = new BABYLON.Vector3(10, 1, -1);
    owall9.rotation.y = Math.PI / 2;
    owall9.material = mat5;

    var owall10 = BABYLON.MeshBuilder.CreatePlane("owall10", {height: 2, width: 2 * Math.sqrt(2)}, scene);
    owall10.position = new BABYLON.Vector3(-9, 1, 4);
    owall10.rotation.y = -Math.PI / 4;
    owall10.material = mat6;

    var owall11 = BABYLON.MeshBuilder.CreatePlane("owall11", {height: 2, width: 2 * Math.sqrt(2)}, scene);
    owall11.position = new BABYLON.Vector3(9, 1, 4);
    owall11.rotation.y = Math.PI / 4;
    owall11.material = mat6;

    var owall12 = BABYLON.MeshBuilder.CreatePlane("owall12", {height: 2, width: 10}, scene);
    owall12.position = new BABYLON.Vector3(0, 1, 8);
    owall12.material = mat9;

    var owall13 = BABYLON.MeshBuilder.CreatePlane("owall13", {height: 2, width: 4 * Math.sqrt(2)}, scene);
    owall13.position = new BABYLON.Vector3(-10, 1, 7);
    owall13.rotation.y = -3 * Math.PI / 4;
    owall13.material = mat8;

    var owall14 = BABYLON.MeshBuilder.CreatePlane("owall14", {height: 2, width: 4 * Math.sqrt(2)}, scene);
    owall14.position = new BABYLON.Vector3(10, 1, 7);
    owall14.rotation.y = 3 * Math.PI / 4;
    owall14.material = mat8;

    var owall15 = BABYLON.MeshBuilder.CreatePlane("owall15", {height: 2, width: 4 * Math.sqrt(2)}, scene);
    owall15.position = new BABYLON.Vector3(-7, 1, 10);
    owall15.rotation.y = Math.PI / 4;
    owall15.material = mat8;

    var owall16 = BABYLON.MeshBuilder.CreatePlane("owall16", {height: 2, width: 4 * Math.sqrt(2)}, scene);
    owall16.position = new BABYLON.Vector3(7, 1, 10);
    owall16.rotation.y = -Math.PI / 4;
    owall16.material = mat8;

    var owall17 = BABYLON.MeshBuilder.CreatePlane("owall17", {height: 2, width: 3 * Math.sqrt(2)}, scene);
    owall17.position = new BABYLON.Vector3(-10.5, 1, 10.5);
    owall17.rotation.y = -Math.PI / 4;
    owall17.material = dspMat;

    var owall18 = BABYLON.MeshBuilder.CreatePlane("owall18", {height: 2, width: 3 * Math.sqrt(2)}, scene);
    owall18.position = new BABYLON.Vector3(10.5, 1, 10.5);
    owall18.rotation.y = Math.PI / 4;
    owall18.material = embeddedMat;
   
    /************************************* Glowing Spheres ***************************************/
    var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:.5}, scene);
    sphere1.material = redSpecMat;
    sphere1.position = light2.position;

    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:.5}, scene);
    sphere2.material = redSpecMat;
    sphere2.position = light3.position;

    /******************************* Gravity and Collision Checks ********************************/
    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;

    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;

    //Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(1.5, .5, 1.5);

    //finally, say which mesh will be collisionable
    floor.checkCollisions   = true;
    iwall1.checkCollisions  = true;
    iwall2.checkCollisions  = true;
    iwall3.checkCollisions  = true;
    iwall4.checkCollisions  = true;
    iwall5.checkCollisions  = true;
    iwall6.checkCollisions  = true;
    iwall7.checkCollisions  = true;
    iwall8.checkCollisions  = true;
    iwall9.checkCollisions  = true;
    iwall10.checkCollisions = true;
    owall1.checkCollisions  = true;
    owall2.checkCollisions  = true;
    owall3.checkCollisions  = true;
    owall4.checkCollisions  = true;
    owall5.checkCollisions  = true;
    owall6.checkCollisions  = true;
    owall7.checkCollisions  = true;
    owall8.checkCollisions  = true;
    owall9.checkCollisions  = true;
    owall10.checkCollisions = true;
    owall11.checkCollisions = true;
    owall12.checkCollisions = true;
    owall13.checkCollisions = true;
    owall14.checkCollisions = true;
    owall15.checkCollisions = true;
    owall16.checkCollisions = true;
    owall17.checkCollisions = true;
    owall18.checkCollisions = true;
    
    /********************************** Basic Animation Updates **********************************/
    //Animate the camera.
    camera.animations = [];

    var animCamRotY = new BABYLON.Animation("animCamRotY", "rotation.y", 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = []; 
    keys.push({frame: 0,    value:      Math.PI     });
    keys.push({frame: 60,   value:      Math.PI     });
    keys.push({frame: 90,   value:      Math.PI     });
    keys.push({frame: 150,  value:      Math.PI     });
    keys.push({frame: 180,  value:      Math.PI / 2 });
    keys.push({frame: 220,  value:      Math.PI / 8 });
    keys.push({frame: 260,  value:     -Math.PI / 2 });
    keys.push({frame: 420,  value:     -Math.PI / 2 });
    keys.push({frame: 450,  value:                0 });
    keys.push({frame: 540,  value:      Math.PI / 4 });
    keys.push({frame: 690,  value:      Math.PI / 4 });
    keys.push({frame: 710,  value:     -Math.PI / 2 });
    keys.push({frame: 790,  value:     -Math.PI / 2 });
    keys.push({frame: 830,  value:     -Math.PI / 4 });
    keys.push({frame: 1000, value:     -Math.PI / 4 });
    keys.push({frame: 1020, value: -3 * Math.PI / 4 });
    keys.push({frame: 1060, value: -    Math.PI     });
    keys.push({frame: 1090, value: -3 * Math.PI / 2 });
    keys.push({frame: 1140, value: -3 * Math.PI / 2 });
    keys.push({frame: 1290, value: -3 * Math.PI / 2 });
    keys.push({frame: 1340, value: -5 * Math.PI / 4 });
    keys.push({frame: 1420, value:     -Math.PI     });
    keys.push({frame: 1440, value:     -Math.PI     });
    animCamRotY.setKeys(keys);
    camera.animations.push(animCamRotY);

    var animationPosZ = new BABYLON.Animation("animationPosZ", "position.z", 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = []; 
    keys.push({frame: 0,    value: -11  });
    keys.push({frame: 150,  value: -11  });
    keys.push({frame: 180,  value: -10  });
    keys.push({frame: 240,  value: -3   });
    keys.push({frame: 260,  value: -1   });
    keys.push({frame: 450,  value: -1   });
    keys.push({frame: 520,  value:  5   });
    keys.push({frame: 540,  value:  7.5 });
    keys.push({frame: 690,  value:  7.5 });
    keys.push({frame: 710,  value:  6   });
    keys.push({frame: 830,  value:  6   });
    keys.push({frame: 850,  value:  7.5 });
    keys.push({frame: 1000, value:  7.5 });
    keys.push({frame: 1020, value:  5   });
    keys.push({frame: 1050, value:  3   });
    keys.push({frame: 1090, value: -1   });
    keys.push({frame: 1140, value: -1   });
    keys.push({frame: 1290, value: -1   });
    keys.push({frame: 1340, value: -1   });
    keys.push({frame: 1420, value: -9   });
    keys.push({frame: 1440, value: -11  });
    animationPosZ.setKeys(keys);
    camera.animations.push(animationPosZ);

    var animationPosX = new BABYLON.Animation("animationPosX", "position.x", 30, 
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = []; 
    keys.push({frame: 0,    value:  0   });
    keys.push({frame: 150,  value:  0   });
    keys.push({frame: 180,  value: -1   });
    keys.push({frame: 220,  value:  6   });
    keys.push({frame: 240,  value:  8   });
    keys.push({frame: 270,  value:  5   });
    keys.push({frame: 420,  value:  5   });
    keys.push({frame: 450,  value:  8   });
    keys.push({frame: 520,  value:  6   });
    keys.push({frame: 540,  value:  7.5 });
    keys.push({frame: 690,  value:  7.5 });
    keys.push({frame: 710,  value:  6   });
    keys.push({frame: 830,  value: -6   });
    keys.push({frame: 850,  value: -7.5 });
    keys.push({frame: 1000, value: -7.5 });
    keys.push({frame: 1020, value: -4   });
    keys.push({frame: 1090, value: -10  });
    keys.push({frame: 1140, value: -5   });
    keys.push({frame: 1290, value: -5   });
    keys.push({frame: 1340, value: -10  });
    keys.push({frame: 1420, value:  0   });
    keys.push({frame: 1440, value:  0   });
    animationPosX.setKeys(keys);
    camera.animations.push(animationPosX);

    //Run the camera animations.
    cameraAnim = scene.beginAnimation(camera, 0, 1440, true);

    //Animate the spotlight
    light3.animations = [];

    var spotAnimZ = new BABYLON.Animation("spotAnimZ", "position.z", 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = []; 
    keys.push({frame: 0,    value: -1});
    keys.push({frame: 60,   value:  2});
    keys.push({frame: 60,   value:  2});
    keys.push({frame: 130,  value:  5});
    keys.push({frame: 200,  value:  8});
    keys.push({frame: 270,  value:  5});
    keys.push({frame: 293,  value:  6});
    keys.push({frame: 293,  value:  6});
    keys.push({frame: 373,  value:  6});
    keys.push({frame: 453,  value:  6});
    keys.push({frame: 476,  value:  5});
    keys.push({frame: 546,  value:  8});
    keys.push({frame: 616,  value:  5});
    keys.push({frame: 686,  value:  2});
    keys.push({frame: 746,  value: -1});
    keys.push({frame: 826,  value: -1});
    keys.push({frame: 906,  value: -1});
    keys.push({frame: 966,  value: -4});
    keys.push({frame: 1059, value: -8});
    keys.push({frame: 1139, value: -8});
    keys.push({frame: 1219, value: -12});
    keys.push({frame: 1299, value: -8});
    keys.push({frame: 1379, value: -8});
    keys.push({frame: 1472, value: -4});
    keys.push({frame: 1532, value: -1});
    keys.push({frame: 1612, value: -1});
    keys.push({frame: 1692, value: -1});
    spotAnimZ.setKeys(keys);
    light3.animations.push(spotAnimZ);

    var spotAnimX = new BABYLON.Animation("spotAnimX", "position.x", 30,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = []; 
    keys.push({frame: 0,    value: -8});
    keys.push({frame: 60,   value: -8});
    keys.push({frame: 130,  value: -5});
    keys.push({frame: 200,  value: -8});
    keys.push({frame: 270,  value: -5});
    keys.push({frame: 293,  value: -4});
    keys.push({frame: 373,  value:  0});
    keys.push({frame: 453,  value: -4});
    keys.push({frame: 476,  value: -5});
    keys.push({frame: 546,  value: -8});
    keys.push({frame: 616,  value: -5});
    keys.push({frame: 686,  value: -8});
    keys.push({frame: 746,  value: -8});
    keys.push({frame: 826,  value: -4});
    keys.push({frame: 906,  value: -8});
    keys.push({frame: 966,  value: -8});
    keys.push({frame: 1059, value: -4});
    keys.push({frame: 1139, value:  0});
    keys.push({frame: 1219, value:  0});
    keys.push({frame: 1299, value:  0});
    keys.push({frame: 1379, value: -4});
    keys.push({frame: 1472, value: -8});
    keys.push({frame: 1532, value: -8});
    keys.push({frame: 1612, value: -4});
    keys.push({frame: 1692, value: -8});
    spotAnimX.setKeys(keys);
    light3.animations.push(spotAnimX);

    //Run the spotlight animations.
    spotAnim = scene.beginAnimation(light3, 0, 1692, true);

    /******************************************** Fog ********************************************/
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = .10;

    /****************************************** Sprites ******************************************/
    // Create a sprite manager to optimize GPU ressources
    var spriteManagerDust = new BABYLON.SpriteManager("dustManager", "https://nmikstas.github.io/resources/images/dust.png", 8000, 37, scene);
    var spriteArray = [];

    //Create 2000 dust particles at random positions in the back hallway.
    for (let i = 0; i < 8000; i++)
    {
        spriteArray.push(new BABYLON.Sprite("dust", spriteManagerDust));
        spriteArray[i].position.x = Math.random() * 30 - 15;
        spriteArray[i].position.y = Math.random() * 2;
        spriteArray[i].position.z = Math.random() * 30 - 15;
        spriteArray[i].height = .007;
        spriteArray[i].width = .007;
        spriteArray[i].vel = Math.random() * .003 + .0005;
    }

    /************************************** User Interface ***************************************/
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var UiPanel = new BABYLON.GUI.StackPanel();
    UiPanel.width = "220px";
    UiPanel.fontSize = "14px";
    UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(UiPanel);

    var button = BABYLON.GUI.Button.CreateSimpleButton("but0", "Take Control");
    button.paddingBottom = "10px";
    button.width = "100px";
    button.height = "50px";
    button.color = "white";
    button.background = "green";
    
    button.onPointerDownObservable.add(function()
    {
        UiPanel.removeControl(button);
        camera.attachControl(canvas, true);
        cameraAnim.pause();
    });
    
    UiPanel.addControl(button);

    /********************************* Mouse and Pick Functions **********************************/
    var hl = new BABYLON.HighlightLayer("hl1", scene); //Add the highlight layer.
    
    //Reset scene function.
    var resetScene = function()
    {
        ceilMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        floorMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat1.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat2.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat3.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat4.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat5.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat6.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat7.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat8.emissiveColor = new BABYLON.Color3(0, 0, 0);
        mat9.emissiveColor = new BABYLON.Color3(0, 0, 0);
        spotAnim.reset();
        cameraAnim.reset();
        spotAnim.restart();
        cameraAnim.restart();
        UiPanel.addControl(button);
        camera.detachControl(canvas, true);
        camera.rotation.x = 0;
        camera.rotation.y = 0;
        camera.rotation.z = 0;
        waitSlides = false;
    }

    //Add actionManager on each slide
    owall3.actionManager  = new BABYLON.ActionManager(scene);
    iwall6.actionManager  = new BABYLON.ActionManager(scene);
    owall18.actionManager = new BABYLON.ActionManager(scene);
    owall17.actionManager = new BABYLON.ActionManager(scene);
    iwall5.actionManager  = new BABYLON.ActionManager(scene);

    owall3.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,
        function(event){hl.addMesh(owall3, BABYLON.Color3.Green());})
    );

    owall3.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,
        function(event){hl.removeMesh(owall3);})
    );

    owall3.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, 
        function(event)
        {
            hl.removeMesh(owall3);
            fadeToLink = true;
            fadeFirst  = true;
            waitSlides = true;

            setTimeout(function()
            {
                fadeToLink = false;
                window.open("https://nmikstas.github.io/portfolio/web.html", "_self");
            }, 1000);

            setTimeout(resetScene, 1500);
        })
    );

    iwall6.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,
        function(event){hl.addMesh(iwall6, BABYLON.Color3.Green());})
    );

    iwall6.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,
        function(event){hl.removeMesh(iwall6);})
    );

    iwall6.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, 
        function(event)
        {
            hl.removeMesh(iwall6);
            fadeToLink = true;
            fadeFirst  = true;
            waitSlides = true;

            setTimeout(function()
            {
                fadeToLink = false;
                window.open("https://nmikstas.github.io/portfolio/fpga.html", "_self");
            }, 1000);

            setTimeout(resetScene, 1500);
        })
    );

    owall18.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,
        function(event){hl.addMesh(owall18, BABYLON.Color3.Green());})
    );

    owall18.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,
        function(event){hl.removeMesh(owall18);})
    );

    owall18.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, 
        function(event)
        {
            hl.removeMesh(owall18);
            fadeToLink = true;
            fadeFirst  = true;
            waitSlides = true;

            setTimeout(function()
            {
                fadeToLink = false;
                window.open("https://nmikstas.github.io/portfolio/embedded.html", "_self");
            }, 1000);

            setTimeout(resetScene, 1500);
        })
    );

    owall17.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,
        function(event){hl.addMesh(owall17, BABYLON.Color3.Green());})
    );

    owall17.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,
        function(event){hl.removeMesh(owall17);})
    );

    owall17.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, 
        function(event)
        {
            hl.removeMesh(owall17);
            fadeToLink = true;
            fadeFirst  = true;
            waitSlides = true;

            setTimeout(function()
            {
                fadeToLink = false;
                window.open("https://nmikstas.github.io/portfolio/dsp.html", "_self");
            }, 1000);

            setTimeout(resetScene, 1500);
        })
    );

    iwall5.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,
        function(event){hl.addMesh(iwall5, BABYLON.Color3.Green());})
    );

    iwall5.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,
        function(event){hl.removeMesh(iwall5);})
    );

    iwall5.actionManager.registerAction
    (
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, 
        function(event)
        {
            hl.removeMesh(iwall5);
            fadeToLink = true;
            fadeFirst  = true;
            waitSlides = true;

            setTimeout(function()
            {
                fadeToLink = false;
                window.open("https://nmikstas.github.io/portfolio/games.html", "_self");
            }, 1000);

            setTimeout(resetScene, 1500);
        })
    );

    /************************************ Fog Particle System ************************************/
    var fountain = BABYLON.Mesh.CreateBox("foutain", .01, scene);
    fountain.visibility = 0;

    // Create a particle system
    var particleSystem;

    var fogTexture = new BABYLON.Texture("https://raw.githubusercontent.com/aWeirdo/Babylon.js/master/smoke_15.png", scene);

    var createNewSystem = function() {
        if (particleSystem) {
            particleSystem.dispose();
        }

        particleSystem = new BABYLON.ParticleSystem("particles", 100 , scene);
        particleSystem.manualEmitCount = particleSystem.getCapacity();
        particleSystem.minEmitBox = new BABYLON.Vector3(-15, 1, -15); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(15, 1, 15); // To...
        
        particleSystem.particleTexture = fogTexture.clone();
        particleSystem.emitter = fountain;
        
	    particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
        particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.15);
        particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
	    particleSystem.minSize = 3.5;
        particleSystem.maxSize = 5.0;
        particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
        particleSystem.emitRate = 50000;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
        particleSystem.minAngularSpeed = -2;
	    particleSystem.maxAngularSpeed = 2;
        particleSystem.minEmitPower = .5;
        particleSystem.maxEmitPower = 1;
        particleSystem.updateSpeed = 0.005;
    
        particleSystem.start();
    }

    createNewSystem();

    /******************************** Advanced Animation Updates *********************************/
    var alpha = 0;
    var isRedLightOn = false;
    var blinkRand = 0;
    scene.registerBeforeRender(function ()
    {
        //Update dust particles.
        for(let i = 0; i < spriteArray.length; i++)
        {
            spriteArray[i].position.y -= spriteArray[i].vel;
            if(spriteArray[i].position.y < 0)
            {
                spriteArray[i].position.y = 2;
            }
        }

        //Update flickering red light.
        blinkRand--;
        if(blinkRand <= 0)
        {
            blinkRand = Math.round(Math.random() * 40);

            if(!isRedLightOn)
            {
                sphere1.material = redSpecMat;
                light2.intensity = 1;
            }
            else
            {
                sphere1.material = blackMat;
                light2.intensity = 0;
            }

            isRedLightOn = !isRedLightOn;
        }

        if(fadeFirst)
        {
            fadeFirst = false;
            alpha = 0;
            webMat.emissiveColor =      new BABYLON.Color3(0, 0, 0);
        }

        if(!fadeToLink && !waitSlides) //Give the slides a surging glow.
        {
            alpha += .05;
            var color = .1 * Math.cos(alpha) + .05;
            webMat.emissiveColor      = new BABYLON.Color3(color * .5, color * .5, color);
            mastersMat.emissiveColor  = new BABYLON.Color3(color * .5, color * .5, color);
            embeddedMat.emissiveColor = new BABYLON.Color3(color * .5, color * .5, color);
            dspMat.emissiveColor      = new BABYLON.Color3(color * .5, color * .5, color);
            gameMat.emissiveColor     = new BABYLON.Color3(color * .5, color * .5, color);
        }
        else //Fade to white.
        {
            alpha += .015;
            webMat.emissiveColor      = new BABYLON.Color3(alpha, alpha, alpha);
            mastersMat.emissiveColor  = new BABYLON.Color3(alpha, alpha, alpha);
            embeddedMat.emissiveColor = new BABYLON.Color3(alpha, alpha, alpha);
            dspMat.emissiveColor      = new BABYLON.Color3(alpha, alpha, alpha);
            gameMat.emissiveColor     = new BABYLON.Color3(alpha, alpha, alpha);
            floorMat.emissiveColor    = new BABYLON.Color3(alpha, alpha, alpha);
            ceilMat.emissiveColor     = new BABYLON.Color3(alpha, alpha, alpha);
            mat1.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat2.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat3.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat4.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat5.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat6.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat7.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat8.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
            mat9.emissiveColor        = new BABYLON.Color3(alpha, alpha, alpha);
        }

        light1.position = camera.position;
    });

    return scene;
};

/******************************************* Top Level *******************************************/
//Call the createScene function.
var scene = createScene(); 

// Register a render loop to repeatedly render the scene.
engine.runRenderLoop(function () { scene.render(); });

// Watch for browser/canvas resize events.
window.addEventListener("resize", function () { engine.resize(); });
