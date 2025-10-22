"use client"

import {useGLTF} from '@react-three/drei';
import {useEffect, useState} from 'react';
import * as THREE from 'three';

export default function VWBeetle() {
	const {scene} = useGLTF('/models/volkswagen_beetle.glb');
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		const checkMobile = (): void => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkMobile();

		window.addEventListener('resize', checkMobile);

		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		scene.traverse((child: THREE.Object3D) => {
			if ((child as THREE.Mesh).isMesh) {
				(child as THREE.Mesh).castShadow = true;
				(child as THREE.Mesh).receiveShadow = true;
			}
		});
	}, [scene]);
	if (isMobile) {
		return <></>
	}
	return <primitive
		object={scene}
		scale={1.5}
		position={isMobile ? [0, -0.5, 0] : [2, -0.5, -0.3]}
	/>;
}