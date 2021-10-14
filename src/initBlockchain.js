import { ethers } from "ethers";
import Dai from './contracts/Dai.json';
import Defi from './contracts/Defi.json';

export const initBlockchain = async () => {
	if(window.ethereum){
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const signerAddress = await signer.getAddress();
		const dai = await new ethers.Contract('0xD2eed31250C051dd968E3447d445C183aD1E971F', Dai.abi, signer);
		const defi = await new ethers.Contract('0x5FFa01FEcfe01388b06eBa9d1C421168e10C4407', Defi.abi, signer);
		return {dai, defi, signerAddress};
	}
}

