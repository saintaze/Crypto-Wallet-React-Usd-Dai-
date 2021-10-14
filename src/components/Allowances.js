import React from 'react'
import { List } from 'semantic-ui-react';
import {ethers} from 'ethers';
import {useSelector} from 'react-redux';

const Allowances = () => {
	const {allowances} = useSelector(state => state.account);

	const renderAllowances = () => {
		if(!allowances.length) return <p>No allowances to show!</p>
		return allowances.map(a => (
			<List key={a.address} divided relaxed>
				<List.Item>
					<List.Icon color="grey" name='user circle' size='large' verticalAlign='middle' />
					<List.Content>
						<List.Header as='a'>{a.address}</List.Header>
						<List.Description as='a'>{ethers.utils.formatUnits(a.value, 18)} (dai)</List.Description>
					</List.Content>
				</List.Item>
			</List>
		))
	}

	return (
		<>
			{
				renderAllowances()
			}
		</>
	)
}

export default Allowances
