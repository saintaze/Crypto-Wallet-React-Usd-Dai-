import { useCallback, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Menu, Loader } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { connectBlockchain } from './connectBlockchain';
import { setContracts } from './store/slices/contractSlice';
import { setAccount } from './store/slices/accountSlice';
import WalletList from './components/WalletList/WalletList';

import './App.css';

function App() {
	const dispatch = useDispatch();
	const [dataIsLoaded, setdataIsLoaded] = useState(false);

	const initContracts = useCallback(async ({tokens, signerAddress}) => {
		const mappedTokens = await Promise.all(
			tokens.map(async (token) => {
				const balance = await token.balanceOf(signerAddress);
				const name = await token.name();
				const decimals = await token.decimals();
				const symbol = await token.symbol()
				return {contract: token, symbol, balance, name, decimals}
			})
		)
		dispatch(setContracts({tokens: mappedTokens}));
		dispatch(setAccount({signerAddress}))
	}, [dispatch])

	useEffect(() => {
		(async () => {
			const connection = await connectBlockchain();
			await initContracts(connection);
			setdataIsLoaded(true);
		})()
	}, [initContracts])

  return (
		<>
			<Menu color="black" inverted attached="top">
				<Menu.Item header>Crypto Wallet</Menu.Item>
			</Menu>
			<Container>
				{!dataIsLoaded ? 
					<Loader active content="Initializing" /> : 
					<WalletList/>
				}
			</Container>
		</>
  );
}

export default App;
