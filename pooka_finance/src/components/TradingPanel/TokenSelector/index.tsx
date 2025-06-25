import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';
import Image from 'next/image';
import { useAccount} from 'wagmi';
import { avalancheFuji, sepolia } from 'viem/chains';
import { NATIVE_TOKEN_AVAX, USDC_TOKEN_SEPOLIA, USDC_TOKEN_AVAX, LINK_TOKEN_AVAX } from '@/utils/constants';
import { usePerpStore } from '@/store/PerpStore';
import { useShallow } from 'zustand/react/shallow';

export const TokenSelector = () => {
  const { isConnected } = useAccount();
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentTokens, setCurrentTokens] = useState<{ name: string; icon: string; address:string}[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    payChain
  }=usePerpStore(useShallow((state)=>({
    payChain:state.payChain
  })))

  const tokens: Record<number, { name: string; icon: string; address:string }[]> = {
    [avalancheFuji.id]: [
      { name: 'Usdc', icon: '/assets/usdc.svg', address:USDC_TOKEN_AVAX }, // USDC first
      { name: 'Link', icon: '/assets/link.svg', address:LINK_TOKEN_AVAX },
      { name: 'Avax', icon: '/assets/avax.svg', address:NATIVE_TOKEN_AVAX },
    ],
    [sepolia.id]: [
      { name: 'Usdc', icon: '/assets/usdc.svg', address:USDC_TOKEN_SEPOLIA },
    ]
  };

  useEffect(() => {

    if (!payChain || (payChain !== avalancheFuji.id && payChain !== sepolia.id)) {
      return;
    }

    const tokensForChain = tokens[payChain] || [];
    setCurrentTokens(tokensForChain);
    
    const isCurrentTokenValid = tokensForChain.some(token => token.name === selectedToken);
    
    if (!selectedToken || !isCurrentTokenValid) {
      if (tokensForChain.length > 0) {
        const defaultToken = tokensForChain[0]; // This will be USDC for both chains
        setSelectedToken(defaultToken.name);
        // Set the token in the store
        usePerpStore.getState().setPayToken(defaultToken.address);
      }
    }
    
  }, [payChain, isConnected]);

  const handleTokenSelect = (tokenSymbol: string, tokenAddress:string) => {
    usePerpStore.getState().setPayToken(tokenAddress)
    setSelectedToken(tokenSymbol);
    setIsOpen(false);
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

  if (currentTokens.length === 0) {
    return (
      <div className="tokenSelector">
        <div className="noTokensMessage">
          No tokens available for this network
        </div>
      </div>
    );
  }

  const selectedTokenData = currentTokens.find(token => token.name === selectedToken);

  return (
    <div className="tokenSelector" ref={dropdownRef}>
      <div className="customSelect" onClick={toggleDropdown}>
        <div className="selectTrigger">
          {selectedTokenData ? (
            <div className="selectedOption">
              <Image
                src={selectedTokenData.icon}
                alt={selectedTokenData.name}
                height={25}
                width={25}
                style={{
                  borderRadius:"50%"
                }}
              />
              <span>{selectedTokenData.name.toUpperCase()}</span>
            </div>
          ) : (
            <div className="placeholder">
              <span>Select Token:</span>
            </div>
          )}
          <div className={`dropdownArrow ${isOpen ? 'open' : ''}`}>
            ▼
          </div>
        </div>

        {isOpen && (
          <div className="dropdownMenu">
            {currentTokens.map((token) => (
              <div
                key={token.name}
                className={`dropdownOption ${selectedToken === token.name? 'selected' : ''}`}
                onClick={() => handleTokenSelect(token.name, token.address)}
              >
                <Image
                  src={token.icon}
                  alt={token.name}
                  height={25}
                  width={25}
                  className='tokenLogo'
                />
                <span>{token.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};