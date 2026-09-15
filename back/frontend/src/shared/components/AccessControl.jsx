import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";


export default function AccessControl({children, type = 'private'}){
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        async function getValidation(){
            try{
                const res = await fetch (
                    `/auth/validation`, {
                        method: "GET",
                        credentials: "include",
                    }
                )
                if (res.status === 200) {
                    setStatus('authorized');
                } else {
                    setStatus('unauthorized');
                }
            } catch {
                setStatus('unauthorized');
            }
        }
        getValidation()
        }, [])
    if (status === 'loading') return <div>Loading...</div>;

    if (type === 'public' && status === 'authorized') {
        return <Navigate to='/dashboard' replace/>;
    }

    if (type === 'private' && status === 'unauthorized') {
        return <Navigate to="/" replace />;
    }

    return children
};
