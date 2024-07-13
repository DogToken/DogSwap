import React, { useState, useEffect } from "react";

function Privacy() {

  const [agreed, setAgreed] = useState(false);

  // Load user agreement status from local storage on component mount
  useEffect(() => {
    const userAgreed = localStorage.getItem("privacyAgreement");
    if (userAgreed === "true") {
      setAgreed(true);
    }
  }, []);

  const handleAgree = () => {
    // Update local storage to remember user's agreement
    localStorage.setItem("privacyAgreement", "true");
    setAgreed(true);
  };

  return (
    <div maxWidth="md">
      <div>
        <h4>
          Privacy Policy for dogswap.xyz
        </h4>

        <h5>What information we collect</h5>

        <p>
          We may collect personal identification information from Users in
          various ways, including when Users visit our Site, register on the
          Site, place an order, subscribe to the newsletter, respond to a
          survey, fill out a form, and in connection with other activities,
          services, features, or resources we make available on our Site.
        </p>

        <p>
          We may also collect non-personal identification information about
          Users whenever they interact with our Site. Non-personal
          identification information may include browser name, computer type,
          and technical information about Users' connection to our Site.
        </p>

        <h5>How we use collected information</h5>

        <p>
          We may use Users' personal and non-personal information for various
          purposes including:
        </p>

        <ul>
          <li>To improve customer service</li>
          <li>To personalize user experience</li>
          <li>To improve our Site</li>
          <li>To process payments</li>
          <li>To run promotions, contests, surveys</li>
          <li>To send periodic emails and respond to inquiries</li>
        </ul>

        <h5>How we protect information</h5>

        <p>
          We adopt appropriate data practices and security measures to protect
          against unauthorized access, alteration, disclosure, or destruction of
          personal and non-personal information.
        </p>

        <h5>Sharing information</h5>

        <p>
          We do not sell or share personal identification information with third
          parties except to provide requested services. We may share aggregated
          non-personal demographic information with partners.
        </p>

        <h5>Changes to privacy policy</h5>

        <h5>
          We may update this privacy policy and encourage Users to review it
          periodically.
        </h5>

        <h5>Contact us</h5>

        <p>
          Please contact us at{" "}
          <a href="mailto:contact@dogswap.xyz">
            contact@dogswap.xyz
          </a>{" "}
          with any questions about this privacy policy.
        </p>
      </div>
    </div>
  );
}

export default Privacy;
