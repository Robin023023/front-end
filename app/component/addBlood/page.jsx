"use client";

import { useState, useEffect } from "react";
import styles from "./addBlood.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import { IoMdCloudUpload } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import Place from '../data/dataJson';

export default function AddBlood() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [zila, setZila] = useState("");
  const [upazila, setUpazila] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleZilaInputChange = (e) => {
    const value = e.target.value;
    setZila(value.toUpperCase());

    if (!value) {
      setFilteredDistricts([]);
      return;
    }

    // Filter districts based on user input
    const filtered = Place.filter((item) =>
      item.district.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredDistricts(filtered);
  };

  const handleDistrictSelect = (district) => {
    setZila(district.district.toUpperCase());
    setFilteredDistricts([]);
    setSelectedDistrict(district);
    setFilteredUpazilas(district.upazilla);
    setUpazila("");
  };

  const handleUpazilaInputChange = (e) => {
    const value = e.target.value;
    setUpazila(value.toUpperCase());

    if (!selectedDistrict) return;

    // Filter upazilas based on selected district and input
    const filtered = selectedDistrict.upazilla.filter((upazila) =>
      upazila.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredUpazilas(filtered);
  };

  const handleUpazilaSelect = (upazila) => {
    setUpazila(upazila.toUpperCase());
    setFilteredUpazilas([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!captchaValue) {
      alert("Please complete the reCAPTCHA.");
       return;
     }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name.toUpperCase());
    formData.append("zila", zila.toUpperCase());
    formData.append("upazila", upazila.toUpperCase());
    formData.append("blood", bloodType.toUpperCase());
    formData.append("file", file);
    formData.append("mobile", mobile);
    formData.append("captcha", captchaValue);

    try {
      const response = await axios.post(
        "https://api.bdblood24.com/api/blood-document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form and show success message
      setName("");
      setZila("");
      setUpazila("");
      setBloodType("");
      setFile(null);
      setFilePreview(null);
      setMobile("");
      setError(null);
      setSuccessMessage("Data added successfully");
      setCaptchaValue(null);
      setLoading(false);

      // Navigate to another page if needed
      router.push("/component/searchbar");
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Add Blood | Blood-Donation";
  }, []);

  return (
    <div className={styles.AddBlood}>
      <button className={styles.returnButton} onClick={() => router.push("/")}>
        <FaArrowLeft /> Return Home
      </button>
      <h1 className={styles.formHeader}>
        If you are a blood donor, please add your information so that a blood
        recipient can contact you easily...
      </h1>

      <div className={styles.grid}>
        <img className={styles.image} src="/img/blood.jpg" alt="image" />
        <div className={styles.main}>
          <div className={styles.formContainer}>
            <form className={styles.bloodForm} onSubmit={handleSubmit}>
              {error && <p className={styles.error}>{error}</p>}
              {successMessage && <p className={styles.success}>{successMessage}</p>}

              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
                required
              />

              <label className={styles.label}>Zila</label>
              <input
                className={styles.input}
                type="text"
                name="zila"
                placeholder="Enter zila"
                value={zila}
                onChange={handleZilaInputChange}
                required
                autoComplete="off"
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

              <label className={styles.label}>Upazila</label>
              <input
                className={styles.input}
                type="text"
                name="upazila"
                placeholder="Enter upazila"
                value={upazila}
                onChange={handleUpazilaInputChange}
                required
                autoComplete="off"
              />
              {filteredUpazilas.length > 0 && (
                <ul className={styles.dropdownList}>
                  {filteredUpazilas.map((upazila, index) => (
                    <li
                      key={index}
                      onClick={() => handleUpazilaSelect(upazila)}
                      className={styles.dropdownItem}
                    >
                      {upazila}
                    </li>
                  ))}
                </ul>
              )}

              <label className={styles.label}>Blood Type</label>
              <select
              name="blood"
              className={styles.Bloodinput}
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

              <label className={styles.label}>Photo</label>
              <div className={styles.fileInputContainer}>
                <label htmlFor="file-upload" className={styles.customFileUpload}>
                  <IoMdCloudUpload className={styles.uploadIcon} />
                  <input
                    type="file"
                    id="file-upload"
                    name="file"
                    onChange={handleFileChange}
                    required
                    className={styles.inputFile}
                  />
                </label>
              </div>

              <label className={styles.label}>Mobile Number</label>
              <input
                className={styles.input}
                type="tel"
                name="mobile"
                placeholder="01xxxxxxxxxx"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />

              {/* Uncomment if you want reCAPTCHA validation */}
              <ReCAPTCHA
                sitekey="6LfsSjYqAAAAAL3as9JOll_w_OhqpG_rO8SZLhbT"
                onChange={handleCaptchaChange}
              />

              <button
                className={styles.submitButton}
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Add Information"}
              </button>
            </form>
          </div>
        </div>
      </div>

      
    </div>
  );
}


