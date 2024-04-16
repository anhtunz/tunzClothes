import { db, auth } from "../Services/firebase";
import { collection, getDocs, where, query, doc, getDoc, orderBy, limit, updateDoc, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updatePassword, updateEmail } from "firebase/auth";
/**
 * Lấy thông tin người dùng đăng nhập
 * @returns 
 */
export const getUserData = async (uid) => {
    // const uid = localStorage.getItem("uid");
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

/**
 * Lấy ra 4 sản phẩm theo ID
 * @param {*} categoryID 
 * @returns 
 */
export const getTop4ProductsByID = async (categoryID) => {
    try {
        const productCollectionRef = collection(db, 'products');
        const q = query(productCollectionRef, where('category_detail', "==", categoryID), limit(4));
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

/**
 * Lấy thông tin chi tiết về một thể loại
 * @param {*} categoryID 
 * @returns 
 */
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

/**
 * Lấy thông tin sản phẩm theo ID
 * @param {*} productId 
 * @returns 
 */
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

/**
 * Lấy giỏ hàng của người dùng theo uid
 * @param {*} uid 
 * @returns 
 */
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

/**
 * Tăng số lượng của phầm tử trong cart
 * @param {*} uid 
 * @param {*} pr_id 
 * @param {*} pr_color 
 * @param {*} pr_size 
 */
export const increaseQuantityAndUpdateFirestore = async (uid, pr_id, pr_color, pr_size) => {
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



/**
 * Lắng 
 */
// export const getCartItemRealtimeByUID = (uid, callback) => {
//     try {
//         const cartQuery = doc(db, 'cart ', uid);
//         return onSnapshot(cartQuery, (snapshot) => {
//             if (snapshot.exists()) {
//                 const cartData = snapshot.data();
//                 const cartID = snapshot.id;
//                 const updatedCartData = { ...cartData, id: cartID };
//                 callback(updatedCartData);
//             } else {
//                 console.log("Phần tử con rỗng!!!!");
//                 callback(null);
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching product by ID:', error);
//         throw error;
//     }
// };


/**
 * Cập nhật trường image trong table users
 * @param {*} uid 
 * @param {*} image 
 * @returns 
 */
export const updateProfileImage = async (uid, image) => {
    if (uid && image) {
        try {
            const userQuery = query(collection(db, 'users'), where('uid', '==', uid));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const userDocRef = doc(db, 'users', querySnapshot.docs[0].id);
                await updateDoc(userDocRef, { image: image });
                console.log('Đã cập nhật hình ảnh cho người dùng có uid:', uid);
                return true;
            } else {
                console.error('Người dùng không tồn tại');
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật hình ảnh:', error);
            return false;
        }
    } else {
        console.error('Thiếu thông tin người dùng hoặc hình ảnh mới');
        return false;
    }
};

/**
 * Cập nhật trường password theo uid
 * @param {*} uid 
 * @param {*} newPassword 
 * @returns 
 */
export const updatePasswordFirestore = async (uid, newPassword) => {
    if (uid && newPassword) {
        try {
            const userQuery = query(collection(db, 'users'), where('uid', '==', uid));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const userDocRef = doc(db, 'users', querySnapshot.docs[0].id);
                await updateDoc(userDocRef, { password: newPassword });
                console.log('Đã cập nhật mật khẩu cho người dùng có uid:', uid);
                return true;
            } else {
                console.error('Người dùng không tồn tại');
                return false;
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật mật khẩu:', error);
            return false;
        }
    } else {
        console.error('Thiếu thông tin người dùng hoặc mật khẩu mới');
        return false;
    }
};

/**
 * Đổi mật khẩu người dùng trong authen và table users
 * @param {*} password 
 * @returns 
 */
export const changeUserPassword = async (password) => {
    const user = auth.currentUser;
    console.log(user.uid);
    try {
        await updatePassword(user, password);
        await updatePasswordFirestore(user.uid, password);
        // Nếu không có lỗi, thông báo thành công
        console.log('Mật khẩu đã được thay đổi thành công');
        // Bạn có thể sử dụng một thư viện thông báo như Ant Design để hiển thị thông báo
        return true;
    } catch (error) {
        // Nếu có lỗi, xử lý và thông báo lỗi
        console.error('Lỗi khi thay đổi mật khẩu:', error.message);
        // Bạn có thể sử dụng một thư viện thông báo như Ant Design để hiển thị thông báo
        return false;
    }
}

/**
 * Thêm người dùng bởi admin
 * @param {*} user 
 * @returns 
 */
export const addNewUser = async (user) => {
    // console.log("created_time: " + user.created_time);
    // console.log("created_time: " + typeof user.created_time);
    // console.log("description" + user.description);
    // console.log("description" + typeof user.description);
    // console.log("email: " + user.email);
    // console.log("email: " + typeof user.email);
    // console.log("password: " + user.password);
    // console.log("password: " + typeof user.password);
    // console.log("role: " + user.role);
    // console.log("role: " + typeof user.role);
    // console.log("updated_time: " + user.updated_time);
    // console.log("updated_time: " + typeof user.updated_time);
    // console.log("username: " + user.username);
    // console.log("username: " + typeof user.username);
    // console.log("purchase_ordered: " + user.purchase_ordered);
    // console.log("purchase_ordered: " + typeof user.purchase_ordered);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        const userRegister = userCredential.user;
        console.log("Đăng ký thành công", userRegister);
        await addDoc(collection(db, "users"), {
            created_time: user.created_time,
            description: user.description,
            email: user.email,
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
            password: user.password,
            role: user.role,
            status: user.status,
            updated_time: user.updated_time,
            username: user.username,
            uid: userRegister.uid,
            purchase_ordered: user.purchase_ordered
        });
        return true;
    } catch (error) {
        console.error("Đăng ký thất bại", error.message);
        return false;
    }
}


/**
 * Lấy ra tất cả người dùng trong table users
 * @returns 
 */
export const getAllUser = async () => {
    try {
        const userQuerry = query(collection(db, "users"))
        const querySnapshot = await getDocs(userQuerry);
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return userData;
        } else {
            return null;
        }
    } catch (error) {

    }
}

/**
 * Cập nhật thông tin người dùng by ADMIN
 * @param {*} user 
 * @returns 
 */
export const updateUser = async (user) => {
    // console.log("created_time: " + user.created_time);
    // console.log("created_time: " + typeof user.created_time);
    // console.log("description" + user.description);
    // console.log("description" + typeof user.description);
    // console.log("email: " + user.email);
    // console.log("email: " + typeof user.email);
    // console.log("password: " + user.password);
    // console.log("password: " + typeof user.password);
    // console.log("role: " + user.role);
    // console.log("role: " + typeof user.role);
    // console.log("updated_time: " + user.updated_time);
    // console.log("updated_time: " + typeof user.updated_time);
    // console.log("username: " + user.username);
    // console.log("username: " + typeof user.username);
    // console.log("purchase_ordered: " + user.purchase_ordered);
    // console.log("purchase_ordered: " + typeof user.purchase_ordered);
    try {
        const userAuth = auth.currentUser;
        await updatePassword(userAuth, user.password)
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
            const userDocRef = doc(db, 'users', querySnapshot.docs[0].id);
            await updateDoc(userDocRef, {
                description: user.description,
                email: user.email,
                image: user.image,
                password: user.password,
                role: user.role,
                updated_time: user.updated_time,
                username: user.username,
            });
            console.log('Đã cập nhật thông tin cho người dùng có uid:', user.uid);
            return true;
        } else {
            console.error('Cập nhật người dùng không thành công');
            return false;
        }
    } catch (error) {
        console.error("Cập nh thất bại", error.message);
    }
}

/**
 * Cập nhật thông tin người dùng by USER
 * @param {*} user 
 * @returns 
 */
export const updateProfilebyUser = async (user) => {
    const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
        const userDocRef = doc(db, 'users', querySnapshot.docs[0].id);
        await updateDoc(userDocRef, {
            description: user.description,
            image: user.image,
            username: user.username,
            updated_time: user.updated_time,
        });
        console.log('Đã cập nhật thông tin cho người dùng có uid:', user.uid);
        return true;
    } else {
        console.error('Cập nhật người dùng không thành công');
        return false;
    }
}

