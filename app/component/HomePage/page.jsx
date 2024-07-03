"use client"

import styles from './Home.module.css';
import { JackInTheBox } from 'react-awesome-reveal';
import { useRouter } from 'next/navigation'

export default function HomePage() {
   const router=useRouter();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
      <JackInTheBox cascade>
        <h1 className={styles.title}>Donate your blood and inspire to donate to others</h1>
        <p className={styles.description}>DONATE BLOOD, SAVE LIFE</p>
        <div className={styles.buttons}>
          <button onClick={() => router.push('/component/addBlood')} className={styles.button}>JOIN WITH US</button>
          <button onClick={() => router.push('/component/searchbar')} className={styles.button}>SEARCH HERE</button>  
        </div>
        </JackInTheBox>
      </main>
    </div>
  );
}



