import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';
import Image from 'next/image';
import { useAccount} from 'wagmi';
import { avalancheFuji, sepolia } from 'viem/chains';
import { usePerpStore } from '@/store/PerpStore';
import { useShallow } from 'zustand/react/shallow';

interface ChainInterface {
  name: string;
  icon: string;
  chainId: number;
}

export const ChainSelector = () => {
  const { isConnected } = useAccount();
  const {
    payChain
  } = usePerpStore(useShallow((state) => ({
    payChain: state.payChain
  })));

  const chains: ChainInterface[] = [
    { name: 'Avax', icon: '/assets/avax.svg', chainId: avalancheFuji.id }, // Move Avax first
    { name: 'Sepolia', icon: '/assets/eth.svg', chainId: sepolia.id }, 
  ];
  
  const [selectedChain, setSelectedChain] = useState<ChainInterface | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConnected) return;
    if (!payChain) {
      const defaultChain = chains[0];
      setSelectedChain(defaultChain);
      usePerpStore.getState().setPayChain(defaultChain.chainId);
      return;
    }

    const chainFromId = chains.find(chain => chain.chainId === payChain);
    if (chainFromId) {
      setSelectedChain(chainFromId);
    }
  }, [payChain, isConnected]);

  const handleChainSelect = (chainName: string) => {
    const selectedChainClicked = chains.find(item => item.name === chainName);
    if (selectedChainClicked) {
      setSelectedChain(selectedChainClicked);
      usePerpStore.getState().setPayChain(selectedChainClicked.chainId);
      setIsOpen(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isConnected) return null;

  return (
    <div className="tokenSelector" ref={dropdownRef}>
      <span style={{
        fontSize:"10px",
        marginTop:"-6px",
        opacity:"0.6"
      }}>Chain Name:</span>
      <div className="customSelect" onClick={toggleDropdown}>
        <div className="selectTrigger">
          {selectedChain ? (
            <div className="selectedOption">
              <Image
                height={25}
                width={25}
                src={selectedChain.icon}
                alt={selectedChain.name}
                className='tokenLogo'
              />
              <span>{selectedChain.name}</span>
            </div>
          ) : (
            <div className="placeholder">
              <span>Select Chain:</span>
            </div>
          )}
          <div className={`dropdownArrow ${isOpen ? 'open' : ''}`}>
            ▼
          </div>
        </div>

        {isOpen && (
          <div className="dropdownMenu">
            {chains.map((chain) => (
              <div
                key={chain.name}
                className={`dropdownOptionChain ${selectedChain?.name === chain.name ? 'selected' : ''}`}
                onClick={() => handleChainSelect(chain.name)}
              >
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  height={25}
                  width={25}
                  className='tokenLogo'
                />
                <span>{chain.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};