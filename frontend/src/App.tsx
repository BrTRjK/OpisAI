import { useState } from 'react';
import { Box, Container, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import PropertyForm from './components/forms/PropertyForm'
import DescriptionHistory from './components/DescriptionHistory'

function App() {
  const [shouldRefreshHistory, setShouldRefreshHistory] = useState(false);

  const refreshHistory = () => {
    setShouldRefreshHistory(prev => !prev); // Zmiana stanu wymusi ponowne pobranie historii
  };

  return (
    <Container maxW="container.xl" py={10}>
      <Box textAlign="center" mb={10}>
        <Heading>Generator Opisów Nieruchomości</Heading>
      </Box>
      <Tabs>
        <TabList>
          <Tab>Generuj opis</Tab>
          <Tab>Historia</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PropertyForm onDescriptionGenerated={refreshHistory} />
          </TabPanel>
          <TabPanel>
            <DescriptionHistory refreshTrigger={shouldRefreshHistory} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default App