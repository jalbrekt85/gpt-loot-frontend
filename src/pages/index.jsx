import CreateLoot from "../components/CreateLoot";
import MarketPlace from "../components/Marketplace";
import MyCollection from "../components/MyCollection";
import { useState } from "react";
import { Container } from "../components/Container";
import Header from "../components/Header";
import { ethers } from "ethers";
import { useUser, useLogin } from "../context/UserContext";
import useETHBalance from "../hooks/useETHBalance";
import useNetwork from "../hooks/useNetwork";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Button,
} from "@chakra-ui/react";
import Help from "../components/Help";

const NewHome = () => {
  const user = useUser();
  const login = useLogin();
  const [userBalance] = useETHBalance(user);
  const [network] = useNetwork(user);
  const [deployedContract, setDeployedContract] = useState();
  const [deployedColor, setDeployedColor] = useState();
  const [itemHistory, setItemHistory] = useState([]);

  const [items, setItems] = useState({
    theme: "",
    weapons: [],
    armor: [],
    accessories: [],
    colorTheme: "",
  });

  return (
    <div>
      <Header
        account={
          user
            ? user.address.substring(0, 3) +
              "..." +
              user.address.substring(
                user.address.length - 3,
                user.address.length
              )
            : "0x"
        }
        network={network}
        balance={ethers.utils
          .formatUnits(userBalance)
          .toString()
          .substring(0, 6)}
      />

      <Container height="125vh">
        <Tabs variant="unstyled" align="center">
          <TabList>
            <Tab
              _selected={{
                color: "white",
                bgGradient: "linear(to-b, orange.100, purple.300)",
              }}
            >
              Create Loot
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bgGradient: "linear(to-b, orange.100, purple.300)",
              }}
            >
              Marketplace
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bgGradient: "linear(to-b, orange.100, purple.300)",
              }}
            >
              My Collection
            </Tab>
            <Tab
              _selected={{
                color: "white",
                bgGradient: "linear(to-b, orange.100, purple.300)",
              }}
            >
              Help
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CreateLoot
                items={items}
                setItems={setItems}
                setDeployedContract={setDeployedContract}
                setDeployedColor={setDeployedColor}
                itemHistory={itemHistory}
                setItemHistory={setItemHistory}
              />
            </TabPanel>

            <TabPanel>
              <MarketPlace itemHistory={itemHistory} />
            </TabPanel>
            <TabPanel>
              <MyCollection
                deployedContract={deployedContract}
                deployedColor={deployedColor}
              />
            </TabPanel>
            <TabPanel>
              <Help />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </div>
  );
};

export default NewHome;
