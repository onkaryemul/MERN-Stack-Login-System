import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store.js';
import { generateOTP, verifyOTP } from '../helper/helper.js';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Username.module.css';


export default function Recovery() {

    const { username } = useAuthStore(state => state.auth);

    const [ OTP, setOTP ] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        generateOTP(username).then((OTP) => {
            console.log(OTP);
            if(OTP) {
                return toast.success('OTP has been sent to yout email!');
            }
            return toast.error('Problem while generating OTP!');
        })
    }, [ username ]);

    async function onSubmit(e) {
        e.preventDefault();
 
        try {
            const { status } = await verifyOTP( { username, code: OTP } );

            if( status === 201 ) {
                toast.success('Verify Successfully!');
                return navigate('/reset');
            }
        } catch(error) {
            return toast.error('Wrong OTP! Check email again!');
        }
    }

    // handler function of resend OTP
    function resendOTP() {
        const sendPromise = generateOTP(username);

        toast.promise(sendPromise, {
            loading: 'Sending...',
            success: <b>OTP has been send to your email!</b>,
            error: <b>Could not Send it!</b>
        });

        sendPromise.then(OTP => {
            console.log(OTP);
        });
    }

    // rendering recovery component
    return (
        <div className="container mx-auto">

            <Toaster position='top-center' reverseOrder={false}></Toaster>

            <div className="flex flex-col justify-center items-center h-screen">
                <div className={styles.glass} style={{height: "70%"}}>

                    <div className="title flex flex-col items-center">
                        <h4 className="text-5xl font-bold">Recovery</h4>
                        <span className="py-4 text-xl w-2/3 text-center text-gray-500">
                            Enter OTP to recover password
                        </span>
                    </div>

                    <form className="pt-20" onSubmit={onSubmit}>
                        <div className="textbox flex flex-col items-center gap-6">

                            <div className="input text-center">
                                <span className='py-4 text-sm text-left text-gray-500'>
                                    Enter 6 digit OTP sent to your email address
                                </span>
                                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='OTP'></input>
                            </div>

                            <button className={styles.btn} type="submit">Recover</button>
                        </div>
                    </form>

                    <div className="text-center py-4">
                        <span className="text-gray-500">Can't get OTP? <button onClick={resendOTP} className="text-red-500"> Resend</button></span>
                    </div>

                </div>
            </div>
        </div>
    );

}

