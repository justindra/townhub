import React, { useState } from 'react';
import { makeStyles, Tab, Tabs as MuiTabs } from '@material-ui/core';

const useTabsStyles = makeStyles((theme) => ({
  root: {
    position: 'sticky',
    top: -1,
    left: 0,
    right: 0,
    background: theme.palette.background.paper,
    zIndex: theme.zIndex.appBar,
  },
}));

export type TabsProps = {
  tabs: {
    label: string;
    Component: React.ElementType;
  }[];
};

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const tabsClasses = useTabsStyles();
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleChangeTab = (_event: any, tab: number) => {
    setCurrentTab(tab);
  };

  const CurrentTab = tabs[currentTab].Component;

  return (
    <>
      <MuiTabs
        value={currentTab}
        aria-label='simple tabs example'
        variant='fullWidth'
        classes={tabsClasses}
        onChange={handleChangeTab}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </MuiTabs>
      <CurrentTab />
    </>
  );
};
