import { ENSArgs } from '..';
export default function ({ contracts, provider }: ENSArgs<'contracts' | 'provider'>, name: string): Promise<import("ethers").ContractTransaction | undefined>;