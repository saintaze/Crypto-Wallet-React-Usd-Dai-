import { createSlice } from '@reduxjs/toolkit';

const contractInitialState = {
	tokens: []
}

export const contractSlice = createSlice({
  name: 'contract',
  initialState: contractInitialState,
  reducers: {
		setContracts(state, {payload}){
			state.tokens = payload.tokens;
		},
		updateBalance(state, {payload}){
			const token = state.tokens.find(token => token.contract.address === payload.address);
			token.balance = payload.balance;
		}
  }
})

export const { 
	setContracts,
	updateBalance
} = contractSlice.actions

export default contractSlice.reducer