import React from 'react';
import { Tabs, Space } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from './routes';

const NavigationTabs = ({ height }: any) => {
  const location = useLocation();
  const navigate = useNavigate();

  const labelToPathMap: { [label: string]: string } = {};
  routes[0].children.forEach((route) => {
    if (route.label) {
      const path = route.path ? `/${route.path}` : '/';
      labelToPathMap[route.label] = path;
    }
  });

  const currentPath = location.pathname;
  let activeLabel = 'Main';

  for (const [label, path] of Object.entries(labelToPathMap)) {
    if (currentPath === path || currentPath.startsWith(path + '/')) {
      activeLabel = label;
      break;
    }
  }

  const handleTabChange = (value: string) => {
    const path = labelToPathMap[value];
    if (path) {
      navigate(path);
    }
  };

  return (
    <Tabs
      value={activeLabel}
      onTabChange={handleTabChange}
      w="100%"
      styles={{
        tabLabel: {
          padding: '8px 16px', // Adjust padding to increase tab size
          margin: '0 4px', // Add horizontal margin between tabs
        },
        tab: {
          lineHeight: '1.2',
          fontWeight: 700, // Increase font weight
          fontSize: '16px', // Increase font size
          color: 'white',
          border: `2px solid transparent`, // Default border
          borderRadius: '8px', // Rounded corners
          backgroundColor: '#333', // Tab background color
          transition: 'background-color 0.2s ease, border-color 0.2s ease', // Smooth transition
          '&[data-active]': {
            color: 'white',
            backgroundColor: '#ff7f50', // Active tab background
            borderColor: '#ff7f50', // Active tab border
          },
          '&:hover': {
            backgroundColor: '#444', // Background on hover
          },
        },
        tabsList: {
          borderBottom: 'none',
          padding: '4px', // Add padding to the tabs list
          display: 'flex',
          alignItems: 'center',
        },
      }}
    >
      <Tabs.List position="left">
        {routes[0].children
          .filter((route) => route.label)
          .map((route) => (
            <Tabs.Tab key={route.label} value={route.label}>
              {route.label}
            </Tabs.Tab>
          ))}
        <Space style={{ flex: '1 0 auto' }} />
      </Tabs.List>
    </Tabs>
  );
};

export default NavigationTabs;
