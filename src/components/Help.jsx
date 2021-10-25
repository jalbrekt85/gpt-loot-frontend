import {
  Text,
  Button,
  Textarea,
  SkeletonText,
  useToast,
  Stack,
  SimpleGrid,
  Tooltip,
  Center,
  Container,
  IconButton,
  Box,
  Spacer,
  Heading,
  Img,
} from "@chakra-ui/react";
import { useState } from "react";

const Help = () => {
  const faq = [
    {
      question: "What is This?",
      answer:
        "GPT-Loot is an NFT Loot Generation Platform. It uses an on-chain AI model called GPT-3 to create loot items from any theme",
    },
    {
      question: "What Theme should I submit?",
      answer:
        "Anything! The AI model is non-deterministic and is trained on billions of parameters. Even submitting the same theme multiple time will give different results",
    },
    {
      question: "How do I create an NFT from the Loot I've generated?",
      answer:
        "Click the 'Deploy' button to create an NFT Loot set. In 'My Collection', you'll be able to see NFT contract address and your the NFTs you've minted",
    },
    {
      question: "Can I trade the NFTs from the Loot Contract on OpenSea?",
      answer:
        "Yes. The Loot contract is a standard ERC-721 NFT and will be tradable like any other NFT. After you deploy the contract, it will automatically show up on OpenSea",
    },
    {
      question: "How does the Marketplace Work?",
      answer:
        "The Marketplace is a shared NFT Loot contract that anybody can contribute to. When users generate loot they can add their loot to the Marketplace contract. Users can also mint loot from the Marketplace. By doing this, a random Loot set is selected and random loot from that set is minted. 50% of the minting fee (0.5 MATIC) is accredited to the user who added that loot set",
    },
    {
      question: "How do I earn minting fees?",
      answer:
        "By adding your Loot set to the Marketplace contract, 0.25 MATIC will automatically be deposited into your wallet everytime somebody mints loot from your loot set.",
    },
    {
      question: "How is the AI model on-chain?",
      answer:
        "Chainlink powers the backend of GPT-Loot. A oracle service allows anyone to call GPT-3 throught their smart contract using the Oracles's address",
    },
  ];

  // Use the faq list to render the FAQ section
  const faqList = faq.map((faq, index) => {
    return (
      <Stack key={index}>
        <Text
          fontSize="lg"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold"
        >
          {faq.question}
        </Text>
        <Text fontWeight="semibold">{faq.answer}</Text>
      </Stack>
    );
  });

  return (
    <div>
      <Container maxW="4xl">
        <Heading
          //   fontSize="2xl"
          bgGradient={[
            "linear(to-tr, teal.400, yellow.500)",
            "linear(to-t, blue.300, teal.600)",
            "linear(to-b, orange.200, purple.400)",
          ]}
          bgClip="text"
          fontWeight="bold"
        >
          FAQ
        </Heading>
        <Spacer height="20px" />
        <SimpleGrid columns={[1, 1, 2]} spacing={8}>
          {faqList}
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default Help;
