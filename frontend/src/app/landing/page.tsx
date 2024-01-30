"use client";
import React from 'react';
import { useState,useEffect } from 'react';
const Landing = () => {
        const [datab, setDatab] = useState({});
        const fetchData = async () => {
            let id = localStorage.getItem("id");
            let idAsInt = parseInt(id, 10);
            const API_URL = `http://localhost:8000/api/user/${idAsInt}`;
    
            const token = localStorage.getItem("token");
    
            try {
                const response = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `${token}`,
                    },
                });
                const data_new = await response.json();
                setDatab(data_new);
                if(data_new.isAuthorized === true){
                    localStorage.setItem("isAuthorized",data_new.isAuthorized)
                    window.location.replace('/dashboard')
                }                   
                console.log(data_new)
            } catch (error) {
                console.error(error);
            }
        };
    
        useEffect(() => {
            const isAuthorized = localStorage.getItem("isAuthorized")
            if(isAuthorized === true){
                window.location.replace('/dashboard')
            }            
            fetchData();
        }, []);
  return (
    <div>
        <h1>Request Sent to Admin</h1>
    </div>
  );
}

export default Landing;       