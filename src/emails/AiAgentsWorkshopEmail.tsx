import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
} from "@react-email/components";
import * as React from "react";

interface AiAgentsWorkshopEmailProps {
  name?: string;
}

export const AiAgentsWorkshopEmail = ({ name = "Builder" }: AiAgentsWorkshopEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You're in! Welcome to LazyTech Workshop #01.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Workshop #01.</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Your payment was successful and your seat is confirmed! We are thrilled to have you join
            us for <strong>BUILD YOUR FIRST AI AGENT</strong>.
          </Text>
          <Text style={text}>
            <strong>
              Please note that Workshop #01 will officially commence on Sunday, September 27th, 2026 at 10:00 AM IST.
            </strong>
          </Text>
          <Text style={text}>
            We are preparing everything for you right now.{" "}
            <strong>
              Further details, the meeting link, and resources will be shared soon.
            </strong>
          </Text>
          <Text style={text}>
            In the meantime, please join our official WhatsApp group for important announcements and further updates:
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://chat.whatsapp.com/FpAoGu3KCw8662LtHqPrZ0?s=cl&p=a&mlu=4">
              Join WhatsApp Group
            </Button>
          </Section>
          <Text style={text}>Get ready to build something useful this weekend!</Text>
          <Text style={text}>
            Need help? Contact support at <strong>+91 85008 02243</strong> for more details.
          </Text>
          <Text style={footer}>
            Best,
            <br />
            The LazyTech Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AiAgentsWorkshopEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingTop: "32px",
  paddingBottom: "32px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#E50027",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const footer = {
  color: "#898989",
  fontSize: "14px",
  lineHeight: "22px",
  marginTop: "48px",
};
