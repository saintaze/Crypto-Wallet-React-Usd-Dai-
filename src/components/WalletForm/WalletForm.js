import { useState, useEffect } from 'react';
import { Form, Input, Button, Message, Loader, Header } from 'semantic-ui-react';
import { ethers } from 'ethers';
import { useSelector, useDispatch } from 'react-redux';
import { updateBalance, setBalanceLoading } from '../../store/slices/contractSlice';
import { paymentAction } from '../../enums/paymentAction';

import './WalletForm.css';

const WalletForm = ({token}) => {
	const { signerAddress } = useSelector(state => state.account);
	const { balanceLoading } = useSelector(state => state.contract);
	const dispatch = useDispatch();

	const [transferIsLoading, setTransferIsloading] = useState(false);
	const [approveIsLoading, setApproveIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const tokenFormIS = {amount: '', address: ''};
	const [tokenForm, setTokenForm] = useState(tokenFormIS);
	const {address, amount} = tokenForm;

	const handleChange = e => {
		setTokenForm({...tokenForm, [e.target.name]: e.target.value});
	}

	const handleSubmit = async(e) => {
		e.preventDefault();
		setErrorMessage('');
		if(!(address.trim() && amount.trim())) return;
		if(e.nativeEvent.submitter.textContent === paymentAction.TRANSFER){
			await handleTransfer();
		}
		if(e.nativeEvent.submitter.textContent === paymentAction.APPROVE){
			await handleApprove();
		}
		setTokenForm(tokenFormIS);
	}

	const handleTransfer = async () => {
		setTransferIsloading(true);
		try{
			await token.contract.transfer(address, amount);	
			dispatch(setBalanceLoading({symbol: token.symbol, loadingState: true}));
		}catch(e) {
			setErrorMessage(e.message);
			dispatch(setBalanceLoading({symbol: token.symbol, loadingState: false}));
		}
		setTransferIsloading(false);
	}

	const handleApprove = async () => {
		setApproveIsLoading(true);
		try{
			await token.contract.approve(address, amount);	
		}catch(e) {
			setErrorMessage(e.message);
		}	
		setApproveIsLoading(false);		
	}

	useEffect(() => {
		const reupdateBalance = async (from, to) => {
			if (from === signerAddress){
				const balance = await token.contract.balanceOf(signerAddress);
				dispatch(updateBalance({balance, address: token.contract.address}));
				dispatch(setBalanceLoading({symbol: token.symbol, loadingState: false}));
			}
		}
		token.contract.on('Transfer', reupdateBalance);	
		return () => token.contract.off('Transfer', reupdateBalance);
	}, [token, signerAddress, address, dispatch])

	return (
		<div>
			<Form error={!!errorMessage} onSubmit={handleSubmit}>
				<Message error header='Oops' content={errorMessage} />
				<Form.Field>
					<Header as='h3'>Balance <Loader inline size="mini" active={balanceLoading[token.symbol].loading} /></Header>
					<div className="balance">{ethers.utils.formatUnits(token.balance, token.decimals)} ({token.symbol.toLowerCase()})</div>
				</Form.Field>
				<Form.Field>
					<label>Address</label>
					<Input value={address} name="address" onChange={handleChange} placeholder='0xfe27059000bA9E665A280Fa42109dd0527662A78' />
				</Form.Field>
				<Form.Field>
					<label>Amount ({token.symbol})</label>
					<Input value={amount} name="amount" onChange={handleChange} label={token.symbol.toLowerCase()}labelPosition='right' placeholder={`${token.decimals} places`} />
				</Form.Field>
				<Button className="transferBtn" loading={transferIsLoading} primary>Transfer</Button>
				<Button loading={approveIsLoading} color="teal">Approve</Button>
			</Form>
		</div>
	)
}

export default WalletForm
