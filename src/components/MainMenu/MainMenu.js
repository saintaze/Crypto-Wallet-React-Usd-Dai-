import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Button } from 'semantic-ui-react';
import { setBalanceLoading, updateBalance } from '../../store/slices/contractSlice';
import { initTokensLoading } from '../../helpers/index';

import './MainMenu.css';

const MainMenu = () => {
	const dispatch = useDispatch();
	const { signerAddress } = useSelector(state => state.account);
	const { tokens } = useSelector(state => state.contract);
	const [ faucetToken, setFaucetToken ] = useState(null);
	const [ tokensLoading, setTokensLoading ] = useState({});

	const mintTokens = async (token) => {
		setFaucetToken(token);
		setTokensLoading({...tokensLoading, [token.symbol]: {loading: true}});
		try{
			await token.contract.faucet(signerAddress);
			dispatch(setBalanceLoading({symbol: token.symbol, loadingState: true}));
		}catch(e){
			console.log(e.message);
			dispatch(setBalanceLoading({symbol: token.symbol, loadingState: false}));
		}
		setTokensLoading({...tokensLoading, [token.symbol]: {loading: false}});
	}

	useEffect(() => {setTokensLoading(initTokensLoading(tokens))}, [tokens]);
	
	useEffect(() => {
		if(!faucetToken) return;
		const reupdateBalance = async () => {
			const balance = await faucetToken.contract.balanceOf(signerAddress);
			dispatch(updateBalance({balance, address: faucetToken.contract.address}));
			dispatch(setBalanceLoading({symbol: faucetToken.symbol, loadingState: false}));
		}
		faucetToken.contract.on('Transfer', reupdateBalance);	
		return () => faucetToken.contract.off('Transfer', reupdateBalance);
	}, [faucetToken, signerAddress, dispatch]);


	const getFaucetSymbol = (token) => {
		return token.symbol[0].toUpperCase() + token.symbol.slice(1).toLowerCase();
	}

	return (
		<Menu color="black" inverted attached="top">
			<Menu.Item header>
				<h3>Crypto Wallet</h3>
			</Menu.Item>
			 <Menu.Menu position='right'>
				{
					tokens.map(token => (
						<Menu.Item key={token.symbol}>
							<Button className="faucetBtn" loading={!!Object.keys(tokensLoading).length && tokensLoading[token.symbol].loading} onClick={() => mintTokens(token)}>{getFaucetSymbol(token)} Faucet</Button>
						</Menu.Item>
					))
				}
			</Menu.Menu>
		</Menu>
	)
}

export default MainMenu
