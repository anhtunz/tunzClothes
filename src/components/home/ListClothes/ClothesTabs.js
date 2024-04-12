import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import ClothesList from './List_Clothes';
import { getTop4ProductsByID } from '../../../APi';
import TabContent from '../../Tab';

export default function ClothesTabs() {
    
    const tabsData = [
        { name: "Áo Polo", id: "iZWRg0K3YTVJmEhyAV29" },
        { name: "Áo Sơ Mi", id: "8iFxghJVk4iXoT7f7CFb" },
        { name: "Quần dài", id: "e95tqKQseFZbYKM5MJGn" }
    ];

    return (
        <Tabs
            defaultActiveKey="1"
            centered
            items={tabsData.map((tab => ({
                label: tab.name,
                key: tab.id,
                children: <TabContent
                    categoryID={tab.id}
                />,
            })) )}
        />
    );
}