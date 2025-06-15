
import Head from 'next/head';
import ChatBox from '../components/ChatBox';
import FileUploader from '../components/FileUploader';
import ProjectSelector from '../components/ProjectSelector';
import { useState, useEffect } from 'react';


export default function Home() {
  return (
    <>
      <Head>
        <title>CS Co-Pilot</title>
      </Head>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Welcome to CS Co-Pilot</h1>
        <ProjectSelector />
        <FileUploader />
        <ChatBox />
      </main>
    </>
  );
}
