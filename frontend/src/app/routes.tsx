import * as React from "react"
import MainPage from "../pages/main/MainPage"
import MyPage from "../pages/my/MyPage"
import BuyChickenPage from "../pages/buychicken/BuyChickenPage"
import GamePage from "../pages/game/GamePage"
import MarketPage from "../pages/market/MarketPage"
import App from "./App"
import GameDetailsPage from "../pages/game/GameDetailsPage"
import { Space, Tabs } from "@mantine/core"
import { Link } from "react-router-dom"

const ROUTES_AND_TABS = [
  { path: "/", label: "HOME", value: "home", component: MainPage, index: true },
  { path: "/main", label: "HOME", value: "main", component: MainPage },
  { path: "/my", label: "MYPAGE", value: "my", component: MyPage },
  { path: "/buychicken/*", label: "BUY CHICKEN", value: "buychicken", component: BuyChickenPage },
  {
    path: "/game/*",
    label: "GAME",
    value: "game",
    component: GamePage,
    children: [
      { path: ":gameId", component: GameDetailsPage },
    ],
  },
  { path: "/market", label: "MARKET", value: "market", component: MarketPage },
];

const NavigationTabs = ({ height, activeTab, onTabChange }) => {
  return (
    <Tabs
      size="lg"
      value={activeTab}
      onTabChange={onTabChange}
      w="100%"
      styles={(theme) => ({
        tab: {
          padding: "0 12px",
          lineHeight: height + "px",
          fontWeight: "bold",
          color: theme.colors.white[0],
          border: "none",
          "&[data-active]": {
            color: theme.colors["custom-orange"][1],
          },
          "&:hover": {
            background: "none",
          },
        },
        tabsList: {
          borderBottom: "none",
        },
      })}
    >
      <Tabs.List position="left" grow={true}>
        {ROUTES_AND_TABS.filter(tab => tab.label).map((tab) => (
          <Link key={tab.value} to={tab.path}>
            <Tabs.Tab value={tab.value}>{tab.label}</Tabs.Tab>
          </Link>
        ))}
        <Space style={{ flex: "1 0 auto" }} />
      </Tabs.List>
    </Tabs>
  );
};

const createRoutes = () => {
  return [
    {
      path: "/",
      element: <App />,
      children: ROUTES_AND_TABS.map((route) => {
        if (route.children) {
          return {
            path: route.path,
            element: <route.component />,
            children: route.children.map((child) => ({
              path: child.path,
              element: <child.component />,
            })),
          };
        }
        return {
          path: route.path,
          element: <route.component />,
          index: route.index || false,
        };
      }),
    },
  ];
};

const routes = createRoutes();

export default routes
export { NavigationTabs, createRoutes }