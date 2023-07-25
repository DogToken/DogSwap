import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const PrivacyPolicyPopup = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [policyContent, setPolicyContent] = useState("");

  useEffect(() => {
    // Fetch the privacy policy content from the URL
    fetch("https://dogswap.online/privacypolicy.md")
      .then((response) => response.text())
      .then((data) => setPolicyContent(data));
  }, []);

  // Custom styles for the Modal component
  const customModalStyles = {
    content: {
      width: "75%", // Reduce the size to 75% of the original size
      height: "75%", // Reduce the height to 75% of the original height
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      overflowY: "auto", // Enable vertical scrolling if content overflows
    },
  };

  // Custom styles for the policy content
  const customPolicyContentStyles = {
    padding: "20px", // Add padding to make the text readable
    fontSize: "14px", // Adjust font size for better readability
  };

  return (
    <div>
      <a href="#" onClick={() => setModalIsOpen(true)}>
        Privacy Policy
      </a>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Privacy Policy"
        style={customModalStyles} // Apply custom styles to the Modal component
      >
        <div style={customPolicyContentStyles} dangerouslySetInnerHTML={{ __html: policyContent }} />
      </Modal>
    </div>
  );
};

export default PrivacyPolicyPopup;
