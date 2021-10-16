import { ethers } from "ethers";
import Dai from './contracts/Dai.json';
import Usd from './contracts/Usd.json';

export const connectBlockchain = async () => {
	if(window.ethereum){
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const signerAddress = await signer.getAddress();
		const dai = await new ethers.Contract('0x589641FB24F49A2400f9e62810be4476083bf43c', Dai.abi, signer);
		const usd = await new ethers.Contract('0x545aD39DcADA2f79A6508281fe6DCC15dfe805B0', Usd.abi, signer);
		return {tokens: [dai, usd], signerAddress};
	}
}

