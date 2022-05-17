import { BaseContract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { Camp, Camp__factory as CampFactory } from "../typechain";

type GetContractParams<Factory extends ContractFactory> =
  | {
      contractName: string;
      deployParams: Parameters<Factory["deploy"]>;
      existingContractAddress?: null;
    }
  | {
      contractName: string;
      deployParams?: null;
      existingContractAddress: string;
    };

export const getContract = async <
  Factory extends ContractFactory,
  Contract extends BaseContract
>({
  contractName,
  deployParams,
  existingContractAddress,
}: GetContractParams<Factory>): Promise<Contract> => {
  const ContractFactory = (await ethers.getContractFactory(
    contractName
  )) as Factory;

  const isGetExistingContract = Boolean(existingContractAddress);
  if (isGetExistingContract) {
    console.log(
      "Getting existing contract from address:",
      existingContractAddress
    );
    return ContractFactory.attach(existingContractAddress!) as Contract;
  }

  const contract = (await ContractFactory.deploy(...deployParams!)) as Contract;
  await contract.deployed();

  return contract;
};

export const getCamp = (params: GetContractParams<CampFactory>) =>
  getContract<CampFactory, Camp>(params);
