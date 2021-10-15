import { useSelector } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';
import AllowanceForm from '../AllowanceForm/AllowanceForm';
import WalletForm from '../WalletForm/WalletForm';

const WalletList = () => {
	const { tokens } = useSelector(state => state.contract);
	const floats = ['left', 'right'];

	return (
		<Grid>
			<Grid.Row>
				{
					tokens.map((token, i) => (
						<Grid.Column key={token.contract.address} floated={floats[i]} width={7}>
							<Header color="grey" className="topHeader" as='h1'>{token.symbol}</Header>
							<AllowanceForm token={token} />
							<WalletForm token={token} />
						</Grid.Column>
					))
				}
			</Grid.Row>
		</Grid>
	)
}

export default WalletList
