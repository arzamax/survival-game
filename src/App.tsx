import React from 'react';
import { IonPhaser } from '@ion-phaser/react'

import { gameConfig } from './game-config';

function App() {
  return (
    <IonPhaser game={gameConfig} initialize />
  );
}

export default App;
