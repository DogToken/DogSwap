import React, { useState } from "react";
import {
  Container,
  Typography,
  makeStyles,
  Link,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  footer: {
    marginTop: "250px",
  },
}));

function Privacy() {
  const classes = useStyles();

  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    setAgreed(true);
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        Privacy Policy for DogSwap.Online
      </Typography>
      <Typography variant="body1">
        This Privacy Policy governs the manner in which DogSwap.Online ("we," "our," or "us") collects, uses, maintains, and
        discloses information collected from users (each, a "User") of the dogswap.online website ("Site").
      </Typography>

      <Typography variant="h5">1. Personal Identification Information</Typography>
      <Typography variant="body1">
        We may collect personal identification information from Users in various ways, including but not limited to when Users
        visit our Site, register on the Site, place an order, subscribe to the newsletter, respond to a survey, fill out a
        form, and in connection with other activities, services, features, or resources we make available on our Site. Users
        may be asked for their name, email address, mailing address, phone number, or other relevant information. Users may,
        however, visit our Site anonymously. We will collect personal identification information from Users only if they
        voluntarily submit such information to us. Users can always refuse to supply personal identification information,
        except that it may prevent them from engaging in certain Site-related activities.
      </Typography>

      <Typography variant="h5">2. Non-Personal Identification Information</Typography>
      <Typography variant="body1">
        We may collect non-personal identification information about Users whenever they interact with our Site.
        Non-personal identification information may include the browser name, the type of computer, and technical information
        about Users' means of connection to our Site, such as the operating system and the Internet service providers
        utilized, and other similar information.
      </Typography>

      <Typography variant="h5">3. Web Browser Cookies</Typography>
      <Typography variant="body1">
        Our Site may use "cookies" to enhance User experience. Users' web browsers place cookies on their hard drive for
        record-keeping purposes and sometimes to track information about them. Users may choose to set their web browsers to
        refuse cookies or to alert them when cookies are being sent. If they do so, note that some parts of the Site may not
        function properly.
      </Typography>

      <Typography variant="h5">4. How We Use Collected Information</Typography>
      <Typography variant="body1">
        DogSwap.Online may collect and use Users' personal information for the following purposes:
        <ul>
          <li>
            To improve customer service: Information provided helps us respond to customer service requests and support needs
            more efficiently.
          </li>
          <li>
            To personalize the user experience: We may use information in the aggregate to understand how our Users as a group
            use the services and resources provided on our Site.
          </li>
          <li>
            To improve our Site: We may use feedback you provide to improve our products and services.
          </li>
          <li>
            To process payments: We may use the information Users provide about themselves when placing an order only to
            provide service to that order. We do not share this information with outside parties except to the extent necessary
            to provide the service.
          </li>
          <li>
            To run a promotion, contest, survey, or other Site feature.
          </li>
          <li>
            To send periodic emails: We may use the email address to send User information and updates pertaining to their
            order. It may also be used to respond to their inquiries, questions, and/or other requests.
          </li>
        </ul>
      </Typography>

      <Typography variant="h5">5. How We Protect Your Information</Typography>
      <Typography variant="body1">
        We adopt appropriate data collection, storage, and processing practices and security measures to protect against
        unauthorized access, alteration, disclosure, or destruction of your personal information, username, password,
        transaction information, and data stored on our Site.
      </Typography>

      <Typography variant="h5">6. Sharing Your Personal Information</Typography>
      <Typography variant="body1">
        We do not sell, trade, or rent Users' personal identification information to others. We may share generic aggregated
        demographic information not linked to any personal identification information regarding visitors and users with our
        business partners, trusted affiliates, and advertisers for the purposes outlined above.
      </Typography>

      <Typography variant="h5">7. Changes to This Privacy Policy</Typography>
      <Typography variant="body1">
        DogSwap.Online has the discretion to update this privacy policy at any time. When we do, we will revise the updated
        date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed
        about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your
        responsibility to review this privacy policy periodically and become aware of modifications.
      </Typography>

      <Typography variant="h5">8. Your Acceptance of These Terms</Typography>
      <Typography variant="body1">
        By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use
        our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your
        acceptance of those changes.
        </Typography>
        <Typography variant="h5">9. Contacting Us</Typography>
      <Typography variant="body1">
        If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site,
        please contact us at{" "}
        <Link href="mailto:contact@dogswap.online">contact@dogswap.online</Link>.
      </Typography>

      <Typography variant="body1">
        This document was last updated on 25/07/2023.
      </Typography>
      {!agreed && (
        <button type="button" onClick={handleAgree}>
          I Agree
        </button>
      )}
      {agreed && (
        <Typography variant="h6" align="center" gutterBottom>
          Thank you for agreeing to our privacy policy!
        </Typography>
      )}

      <div className={classes.footer}>
        {/* Footer content here */}
      </div>
    </Container>
  );
}

export default Privacy;


