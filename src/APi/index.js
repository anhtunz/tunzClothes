import { db, auth } from "../Services/firebase";
import { collection, getDocs, where, query, doc, getDoc, orderBy, limit, updateDoc, onSnapshot, addDoc, deleteDoc, increment, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updatePassword, updateEmail } from "firebase/auth";

/**
 * Lấy ra tất cả người dùng trong hệ thống
 * @returns 
 */
export const getAllUsers = async () => {
    console.log("Đã gọi hàm getAllUsers! ");
    try {
        const userQuerry = query(collection(db, "users"))
        console.log('Câu truy vấn:', userQuerry.path);
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
 * Lấy thông tin người dùng đăng nhập
 * @returns 
 */
export const getUserData = async (uid) => {
    console.log("Đã gọi hàm getUserData! ");
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
 * cập nhật trạng thái khi người dùng đăng nhập 
 * @param {*} uid 
 * @returns 
 */
export const updateUserLogin = async (uid) => {
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 1) {
            const userDocRef = querySnapshot.docs[0].ref;

            await updateDoc(userDocRef, {
                status: '1'
            });

            console.log('Đã cập nhật trạng thái của người dùng có uid', uid);
            return true;
        } else {
            console.log('Không tìm thấy người dùng với uid', uid);
            return false;
        }
    } catch (error) {
        console.error('Cập nhật trạng thái người dùng thất bại', error.message);
        return false;
    }
};


/**
 * Cập nhật trạng thái khi người dùng đăng xuất 
 * @param {*} uid 
 * @returns 
 */
export const updateUserLogout = async (uid) => {
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 1) {
            const userDocRef = querySnapshot.docs[0].ref;

            await updateDoc(userDocRef, {
                status: '0'
            });

            console.log('Đã cập nhật trạng thái của người dùng có uid', uid);
            return true;
        } else {
            console.log('Không tìm thấy người dùng với uid', uid);
            return false;
        }
    } catch (error) {
        console.error('Cập nhật trạng thái người dùng thất bại', error.message);
        return false;
    }
};

/**
 * Lấy ra tất cả các trường trong bảng Category
 * @returns 
 */
