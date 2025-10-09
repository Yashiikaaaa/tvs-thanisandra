import "./App.css";
import { Header } from "./Components/Header";
import HomePage from "./Pages/HomePage";
import PropertyPage from "./Pages/PropertyPage";
import PlotDetailsPage from "./Pages/PlotDetails";
import LocationPage from "./Pages/LocationPage";
import StandardsPage from "./Pages/StandardsPage";
import LifestylePage from "./Pages/Lifestyle";
import Footer from "./Components/Footer";
import EnquiryModal from "./Components/EnquiryModal";

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToSectionWrapper from "./Components/ScrollToSectionWrapper";
import { useLeadTracking, LEAD_SOURCES } from "./hooks/useLeadTracking";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<string | null>(null); // <-- New state

  const { trackButtonClick, trackFormOpen } = useLeadTracking();

  // Modal open/close functions
  const openModal = (source: string) => {
    setModalSource(source); // <-- Save the source
    trackFormOpen(source, "contact_form"); // Track when form is opened
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSource(null); // optional: clear source when closed
  };

  const handleButtonClick = () => {
    trackButtonClick(LEAD_SOURCES.HERO, "click");
  };


  const layoutProps = { openModal, handleButtonClick };

  const FullLayout = () => (
    <>
      <HomePage {...layoutProps} />
      <PropertyPage {...layoutProps} />
      <PlotDetailsPage {...layoutProps} />
      <LocationPage />
      <StandardsPage />
      <LifestylePage />
    </>
  );

  return (
    <>
      <Header />

      <Routes>
        {["/", "/home", "/overview", "/location", "/amenities", "/gallery", "/floorplan"].map(
          (path) => {
            const scrollTo = path === "/" ? null : path.replace("/", "");
            return (
              <Route
                key={path}
                path={path}
                element={
                  <ScrollToSectionWrapper scrollTo={scrollTo || '/'}>
                    <FullLayout />
                  </ScrollToSectionWrapper>
                }
              />
            );
          }
        )}
      </Routes>

      <Footer openModal={openModal} />

      <EnquiryModal 
        isOpen={isModalOpen} 
        closeModal={closeModal} 
        source={modalSource? modalSource: 'unknown'} // <-- Pass source to modal
        // handleSubmit={handleFormSubmit} 
      />
    </>
  );
}

export default App;
