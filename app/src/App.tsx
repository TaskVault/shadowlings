import React, { useEffect } from 'react';
import logo from './logo.svg';
import { ethers } from 'ethers';
import './App.css';
import artifactJson from './config/artifacts.json'
import keypairJson from './config/keypair.json'
import { Abi, CompilationArtifacts, initialize } from "zokrates-js";
import LocationDialog from './setup/LocationDialog';

interface PersistedArtifact {
  program: string,
  abi: Abi
}
const loadProvingKey = (): Uint8Array => {
  return ethers.getBytes(keypairJson.pk)
}

const loadPersistedArtifacts = (): PersistedArtifact => {
  return artifactJson as any
}

const loadArtifact = (): CompilationArtifacts => {
  const persisted = loadPersistedArtifacts()
  return {
    program: ethers.getBytes(persisted.program),
    abi: persisted.abi
  }
}

const createProof = async (account: string) => {
  const zok = await initialize()
  const provingKey = loadProvingKey()
  const artifact = loadArtifact()
  const {witness} = zok.computeWitness(artifact, ["2", "4"])
  const proof = zok.generateProof(
    artifact.program,
    witness,
    provingKey
  );
  console.log(proof)
}

function App() {
  useEffect(() => {
    createProof("")
  }, [])
  return (
    <div className="App">
      <LocationDialog open={true} handleSelect={(entropy) => { console.log(entropy)}}/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
