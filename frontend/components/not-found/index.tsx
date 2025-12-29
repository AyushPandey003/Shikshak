'use client';

import React from 'react';
import Link from 'next/link';
import styles from './style.module.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFoundContent() {
  return (
    <div className={styles.container}>
      {/* Font Awesome CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" 
        integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer" 
      />

      {/* Global Navbar */}
      <Navbar />

      {/* 404 Section */}
      <div className={styles.page404}>
        <div className={styles.wrapper}>
          <h1 className="text-center">404</h1>
        </div>
        
        <div className={styles.msg}>
          <h3>Looks like you're lost</h3>
          <p>The page you are looking for is not available!</p>
           
          <div className={styles.backbtn}>
            <Link href="/" className={styles.btn}>
              <i className="fas fa-arrow-left"></i>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
