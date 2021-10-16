import { createSlice } from '@reduxjs/toolkit';
import { initTokensLoading } from '../../helpers/index';

const contractInitialState = {
	balanceLoading: {},
	tokens: []
}

export const contractSlice = createSlice({
  name: 'contract',
  initialState: contractInitialState,
  reducers: {
		setContracts(state, {payload}){
			state.tokens = payload.tokens;
			state.balanceLoading = initTokensLoading(payload.tokens);
		},
		updateBalance(state, {payload}){
			const token = state.tokens.find(token => token.contract.address === payload.address);
			token.balance = payload.balance;
		},
		setBalanceLoading(state, {payload}) {
			state.balanceLoading[payload.symbol].loading =  payload.loadingState;
		}
  }
})

export const { 
	setContracts,
	updateBalance,
	setBalanceLoading
} = contractSlice.actions

export default contractSlice.reducer