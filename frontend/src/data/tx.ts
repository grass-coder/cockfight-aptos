import { AccountInfo, InputTransactionData, useWallet } from '@aptos-labs/wallet-adapter-react'; 
import { aptos } from '../lib/aptosClient';
import { TransactionResponse } from '@aptos-labs/ts-sdk';
 
export const onSignAndSubmitTransaction = async (
    account: AccountInfo | null,
    signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<TransactionResponse>,
    transaction: InputTransactionData,
) => {
    if(account == null) {
        throw new Error("Unable to find account to sign transaction")
    }
    const response = await signAndSubmitTransaction(transaction);
    
    try {
      const res = await aptos.waitForTransaction({ transactionHash: response.hash });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
};