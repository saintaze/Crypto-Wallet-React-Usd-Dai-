import { ethers } from "ethers";
import Dai from './contracts/Dai.json';
import Usd from './contracts/Usd.json';

export const connectBlockchain = async () => {
	if(window.ethereum){
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const signerAddress = await signer.getAddress();
		const dai = await new ethers.Contract('0x05F9Ce435449856e579ed2007ac25922B6497F60', Dai.abi, signer);
		const usd = await new ethers.Contract('0x622708b53CEeCe96d1A5b60D948e087Fbb75F06a', Usd.abi, signer);
		return {tokens: [dai, usd], signerAddress};
	}
}

