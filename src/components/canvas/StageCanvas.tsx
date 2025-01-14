import { instruments } from '@/constants/music';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import Instrument from '../3d/Instrument';
import Loading from '../Loading';
import MusicAnalyzer from '../MusicAnalyzer';
import Rig from '../3d/Rig';
import StageGround from '../3d/StageGround';

type Props = {
  audios?: HTMLAudioElement[];
};

export default function StageCanvas({ audios }: Props) {
  return (
    <Canvas
      camera={{
        position: [0, 15, 65],
        fov: 90,
        near: 0.1,
        far: 1000,
        zoom: 0.95
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['black']} />
      <Suspense>
        <Rig>
          <StageGround />
          {instruments.map((instrument) => (
            <Instrument key={instrument.type} {...instrument} />
          ))}
          {audios && (
            <>
              <MusicAnalyzer audio={audios[0]} fftSize={128} centerPos={[0, -37, 30]} radius={8} />
              <MusicAnalyzer audio={audios[1]} fftSize={128} centerPos={[32.5, -37, -16.5]} radius={18} />
              <MusicAnalyzer audio={audios[2]} fftSize={128} centerPos={[75, -37, 10]} radius={8} />
              <MusicAnalyzer audio={audios[3]} fftSize={128} centerPos={[-75, -37, 10]} radius={0} />
              <MusicAnalyzer audio={audios[4]} fftSize={128} centerPos={[-32.5, -37, -16.5]} radius={18} />
            </>
          )}
        </Rig>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <ambientLight intensity={0.4} />
    </Canvas>
  );
}
