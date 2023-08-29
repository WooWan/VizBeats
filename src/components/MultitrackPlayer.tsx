import React, { ChangeEvent, useEffect, useRef, useState, Suspense } from 'react';
import { Button } from './ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StageGround from '@/components/StageGround';
import Rig from '@/components/Rig';
import MusicAnalyzer from '@/components/MusicAnalyzer';
import Loading from '@/components/Loading';
import { instruments } from '@/constants/music';
import MusicPlayToggleButton from './MusicPlayToggleButton';
import { useMusicStore } from '@/store/music';
import Instrument from './Instrument';
import { Volume2Icon, VolumeXIcon } from 'lucide-react';
import { InstrumentData } from '@/types/instrument';
import Multitrack from 'wavesurfer-multitrack';
import { shallow } from 'zustand/shallow';
import { cn } from '@/lib/utils';

const TRACK_HEIGHT = 100;

export default function MultitrackPlayer() {
  const playerRef = useRef<HTMLDivElement>(null!);
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const { instrumentState, api } = useMusicStore(
    (state) => ({ instrumentState: state.instruments, api: state.api }),
    shallow
  );
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const allMuted = Object.values(instrumentState).every((instrument) => instrument.isMuted);

  useEffect(() => {
    const multitrack = Multitrack.create(
      [
        {
          id: 0,
          url: '/music/mp3/vocal.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 1,
          url: '/music/mp3/drum.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 2,
          url: '/music/mp3/guitar.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 3,
          url: '/music/mp3/bass.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 4,
          url: '/music/mp3/piano.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: 120,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        }
      ],
      {
        container: playerRef.current, // required!
        minPxPerSec: 5, // zoom level
        rightButtonDrag: true, // drag tracks with the right mouse button
        cursorWidth: 2,
        cursorColor: '#D72F21', // 진행 바 색상
        trackBorderColor: 'black',
        envelopeOptions: {
          lineWidth: '0',
          dragPointSize: 0
        }
      }
    );

    multitrack.once('canplay', () => {
      setWavesurfer(multitrack);
    });

    return () => {
      multitrack.destroy();
    };
  }, []);

  const updateMasterVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedVolume = event.target.valueAsNumber / 100;
    Object.values(instruments).forEach((instrument, index) => {
      api.updateVolume(instrument.type, updatedVolume);
      wavesurfer.audios[index].volume = updatedVolume;
    });
  };

  const pauseAndResumeAll = () => {
    if (wavesurfer?.isPlaying()) {
      api.stopAudio();
      wavesurfer.pause();
    } else {
      api.playAudio();
      wavesurfer?.play();
    }
  };

  const muteAll = () => {
    Object.values(instruments).forEach((instrument, index) => {
      api.muteAudio(instrument.type);
      wavesurfer.audios[index].volume = 0;
    });
  };

  const unmuteAll = () => {
    Object.values(instruments).forEach((instrument, index) => {
      api.unMuteAudio(instrument.type);
      wavesurfer.audios[index].volume = instrumentState[instrument.type].volume;
    });
  };

  const updateTrackVolume = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const updatedVolume = event.target.valueAsNumber / 100;
    const audioIndex = instruments.findIndex((instrument) => instrument.id === id);
    const instrument = instruments[audioIndex];
    api.updateVolume(instrument.type, updatedVolume);
    wavesurfer.audios[audioIndex].volume = updatedVolume;
  };

  const muteToggle = (track: InstrumentData) => {
    const isMuted = instrumentState[track.type].isMuted;
    const instrumentIndex = instruments.findIndex((instrument) => instrument.id === track.id);
    const instrument = instrumentState[track.type];
    wavesurfer.audios[instrumentIndex].volume = isMuted ? instrument.volume : 0;
    isMuted ? api.unMuteAudio(track.type) : api.muteAudio(track.type);
  };

  const soloTrack = (type: string) => {
    Object.values(instruments).forEach((instrument, index) => {
      if (instrument.type === type) {
        api.unMuteAudio(instrument.type);
        wavesurfer.audios[index].volume = instrumentState[instrument.type].volume;
      } else {
        api.muteAudio(instrument.type);
        wavesurfer.audios[index].volume = 0;
      }
    });
  };
  
  return (
    <main>
      <div className="absolute right-5 top-4 z-10 flex items-center gap-x-1.5">
        <Button onClick={() => setIsPlayerOpen(!isPlayerOpen)} className="bg-zinc-950 text-base text-zinc-100">
          <span>{isPlayerOpen ? 'Hide Controller' : 'Show Controller'}</span>
        </Button>
        <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative right-0" />
      </div>
      <Suspense fallback={<Loading />}>
        <Canvas
          camera={{
            position: [0, 20, 0],
            fov: 80,
            near: 0.1,
            far: 300,
            zoom: 1
          }}
          style={{ width: '100vw', height: '100vh' }}
        >
          <color attach="background" args={['white']} />
          <Suspense fallback={null}>
            <Rig>
              <StageGround />
              {instruments.map((instrument) => (
                <Instrument key={instrument.type} {...instrument} />
              ))}
              {wavesurfer && (
                <>
                  <MusicAnalyzer
                    audio={wavesurfer?.wavesurfers[0].media}
                    fftSize={128}
                    centerPos={[0, -26, 30]}
                    radius={8}
                  />
                  <MusicAnalyzer
                    audio={wavesurfer.wavesurfers[1].media}
                    fftSize={128}
                    centerPos={[32, -26, -10]}
                    radius={18}
                  />
                  <MusicAnalyzer
                    audio={wavesurfer.wavesurfers[2].media}
                    fftSize={128}
                    centerPos={[75, -26, 10]}
                    radius={8}
                  />
                  <MusicAnalyzer
                    audio={wavesurfer.wavesurfers[3].media}
                    fftSize={128}
                    centerPos={[-75, -26, 10]}
                    radius={4}
                  />
                  <MusicAnalyzer
                    audio={wavesurfer.wavesurfers[4].media}
                    fftSize={128}
                    centerPos={[-32, -26, -10]}
                    radius={18}
                  />
                </>
              )}
            </Rig>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          <ambientLight intensity={0.4} />
        </Canvas>
      </Suspense>
      <div
        className={cn('fixed inset-0 bg-background/50 opacity-30 backdrop-blur-sm', {
          hidden: !isPlayerOpen
        })}
        onClick={() => setIsPlayerOpen(false)}
      />
      <section
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex w-full flex-col overflow-y-scroll bg-zinc-900/[0.75] pl-5 pt-5 transition-transform duration-200 ease-in',
          {
            'translate-y-[620px]': !isPlayerOpen
          }
        )}
      >
        <div className="flex gap-x-2">
          <label className="flex items-center">
            <input type="range" min="0" max="100" onChange={updateMasterVolume} />
          </label>
          <button className="text-zinc-100" onClick={allMuted ? unmuteAll : muteAll}>
            {allMuted ? <VolumeXIcon /> : <Volume2Icon />}
          </button>
          <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative right-0 top-0" />
        </div>
        <section className="flex gap-x-4">
          <ul className="flex h-full flex-col">
            {instruments.map((instrument) => {
              const { isMuted, volume } = instrumentState[instrument.type];
              return (
                <li className="flex h-[102px] flex-col justify-center" key={instrument.type}>
                  <div className="flex items-center justify-start">
                    <button className="rounded bg-gray-500 px-1" onClick={() => soloTrack(instrument.type)}>
                      <span className="text-sm text-zinc-100">S</span>
                    </button>
                    <button className="pl-2 text-zinc-200" onClick={() => muteToggle(instrument)}>
                      {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
                    </button>
                  </div>
                  <label className="block">
                    <input
                      value={volume * 100}
                      onChange={(e) => updateTrackVolume(instrument.id, e)}
                      type="range"
                      min="0"
                      max="100"
                    />
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="w-full pt-2.5" ref={playerRef} />
        </section>
      </section>
    </main>
  );
}
