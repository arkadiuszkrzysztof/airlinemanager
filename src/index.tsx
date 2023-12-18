import React from 'react'
import ReactDOM from 'react-dom/client'
import './custom.scss'
import App from './components/App'
import { RouterProvider, createBrowserRouter, redirect, type LoaderFunction } from 'react-router-dom'
import ErrorPage from './components/ErrorPage'
import Market from './components/tabs/Market'
import Dashboard from './components/tabs/Dashboard'
import Hangar from './components/tabs/Hangar'
import Map from './components/tabs/Map'
import Missions from './components/tabs/Missions'
import CreateAirline from './components/CreateAirline'
import { GameController } from './controllers/GameController'
import Statistics from './components/tabs/Statistics'
import Manual from './components/tabs/Manual'
import Settings from './components/tabs/Settings'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const gameLoader: LoaderFunction = () => {
  const isStarted = GameController.isGameStarted()

  if (isStarted) {
    return redirect('/dashboard')
  } else {
    return null
  }
}

const createAirlineLoader: LoaderFunction = () => {
  const isStarted = GameController.isGameStarted()

  if (isStarted) {
    return null
  } else {
    return redirect('/')
  }
}

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <App Tab={Dashboard} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/market',
    element: <App Tab={Market} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/hangar',
    element: <App Tab={Hangar} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/missions',
    element: <App Tab={Missions} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/map',
    element: <App Tab={Map} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/statistics',
    element: <App Tab={Statistics} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/manual',
    element: <App Tab={Manual} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/settings',
    element: <App Tab={Settings} />,
    errorElement: <ErrorPage />,
    loader: createAirlineLoader
  },
  {
    path: '/',
    element: <CreateAirline />,
    errorElement: <ErrorPage />,
    loader: gameLoader
  }
])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
