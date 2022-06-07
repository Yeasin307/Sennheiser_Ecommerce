import React from 'react'
import Link from 'next/link';
import { useEffect } from 'react';
import { useStateContext } from '../context/StateContext';

const Cancel = () => {
    const { setShowCart } = useStateContext();

    useEffect(() => {
        setShowCart(true);
    }, [setShowCart])

    return (
        <div className="cancel-wrapper">
            <div className='cancel'>
                <p>Forgot to add something to your cart? Shop around then come back to pay!</p>
                <Link href="/">
                    <button
                        type="button"
                        className="btn"
                    >
                        Continue Shopping
                    </button>
                </Link>

            </div>

        </div>
    )
}

export default Cancel