export const getAllCatergory = async () => {
    console.log("Đã gọi hàm getAllCatergory! ");
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
    console.log("Đã gọi hàm getAllChildCategory! ");
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
    console.log("Đã gọi hàm getAllProductsByCategoryID! ");
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
    console.log("Đã gọi hàm getAllProductsSortedAZ! ");
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
    console.log("Đã gọi hàm getAllProductsSortedZA! ");
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
    console.log("Đã gọi hàm getTop4ProductsBySold! ");
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
    console.log("Đã gọi hàm getTop4ProductsByID! ");
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
 * Lấy ra tất cả sản phẩm đang sale trog cửa hàng
 * @returns 
 */
export const getAllProductsOnSale = async () => {
    console.log("Đã gọi hàm getProductsOnSale! ");
    try {
        const productCollectionRef = collection(db, 'products');
        const q = query(productCollectionRef, where('pr_sale', '>', 0));
        const querySnapshot = await getDocs(q);

        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return products;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm đang giảm giá:', error);
        return [];
    }
};


/**
 * Lấy thông tin chi tiết về một thể loại
 * @param {*} categoryID 
 * @returns 
 */
export const getCategoryDetailData = async (categoryID) => {
    console.log("Đã gọi hàm getCategoryDetailData! ");
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
    console.log("Đã gọi hàm getProductByID! ");
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
 * Thêm sản phẩm mới vào giỏ hàng của người dùng
 * @param {*} uid 
 * @param {*} newItem 
 */
export const addItemToCart = async (uid, newItem) => {
    console.log("Đã gọi hàm addItemToCart!");
    try {
        // Tìm kiếm phần tử trong bảng cart có uid bằng uid được truyền vào
        const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid));
        const querySnapshot = await getDocs(cartQuery);

        if (!querySnapshot.empty) {
            // Nếu tìm thấy phần tử có uid tương ứng, kiểm tra xem sản phẩm mới đã tồn tại trong mảng items hay chưa
            const cartDocRef = querySnapshot.docs[0].ref;
            const cartDocSnapshot = await getDoc(cartDocRef);

            if (cartDocSnapshot.exists()) {
                const cartData = cartDocSnapshot.data();
                const existingItemIndex = cartData.items.findIndex(item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color);

                if (existingItemIndex !== -1) {
                    // Nếu sản phẩm đã tồn tại trong mảng items, chỉ cần tăng chỉ số quantity lên 1
                    const updatedItems = [...cartData.items];
                    updatedItems[existingItemIndex].quantity++;
                    await updateDoc(cartDocRef, { items: updatedItems });
                    console.log('Đã cập nhật số lượng của sản phẩm trong giỏ hàng.');
                    return true;
                } else {
                    // Nếu sản phẩm chưa tồn tại trong mảng items, thêm sản phẩm vào mảng items
                    const updatedItems = [...cartData.items, newItem];
                    await updateDoc(cartDocRef, { items: updatedItems });
                    console.log('Đã thêm một sản phẩm mới vào giỏ hàng.');
                    return true;
                }
            } else {
                console.log('Không tìm thấy phần tử trong bảng cart có uid bằng', uid);
                return false;
            }
        } else {
            // Nếu không tìm thấy phần tử với uid tương ứng, tạo một phần tử mới và thêm vào mảng items
            const newCartData = { uid: uid, items: [newItem] };
            await addDoc(collection(db, 'cart'), newCartData);
            console.log('Đã tạo một giỏ hàng mới và thêm sản phẩm vào giỏ hàng.');
            return true;
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        return false;
    }
};

/**
 * Lấy giỏ hàng của người dùng theo uid
 * @param {*} uid 
 * @returns 
 */
export const getCartItemByUID = async (uid) => {
    console.log("Đã gọi hàm getCartItemByUID! ");
    try {
        const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid));
        const querySnapshot = await getDocs(cartQuery);
        if (!querySnapshot.empty) {
            const cartData = querySnapshot.docs[0].data();
            const cartID = querySnapshot.docs[0].id;
            return { ...cartData, id: cartID };
        } else {
            console.log("Không tìm thấy phần tử trong bảng cart có uid bằng", uid);
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm phần tử trong bảng cart:', error);
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
export const increaseQuantityProductInCart = async (uid, pr_id, pr_color, pr_size) => {
    console.log("Đã gọi hàm increaseQuantityProductInCart! ");
    try {
        const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid)); // Tạo truy vấn lọc

        const cartQuerySnapshot = await getDocs(cartQuery);
        if (!cartQuerySnapshot.empty) {
            const cartDocRef = cartQuerySnapshot.docs[0].ref; // Lấy tham chiếu của tài liệu trong bảng "cart"

            const cartDocSnapshot = await getDoc(cartDocRef);
            if (cartDocSnapshot.exists()) {
                const cartData = cartDocSnapshot.data();
                const itemIndex = cartData.items.findIndex(item => item.id === pr_id && item.color === pr_color && item.size === pr_size);
                if (itemIndex !== -1) {
                    cartData.items[itemIndex].quantity++;
                    await updateDoc(cartDocRef, { items: cartData.items });
                    console.log(`Số lượng của sản phẩm ${pr_id} (${pr_color}, ${pr_size}) đã được cập nhật.`);
                } else {
                    console.log(`Không tìm thấy sản phẩm ${pr_id} (${pr_color}, ${pr_size}) trong giỏ hàng.`);
                }
            } else {
                console.log('Giỏ hàng không tồn tại.');
            }
        } else {
            console.log('Không tìm thấy giỏ hàng cho người dùng có uid là', uid);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu trong Firestore:', error);
    }
};

/**
 * Giảm số lượng của phầm tử trong cart
 * @param {*} uid 
 * @param {*} pr_id 
 * @param {*} pr_color 
 * @param {*} pr_size 
 */
export const decreaseQuantityProductInCart = async (uid, pr_id, pr_color, pr_size) => {
    console.log("Đã gọi hàm decreaseQuantityProductInCart! ");
    // console.log("prID", pr_id);
    // console.log("prcolor", pr_color);
    // console.log("prsize", pr_size);
    try {
        const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid)); // Tạo truy vấn lọc

        const cartQuerySnapshot = await getDocs(cartQuery);
        if (!cartQuerySnapshot.empty) {
            const cartDocRef = cartQuerySnapshot.docs[0].ref; // Lấy tham chiếu của tài liệu trong bảng "cart"

            const cartDocSnapshot = await getDoc(cartDocRef);
            if (cartDocSnapshot.exists()) {
                const cartData = cartDocSnapshot.data();
                const itemIndex = cartData.items.findIndex(item => item.id === pr_id && item.color === pr_color && item.size === pr_size);
                if (itemIndex !== -1) {
                    cartData.items[itemIndex].quantity--;
                    await updateDoc(cartDocRef, { items: cartData.items });
                    console.log(`Số lượng của sản phẩm ${pr_id} (${pr_color}, ${pr_size}) đã được cập nhật.`);
                } else {
                    console.log(`Không tìm thấy sản phẩm ${pr_id} (${pr_color}, ${pr_size}) trong giỏ hàng.`);
                }
            } else {
                console.log('Giỏ hàng không tồn tại.');
            }
        } else {
            console.log('Không tìm thấy giỏ hàng cho người dùng có uid là', uid);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu trong Firestore:', error);
    }
};

