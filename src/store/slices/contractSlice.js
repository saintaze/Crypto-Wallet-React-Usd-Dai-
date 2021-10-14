import { createSlice } from '@reduxjs/toolkit';


const contractInitialState = {
	dai: null,
	defi: null,
}

export const contractSlice = createSlice({
  name: 'contract',
  initialState: contractInitialState,
  reducers: {
		setContract(state, {payload}){
			state.dai = payload.dai;
			state.defi = payload.defi;
		}
  },
})

export const { 
	setContract
} = contractSlice.actions

export default contractSlice.reducer