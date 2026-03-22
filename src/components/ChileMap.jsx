"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ChileMap() {
  // containerRef gives us a reference to the <div> that Three.js will render into
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- RENDERER ---
    // WebGLRenderer draws everything onto a <canvas> element
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // sharper on retina screens
    container.appendChild(renderer.domElement); // attach canvas to the DOM

    // --- SCENE ---
    // The scene is the 3D world — everything lives inside it
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // dark background

    // --- CAMERA ---
    // PerspectiveCamera mimics how the human eye sees (things get smaller with distance)
    // args: field of view (degrees), aspect ratio, near clip, far clip
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    // Camera position is set after the model loads so we know its size

    // --- CONTROLS ---
    // OrbitControls lets the user rotate, zoom, and pan with the mouse
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;   // smooth deceleration when you release the mouse
    controls.dampingFactor = 0.1;

    // --- LIGHTS ---
    // AmbientLight illuminates everything equally from all directions (no shadows)
    const ambientLight = new THREE.AmbientLight(0xffffff, 100);
    scene.add(ambientLight);

    // DirectionalLight acts like the sun — parallel rays from one direction
    const directionalLight = new THREE.DirectionalLight(0xffffff, 50);
    directionalLight.position.set(0, 5, 10);
    scene.add(directionalLight);

    // --- LOAD 3D MODEL ---
    // GLTFLoader reads .glb / .gltf files (the standard 3D format for the web)
    const loader = new GLTFLoader();
    loader.load("/assets/models/Chile3D.glb", (gltf) => {
      const model = gltf.scene; // gltf.scene contains all meshes in the file

      // Center the model at the world origin (0,0,0)
      // Box3 computes the axis-aligned bounding box around the whole model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center); // shift model so its center lands at origin

      // Position the camera based on how large the model is
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z); // longest axis
      camera.position.set(maxDim * 0, maxDim * 1.2, maxDim * 0.1);
      controls.target.set(0, 0, 0); // orbit around the center of the model
      controls.update();

      scene.add(model);

      // --- ANIMATION LOOP ---
      // requestAnimationFrame calls animate() ~60 times per second
      function animate() {
        requestAnimationFrame(animate);
        controls.update(); // required when dampingFactor is enabled
        renderer.render(scene, camera);
      }
      animate();
    });

    // --- RESIZE HANDLER ---
    // Keep the camera and renderer in sync when the window is resized
    function onResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix(); // must call this after changing camera properties
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", onResize);

    // --- CLEANUP ---
    // React calls this when the component unmounts — prevents memory leaks
    return () => {
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
