"use client"

import Image from 'next/image'
import React from 'react'
import styles from './contact.module.css'
import { FaFacebookSquare } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FaLinkedinIn } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={()=>router.push('/component/HomePage')}>Home</button>
      <div className={styles.imageWrapper}>
        <Image className={styles.image} src='/img/image1.jpg' width={300} height={300} alt='my-photo'/>
      </div>
      <p className={styles.description}>
        Hello! I am Robin Hossain, a dedicated full-stack web developer with over 2 years of experience. I specialize in responsive dynamic website, and my passion is coding. Throughout my career, I have had the opportunity to work on a variety of projects that have helped me grow both professionally and personally. My goal is to provide exceptional service and support to all my clients, helping them achieve their goals with my expertise. If you have any questions or would like to collaborate, feel free to contact me using the contact information provided below. I look forward to connecting with you.
      </p>
      <h3 className={styles.contactHeader}>Contact Information</h3>
      <ul className={styles.contactList}>
        <li><a target='-blank' href='https://www.facebook.com/welcome.robin'><FaFacebookSquare /></a></li>
        <li><a target='-blank' rel='noopener noreferrer' href='mailto:023023robin@gmail.com'><MdOutlineMail /></a></li>
        <li><a target='-blank' href='https://www.linkedin.com/in/robin-hossain-b31302287/'><FaLinkedinIn /></a></li>
        <li><a target='-blank' href='https://x.com/Robinho78156808'><FaTwitter /></a></li>
      </ul>
    </div>
  )
}

