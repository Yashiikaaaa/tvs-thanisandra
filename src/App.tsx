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
import { useLeadTracking, LEAD_SOURCES } from "./hooks/useLeadTracking"; // Import tracking hooks

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  // Get tracking functions from useLeadTracking
  const { trackButtonClick, trackFormSubmission, trackFormOpen } = useLeadTracking();

  // Modal open/close functions
  const openModal = () => {
    trackFormOpen(LEAD_SOURCES.HERO, "contact_form"); // Track when form is opened
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Button click tracking (Example: "Contact Us" button click)
  const handleButtonClick = () => {
    trackButtonClick(LEAD_SOURCES.HERO, "click", "Hero Section Button"); // Track button click event
  };

  // Form submission tracking
  const handleFormSubmit = () => {
    trackFormSubmission(LEAD_SOURCES.CONTACT_FORM_LINK, "contact_form"); // Track form submission
  };

  // Layout for the pages
  const layoutProps = { openModal, handleButtonClick };

  // Full page layout component
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
                  <ScrollToSectionWrapper scrollTo={scrollTo}>
                    <FullLayout />
                  </ScrollToSectionWrapper>
                }
              />
            );
          }
        )}
      </Routes>

      {/* Footer with modal open functionality */}
      <Footer openModal={openModal} />

      {/* Enquiry Modal with form submission tracking */}
      <EnquiryModal 
        isOpen={isModalOpen} 
        closeModal={closeModal} 
        handleSubmit={handleFormSubmit} // Pass submit function to modal
      />
    </>
  );
}

export default App;
