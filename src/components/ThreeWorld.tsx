import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GameStage, GridPos, KamiDirection } from '../types';

interface ThreeWorldProps {
  stage: GameStage;
  lightsLit: number; // 0, 1, 2, 3
  kamiPos?: GridPos;
  kamiDir?: KamiDirection;
  kamiChestLit?: boolean;
  activeDoorChoice?: number | null; // 0 for left, 1 for right
  chucheonTalking?: boolean;
}

export const ThreeWorld: React.FC<ThreeWorldProps> = ({
  stage,
  lightsLit,
  kamiPos = { x: 0, z: 0 },
  kamiDir = 'UP',
  kamiChestLit = false,
  activeDoorChoice = null,
  chucheonTalking = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number>(0);

  // References to animated 3D parts
  const kamiGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const heartGlowLightRef = useRef<THREE.PointLight | null>(null);
  const villageLightsRef = useRef<THREE.PointLight[]>([]);
  const windowMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const eyesMeshRef = useRef<THREE.Mesh[]>([]);
  const chestLightMeshRef = useRef<THREE.Mesh | null>(null);
  const hologramGroupRef = useRef<THREE.Group | null>(null);
  const doorsGroupRef = useRef<THREE.Group | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const firefliesRef = useRef<THREE.Points | null>(null);

  // Target values for smooth animation
  const targetKamiPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetKamiRot = useRef<number>(0);
  const currentKamiRot = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e1a); // Deep atmospheric dark matching Immersive UI
    scene.fog = new THREE.FogExp2(0x0a0e1a, 0.028);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 7.5, 12);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x405580, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x8fa3d8, 1.5);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Heart Light (Choice Light in center)
    const heartLight = new THREE.PointLight(0xffea00, 0.5, 15);
    heartLight.position.set(0, 2.5, 0);
    scene.add(heartLight);
    heartGlowLightRef.current = heartLight;

    // 5. Build Environment (Mind Light Village)
    buildVillage(scene);

    // 6. Build Choice Heart Jewel on Pedestal
    buildChoiceHeart(scene);

    // 7. Build Kami Exploration Robot
    buildKami(scene);

    // 8. Build Hologram (Mission 2)
    buildHologram(scene);

    // 9. Build Doors (Mission 1)
    buildDoors(scene);

    // 10. Build Grid Path (Mission 3)
    buildGrid(scene);

    // 11. Stars & Twinkles
    buildStarField(scene);

    // Animation Loop
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Kami idle breathing & position smoothing
      if (kamiGroupRef.current) {
        kamiGroupRef.current.position.lerp(targetKamiPos.current, 0.12);
        // Shortest arc angle lerp to avoid wild 360 spinning
        let angleDiff = (targetKamiRot.current - currentKamiRot.current) % (Math.PI * 2);
        if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        currentKamiRot.current += angleDiff * 0.18;
        kamiGroupRef.current.rotation.y = currentKamiRot.current;

        // Subtle bobbing
        if (stage !== 'MISSION_3') {
          kamiGroupRef.current.position.y = Math.sin(elapsed * 2.5) * 0.06;
        }
      }

      // Kami Eyes Blinking
      blinkTimer += delta;
      if (blinkTimer > 3.5) {
        isBlinking = true;
        if (blinkTimer > 3.65) {
          isBlinking = false;
          blinkTimer = 0;
        }
      }
      eyesMeshRef.current.forEach((eye) => {
        eye.scale.y = isBlinking ? 0.1 : 1.0;
      });

      // Heart Jewel Animation
      if (heartMeshRef.current) {
        heartMeshRef.current.rotation.y = elapsed * 0.8;
        if (stage === 'RESTORATION' || stage === 'CEREMONY') {
          // Floating high in the sky and glowing
          heartMeshRef.current.position.y = 4.2 + Math.sin(elapsed * 2) * 0.3;
          heartMeshRef.current.scale.setScalar(1.4 + Math.sin(elapsed * 4) * 0.1);
        } else {
          heartMeshRef.current.position.y = 1.8 + Math.sin(elapsed * 1.5) * 0.08;
          heartMeshRef.current.scale.setScalar(1.0);
        }
      }

      // Hologram Animation (Mission 2)
      if (hologramGroupRef.current && hologramGroupRef.current.visible) {
        hologramGroupRef.current.rotation.y = elapsed * 0.5;
        const wave = Math.sin(elapsed * 3) * 0.08;
        hologramGroupRef.current.position.y = 2.2 + wave;
      }

      // Stars Twinkle
      if (starsRef.current) {
        starsRef.current.rotation.y = elapsed * 0.015;
      }

      // Fireflies floating
      if (firefliesRef.current) {
        const positions = firefliesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(elapsed + i) * 0.005;
        }
        firefliesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth && newHeight && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update dynamic visuals when props change
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    // Adjust camera and element visibility per stage
    if (stage === 'TITLE' || stage === 'INTRO') {
      camera.position.set(0, 5.5, 11);
      camera.lookAt(0, 1.2, 0);

      targetKamiPos.current.set(1.8, 0, 1.8);
      targetKamiRot.current = -0.4;

      if (hologramGroupRef.current) hologramGroupRef.current.visible = false;
      if (doorsGroupRef.current) doorsGroupRef.current.visible = false;
      if (gridGroupRef.current) gridGroupRef.current.visible = false;
    } else if (stage === 'MISSION_1') {
      camera.position.set(0, 6.0, 10.5);
      camera.lookAt(0, 1.2, 0);

      targetKamiPos.current.set(0, 0, 3.2);
      targetKamiRot.current = 0;

      if (hologramGroupRef.current) hologramGroupRef.current.visible = false;
      if (doorsGroupRef.current) doorsGroupRef.current.visible = true;
      if (gridGroupRef.current) gridGroupRef.current.visible = false;
    } else if (stage === 'MISSION_2') {
      camera.position.set(0, 5.2, 8.5);
      camera.lookAt(0, 1.5, 0);

      targetKamiPos.current.set(-1.8, 0, 1.5);
      targetKamiRot.current = 0.5;

      if (hologramGroupRef.current) {
        hologramGroupRef.current.visible = true;
        hologramGroupRef.current.position.set(1.2, 2.2, 0.8);
      }
      if (doorsGroupRef.current) doorsGroupRef.current.visible = false;
      if (gridGroupRef.current) gridGroupRef.current.visible = false;
    } else if (stage === 'MISSION_3') {
      // Elevated diagonal view specifically tuned for Tablets:
      // Puts 3x3 board and Kamibot prominently in the upper 60% of screen so tablet touch controllers never obstruct view!
      camera.position.set(0, 13.2, 8.0);
      camera.lookAt(0, 1.2, 0.4);

      if (hologramGroupRef.current) hologramGroupRef.current.visible = false;
      if (doorsGroupRef.current) doorsGroupRef.current.visible = false;
      if (gridGroupRef.current) {
        gridGroupRef.current.visible = true;
        gridGroupRef.current.position.set(0, 0.8, -0.6);
      }

      // Position Kami on grid: map x and z (elevated on grid)
      // Grid is 3x3 with step = 2.2, elevated at y = 0.95, offset z = -0.6
      const worldX = (kamiPos.x - 1) * 2.2;
      const worldZ = -0.6 + (1 - kamiPos.z) * 2.2;
      targetKamiPos.current.set(worldX, 0.95, worldZ);

      // Rotation based on Kami direction (Accurately aligned with 3D axes):
      // Kami eyes point at +Z when rot=0.
      // UP (towards -Z / top of screen): rot = PI
      // RIGHT (towards +X / right of screen): rot = PI / 2
      // DOWN (towards +Z / bottom of screen): rot = 0
      // LEFT (towards -X / left of screen): rot = -PI / 2
      switch (kamiDir) {
        case 'UP':
          targetKamiRot.current = Math.PI;
          break;
        case 'RIGHT':
          targetKamiRot.current = Math.PI / 2;
          break;
        case 'DOWN':
          targetKamiRot.current = 0;
          break;
        case 'LEFT':
          targetKamiRot.current = -Math.PI / 2;
          break;
      }
    } else if (stage === 'RESTORATION' || stage === 'CEREMONY') {
      camera.position.set(0, 7.0, 13);
      camera.lookAt(0, 2.5, 0);

      targetKamiPos.current.set(1.5, 0, 2.0);
      targetKamiRot.current = -0.3;

      if (hologramGroupRef.current) {
        hologramGroupRef.current.visible = true;
        hologramGroupRef.current.position.set(-1.8, 2.0, 1.8);
      }
      if (doorsGroupRef.current) doorsGroupRef.current.visible = false;
      if (gridGroupRef.current) gridGroupRef.current.visible = false;
    }

    // Update Heart Choice Light intensity & color
    if (heartMeshRef.current && heartGlowLightRef.current) {
      const mat = heartMeshRef.current.material as THREE.MeshStandardMaterial;
      if (lightsLit === 0 && stage !== 'RESTORATION' && stage !== 'CEREMONY') {
        mat.color.setHex(0x555566);
        mat.emissive.setHex(0x222233);
        mat.emissiveIntensity = 0.2;
        heartGlowLightRef.current.intensity = 0.2;
        heartGlowLightRef.current.color.setHex(0x555566);
      } else if (lightsLit === 1 && stage !== 'RESTORATION' && stage !== 'CEREMONY') {
        mat.color.setHex(0xffd54f);
        mat.emissive.setHex(0xffb300);
        mat.emissiveIntensity = 0.8;
        heartGlowLightRef.current.intensity = 1.8;
        heartGlowLightRef.current.color.setHex(0xffca28);
      } else if (lightsLit === 2 && stage !== 'RESTORATION' && stage !== 'CEREMONY') {
        mat.color.setHex(0xffe082);
        mat.emissive.setHex(0xffc107);
        mat.emissiveIntensity = 1.4;
        heartGlowLightRef.current.intensity = 3.2;
        heartGlowLightRef.current.color.setHex(0xffd54f);
      } else {
        // 3 lights or restoration/ceremony: dazzling golden glow
        mat.color.setHex(0xfff59d);
        mat.emissive.setHex(0xffd600);
        mat.emissiveIntensity = 2.5;
        heartGlowLightRef.current.intensity = 6.0;
        heartGlowLightRef.current.color.setHex(0xffea00);
      }
    }

    // Village Lights & Window Glowing
    const isLitVillage = lightsLit >= 3 || stage === 'RESTORATION' || stage === 'CEREMONY';
    windowMaterialsRef.current.forEach((winMat) => {
      if (isLitVillage) {
        winMat.emissive.setHex(0xffb74d);
        winMat.emissiveIntensity = 1.6;
      } else {
        winMat.emissive.setHex(0x263238);
        winMat.emissiveIntensity = 0.3;
      }
    });

    villageLightsRef.current.forEach((light) => {
      light.intensity = isLitVillage ? 1.8 : 0.2;
    });

    // Kami chest light
    if (chestLightMeshRef.current) {
      const chestMat = chestLightMeshRef.current.material as THREE.MeshStandardMaterial;
      if (kamiChestLit || lightsLit >= 3 || stage === 'RESTORATION' || stage === 'CEREMONY') {
        chestMat.emissive.setHex(0xffd600);
        chestMat.emissiveIntensity = 2.0;
      } else {
        chestMat.emissive.setHex(0x42a5f5);
        chestMat.emissiveIntensity = 0.8;
      }
    }
  }, [stage, lightsLit, kamiPos, kamiDir, kamiChestLit]);

  // Helper 1: Build Village Environment
  const buildVillage = (scene: THREE.Scene) => {
    // Ground Island (soft round cylinder)
    const islandGeo = new THREE.CylinderGeometry(14, 15, 2, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x1a243b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -1;
    island.receiveShadow = true;
    scene.add(island);

    // Central circular plaza
    const plazaGeo = new THREE.CylinderGeometry(5.5, 5.5, 0.1, 32);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x243252,
      roughness: 0.7,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.y = 0.05;
    plaza.receiveShadow = true;
    scene.add(plaza);

    // Outer Plaza Ring
    const ringGeo = new THREE.RingGeometry(5.4, 5.7, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3d5a80, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.12;
    scene.add(ring);

    // Cute Low-poly Houses around the perimeter
    const housePositions = [
      { x: -8, z: -4, rot: 0.6 },
      { x: -5, z: -8, rot: 0.2 },
      { x: 5, z: -8, rot: -0.2 },
      { x: 8, z: -4, rot: -0.6 },
      { x: -9, z: 2, rot: 1.3 },
      { x: 9, z: 2, rot: -1.3 },
    ];

    housePositions.forEach(({ x, z, rot }, idx) => {
      const houseGroup = new THREE.Group();
      houseGroup.position.set(x, 0, z);
      houseGroup.rotation.y = rot;

      // Body
      const bodyGeo = new THREE.BoxGeometry(2.4, 2.2, 2.2);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0x2e3c5a : 0x233148,
        roughness: 0.9,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 1.1;
      body.castShadow = true;
      body.receiveShadow = true;
      houseGroup.add(body);

      // Roof (Pyramid / Prism)
      const roofGeo = new THREE.ConeGeometry(2.2, 1.5, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0xc0392b : 0x2980b9,
        roughness: 0.8,
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 2.95;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      houseGroup.add(roof);

      // Glowing Window
      const winGeo = new THREE.PlaneGeometry(0.7, 0.7);
      const winMat = new THREE.MeshStandardMaterial({
        color: 0xffe082,
        emissive: 0x263238,
        emissiveIntensity: 0.3,
      });
      windowMaterialsRef.current.push(winMat);

      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(0, 1.2, 1.11);
      houseGroup.add(win);

      // House Lantern light
      const houseLight = new THREE.PointLight(0xffa726, 0.2, 6);
      houseLight.position.set(0, 1.8, 1.4);
      villageLightsRef.current.push(houseLight);
      houseGroup.add(houseLight);

      scene.add(houseGroup);
    });

    // Cute Pine Trees
    const treePositions = [
      { x: -3.5, z: -6.5, s: 0.9 },
      { x: 3.5, z: -6.5, s: 1.1 },
      { x: -7.5, z: -1, s: 0.8 },
      { x: 7.5, z: -1, s: 1.0 },
      { x: -6.5, z: 5, s: 0.7 },
      { x: 6.5, z: 5, s: 0.8 },
    ];

    treePositions.forEach(({ x, z, s }) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);
      treeGroup.scale.set(s, s, s);

      // Trunk
      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.9, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.45;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      // 3 Foliage Cones
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1b4d3e, roughness: 0.8 });
      for (let i = 0; i < 3; i++) {
        const coneGeo = new THREE.ConeGeometry(1.2 - i * 0.25, 1.0, 7);
        const cone = new THREE.Mesh(coneGeo, foliageMat);
        cone.position.y = 1.0 + i * 0.65;
        cone.castShadow = true;
        treeGroup.add(cone);
      }

      scene.add(treeGroup);
    });
  };

  // Helper 2: Choice Heart Jewel & Pedestal
  const buildChoiceHeart = (scene: THREE.Scene) => {
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, 0, 0);

    // Stone Pedestal Steps
    const step1Geo = new THREE.CylinderGeometry(1.6, 1.8, 0.4, 16);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.7 });
    const step1 = new THREE.Mesh(step1Geo, stoneMat);
    step1.position.y = 0.2;
    step1.receiveShadow = true;
    pedestalGroup.add(step1);

    const step2Geo = new THREE.CylinderGeometry(1.2, 1.3, 0.6, 16);
    const step2 = new THREE.Mesh(step2Geo, stoneMat);
    step2.position.y = 0.7;
    step2.castShadow = true;
    step2.receiveShadow = true;
    pedestalGroup.add(step2);

    // 3 Pedestal Gem Indicators (light up for missions 1, 2, 3)
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
      const gemGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0xffeb3b,
        emissive: 0xffb300,
        emissiveIntensity: 0.5,
      });
      const indicator = new THREE.Mesh(gemGeo, gemMat);
      indicator.position.set(Math.cos(angle) * 1.1, 0.8, Math.sin(angle) * 1.1);
      pedestalGroup.add(indicator);
    }

    // 3D Heart Geometry
    const shape = new THREE.Shape();
    const x = 0,
      y = 0;
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    };

    const heartGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    heartGeo.center();

    const heartMat = new THREE.MeshStandardMaterial({
      color: 0x555566,
      emissive: 0x222233,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.4,
    });

    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.scale.set(1.4, 1.4, 1.4);
    heartMesh.position.set(0, 1.8, 0);
    heartMesh.castShadow = true;
    pedestalGroup.add(heartMesh);
    heartMeshRef.current = heartMesh;

    scene.add(pedestalGroup);
  };

  // Helper 3: Kami Exploration Robot (Accurately modeled after the real Kamibot)
  const buildKami = (scene: THREE.Scene) => {
    const kami = new THREE.Group();
    kami.position.set(1.8, 0, 1.8);
    kamiGroupRef.current = kami;

    // 1. Smooth White Matte Plastic Cylindrical Body
    const bodyGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.96, 36);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.72;
    body.castShadow = true;
    kami.add(body);

    // 2. Rounded Top Bevel Lid Rim (matching the curved dome contour)
    const topBevelGeo = new THREE.TorusGeometry(0.68, 0.1, 16, 36);
    topBevelGeo.rotateX(Math.PI / 2);
    const topBevel = new THREE.Mesh(topBevelGeo, bodyMat);
    topBevel.position.y = 1.18;
    topBevel.castShadow = true;
    kami.add(topBevel);

    // Top Recessed Center Plate
    const topPlateGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.05, 32);
    const topPlateMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.3,
    });
    const topPlate = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlate.position.y = 1.2;
    kami.add(topPlate);

    // 3. Glowing Neon Cyan Circular LED Ring on Top Lid
    const topLedRingGeo = new THREE.TorusGeometry(0.52, 0.04, 16, 36);
    topLedRingGeo.rotateX(Math.PI / 2);
    const cyanLedMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00e5ff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    });
    const topLedRing = new THREE.Mesh(topLedRingGeo, cyanLedMat);
    topLedRing.position.y = 1.23;
    kami.add(topLedRing);

    // 4. Glowing Neon Cyan Horizontal Accent Line around upper body
    const midLedStripGeo = new THREE.TorusGeometry(0.785, 0.025, 12, 36);
    midLedStripGeo.rotateX(Math.PI / 2);
    const midLedStrip = new THREE.Mesh(midLedStripGeo, cyanLedMat);
    midLedStrip.position.y = 0.98;
    kami.add(midLedStrip);

    // 5. Arched Cyan LED Brow Contour (wave shape over the eyes)
    // Left arch + center notch + right arch
    const browCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.48, 0.45, 0.74),
      new THREE.Vector3(-0.42, 0.62, 0.76),
      new THREE.Vector3(-0.25, 0.66, 0.78),
      new THREE.Vector3(-0.08, 0.64, 0.78),
      new THREE.Vector3(0, 0.61, 0.78),
      new THREE.Vector3(0.08, 0.64, 0.78),
      new THREE.Vector3(0.25, 0.66, 0.78),
      new THREE.Vector3(0.42, 0.62, 0.76),
      new THREE.Vector3(0.48, 0.45, 0.74),
    ]);
    const browGeo = new THREE.TubeGeometry(browCurve, 32, 0.024, 8, false);
    const browMesh = new THREE.Mesh(browGeo, cyanLedMat);
    kami.add(browMesh);

    // 6. Two Ultrasonic Sensor / Camera Eyes (concentric metallic silver bezels + dark lenses)
    eyesMeshRef.current = [];
    const silverBezelMat = new THREE.MeshStandardMaterial({
      color: 0xdcdde1,
      metalness: 0.92,
      roughness: 0.18,
    });
    const darkLensMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.6,
    });

    [-0.24, 0.24].forEach((eyeX) => {
      // Chrome/Silver Bezel Outer Ring
      const bezelGeo = new THREE.TorusGeometry(0.14, 0.03, 16, 28);
      const bezel = new THREE.Mesh(bezelGeo, silverBezelMat);
      bezel.position.set(eyeX, 0.48, 0.77);
      kami.add(bezel);

      // Dark Sensor Lens Cylinder inside
      const lensGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24);
      lensGeo.rotateX(Math.PI / 2);
      const lens = new THREE.Mesh(lensGeo, darkLensMat);
      lens.position.set(eyeX, 0.48, 0.76);
      kami.add(lens);

      // Glowing pupil reflection point
      const pupilGeo = new THREE.SphereGeometry(0.035, 12, 12);
      const pupilMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00e5ff,
        emissiveIntensity: 1.8,
      });
      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(eyeX + 0.02, 0.49, 0.79);
      kami.add(pupil);
      eyesMeshRef.current.push(pupil);
    });

    // 7. Status / Heart Choice Glow Indicator (subtle front/base glow)
    const chestGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.04, 16);
    chestGeo.rotateX(Math.PI / 2);
    const chestMat = new THREE.MeshStandardMaterial({
      color: 0x00d2d3,
      emissive: 0x00d2d3,
      emissiveIntensity: 0.8,
    });
    const chestLight = new THREE.Mesh(chestGeo, chestMat);
    chestLight.position.set(0, 0.28, 0.76);
    kami.add(chestLight);
    chestLightMeshRef.current = chestLight;

    // 8. Tucked Rubber Wheels Underneath Sides
    [-0.78, 0.78].forEach((wheelX) => {
      const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 20);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheelMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.9,
      });
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wheelX, 0.24, 0);
      wheel.castShadow = true;
      kami.add(wheel);
    });

    scene.add(kami);
  };

  // Helper 4: Hologram for Chucheon-i (Mission 2)
  const buildHologram = (scene: THREE.Scene) => {
    const holoGroup = new THREE.Group();
    holoGroup.position.set(1.2, 2.2, 0.8);
    holoGroup.visible = false;
    hologramGroupRef.current = holoGroup;

    // Hologram Projection Beam Cylinder
    const beamGeo = new THREE.CylinderGeometry(1.2, 0.1, 2.5, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00d2d3,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = -0.5;
    holoGroup.add(beam);

    // Floating Screen / Face Platter
    const faceDiscGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.08, 32);
    faceDiscGeo.rotateX(Math.PI / 2);
    const faceDiscMat = new THREE.MeshStandardMaterial({
      color: 0x0984e3,
      emissive: 0x74b9ff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.85,
    });
    const faceDisc = new THREE.Mesh(faceDiscGeo, faceDiscMat);
    holoGroup.add(faceDisc);

    // Chucheon-i Eyes and Smile on hologram
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.3, 0.15, 0.1);
    holoGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.3, 0.15, 0.1);
    holoGroup.add(rightEye);

    // Smile line (torus arc)
    const smileGeo = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const smile = new THREE.Mesh(smileGeo, smileMat);
    smile.rotation.z = Math.PI;
    smile.position.set(0, -0.1, 0.1);
    holoGroup.add(smile);

    scene.add(holoGroup);
  };

  // Helper 5: Mission 1 Glowing Doors
  const buildDoors = (scene: THREE.Scene) => {
    const doors = new THREE.Group();
    doors.position.set(0, 0, 0);
    doors.visible = false;
    doorsGroupRef.current = doors;

    // Two arches: Left (-2.2) and Right (+2.2)
    const doorOffsets = [-2.4, 2.4];
    doorOffsets.forEach((xPos, idx) => {
      const archGroup = new THREE.Group();
      archGroup.position.set(xPos, 0, 0);

      // Arch pillar left
      const pillarGeo = new THREE.BoxGeometry(0.3, 2.6, 0.3);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x3d5a80,
        emissive: idx === 0 ? 0xff6b81 : 0x70a1ff,
        emissiveIntensity: 0.4,
      });
      const p1 = new THREE.Mesh(pillarGeo, pillarMat);
      p1.position.set(-0.9, 1.3, 0);
      archGroup.add(p1);

      const p2 = new THREE.Mesh(pillarGeo, pillarMat);
      p2.position.set(0.9, 1.3, 0);
      archGroup.add(p2);

      // Arch header
      const headerGeo = new THREE.BoxGeometry(2.1, 0.35, 0.35);
      const header = new THREE.Mesh(headerGeo, pillarMat);
      header.position.set(0, 2.7, 0);
      archGroup.add(header);

      // Glowing Portal Field
      const portalGeo = new THREE.PlaneGeometry(1.6, 2.5);
      const portalMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xff4757 : 0x1e90ff,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const portal = new THREE.Mesh(portalGeo, portalMat);
      portal.position.set(0, 1.3, 0);
      archGroup.add(portal);

      doors.add(archGroup);
    });

    scene.add(doors);
  };

  // Helper 6: Mission 3 Grid Path
  const buildGrid = (scene: THREE.Scene) => {
    const grid = new THREE.Group();
    grid.position.set(0, 0.08, 0);
    grid.visible = false;
    gridGroupRef.current = grid;

    // 3x3 tiles
    // Safe path layout:
    // Start at (0, 0) [tile (-2.2, 2.2)], goes forward to (0, 1) and (0, 2), turns right to (1, 2) and arrives at (2, 2) [Choice Light]
    for (let gx = 0; gx < 3; gx++) {
      for (let gz = 0; gz < 3; gz++) {
        const isPath =
          (gx === 0 && (gz === 0 || gz === 1 || gz === 2)) ||
          (gz === 2 && (gx === 1 || gx === 2));

        const isStart = gx === 0 && gz === 0;
        const isGoal = gx === 2 && gz === 2;

        const tileGeo = new THREE.BoxGeometry(1.8, 0.15, 1.8);
        const tileMat = new THREE.MeshStandardMaterial({
          color: isGoal ? 0xffd32a : isStart ? 0x2ed573 : isPath ? 0x487eb0 : 0x2f3640,
          emissive: isGoal ? 0xffa502 : isStart ? 0x26de81 : isPath ? 0x273c75 : 0x192a56,
          emissiveIntensity: isGoal ? 1.0 : isStart ? 0.8 : isPath ? 0.4 : 0.1,
          roughness: 0.6,
        });

        const tile = new THREE.Mesh(tileGeo, tileMat);
        const worldX = (gx - 1) * 2.2;
        const worldZ = (1 - gz) * 2.2;
        tile.position.set(worldX, 0, worldZ);
        tile.receiveShadow = true;
        grid.add(tile);

        // Goal Star or Jewel on Goal Tile
        if (isGoal) {
          const goalJewelGeo = new THREE.OctahedronGeometry(0.4, 1);
          const goalJewelMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xffa502,
            emissiveIntensity: 1.5,
          });
          const goalJewel = new THREE.Mesh(goalJewelGeo, goalJewelMat);
          goalJewel.position.set(worldX, 0.7, worldZ);
          grid.add(goalJewel);
        }
      }
    }

    scene.add(grid);
  };

  // Helper 7: Star Field & Fireflies
  const buildStarField = (scene: THREE.Scene) => {
    // Background Stars
    const starCount = 300;
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 35 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starCoords[i] = r * Math.sin(phi) * Math.cos(theta);
      starCoords[i + 1] = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 4;
      starCoords[i + 2] = r * Math.cos(phi);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      transparent: true,
      opacity: 0.8,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    starsRef.current = stars;

    // Ground Fireflies
    const fireflyCount = 40;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyCoords = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount * 3; i += 3) {
      fireflyCoords[i] = (Math.random() - 0.5) * 16;
      fireflyCoords[i + 1] = 0.5 + Math.random() * 3.5;
      fireflyCoords[i + 2] = (Math.random() - 0.5) * 16;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyCoords, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0xffea00,
      size: 0.25,
      transparent: true,
      opacity: 0.7,
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    scene.add(fireflies);
    firefliesRef.current = fireflies;
  };

  return <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" />;
};
