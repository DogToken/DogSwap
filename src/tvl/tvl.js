import React, { useState, useEffect } from 'react';

const TVLPage = () => {
  const [loading, setLoading] = useState(false);
  const [mintmePrice, setMintmePrice] = useState(null);

  useEffect(() => {
    fetchMintmePrice();
  }, []);

  const fetchMintmePrice = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=mintme&vs_currencies=usd');
      const data = await response.json();
      const price = data?.mintme?.usd;

      if (price) {
        setMintmePrice(price);
      } else {
        throw new Error('Failed to fetch MINTME price');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching MINTME price:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : mintmePrice ? (
        <p>1 MINTME = ${mintmePrice} USD</p>
      ) : (
        <p>Failed to fetch MINTME price</p>
      )}
    </div>
  );
};

export default TVLPage;
