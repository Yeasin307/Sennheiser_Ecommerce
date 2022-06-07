import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {

    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState();
    const [totalPrice, setTotalPrice] = useState();
    const [totalQuantities, setTotalQuantities] = useState();
    const [qty, setQty] = useState(1);

    let findProduct;
    let index;

    useEffect(() => {
        const getLocalStorage = (name) => {
            if (typeof window !== 'undefined') {
                const storage = localStorage.getItem(name);

                if (storage) return JSON.parse(localStorage.getItem(name));

                if (name === 'cartItems') return [];

                return 0;
            }
        };
        setCartItems(getLocalStorage('cartItems'));
        setTotalPrice(getLocalStorage('totalPrice'));
        setTotalQuantities(getLocalStorage('totalQuantities'));
    }, [])

    // useEffect(() => {
    //     localStorage.setItem('cartItems', JSON.stringify(cartItems));
    //     localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
    //     localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities));
    // }, [cartItems, totalPrice, totalQuantities]);

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(
            (cartProduct) => cartProduct._id === product._id,
        );

        if (checkProductInCart) {
            setTotalPrice(totalPrice + product.price * quantity);
            setTotalQuantities(totalQuantities + quantity);

            localStorage.setItem('totalPrice', JSON.stringify(totalPrice + product.price * quantity));
            localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities + quantity));

            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) {
                    return { ...cartProduct, quantity: cartProduct.quantity + quantity };
                }
                return cartProduct;
            });

            setCartItems(updatedCartItems);
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

            toast.success(`${qty} ${product.name} added`);
        } else {
            setTotalPrice(totalPrice + product.price * quantity);
            setTotalQuantities(totalQuantities + quantity);

            localStorage.setItem('totalPrice', JSON.stringify(totalPrice + product.price * quantity));
            localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities + quantity));

            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
            localStorage.setItem('cartItems', JSON.stringify([...cartItems, { ...product }]));

            toast.success(`${qty} ${product.name} added`);
        }
    };

    const onRemove = (product) => {
        findProduct = cartItems.find((item) => item._id === product._id);
        const tempCart = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice(totalPrice - findProduct.price * findProduct.quantity);
        setTotalQuantities(totalQuantities - findProduct.quantity);
        setCartItems(tempCart);

        localStorage.setItem('totalPrice', JSON.stringify(totalPrice - findProduct.price * findProduct.quantity));
        localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities - findProduct.quantity));
        localStorage.setItem('cartItems', JSON.stringify(tempCart));
    };

    const toggleCartItemQuantity = (id, value) => {
        findProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);

        if (value === 'inc') {
            findProduct.quantity += 1;
            cartItems[index] = findProduct;
            setTotalPrice(totalPrice + findProduct.price);
            setTotalQuantities(totalQuantities + 1);

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice + findProduct.price));
            localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities + 1));
        }

        if (value === 'dec') {
            if (findProduct.quantity > 1) {
                findProduct.quantity -= 1;
                cartItems[index] = findProduct;
                setTotalPrice(totalPrice - findProduct.price);
                setTotalQuantities(totalQuantities - 1);

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                localStorage.setItem('totalPrice', JSON.stringify(totalPrice - findProduct.price));
                localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities - 1));
            }
        }
    };

    const incQty = () => {
        setQty((oldQty) => {
            const tempQty = oldQty + 1;
            return tempQty;
        });
    };

    const decQty = () => {
        setQty((oldQty) => {
            let tempQty = oldQty - 1;
            if (tempQty < 1) {
                tempQty = 1;
            }
            return tempQty;
        });
    };

    return (
        <Context.Provider
            value={{
                onAdd,
                onRemove,
                cartItems,
                totalPrice,
                totalQuantities,
                setShowCart,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
                showCart,
                incQty,
                decQty,
                qty,
                toggleCartItemQuantity,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);