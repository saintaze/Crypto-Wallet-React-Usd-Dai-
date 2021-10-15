import { configureStore } from '@reduxjs/toolkit';
import contractReducer from './slices/contractSlice';
import accountReducer from './slices/accountSlice';


export default configureStore({
  reducer: {
		contract: contractReducer,
		account: accountReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})