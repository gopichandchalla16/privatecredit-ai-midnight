/**
 * PrivateCredit AI — Midnight Testnet Deploy Script
 * Uses official @midnight-ntwrk/midnight-js-contracts SDK
 *
 * Run: npx ts-node contracts/deploy.ts
 *
 * Docs: https://docs.midnight.network
 */

import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { createMidnightLedgerState } from '@midnight-ntwrk/midnight-js-contracts';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as crypto from 'crypto';

// ── Network config (Midnight testnet) ────────────────────────────────────────
const MIDNIGHT_INDEXER_URI = process.env.MIDNIGHT_INDEXER_URI ?? 'https://indexer.testnet.midnight.network/api/v1/graphql';
const MIDNIGHT_NODE_URI = process.env.MIDNIGHT_NODE_URI ?? 'https://rpc.testnet.midnight.network';
const MIDNIGHT_ZK_CONFIG_URI = process.env.MIDNIGHT_ZK_CONFIG_URI ?? 'https://zk.testnet.midnight.network';

// ── Types matching privatecredit.compact ─────────────────────────────────────
export interface CreditAttestationPublic {
  application_id: Uint8Array;   // 32 bytes
  above_threshold: boolean;
  threshold: number;
  ai_score_hash: Uint8Array;    // 32 bytes
  lender_id: Uint8Array;        // 32 bytes
  timestamp: bigint;
}

