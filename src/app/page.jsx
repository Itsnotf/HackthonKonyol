"use client"

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import { calculateCosineSimilarity, calculateMatchingValues } from './lib'; // Sesuaikan path dengan lokasi file utilitas Anda

import './style.css';

export default function Home() {
  const [userInput, setUserInput] = useState({
    ipk: '',
    major: '',
    level: '',
    semester: '',
  });

  const [matchedScholarships, setMatchedScholarships] = useState([]);
  const [motivationMessage, setMotivationMessage] = useState('');
  const [motivationMessages, setMotivationMessages] = useState('');

  const scholarshipsData = [
    {
      id: 1,
      title: "Beasiswa A",
      ipkRequirement: 3.5,
      major: "Teknik Informatika",
      level: "S1",
      semester: 3,
    },
    {
      id: 2,
      title: "Beasiswa B",
      ipkRequirement: 3.0,
      major: "Ekonomi",
      level: "S1",
      semester: 2,
    },
    {
      id: 3,
      title: "Beasiswa C",
      ipkRequirement: 3.7,
      major: "Kedokteran",
      level: "Profesi",
      semester: 1,
    },
    {
      id: 4,
      title: "Beasiswa D",
      ipkRequirement: 3.2,
      major: "Hukum",
      level: "S2",
      semester: 1,
    },
  ];

  const VideoMotivasi = [
    {
      element: <Image src={require('./video/damn.gif')} alt="" width="500" height="500" />
    },
    {
      element: <Image src={require('./video/hoke.gif')} alt="" width="500" height="500" />
    },
    {
      element: <Image src={require('./video/tepuk.gif')} alt="" width="500" height="500" />
    },
  ];




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevInput) => ({
      ...prevInput,
      [name]: name === 'semester' ? parseInt(value) || '' : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Extract user input from state
    const { ipk, major, level, semester } = userInput;

    // Convert user input to lower case and prepare for comparison
    const userVector = {
      ipk: parseFloat(ipk),
      major: major.toLowerCase(),
      level: level.toLowerCase(),
      semester: parseInt(semester),
    };

    // Calculate similarity with each scholarship
    const matched = scholarshipsData.map((scholarship) => {
      const scholarshipVector = {
        ipkRequirement: scholarship.ipkRequirement,
        major: scholarship.major.toLowerCase(),
        level: scholarship.level.toLowerCase(),
        semester: parseInt(scholarship.semester),
      };

      const similarity = calculateCosineSimilarity(userVector, scholarshipVector);
      return { ...scholarship, similarity };
    });

    // Filter matched scholarships based on threshold
    const threshold = 0.8;
    const topMatches = matched
      .filter((scholarship) => scholarship.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // Update state based on the result
    if (topMatches.length === 0) {
      setMatchedScholarships([]);
      const randomVideoIndex = Math.floor(Math.random() * VideoMotivasi.length);
      setMotivationMessage(VideoMotivasi[randomVideoIndex].element);
      setMotivationMessages('Maaf, Belum Ada Beasiswa yang jodoh dengan anda!!😂😂😂😂')
    } else {
      setMatchedScholarships(topMatches);
      setMotivationMessage('');
    }
  };


  return (
    <main className="w-full">
      <div className="flex flex-col items-center justify-center h-screen">
        {/* Form untuk input data diri */}
        <form className="mb-8" onSubmit={handleFormSubmit}>
          <input
            type="number"
            name="ipk"
            placeholder="IPK"
            value={userInput.ipk}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mb-2"
            required
          />
          <input
            type="text"
            name="major"
            placeholder="Jurusan"
            value={userInput.major}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mb-2"
            required
          />
          <input
            type="text"
            name="level"
            placeholder="Jenjang"
            value={userInput.level}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mb-2"
            required
          />
          <input
            type="text"
            name="semester"
            placeholder="Semester"
            value={userInput.semester}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded mb-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cari Beasiswa
          </button>
        </form>

        {/* Menampilkan hasil pencarian dalam Swiper */}
        <div className="w-full">
          <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} className="mySwiper">
            {matchedScholarships.length > 0 ? (
              matchedScholarships.map((scholarship) => (
                <SwiperSlide key={scholarship.id}>
                  <div className="bg-gray-200 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold">{scholarship.title}</h2>
                    <p className="text-sm">
                      IPK Minimum: {scholarship.ipkRequirement} | Jurusan: {scholarship.major} | Jenjang: {scholarship.level} | Semester: {scholarship.semester}
                    </p>
                    <p className="text-xs mt-2">Similarity Score: {scholarship.similarity.toFixed(2)}</p>
                  </div>
                </SwiperSlide>
              ))
            ) : (

              <div className="text-gray-500 text-center">
                {motivationMessages}
                {motivationMessage || 'Tidak ada hasil pencarian.'}
              </div>

            )}
          </Swiper>
        </div>
      </div>
    </main>
  );
}