/**
 * Xóa sản phẩm trong giỏ hàng của người dùng
 * @param {*} uid 
 * @param {*} pr_id 
 * @param {*} pr_color 
 * @param {*} pr_size 
 */
export const deleteProductInCart = async (uid, pr_id, pr_color, pr_size) => {
    console.log("Đã gọi hàm deleteProductInCart! ");
    try {
        const cartQuery = query(collection(db, 'cart'), where('uid', '==', uid)); // Tạo truy vấn lọc
        const cartQuerySnapshot = await getDocs(cartQuery);

        if (!cartQuerySnapshot.empty) {
            const cartDocRef = cartQuerySnapshot.docs[0].ref; // Lấy tham chiếu của tài liệu trong bảng "cart"

            const cartDocSnapshot = await getDoc(cartDocRef);
            if (cartDocSnapshot.exists()) {
                const cartData = cartDocSnapshot.data();
                const updatedItems = cartData.items.filter(item => !(item.id === pr_id && item.color === pr_color && item.size === pr_size));

                await updateDoc(cartDocRef, { items: updatedItems });
                console.log(`Sản phẩm ${pr_id} (${pr_color}, ${pr_size}) đã được xóa khỏi giỏ hàng.`);
            } else {
                console.log('Giỏ hàng không tồn tại.');
            }
        } else {
            console.log('Không tìm thấy giỏ hàng cho người dùng có uid là', uid);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu trong Firestore:', error);
    }
};

/**
 * Cập nhật trường image trong table users
 * @param {*} uid 
 * @param {*} image 
 * @returns 
 */
export const updateProfileImage = async (uid, image) => {
    console.log("Đã gọi hàm updateProfileImage! ");
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
    console.log("Đã gọi hàm updatePasswordFirestore! ");
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
    console.log("Đã gọi hàm changeUserPassword! ");
    const user = auth.currentUser;
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
 * Tăng số lượt bán cho sản phẩm
 * @param {*} productId 
 * @returns 
 */
export const increaseSoldCountOfProduct = async (productId) => {
    try {
        const productDocRef = doc(db, "products", productId);
        await updateDoc(productDocRef, {
            pr_sold: increment(1)
        });
        console.log("Đã tăng giá trị pr_sold cho sản phẩm có id", productId);
        return true;
    } catch (error) {
        console.error("Lỗi khi tăng giá trị pr_sold cho sản phẩm", error.message);
        return false;
    }
}

/**
 * Lưu đơn hàng người dùng đặt
 * @param {*} uid 
 * @param {*} purchaseHistory 
 * @returns 
 */
export const addPurchaseHistoryUsers = async (uid, purchaseHistory) => {
    console.log("Đã gọi hàm addPurchaseHistoryUsers! ");
    try {
        // Kiểm tra xem có bill nào của user có uid tương tự không
        const billQuery = query(collection(db, "bills"), where("uid", "==", uid));
        const billSnapshot = await getDocs(billQuery);

        if (!billSnapshot.empty) {
            // Nếu tồn tại bill, thêm purchase history vào bill đó
            const billDoc = billSnapshot.docs[0];
            await updateDoc(billDoc.ref, {
                purchase_history: arrayUnion(purchaseHistory)
            });
            console.log("Thêm purchase history vào bill thành công");
        } else {
            // Nếu không tồn tại bill, tạo mới bill và thêm purchase history vào
            const newBill = {
                uid: uid,
                purchase_history: [purchaseHistory]
            };
            await addDoc(collection(db, "bills"), newBill);
            console.log("Tạo mới bill và thêm purchase history thành công");
        }

        return true;
    } catch (error) {
        console.error("Lỗi khi thêm purchase history vào bill", error.message);
        return false;
    }
};

/**
 * Lấy ra lịch sử mua hàng của người dùng
 * @param {*} uid 
 * @returns 
 */
export const getPurchaseHistory = async (uid) => {
    console.log("Đã gọi hàm getPurchaseHistory! ");
    try {
        const billQuery = query(collection(db, 'bills'), where('uid', '==', uid));
        const querySnapshot = await getDocs(billQuery);
        if (!querySnapshot.empty) { // Kiểm tra xem có tài liệu nào phù hợp không
            const billData = querySnapshot.docs[0].data(); // Lấy dữ liệu từ tài liệu đầu tiên
            const billId = querySnapshot.docs[0].id; // Lấy id của tài liệu đầu tiên
            return { ...billData, id: billId };
        } else {
            console.log("Không tìm thấy phần tử trong bảng bills có uid bằng", uid);
            return null;
        }
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
}

/**
 * Cập nhật số lượt bán và đánh giá của sản phẩm từ người dùng
 * @param {*} product 
 * @returns 
 */
export const updateProductbyUser = async (product) => {
    console.log("Đã gọi hàm updateProductbyUser");
    try {
        const productDocRef = doc(db, "products", product.id);
        const productDocSnap = await getDoc(productDocRef);

        if (productDocSnap.exists()) {
            await updateDoc(productDocRef, {
                pr_sold: product.pr_sold,
                pr_rating: product.pr_rating,
            });
            console.log('Đã cập nhật thông tin cho sản phẩm có id:', product.id);
            return true;
        } else {
            console.error('Không tìm thấy sản phẩm có id:', product.id);
            return false;
        }
    } catch (error) {
        console.error('Cập nhật thông tin sản phẩm không thành công:', error.message);
        return false;
    }
}


/**
 * Hiển thị bình luận của người dùng về sản phẩm
 * @param {*} productID 
 * @returns 
 */
export const getCommentItemByproductID = async (productID) => {
    console.log("Đã gọi hàm getCommentItemByproductID! ");
    try {
        const commentsQuery = query(collection(db, 'comments'), where('pr_id', '==', productID));
        const querySnapshot = await getDocs(commentsQuery);
        if (!querySnapshot.empty) {
            const commentsData = querySnapshot.docs[0].data();
            const commentsID = querySnapshot.docs[0].id;
            return { ...commentsData, id: commentsID };
        } else {
            console.log("Không tìm thấy phần tử trong bảng comments có productID bằng", productID);
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi tìm kiếm phần tử trong bảng comments:', error);
        throw error;
    }
};


/**
 * Thêm đánh giá của người dùng về sản phẩm
 * @param {*} productId 
 * @param {*} uid 
 * @param {*} rate 
 * @param {*} evaluate 
 * @returns 
 */
export const addCommentbyProductID = async (productId, uid, rate, evaluate) => {
    console.log("Đã gọi hàm addCommentbyProductID");
    try {
        // Kiểm tra xem có tồn tại phần tử trong bảng comments có pr_id bằng productId không
        const commentsQuery = query(collection(db, "comments"), where("pr_id", "==", productId));
        const commentsSnapshot = await getDocs(commentsQuery);

        if (!commentsSnapshot.empty) {
            // Nếu có, lặp qua các phần tử và cập nhật giá trị
            commentsSnapshot.forEach(async (doc) => {
                const commentDocRef = doc(db, "comments", doc.id);
                await updateDoc(commentDocRef, {
                    details: [
                        ...doc.data().details,
                        { uid, rate, evaluate }
                    ]
                });
                console.log("Đã cập nhật đánh giá cho sản phẩm có id:", productId);
            });
        } else {
            // Nếu không, tạo một phần tử mới trong bảng comments
            const newCommentRef = await addDoc(collection(db, "comments"), {
                pr_id: productId,
                details: [{ uid, rate, evaluate }]
            });
            console.log("Đã tạo mới đánh giá cho sản phẩm có id:", productId, "với id:", newCommentRef.id);
        }
        return true;
    } catch (error) {
        console.error("Lỗi khi lưu đánh giá:", error.message);
        return false;
    }
};

/**
 * Cập nhật bill khi người dùng đánh giá xong
 * @param {*} uid 
 * @param {*} newPurchaseHistory 
 * @returns 
 */
export const updateBillWithPurchaseHistory = async (uid, newPurchaseHistory) => {
    try {
        const billsCollectionRef = query(collection(db, "bills"), where("uid", "==", uid));
        const querySnapshot = await getDocs(billsCollectionRef);

        querySnapshot.forEach(async (doc) => {
            const updatedBillData = {
                ...doc.data(),
                purchase_history: newPurchaseHistory.purchase_history
            };

            await updateDoc(doc.ref, updatedBillData);
            console.log("Đã cập nhật bill có uid:", uid);
        });

        return true;
    } catch (error) {
        console.error("Lỗi khi cập nhật bill:", error);
        return false;
    }
}

/**
 * Lấy ra đơn hàng cần được duyệt
 * @returns 
 */
export const getUnprocessedBills = async () => {
    try {
        const billQuery = collection(db, 'bills');
        const querySnapshot = await getDocs(billQuery);

        const bills = [];

        querySnapshot.forEach(doc => {
            const billData = doc.data();

            const billsss = billData.purchase_history
                .filter(purchase => purchase.status === false)
                .map(purchase => ({ ...purchase, uid: billData.uid }));

            bills.push(...billsss);
        });
        return bills;
    } catch (error) {
        console.error('Error getting bills with status false:', error);
        throw error;
    }
};

/**
 * Lấy ra đơn hàng đã được duyệt
 * @returns 
 */
export const getSuccessfulBills = async () => {
    try {
        const billQuery = collection(db, 'bills');
        const querySnapshot = await getDocs(billQuery);

        const bills = [];

        querySnapshot.forEach(doc => {
            const billData = doc.data();

            const billsss = billData.purchase_history
                .filter(purchase => purchase.status === true)
                .map(purchase => ({ ...purchase, uid: billData.uid }));
            bills.push(...billsss);
        });
        return bills;
    } catch (error) {
        console.error('Error getting bills with status false:', error);
        throw error;
    }
};


/**
 * Duyệt đơn hàng cho người dùng
 * @param {*} uid 
 * @param {*} billsItem 
 * @returns 
 */
export const updateBillByAdmin = async (uid, billsItem) => {
    try {
        const billQuery = query(collection(db, "bills"), where("uid", "==", uid));
        const billSnapshot = await getDocs(billQuery);

        billSnapshot.forEach(async (bill) => {
            const data = bill.data();
            const bills = [...data.purchase_history];
            data.purchase_history.forEach((purchase, idx) => {
                if (purchase.email === billsItem.email && purchase.name === billsItem.name && purchase.address === billsItem.address) {
                    console.log(111, purchase, idx);
                    bills[idx] = billsItem;
                }
            })
            const update = { uid, purchase_history: bills }
            await updateDoc(bill.ref, update)
        })
        return true;
    } catch (error) {
        console.log("Error: ", error.message);
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
    console.log("Đã gọi hàm addNewUser! ");
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
    console.log("Đã gọi hàm getAllUser! ");
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
    console.log("Đã gọi hàm updateUser! ");
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
    console.log("Đã gọi hàm updateProfilebyUser! ");
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
    console.log("Đã gọi hàm createNewProduct! ");
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
    console.log("Đã gọi hàm getAllProducts! ");
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
    console.log("Đã gọi hàm deleteProductByID! ");
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
 * Xóa người dùng bởi ADMIN
 * @param {*} uid 
 * @returns 
 */
export const deleteUserByUID = async (uid) => {
    console.log("Đã gọi hàm deleteUserByUID! ");
    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size === 1) {
            const userDocRef = querySnapshot.docs[0].ref;
            await deleteDoc(userDocRef);
            console.log('Đã xóa người dùng có uid', uid);
            return true;
        } else {
            console.log('Không tìm thấy người dùng với uid', uid);
            return false;
        }
    } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        return false;
    }
};

/**
 * Chỉnh sửa sản phẩm bởi admin
 * @param {*} product 
 * @returns 
 */
export const updateProductByAdmin = async (product) => {
    console.log("Đã gọi hàm updateProductByAdmin! ");
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


