import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import TaxPayerList from './components/TaxPayerList';
import TaxPayerForm from './components/TaxPayerForm';
import SearchBar from './components/SearchBar';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
};

function App() {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<TaxPayer[]>([]);

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
      setSearchResults(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
      setLoading(false);
    }
  };

  const handleAddTaxPayer = async (newTaxPayer: TaxPayer) => {
    try {
      const success = await backend.createTaxPayer(
        newTaxPayer.tid,
        newTaxPayer.firstName,
        newTaxPayer.lastName,
        newTaxPayer.address
      );
      if (success) {
        fetchTaxPayers();
      } else {
        console.error('Failed to add tax payer');
      }
    } catch (error) {
      console.error('Error adding tax payer:', error);
    }
  };

  const handleSearch = async (tid: string) => {
    if (tid.trim() === '') {
      setSearchResults(taxPayers);
    } else {
      try {
        const result = await backend.searchTaxPayerByTID(tid);
        setSearchResults(result ? [result] : []);
      } catch (error) {
        console.error('Error searching for tax payer:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TaxPayer Management App
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ width: '60%' }}>
            <SearchBar onSearch={handleSearch} />
            {loading ? (
              <CircularProgress />
            ) : (
              <TaxPayerList taxPayers={searchResults} />
            )}
          </Box>
          <Box sx={{ width: '35%' }}>
            <TaxPayerForm onAddTaxPayer={handleAddTaxPayer} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
