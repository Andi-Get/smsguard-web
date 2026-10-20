#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/824852f0fafe9294755dbd9f4f5b51d616d75a8d3b1fe3e37ea96eecd83f786f/contract';
import startContract from '../../snapshots/824852f0fafe9294755dbd9f4f5b51d616d75a8d3b1fe3e37ea96eecd83f786f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a671053aa0ac664c15f6a801cbf4ba2b433ef59ceb361bd7ca3e4ee4ff48e70b/contract';
import endContract from '../../snapshots/a671053aa0ac664c15f6a801cbf4ba2b433ef59ceb361bd7ca3e4ee4ff48e70b/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'device_pairing',
        columns: [
          col('claimedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('deviceId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('pending'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'device_pairing',
        constraint: 'device_pairing_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'device_pairing',
        constraint: 'device_pairing_deviceId_key',
        columns: ['deviceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'device_pairing',
        index: 'device_pairing_status_expiresAt_idx_c206f415',
        columns: ['status', 'expiresAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'device_pairing',
        index: 'device_pairing_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'device_pairing',
        foreignKey: {
          name: 'device_pairing_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'device_pairing',
        foreignKey: {
          name: 'device_pairing_deviceId_fkey',
          columns: ['deviceId'],
          references: { schema: 'public', table: 'device', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
