import React from 'react'
import { useParams,useLocation } from 'react-router-dom';
import { Divider, Flex, Pagination } from 'antd';
import { getAllProductsSortedAZ } from '../../APi';
import ClothesList from '../../components/home/ListClothes/List_Clothes';

function SearchPage() {
    const params = useParams();
    const location = useLocation();
    const queryFromState = location.state?.query;
    const [products, setProducts] = React.useState([])
    const [filteredProducts, setFilteredProducts] = React.useState([]);

    React.useEffect(() => {
        const fetchProducts = async () => {
            const products = await getAllProductsSortedAZ();
            setProducts(products)
            
        };
        fetchProducts();
    }, []);
    console.log("All Products: " +products.length);
    const filterProductsByName = (products, query) => {
        const lowercaseQuery = query.toLowerCase();
        return products.filter(product =>
            product.pr_name.toLowerCase().includes(lowercaseQuery)
        );
    };
    React.useEffect(() => {
        if (queryFromState.trim() !== '') {
            const filteredProducts = filterProductsByName(products, queryFromState);
            setFilteredProducts(filteredProducts);
        } else {
            setFilteredProducts(products);
        }
    }, [queryFromState, products]);
    console.log("Filtered Products: " + filteredProducts.length);

  return (
      <div>
        <Flex justify={'center'} align={'flex-start'}>
              <h1>Kết quả tìm kiếm cho: {queryFromState}</h1>
        </Flex>
        <Flex justify={'center'} align={'flex-start'}>
            <h6>Có <strong> {filteredProducts.length} sản phẩm </strong> cho tìm kiếm</h6>
        </Flex>
        <Flex justify={'center'} align={'flex-start'} >
            <Divider/>
        </Flex>
        <Flex justify={'center'} align={'flex-start'} >
            <ClothesList title={""} products={filteredProducts} />
          </Flex>
          <Flex justify={'center'} align={'flex-start'} >
              <Pagination defaultCurrent={1} total={10} />
          </Flex>  
          
      </div>
  )
}

export default SearchPage