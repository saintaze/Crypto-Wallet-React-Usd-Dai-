export const initTokensLoading = (tokens) => {
	return tokens.reduce((tokensLoading, token) => {
		tokensLoading[token.symbol] = {loading: false};
		return tokensLoading;
	}, {})
}