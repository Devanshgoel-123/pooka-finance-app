import React, { useState, useRef, useEffect } from 'react';
import './styles.scss';
import Image from 'next/image';
import { useAccount, useChainId } from 'wagmi';
import { avalancheFuji, sepolia } from 'viem/chains';
import { NATIVE_TOKEN_AVAX, USDC_TOKEN_SEPOLIA, USDC_TOKEN_AVAX } from '@/utils/constants';

export const TokenSelector = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId(); 
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [currentTokens, setCurrentTokens] = useState<{ name: string; icon: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tokens: Record<number, { name: string; icon: string; address:string }[]> = {
    [avalancheFuji.id]: [
      { name: 'Usdc', icon: '/assets/usdc.svg', address:USDC_TOKEN_AVAX },
      // { name: 'Link', icon: '/assets/link.svg' },
      { name: 'Avax', icon: '/assets/avax.svg', address:NATIVE_TOKEN_AVAX },
    ],
    [sepolia.id]: [
      { name: 'Usdc', icon: '/assets/usdc.svg', address:USDC_TOKEN_SEPOLIA },
      // Add more Sepolia tokens here
    ]
  };

  // Update tokens when chain changes
  useEffect(() => {
    if (chainId === undefined || !isConnected) {
      setCurrentTokens([]);
      setSelectedToken('');
      return;
    }
    
    const tokensForChain = tokens[chainId] || [];
    setCurrentTokens(tokensForChain);
    
    if (selectedToken && !tokensForChain.find(token => token.name === selectedToken)) {
      setSelectedToken('');
    }
  }, [chainId, isConnected, selectedToken]);

  const handleTokenSelect = (tokenSymbol: string) => {
    setSelectedToken(tokenSymbol);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
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

  // Don't render if not connected or no chain ID
  if (!isConnected || chainId === undefined) return null;

  // Don't render if no tokens available for current chain
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
              />
            </div>
          ) : (
            <div className="placeholder">
              <Image
                height={25}
                width={25}
                src={currentTokens[0]?.icon || "/assets/usdc.svg"}
                alt='Select token'
                className='tokenLogo'
              />
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
                onClick={() => handleTokenSelect(token.name)}
              >
                <Image
                  src={token.icon}
                  alt={token.name}
                  height={25}
                  width={25}
                  className='tokenLogo'
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};