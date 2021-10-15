import { createSlice } from '@reduxjs/toolkit';

const accountInitialState = {
	signerAddress: ''
}

export const accountSlice = createSlice({
  name: 'account',
  initialState: accountInitialState,
  reducers: {
		setAccount(state, {payload}){
			state.signerAddress = payload.signerAddress;
		}
  }
})

export const { 
	setAccount
} = accountSlice.actions

export default accountSlice.reducer