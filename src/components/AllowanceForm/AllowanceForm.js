import { useState } from 'react';
import { List, Form, Message, Button, Input, Header } from 'semantic-ui-react';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';

import './AllowanceForm.css';

const AllowanceForm = ({token}) => {
	const {signerAddress} = useSelector(state => state.account);
	const [errorMessage, setErrorMessage] = useState('');
	const [address, setAddress] = useState('');
	const [allowance, setAllowance] = useState(null);

	const handleSubmit =  async (e) => {
		e.preventDefault();
		if(!address.trim()) return;
		setErrorMessage('');
		try {
			const amount = await token.contract.allowance(address, signerAddress);
			setAllowance({amount, address});
			setAddress('');
		}catch(e){
			setErrorMessage(e.message);
		}
	}

	return (
		<div className="AddressForm">
			<Header as='h3'>Allowance</Header>
			<Form error={!!errorMessage} onSubmit={handleSubmit}>
				<Message error header='Oops' content={errorMessage} />
				<Form.Field>
					<label>Address</label>
					<Input placeholder="0x5092031db96C31277e70c6841666c51aEE292490" value={address} name="address" onChange={(e) => setAddress(e.target.value)} />
				</Form.Field>  
				<Button type="submit" color="violet">Check</Button>
			</Form>
			{
				allowance && (
					<List divided relaxed>
						<List.Item>
							<List.Icon color="grey" name='user circle' size='big' verticalAlign='middle' />
							<List.Content>
								<List.Header className="address" as='a'>{allowance.address}</List.Header>
								<List.Description className="amount" as='a'>{ethers.utils.formatUnits(allowance.amount, token.decimals)} ({token.symbol.toLowerCase()})</List.Description>
							</List.Content>
						</List.Item>
					</List>
				)
			}
		</div>
	)
}

export default AllowanceForm
