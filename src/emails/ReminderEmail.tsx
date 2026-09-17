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

interface ReminderEmailProps {
  name?: string;
  intervalText?: string;
}

export const ReminderEmail = ({ name = "Builder", intervalText = "" }: ReminderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your batch is starting soon! Complete your registration.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Complete Your Registration.</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            We noticed you initiated your payment for the LazyTech Building Year but didn't complete
            it.
          </Text>
          <Text style={text}>
            Our upcoming batch is starting soon! Don't miss out on securing your seat.{" "}
            {intervalText}
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://lazytech.greatskills.co.in/join">
              Complete Payment Now
            </Button>
          </Section>
          <Text style={text}>
            If you ran into any issues, just reply to this email and we'll help you out immediately.
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

export default ReminderEmail;

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
