import React from 'react';
import { Room } from './Room';
import { Desk } from './Desk';
import { Computer } from './Computer';
import { Lamp } from './Lamp';
import { Clock } from './Clock';
import { Door } from './Door';
import { WindowView } from './WindowView';
import { ServerRack } from './ServerRack';
import { DustParticles } from './DustParticles';
import { Player } from './Player';
import { Lighting } from './Lighting';

export const Scene: React.FC = () => {
  return (
    <>
      {/* Subtle atmospheric scene fog matching the deep night palette */}
      <fog attach="fog" args={['#080c18', 12, 30]} />

      {/* Dynamic and ambient lighting */}
      <Lighting />

      {/* Floating dust motes */}
      <DustParticles />

      {/* Architectural Room */}
      <Room />

      {/* Window looking out into rainy cyber night */}
      <WindowView />

      {/* Sturdy Desk & Workstation */}
      <Desk />

      {/* Computer CRT Terminal on desk */}
      <Computer />

      {/* Articulated Desk Lamp */}
      <Lamp />

      {/* Wall Chronometer Clock */}
      <Clock />

      {/* Chamber Blast Door */}
      <Door />

      {/* Archival Server Rack */}
      <ServerRack />

      {/* Explorer Player Character */}
      <Player />
    </>
  );
};
