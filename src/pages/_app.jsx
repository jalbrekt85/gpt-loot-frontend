import { Web3ReactProvider } from "@web3-react/core";
import { Provider, Web3Provider } from "@ethersproject/providers";
import "../styles/globals.scss";
import { UserContextProvider } from "../context/UserContext";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

const getLibrary = (provider) => {
  return new Web3Provider(provider);
};

const MyApp = ({ Component, pageProps }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider resetCSS theme={theme}>
        <UserContextProvider>
          <Component {...pageProps} />
        </UserContextProvider>
      </ChakraProvider>
    </Web3ReactProvider>
  );
};

export default MyApp;
