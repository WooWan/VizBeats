import { Mesh, TextureLoader } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { lerp } from 'three/src/math/MathUtils';
import { MeshAxis, YAxis } from '@/types/Axis';
import { Music } from '@prisma/client';
import { useMusicStore } from '@/store/music';
import { shallow } from 'zustand/shallow';
import { useScroll } from '@react-three/drei';

const radian = Math.PI / 180;

type Props = {
  music: Music;
  index: number;
  groupY: number;
  musics?: Music[];
};

const LERP_FACTOR = 0.05;

const MusicAlbum = ({ music, index, groupY, musics }: Props) => {
  const [originalPosition] = useState(-index * 1.5);
  const rotationRef = useRef(radian * 5 * index);
  const meshRef = useRef<Mesh>(null!);
  const { api, music: selectedMusic } = useMusicStore(
    (state) => ({ api: state.api, isAudioPlaying: state.isAudioPlaying, music: state.musicInfo }),
    shallow
  );
  const cover = useLoader(TextureLoader, music.albumCover);
  const texture = useLoader(TextureLoader, '/images/cdtexture.jpg');
  const scroll = useScroll();

  const updateRotation = ({ x, y, z }: MeshAxis) => {
    meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, x, LERP_FACTOR);
    meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, y, LERP_FACTOR);
    meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, z, LERP_FACTOR);
  };

  const updatePosition = ({ y }: YAxis) => {
    meshRef.current.position.y = lerp(meshRef.current.position.y, y, LERP_FACTOR);
  };

  useFrame(() => {
    if (!musics) return;
    rotationRef.current = (rotationRef.current + radian * 0.4) % (Math.PI * 2);
    const selectedIdx = musics.findIndex((music) => music.id === selectedMusic?.id);
    if (selectedIdx === -1) {
      meshRef.current.rotation.y = rotationRef.current;
      updatePosition({ y: originalPosition });
    } else {
      if (selectedIdx !== index) {
        meshRef.current.rotation.y = rotationRef.current;
        const indexGap = index - selectedIdx;
        if (indexGap < 0) {
          updatePosition({ y: originalPosition + 5 });
        } else {
          updatePosition({ y: originalPosition - 5 });
        }
      } else {
        updatePosition({ y: originalPosition });
        updateRotation({ x: Math.PI * 1 + radian * 90, y: Math.PI, z: Math.PI * 1 + radian * -90 });
      }
    }
  });

  // useEffect(() => {
  //   console.log('offset');
  //   if (selectedMusic !== null) {
  //     updatePosition({ y: originalPosition });
  //     updateRotation({ x: 0, y: 0, z: 0 });
  //     console.log('ihoshoisdh');
  //     api.clear();
  //     // setSelectedMusic(null);
  //   }
  // }, [scroll.offset]);

  // useEffect(() => {
  //   window.addEventListener('scroll', () => {
  //     console.log('scrolled');
  //   });

  //   if (music) {
  //     if (selectedMusic?.id === music.id) {
  //       console.log(selectedMusic);
  //     }
  //   }
  // }, []);

  return (
    <mesh
      position={[0, originalPosition, 0]}
      rotation={[0, rotationRef.current, 0]}
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        if (musics) {
          const selectedIdx = musics.findIndex((music) => music.id === selectedMusic?.id);
          if (selectedIdx !== index) {
            api.selectAudio(music);
          } else {
            api.clear();
          }
        }
      }}
    >
      <boxGeometry args={[10, 0.7, 10]} />
      <meshBasicMaterial attach="material-0" map={texture} />
      <meshBasicMaterial attach="material-1" map={texture} />
      <meshBasicMaterial attach="material-2" map={cover} />
      <meshBasicMaterial attach="material-3" map={cover} />
      <meshBasicMaterial attach="material-4" map={texture} />
      <meshBasicMaterial attach="material-5" map={texture} />
    </mesh>
  );
};
export default MusicAlbum;
