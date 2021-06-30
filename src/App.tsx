import React from 'react';
import { IonPhaser } from '@ion-phaser/react'

import { gameConfig } from './game-config';

const App = () => <IonPhaser key="game" game={gameConfig} initialize />;

export default App;
