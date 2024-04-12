import { db } from "../Services/firebase";
import { collection, getDocs, where, query, doc, getDoc, orderBy, limit, updateDoc, onSnapshot } from 'firebase/firestore';

/**
 * Lấy thông tin người dùng đăng nhập
 * @returns 
 */
export const getUserData = async () => {
    const uid = localStorage.getItem("uid");
    if (uid) {
        try {
            const userQuery = query(collection(db, "users"), where("uid", "==", uid));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                // console.log(userData);
                return userData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Lỗi lấy Data User", error);
            return null;
        }
    } else {
        return null;
    }
}

/**
 * Lấy ra tất cả các trường trong bảng Category
 * @returns 
 */
export const getAllCatergory = async () => {
    try {
        const categoryQuerry = query(collection(db, "category"))
        console.log('Câu truy vấn:', categoryQuerry.path);
        const querySnapshot = await getDocs(categoryQuerry);
        if (!querySnapshot.empty) {
            const categoryData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // console.log(categoryData);
            return categoryData;
        } else {
            return null;
        }
    } catch (error) {

    }
}

/**
 * Lấy ra các trường con trong bảng catgory_detail ứng với id trong bảng category
 * @param {*} parentCategory 
 * @returns 
 */
export const getAllChildCategory = async (parentCategory) => {
    try {
        const categoryRef = collection(db, 'category-detail');
        const q = query(categoryRef, where('detail_category', "==", parentCategory));
        const querySnapshot = await getDocs(q);

        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // console.log(categories);
        return categories;
    } catch (error) {
        console.error('Lỗi khi lấy giá trị con:', error);
        return [];
    }
};

/**
 *  Lấy tất cả sản phầm theo thể loại (Quần, áo)
 * @param {*} categoryId 
 * @returns 
 */ 
export const getAllProductsByCategoryID = async (categoryId) => {
    try {
        const productCollectionRef = collection(db, 'products');
        const q = query(productCollectionRef, where('category_detail', '==', categoryId));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // console.log(products);
        return products;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm theo category:', error);
        return [];
    }
};

/**
 * Lấy tất cả sản phẩm theo thể loại, từ A-Z
 * @param {*} categoryId 
 * @returns 
 */

export const getAllProductsSortedAZ = async () => {
    try {
        const productCollectionRef = collection(db, 'products');
        const q = query(productCollectionRef, orderBy('pr_name', 'asc'));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // console.log(products);
        return products;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm và sắp xếp:', error);
        return [];
    }
};

/**
 * Lấy tất cả sản phẩm theo thể loại, từ Z-A
 * @param {*} categoryId 
 * @returns 
 */
export const getAllProductsSortedZA = async () => {
    try {
        const productCollectionRef = collection(db, 'products');
        const q = query(productCollectionRef, orderBy('pr_name', 'desc'));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // console.log(products);
        return products;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm và sắp xếp:', error);
        return [];
    }
};

/**
 * Lấy ra 4 sản phẩm có lượt bán cao nhất
 * @returns 
 */
export const getTop4ProductsBySold = async () => {
    try {
        const productCollectionRef = collection(db, 'products');
        const q = query(productCollectionRef, orderBy('pr_sold', 'desc'), limit(8));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // console.log(typeof products);
        return products;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        return [];
    }
};

export const getTop4ProductsByID = async (categoryID) => {
    try {
        const productCollectionRef = collection(db, 'products');
        const q = query(productCollectionRef, where('category_detail',"==", categoryID), limit(4));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // console.log(typeof products);
        return products;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        return [];
    }
};

export const getCategoryDetailData = async (categoryID) => {
        try {
            const userQuery = doc(db, "category-detail", categoryID);
            const querySnapshot = await getDoc(userQuery);
            if (!querySnapshot.empty) {
                const categoryData = querySnapshot.data();
                return categoryData;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Lỗi lấy Data CategoryDetails: ", error);
            return null;
        }
}

export const getProductByID = async (productId) => {
    try {
        const productQuery = doc(db, 'products', productId);
        const querySnapshot = await getDoc(productQuery);
        if (querySnapshot.exists()) { // Kiểm tra xem document có tồn tại không
            const productData = querySnapshot.data();
            const productID = querySnapshot.id;
            return { ...productData, id: productID };
        } else {
            console.log("Phần tử con rỗng!!!!");
            return null;
        }
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
}


export const getCartItemByUID = async (uid) => {
    try {
        const cartQuery = doc(db, 'cart ', uid);
        const querySnapshot = await getDoc(cartQuery);
        if (querySnapshot.exists()) { // Kiểm tra xem document có tồn tại không
            const cartData = querySnapshot.data();
            const cartID = querySnapshot.id; 
            return { ...cartData, id: cartID };
        } else {
            console.log("Phần tử con rỗng!!!!");
            return null;
        }
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};

export const increaseQuantityAndUpdateFirestore = async (uid,pr_id, pr_color, pr_size) => {
    try {
        // Lấy dữ liệu của giỏ hàng từ Firestore
        const cartDocRef = doc(db, 'cart ', uid); // Thay 'user_id_or_cart_id' bằng ID của giỏ hàng hoặc ID của người dùng

        const cartDocSnapshot = await getDoc(cartDocRef);
        if (cartDocSnapshot.exists()) {
            const cartData = cartDocSnapshot.data();

            // Tìm kiếm phần tử trong mảng items dựa trên pr_id, pr_color, và pr_size
            const itemIndex = cartData.items.findIndex(item => item.pr_id === pr_id && item.pr_color === pr_color && item.pr_size === pr_size);

            // Nếu tìm thấy phần tử
            if (itemIndex !== -1) {
                // Tăng số lượng lên 1
                cartData.items[itemIndex].quantity++;

                // Cập nhật giá trị quantity của tài liệu đó trong Firestore
                await updateDoc(cartDocRef, { items: cartData.items });

                console.log(`Số lượng của sản phẩm ${pr_id} (${pr_color}, ${pr_size}) đã được cập nhật.`);
            } else {
                console.log(`Không tìm thấy sản phẩm ${pr_id} (${pr_color}, ${pr_size}) trong giỏ hàng.`);
            }
        } else {
            console.log('Giỏ hàng không tồn tại.');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu trong Firestore:', error);
    }
};