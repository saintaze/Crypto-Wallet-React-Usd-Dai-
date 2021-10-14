import { useEffect, useState } from 'react';
import './App.css';
import { initBlockchain } from './initBlockchain';
import { Container } from 'semantic-ui-react';
import { Menu, Loader } from 'semantic-ui-react';
import { ethers } from "ethers";
import WalletForm from './components/WalletForm';
import {useDispatch} from 'react-redux';
import {setContract} from './store/slices/contractSlice';
import {setAccount} from './store/slices/accountSlice';


function App() {
	const dispatch = useDispatch();
	const [dataIsLoaded, setdataIsLoaded] = useState(false);
	// const getAllowances = async () => {
	// 	const allowanceSenders = await defi.getAllowanceSenders();
	// 	const allowanceVals = await Promise.all(allowanceSenders.map(sender => dai.allowance(sender, signerAddress)));
	// 	const allowances = allowanceSenders.map((s, i) => ({address: s, value: allowanceVals[i]}));
	// 	setAllowances(allowances);
	// }


	useEffect(() => {
		(async () => {
			const {dai, defi, signerAddress} = await initBlockchain();
			dispatch(setContract({dai, defi}))
			const daiBalance = await dai.balanceOf(signerAddress);
			// const allowanceSenders = [...new Set((await defi.getAllowanceSenders()))];
			// const allowanceVals = await Promise.all(allowanceSenders.map(sender => dai.allowance(sender, signerAddress)));
			// const allowances = allowanceSenders.map((s, i) => ({address: s, value: allowanceVals[i]}));
			// setAllowances(allowances);
			const allowanceSenders = await defi.getAllowanceSenders();
			const allowanceVals = await Promise.all(allowanceSenders.map(sender => dai.allowance(sender, signerAddress)));
			const allowances = allowanceSenders.map((s, i) => ({address: s, value: allowanceVals[i]}));
			dispatch(setAccount({daiBalance: ethers.utils.formatUnits(daiBalance, 18), signerAddress, allowances}))
			setdataIsLoaded(true);
		})()
	}, [dispatch])

  return (
		<>
		<Menu>
			<Menu.Item header>Crypto Wallet</Menu.Item>
		</Menu>
		<Container>
			{!dataIsLoaded ? 
			 	<Loader active content="Initializing" /> : 
				<WalletForm />
			}
		</Container>
		</>
  );
}

export default App;
