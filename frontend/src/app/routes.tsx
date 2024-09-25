import React from 'react';
import App from './App';
import MainPage from '../pages/main/MainPage';
import MyPage from '../pages/my/MyPage';
import BuyChickenPage from '../pages/buychicken/BuyChickenPage';
import GamePage from '../pages/game/GamePage';
import MarketPage from '../pages/market/MarketPage';
import GameDetailsPage from '../pages/game/GameDetailsPage';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <MainPage />, label: 'Main' }, 
      { path: 'my', element: <MyPage />, label: 'MyPage' },
      { path: 'cockie', element: <BuyChickenPage />, label: 'Cockie' },
      { path: 'market', element: <MarketPage />, label: 'Market' },
      {
        path: 'game',
        element: <GamePage />,
        label: 'Game',
        children: [
          { path: ':id', element: <GameDetailsPage /> }, 
        ],
      },
    ],
  },
];

export default routes;