/**
 * Thêm sản phẩm mới
 * @param {*} product 
 * @returns 
 */
export const createNewProduct = async (product) => {
    try {
        await addDoc(collection(db, "products"), {
            category_detail: product.category_detail,
            pr_color: product.pr_color,
            pr_description: product.pr_description,
            pr_images: product.pr_images,
            pr_name: product.pr_name,
            pr_price: product.pr_price,
            pr_rating: product.pr_rating,
            pr_sale: product.pr_sale,
            pr_sold: product.pr_sold,
            pr_status: product.pr_status,
            pr_sizes: product.pr_sizes,
        });
        return true;
    } catch (error) {
        console.error("Đăng ký thất bại", error.message);
        return false;
    }
}


/**
 * Lấy tất cả sản phẩm trong bảng Products
 * @returns 
 */
export const getAllProducts = async () => {
    try {
        const productsQuerry = query(collection(db, "products"))
        const querySnapshot = await getDocs(productsQuerry);
        if (!querySnapshot.empty) {
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return productsData;
        } else {
            return null;
        }
    } catch (error) {

    }
}

/**
 * Xóa 1 sản phẩm qua ID
 * @param {*} productID 
 */
export const deleteProductByID = async (productID) => {
    try {
        const productRef = doc(db, 'products', productID);
        await deleteDoc(productRef);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

/**
 * Chỉnh sửa sản phẩm bởi admin
 * @param {*} product 
 * @returns 
 */
export const updateProductByAdmin = async (product) => {
    try {
        const productRef = doc(db, 'products', product.id);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
            await updateDoc(productRef, {
                pr_color: product.pr_color,
                pr_description: product.pr_description,
                pr_images: product.pr_images,
                pr_name: product.pr_name,
                pr_price: product.pr_price,
                pr_sale: product.pr_sale,
                pr_status: product.pr_status,
                pr_sizes: product.pr_sizes,
            });
            console.log('Đã cập nhật thông tin cho sản phẩm có id:', product.id);
            return true;
        } else {
            console.error('Sản phẩm không tồn tại');
            return false;
        }
    } catch (error) {
        console.error("Cập nhật thất bại:", error.message);
        return false;
    }
}
