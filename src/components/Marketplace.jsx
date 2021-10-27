import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Table,
  Container,
  Thead,
  Th,
  Badge,
  RadioGroup,
  Radio,
  Center,
  IconButton,
  useToast,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Tooltip,
  Link,
  Spacer,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import { ethers } from "ethers";
import CollectionItem from "./CollectionItem";
import Master from "../abis/contracts/Master.json";
import { HiRefresh } from "@react-icons/all-files/hi/HiRefresh";
import { ImPriceTags } from "@react-icons/all-files/im/ImPriceTags";
import random from "../utils/random";
import colors from "../utils/colors";

const Marketplace = ({ itemHistory }) => {
  const masterContractAddress = "0xA82B3db1c1a5591269070EfF28a9B0fb4Cc1007c";
  const [tokensOwned, setTokensOwned] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState();
  const user = useUser();
  const [itemsAdded, setItemsAdded] = useState(0);
  const [collectedFees, setCollectedFees] = useState(0);
  const toast = useToast();

  async function getBal() {
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const tokenBal = await contract.balanceOf(user.address);
    setTokensOwned(tokenBal.toString());
  }

  async function getFees() {
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const fees = await contract.collectedFees(user.address);
    setCollectedFees(fees.toString());
  }

  async function getItemsAddded() {
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const itemsAdded = await contract.numItemsSets(user.address);
    setItemsAdded(itemsAdded.toString());
  }

  async function refresh() {
    getBal();
    getTokens();
    getFees();
    getItemsAddded();
  }

  function themeToItemSet(theme) {
    for (let i = 0; i <= itemHistory.length; i++) {
      if (itemHistory[i].theme === theme) {
        return itemHistory[i];
      }
    }
    return "Not Found";
  }

  async function addNewItemSet() {
    const selectedItemSet = themeToItemSet(selectedTheme);

    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const tx = await contract.addItemSet(
      selectedItemSet.theme,
      selectedItemSet.weapons,
      selectedItemSet.armor,
      selectedItemSet.accessories,
      { value: ethers.BigNumber.from("50000000000000000") }
    );
    toast({
      title: "Adding Loot Set",
      description: "Your transaction is pending",
      status: "info",
      duration: 4000,
      isClosable: true,
    });
    await tx.wait();
    const itemsAdded = await contract.numItemsSets(user.address);
    setItemsAdded(itemsAdded.toString());

    refresh();
  }

  async function claimLoot() {
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );

    contract.on("feeCollected", (user, fee) => {
      if (user === user.address) {
        setCollectedFees(fee);
      }
    });

    const tx = await contract.claim({
      value: ethers.BigNumber.from("50000000000000000"),
    });
    toast({
      title: "Claiming Random Loot",
      description: "Your transaction is pending",
      status: "info",
      duration: 4000,
      isClosable: true,
    });
    await tx.wait();

    refresh();
  }

  async function getTokens() {
    let contract = new ethers.Contract(
      masterContractAddress,
      Master.abi,
      user.provider.getSigner()
    );
    const bal = await contract.balanceOf(user.address);
    setTokensOwned(bal.toString());
    let currentTokens = [];
    for (let i = 0; i < parseInt(bal.toString(), 10); i++) {
      const tokenID = await contract.tokenOfOwnerByIndex(user.address, i);
      const index = await contract.tokenIdToRand(tokenID);
      const currentItems = await contract.itemSets(index);
      const theme = currentItems.theme;
      const tokenImage = await contract.tokenImage(tokenID);
      // const tokenURI = await contract.tokenURI(tokenID)
      currentTokens.push({
        image: tokenImage,
        id: tokenID.toString(),
        theme: theme.toString(),
      });
    }
    setTokens(currentTokens);
    getFees();
  }
  function ShowItems() {
    return (
      <RadioGroup
        onChange={(val) => setSelectedTheme(val)}
        value={selectedTheme}
      >
        {itemHistory.map((item) => (
          <Radio value={item.theme}>
            <Badge
              borderRadius="full"
              px="30"
              colorScheme={item.colorTheme}
              alignItems="center"
            >
              {item.theme}
            </Badge>
            <Box as="span" ml="3"></Box>
          </Radio>
        ))}
      </RadioGroup>
    );
  }

  function CollectionList() {
    if (tokens) {
      return tokens.map((token) => (
        <Tooltip label={"View On OpenSea"} bg="purple.200" placement="top">
          <Box
            as="button"
            href="https://chakra-ui.com"
            _hover={{ background: "#555" }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `https://opensea.io/assets/matic/0xa82b3db1c1a5591269070eff28a9b0fb4cc1007c/${token.id}`;
            }}
          >
            <CollectionItem
              image={token.image}
              theme={token.theme}
              color={random(colors)}
              tokenId={token.id}
            />
          </Box>
        </Tooltip>
      ));
    }
    return <div></div>;
  }

  return (
    <Container maxW={"7xl"}>
      <StatGroup>
        <Text>
          View Marketplace Contract on{" "}
          <Link
            color="purple.300"
            href="https://opensea.io/collection/gpt-loot-marketplace"
          >
            OpenSea
          </Link>
          <Spacer height="20px" />
        </Text>
        <Stat>
          <StatLabel>Loot Sets Added</StatLabel>
          <StatNumber>{itemsAdded}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Collected Fees</StatLabel>
          <StatNumber>
            {ethers.utils.formatUnits(collectedFees)} MATIC
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Loot Owned</StatLabel>
          <StatNumber>{tokensOwned}</StatNumber>
        </Stat>
      </StatGroup>

      <Box
        marginTop={{ base: "1", sm: "5" }}
        display="flex"
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flex="1"
          marginRight="3"
          position="relative"
          alignItems="center"
        >
          <Table size="4xl">
            <Thead>
              <Th>Loot</Th>
            </Thead>
            <HStack>
              <ShowItems />
            </HStack>
            <Tooltip
              label={
                itemHistory.length < 1
                  ? "Generate some loot first!"
                  : "0.05 MATIC"
              }
            >
              <span>
                <Button
                  leftIcon={<ImPriceTags />}
                  mt={4}
                  borderRadius="md"
                  bgGradient={[
                    "linear(to-tr, teal.400, yellow.500)",
                    "linear(to-t, blue.300, teal.600)",
                    "linear(to-b, orange.200, purple.400)",
                  ]}
                  color="white"
                  px={4}
                  h={8}
                  isDisabled={itemHistory.length < 1}
                  onClick={addNewItemSet}
                >
                  Add To Marketplace Contract
                </Button>
              </span>
            </Tooltip>
          </Table>
        </Box>

        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          justifyContent="center"
          marginTop={{ base: "3", sm: "0" }}
        >
          <Text
            fontSize="lg"
            bgGradient={[
              "linear(to-tr, teal.400, yellow.500)",
              "linear(to-t, blue.300, teal.600)",
              "linear(to-b, orange.200, purple.400)",
            ]}
            bgClip="text"
            margin="10px"
            noOfLines={[4, 5, 6]}
          >
            Your generated loot sets will appear to the left. You can add your
            loot sets to a global loot contract. When somebody claims loot from
            the global contract, a random loot set is chosen from and the user
            who added the loot set will receive 50% of the minting fee
          </Text>
        </Box>
      </Box>
      <Center height="50px" />
      <Tooltip
        label={
          user ? "0.05 MATIC" : "Not Connected. Switch To Polygon and Refresh"
        }
      >
        <span>
          <Button
            leftIcon={<ImPriceTags />}
            mt={4}
            onClick={claimLoot}
            borderRadius="md"
            bgGradient={[
              "linear(to-tr, teal.400, yellow.500)",
              "linear(to-t, blue.300, teal.600)",
              "linear(to-b, orange.200, purple.400)",
            ]}
            color="white"
            px={12}
            h={12}
            fontWeight={"bold"}
            isDisabled={!user}
          >
            Claim Loot From Marketplace
          </Button>
        </span>
      </Tooltip>
      <Center height="50px" />
      <Heading
        bgGradient={[
          "linear(to-tr, teal.400, yellow.500)",
          "linear(to-t, blue.300, teal.600)",
          "linear(to-b, orange.200, purple.400)",
        ]}
        bgClip="text"
        fontWeight="bold"
      >
        My Loot:
      </Heading>
      <IconButton icon={<HiRefresh />} onClick={refresh} />
      <Box
        maxW="7xl"
        mx={"auto"}
        pt={5}
        px={{ base: 2, sm: 12, md: 17 }}
        alignContent="center"
      >
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
          <CollectionList />
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default Marketplace;
