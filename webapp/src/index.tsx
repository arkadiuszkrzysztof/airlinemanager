import React from 'react'
import ReactDOM from 'react-dom/client'
import './custom.scss'
import App from './components/App'
import { RouterProvider, createBrowserRouter, redirect, type LoaderFunction } from 'react-router-dom'
import ErrorPage from './components/ErrorPage'
import Operations from './components/tabs/Operations'
import Dashboard from './components/tabs/Dashboard'
import Map from './components/tabs/Map'
import Missions from './components/tabs/Missions'
import CreateAirline from './components/CreateAirline'
import { GameController } from './controllers/GameController'

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
    path: '/operations',
    element: <App Tab={Operations} />,
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
