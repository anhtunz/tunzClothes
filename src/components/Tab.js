import React from 'react'
import { useState, useEffect } from 'react';
import ClothesList from './home/ListClothes/List_Clothes';
import { getTop4ProductsByID } from '../APi';

function TabContent({categoryID}) {

    const [product, setProduct] = useState([])
    useEffect(() => {
        async function fetchData() {
            const top4Product = await getTop4ProductsByID(categoryID);
            setProduct(top4Product)
        }
        fetchData();
    }, [])

  return (
      <div
          style={{
            padding:10
        }}
      >
          <ClothesList
              title={""}
              products={product}
          />  
    </div>
  )
}

export default TabContent