"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from "./search.module.css"; 
import Loading from '../../loading.js'


export default function SearchBar() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/blood-document');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const bloodInput = document.querySelector('input[name="blood"]').value.toLowerCase();
    const zilaInput = document.querySelector('input[name="zila"]').value.toLowerCase();
    const upazilaInput = document.querySelector('input[name="upazila"]').value.toLowerCase();

    // Filter data based on inputs
    const filtered = data.filter(user => 
      user.blood.toLowerCase().includes(bloodInput) &&
      user.zila.toLowerCase().includes(zilaInput) &&
      user.upazila.toLowerCase().includes(upazilaInput)
    );
    setFilteredData(filtered);
    setSearchInitiated(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copy successful!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  if (isLoading) return <Loading/>
  if (error) return <p>{error}</p>;
  if (!data || data.length === 0) return <p>No profile data</p>;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button onClick={() => router.push('/component/addBlood')} className={styles.returnButton}>Add Blood Donor</button>
        <button onClick={() => router.push("/component/contact")} className={styles.contactButton}>Contact me</button>
        <h1 className={styles.heading}>Search for Blood Donors</h1>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label>Blood</label>
            <input name='blood' type='text' placeholder='Enter Blood' className={styles.input} required/>
          </div>
          <div className={styles.formGroup}>
            <label>Zila</label>
            <input name='zila' type='text' placeholder='Enter Zila' className={styles.input} required/>
          </div>
          <div className={styles.formGroup}>
            <label>Upazila</label>
            <input name='upazila' type='text' placeholder='Enter Upazila' className={styles.input} required/>
          </div>
          <button type='button' className={styles.button} onClick={handleSearch}>Search</button>
        </form>
        <div className={styles.userContainer}>
          {searchInitiated && filteredData.length === 0 ? (
            <p>Sorry, no results found</p>
          ) : (
            (searchInitiated ? filteredData : data).map((user,id) => (
              <div key={user.id} className={styles.userCard}>
                <Image className={styles.image} src={`http://localhost:4000/uploads/${user.file}`} alt="User photo" width={100} height={100} />
                <div className={styles.userInfo}>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Zila:</strong> {user.zila}</p>
                  <p><strong>Upazila:</strong> {user.upazila}</p>
                  <p><strong>Blood Type:</strong> {user.blood}</p>
                  <p><strong>Mobile Number:</strong> <a href={`tel:${user.mobile}`}>{user.mobile}</a> <button onClick={() => handleCopy(user.mobile)}>Copy</button></p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
