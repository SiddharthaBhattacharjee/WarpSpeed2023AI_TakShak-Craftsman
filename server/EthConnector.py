from web3 import Web3
from env import getPrivateKey

provider = Web3.HTTPProvider('https://eth-sepolia.g.alchemy.com/v2/zDdlaNQNTz6PrbF8nXtdvbM6BEt2aMFW')
w3 = Web3(provider)

contract_address = Web3.toChecksumAddress("0x105cd0c8fA7Dd1f56475E3e74b9d773Cdc78c3D7")

contract_abi =[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "D",
          "type": "string"
        }
      ],
      "name": "addOperation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "op",
          "type": "address"
        }
      ],
      "name": "addToWhitelist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOperations",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "data",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "status",
              "type": "uint256"
            }
          ],
          "internalType": "struct Contract.OperationData[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "op",
          "type": "address"
        }
      ],
      "name": "removeFromWhitelist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "s",
          "type": "uint256"
        }
      ],
      "name": "setStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

contract = w3.eth.contract(address=contract_address, abi=contract_abi)
sender_address = Web3.toChecksumAddress("0x8453ada3A9E671E0f115B2f2A2939b03aD519615")
w3.eth.defaultAccount = sender_address
nonce = w3.eth.getTransactionCount(sender_address)
data = contract.functions.getOperations().buildTransaction({
    'gas': 100000,
    'gasPrice': w3.toWei('20', 'gwei'),
    'nonce': nonce,
})
signed_txn = w3.eth.account.sign_transaction(data, private_key=getPrivateKey())
tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)

print(" ===================== MallEZ Admin Terminal ========================")
while True:
   print("Available Commands:")
   print("1 => addToWhiteList(address) : Adds address to whiteList, Requires Address ")
   print("2 => removeFromWhiteList(address) : Removes address from whiteList, Requires Address ")
   
   x = int(input("Enter your choice (integer 1-8) : "))
   if (x == 1):
      s = input("Enter Address : ");
      try: 
         transaction = contract.functions.addToWhitelist(s).buildTransaction({
             'gas': 2000000,
             'gasPrice': w3.toWei('50', 'gwei'),
             'nonce': w3.eth.getTransactionCount(sender_address),
         })

         # Sign and send the transaction
         signed_txn = w3.eth.account.signTransaction(transaction, private_key=getPrivateKey())
         tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

         print(tx_hash)
         print("Transaction Completed Successfully.")
         print("\n")
      except:
         print("Transaction Failed!")
         print("\n")

   elif (x == 2):
      s = input("Enter Address : ")
      try: 
         transaction = contract.functions.removeFromWhitelist(s).buildTransaction({
             'gas': 2000000,
             'gasPrice': w3.toWei('50', 'gwei'),
             'nonce': w3.eth.getTransactionCount(sender_address),
         })

         # Sign and send the transaction
         signed_txn = w3.eth.account.signTransaction(transaction, private_key=getPrivateKey())
         tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)

         print(tx_hash)
         print("Transaction Completed Successfully.")
         print("\n")
      except:
         print("Transaction Failed!")
         print("\n")
