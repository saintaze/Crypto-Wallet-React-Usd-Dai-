import { useState, useEffect } from 'react';
import { Form, Input, Button, Message, Loader } from 'semantic-ui-react';
import {ethers} from 'ethers';
import Allowances from './Allowances';
import {useSelector, useDispatch} from 'react-redux';
import {setAccount} from '../store/slices/accountSlice';
import {paymentAction} from '../enums/paymentAction';

const WalletForm = () => {

	const {daiBalance, signerAddress, allowances} = useSelector(state => state.account);
	const {dai, defi} = useSelector(state => state.contract);
	const dispatch = useDispatch();

	const [transferIsLoading, setTransferIsloading] = useState(false);
	const [approveIsLoading, setApproveIsLoading] = useState(false);
	const [loadingBalance, setLoadingBalance] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const tokenFormIS = {amount: '', address: ''};
	const [tokenForm, setTokenForm] = useState(tokenFormIS);
	const {address, amount} = tokenForm;


	const handleChange = e => {
		setTokenForm({...tokenForm, [e.target.name]: e.target.value});
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrorMessage('');
		if(e.nativeEvent.submitter.textContent === paymentAction.TRANSFER){
			handleTransfer();
		}
		if(e.nativeEvent.submitter.textContent === paymentAction.APPROVE){
			handleApprove();
		}
	}

	useEffect(() => {
		const udpateBalance = async (from, to) => {
			if (from === signerAddress && to === address){
				const daiBalance = await dai.balanceOf(signerAddress);
				dispatch(setAccount({daiBalance: ethers.utils.formatUnits(daiBalance, 18)}));
				setLoadingBalance(false);
			}
		}
		dai.on('Transfer', udpateBalance);	
		return () => dai.off('Transfer', udpateBalance);
	}, [dai, signerAddress, address, dispatch])


	const handleTransfer = async () => {
		setTransferIsloading(true);
		try{
			await dai.transfer(address, amount);	
			setLoadingBalance(true);
		}catch(e) {
			setErrorMessage(e.message);
			setLoadingBalance(false);
		}
		setTransferIsloading(false);
		// setTokenForm(tokenFormIS);
	}

	const handleApprove = async () => {
		setApproveIsLoading(true);
		try{
			await dai.approve(address, amount);	
			if(!allowances.includes(address)){
				await defi.setAllowance(address);
			}
		}catch(e) {
			setErrorMessage(e.message)
		}	
		setApproveIsLoading(false);		
	}

	return (
		<Form error={!!errorMessage} onSubmit={handleSubmit}>
			<Message error header='Oops' content={errorMessage} />
			<Form.Field>
				<label>Address</label>
				<Input value={address} name="address" onChange={handleChange} placeholder='0xfe27059000bA9E665A280Fa42109dd0527662A78' />
			</Form.Field>
				<Form.Field>
				<h3>Allowance</h3>
				<Allowances />
			</Form.Field>
			<Form.Field>
				<h3>Balance <Loader size="mini" active={loadingBalance} inline /></h3>
				<div>{daiBalance} (dai)</div>
			</Form.Field>
			<Form.Field>
				<label>Amount (Dai)</label>
				<Input value={amount} name="amount" onChange={handleChange} label="dai" labelPosition='right' placeholder='18 decimals'/>
			</Form.Field>
			<Button loading={transferIsLoading} primary>Transfer</Button>
			<Button loading={approveIsLoading} primary>Approve</Button>
		</Form>
	)
}

export default WalletForm
