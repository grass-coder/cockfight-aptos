import { AccountInfo, InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react'; 
import { aptos } from '../lib/aptosClient';
 
export const executeTx = async (
  account: AccountInfo | null,
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  transaction: InputTransactionData,
) => {
    if(account == null) {
      throw new Error("Unable to find account to sign transaction")
    }

    // add sender to transaction
    const response = await signAndSubmitTransaction({
        sender: account.address,
        ...transaction, 
      }
    );
    
    try {
      const res = await aptos.waitForTransaction({ transactionHash: response.hash });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
};

