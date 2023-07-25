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

  return (
    <div>
      <a href="#" onClick={() => setModalIsOpen(true)}>
        Privacy Policy
      </a>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Privacy Policy"
      >
        <div dangerouslySetInnerHTML={{ __html: policyContent }} />
      </Modal>
    </div>
  );
};

export default PrivacyPolicyPopup;
