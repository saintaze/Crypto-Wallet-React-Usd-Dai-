import { createSlice } from '@reduxjs/toolkit';


const accountInitialState = {
	signerAddress: '',
	allowances: [],
	daiBalance: 0,
	usdBalance: 0
}

export const accountSlice = createSlice({
  name: 'account',
  initialState: accountInitialState,
  reducers: {
		setAccount(state, {payload}){
			console.log(payload)
			Object.assign(state, {...state, ...payload})
			// state.signerAddress = payload.signerAddress;
			// state.allowances = payload.allowances;
			// state.daiBalance = payload.daiBalance;
			// state.usdBalance = payload.usdBalance;
		}
  },
})

export const { 
	setAccount
} = accountSlice.actions

export default accountSlice.reducer