import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useScene, useLocalPlayer, useNpcManager} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();
  const npcManager = useNpcManager();
  const scene = useScene();
  const npcArray = [];
  let crowdSpawned = false;
  const npcVariants = 3;
  const totalVariants = 1;
  const density = 2;

  app.name = 'crowd';

  useFrame(() => {

    if(npcManager.npcs) {
      for (var i = 0; i < npcManager.npcs.length; i++) {
        if(!npcManager.npcs[i].hasAction('dance')) {
          const newAction = {
            type: 'dance',
            animation: 'dansu',
          };
          npcManager.npcs[i].addAction(newAction);

          var minX = -80,
          maxX = -73,
          randX = Math.random() * (maxX - minX) + minX;

          var minZ = -8,
          maxZ = 8,
          randZ = Math.random() * (maxZ - minZ) + minZ;

          npcManager.npcs[i].characterPhysics.setPosition(new THREE.Vector3(randX, 8, randZ));
        }
      }
    }

    if(npcArray.length === (npcVariants*totalVariants) && !crowdSpawned) {
      for (var i = 0; i < npcArray.length; i++) {
        let mesh = npcArray[i];
        mesh.updateMatrixWorld();

        var minX = -7,
        maxX = 2,
        randX = Math.random() * (maxX - minX) + minX;

        var minZ = -22 / density,
        maxZ = 22 / density,
        randZ = Math.random() * (maxZ - minZ) + minZ;

        mesh.position.set(randX, -1.3, randZ);
        mesh.quaternion.copy(new THREE.Quaternion(0,-0.7448940576209494,0,0.6671827657553796));

        app.add(mesh);
        app.updateMatrixWorld();

        const physicsId = physics.addGeometry(mesh);
        physicsIds.push(physicsId);

      }

      crowdSpawned = true;
    }

  });
  let physicsIds = [];
  for (var i = 0; i < totalVariants; i++) {
    (async () => {
    let o = await metaversefile.createAppAsync({
      start_url: `${baseUrl}assets/Azuki_Dance_spuke.glb`,
    });
    npcArray.push(o);
  })();
  (async () => {
    let o = await metaversefile.createAppAsync({
      start_url: `${baseUrl}assets/MFers_Dance.glb`,
    });
    npcArray.push(o);
  })();
  (async () => {
    let o = await metaversefile.createAppAsync({
      start_url: `${baseUrl}assets/Wassie_Dance.glb`,
    });
    npcArray.push(o);
  })();
  }
  
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return app;
};