export interface PrivateCreditWitness {
  actual_score: number;         // 0-100, private — never on-chain
  annual_revenue: bigint;       // private
  debt_amount: bigint;          // private
  secret_nonce: Uint8Array;     // 32 bytes random
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function hashToBytes32(input: string): Uint8Array {
  return Buffer.from(crypto.createHash('sha256').update(input).digest('hex'), 'hex');
}

export function scoreToHash(score: number, nonce: Uint8Array): Uint8Array {
  const scoreBytes = Buffer.alloc(1);
  scoreBytes.writeUInt8(score);
  return Buffer.from(
    crypto.createHash('sha256').update(Buffer.concat([scoreBytes, nonce])).digest('hex'),
    'hex'
  );
}

// ── Main deploy + attest function ────────────────────────────────────────────
export async function submitCreditAttestation(params: {
  applicationId: string;    // borrower's unique identifier (hashed before sending)
  lenderId: string;         // lender identifier
  score: number;            // AI-generated score (0-100) — PRIVATE WITNESS
  threshold: number;        // minimum score required (public)
  annualRevenue: number;    // PRIVATE WITNESS
  outstandingDebt: number;  // PRIVATE WITNESS
}): Promise<{ contractAddress: ContractAddress; aboveThreshold: boolean; txHash: string }> {

  console.log('\n🌙 PrivateCredit AI — Midnight Testnet Attestation');
  console.log('━'.repeat(52));
  console.log(`Application ID : ${params.applicationId.slice(0, 16)}...`);
  console.log(`Threshold      : ${params.threshold}`);
  console.log(`Score          : [PRIVATE — not transmitted]`);
  console.log('━'.repeat(52));

  // Build private witness (never leaves local machine)
  const secretNonce = crypto.randomBytes(32);
  const privateWitness: PrivateCreditWitness = {
    actual_score: params.score,
    annual_revenue: BigInt(Math.round(params.annualRevenue)),
    debt_amount: BigInt(Math.round(params.outstandingDebt)),
    secret_nonce: secretNonce
  };

  // Build public attestation fields
  const applicationIdBytes = hashToBytes32(params.applicationId);
  const lenderIdBytes = hashToBytes32(params.lenderId);
  const aiScoreHash = scoreToHash(params.score, secretNonce);
  const aboveThreshold = params.score >= params.threshold;

  console.log(`ZK Proof       : score >= ${params.threshold} → ${aboveThreshold}`);
  console.log(`AI Score Hash  : ${Buffer.from(aiScoreHash).toString('hex').slice(0, 16)}...`);

  // ── ZK Provider (generates actual ZK proof locally) ──────────────────────
  const zkConfigProvider = new NodeZkConfigProvider(MIDNIGHT_ZK_CONFIG_URI);

  // ── Public data provider (reads Midnight ledger) ─────────────────────────
  const publicDataProvider = indexerPublicDataProvider(
    MIDNIGHT_INDEXER_URI,
    getLedgerNetworkId(),
    getZswapNetworkId()
  );

  // ── Build ledger state for the Compact contract ───────────────────────────
  // The private witness is used to generate the ZK proof locally.
  // ONLY the public attestation (above_threshold, ai_score_hash) goes on-chain.
  const ledgerState = createMidnightLedgerState({
    zkConfigProvider,
    publicDataProvider,
    contractAbi: './privatecredit.compact',
  });

  // ── Submit transaction ────────────────────────────────────────────────────
  console.log('\n⏳ Generating ZK proof locally...');
  console.log('⏳ Submitting attestation to Midnight testnet...');

  // Transaction payload — private witness stays local, only proof goes on-chain
  const txResult = await ledgerState.submitTransaction(
    'submit_credit_attestation',
    {
      // Private witness (used for ZK proof generation only)
      private_data: {
        actual_score: privateWitness.actual_score,
        annual_revenue: privateWitness.annual_revenue,
        debt_amount: privateWitness.debt_amount,
        secret_nonce: privateWitness.secret_nonce,
      },
      // Public inputs
      threshold: params.threshold,
      application_id: applicationIdBytes,
      lender_id: lenderIdBytes,
    }
  );

  console.log('\n✅ Attestation committed to Midnight blockchain!');
  console.log(`TX Hash        : ${txResult.hash}`);
  console.log(`Contract Addr  : ${txResult.contractAddress}`);
  console.log(`Above Threshold: ${aboveThreshold}`);
  console.log('\n🔒 What is on-chain   : above_threshold, ai_score_hash, timestamp');
  console.log('🚫 What is NOT on-chain: actual_score, annual_revenue, debt_amount');

  return {
    contractAddress: txResult.contractAddress,
    aboveThreshold,
    txHash: txResult.hash
  };
}

// ── Verify attestation from Midnight ledger ───────────────────────────────────
export async function verifyAttestation(params: {
  applicationId: string;
  contractAddress: ContractAddress;
}): Promise<{ aboveThreshold: boolean; timestamp: bigint }> {

  const publicDataProvider = indexerPublicDataProvider(
    MIDNIGHT_INDEXER_URI,
    getLedgerNetworkId(),
    getZswapNetworkId()
  );

  const applicationIdBytes = hashToBytes32(params.applicationId);

  const ledgerState = createMidnightLedgerState({
    publicDataProvider,
    contractAddress: params.contractAddress,
    contractAbi: './privatecredit.compact',
  });

  // Lender calls verify_attestation — gets proof, NOT the score
  const attestation = await ledgerState.query(
    'verify_attestation',
    { application_id: applicationIdBytes }
  );

  console.log('\n🏦 Lender Verification Result:');
  console.log(`Above Threshold: ${attestation.above_threshold}`);
  console.log(`Timestamp      : ${attestation.timestamp}`);
  console.log('Score          : [NOT ACCESSIBLE — ZK selective disclosure]');

  return {
    aboveThreshold: attestation.above_threshold,
    timestamp: attestation.timestamp
  };
}

// ── CLI entry point ───────────────────────────────────────────────────────────
async function main() {
  // Example: submit a test attestation to Midnight testnet
  const result = await submitCreditAttestation({
    applicationId: 'test-borrower-001',
    lenderId: 'test-lender-001',
    score: 82,              // AI score — PRIVATE
    threshold: 60,          // Public threshold
    annualRevenue: 500000,  // PRIVATE
    outstandingDebt: 100000 // PRIVATE
  });

  console.log('\n📋 Summary:');
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
