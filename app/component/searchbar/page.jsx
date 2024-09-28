"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from "./search.module.css"; 
import Loading from '../../loading.js';
import Place from '../data/dataJson';

export default function SearchBar() {
  const [data, setData] = useState([]); // Blood donors data
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [bloodType, setBloodType] = useState(""); // Blood type selection
  const [zillaInput, setZillaInput] = useState(""); // District input
  const [upazillaInput, setUpazillaInput] = useState(""); // Upazila input
  const [filteredDistricts, setFilteredDistricts] = useState([]); // Filtered districts
  const [filteredUpazilas, setFilteredUpazilas] = useState([]); // Filtered upazilas
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Selected district
  const router = useRouter();

  // Fetch blood donor data
  useEffect(() => {
    document.title = "Search | Blood-Donation";
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.bdblood24.com/api/blood-document');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Something went wrong. Please check your internet connection.');
        setLoading(false);
      }
    };

    fetchData(); // Calling the fetchData function
  }, []);

  // Handle district input change and filter districts
  const handleZillaInputChange = (e) => {
    const value = e.target.value;
    setZillaInput(value);

    if (!value.trim()) {
      setFilteredDistricts([]);
      return;
    }

    const filtered = Place.filter((item) =>
      item.district.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredDistricts(filtered);
  };


  // Handle upazila input change and filter upazilas
  const handleUpaZillaInputChange = (e) => {
    const value = e.target.value;
    setUpazillaInput(value);

    if (!value.trim() || !selectedDistrict) {
      setFilteredUpazilas(selectedDistrict ? selectedDistrict.upazilla : []);
      return;
    }

    const filtered = selectedDistrict.upazilla.filter((upazilla) =>
      upazilla.toLowerCase().startsWith(value.toLowerCase())
    );

    setFilteredUpazilas(filtered);
  };

  // Set selected district and update upazilas
  const handleDistrictSelect = (district) => {
    setZillaInput(district.district);
    setFilteredDistricts([]);
    setSelectedDistrict(district);
    setFilteredUpazilas(district.upazilla);
    setUpazillaInput("");
  };

  // Set selected upazila
  const handleUpazillaSelect = (upazilla) => {
    setUpazillaInput(upazilla);
    setFilteredUpazilas([]);
  };

  // Handle search button click
  const handleSearch = () => {
    const filtered = data.filter(user => 
      user.blood.toLowerCase() === bloodType.toLowerCase() && 
      user.zila.toLowerCase() === zillaInput.toLowerCase() &&
      user.upazila.toLowerCase() === upazillaInput.toLowerCase()
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

  if (isLoading) return <Loading />;
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
            <label>Blood Type</label>
            <select
              name="blood"
              className={styles.input}
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              required
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Zila</label>
            <input
              name='zila'
              type='text'
              placeholder='Enter Zila'
              className={styles.input}
              value={zillaInput}
              onChange={handleZillaInputChange}
              autoComplete="off"
              required
            />
            {filteredDistricts.length > 0 && (
              <ul className={styles.dropdownList}>
                {filteredDistricts.map((district, index) => (
                  <li
                    key={index}
                    onClick={() => handleDistrictSelect(district)}
                    className={styles.dropdownItem}
                  >
                    {district.district}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.formGroup}>
            <label>Upazila</label>
            <input
              name='upazila'
              type='text'
              placeholder='Enter Upazila'
              className={styles.input}
              value={upazillaInput}
              onChange={handleUpaZillaInputChange}
              autoComplete="off"
              required
            />
            {filteredUpazilas.length > 0 && (
              <ul className={styles.dropdownList}>
                {filteredUpazilas.map((upazilla, index) => (
                  <li
                    key={index}
                    onClick={() => handleUpazillaSelect(upazilla)}
                    className={styles.dropdownItem}
                  >
                    {upazilla}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type='button' className={styles.button} onClick={handleSearch}>Search</button>
        </form>
        <div className={styles.userContainer}>
          {searchInitiated && filteredData.length === 0 ? (
            <p>Sorry, no results found</p>
          ) : (
            (searchInitiated ? filteredData : data).map((user, index) => (
              <div key={user.id || index} className={styles.userCard}>
                <Image className={styles.image} src={`https://api.bdblood24.com/uploads/${user.file}`} alt="User photo" width={100} height={100} />
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
