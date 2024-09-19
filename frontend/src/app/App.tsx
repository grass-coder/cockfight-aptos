import { Link, Outlet, useLocation } from "react-router-dom"
import { Container, AppShell, Header } from "@mantine/core"
import * as React from "react"
import CustomHeader from "../components/Header"
import "../styles/index.css"
import { useRecoilState } from 'recoil'
import {StyleState} from '../states/atoms'


const App = () => {
  const { pathname } = useLocation()
  const isHome = pathname === "/";
  const [headerHeight, setheaderHeight] = useRecoilState(StyleState)

  return (
    <AppShell
      padding="0px"
      style={{
        backgroundColor: 'black',
      }}
      header={<CustomHeader height={headerHeight} />}
    >
      <Outlet />
    </AppShell>
  )
}

export default App
