#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/824852f0fafe9294755dbd9f4f5b51d616d75a8d3b1fe3e37ea96eecd83f786f/contract';
import endContract from '../../snapshots/824852f0fafe9294755dbd9f4f5b51d616d75a8d3b1fe3e37ea96eecd83f786f/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/dbbc262adf84925ac49df8c4c162b1cfb8dfdd9a69358019aed88043279c49e0/contract';
import startContract from '../../snapshots/dbbc262adf84925ac49df8c4c162b1cfb8dfdd9a69358019aed88043279c49e0/contract.json' with { type: 'json' };
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
        table: 'device',
        columns: [
          col('appVersion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('brand', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('deviceType', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('iccid', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('imei', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('imei2', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('imsi', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('lastSeenAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('manufacturer', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('meid', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('model', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('osVersion', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('phoneNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('platform', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('serialNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'jsonb', {
            notNull: true,
            default: lit({}),
            codecRef: { codecId: 'pg/jsonb@1' },
          }),
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
        table: 'device',
        constraint: 'device_serialNumber_key',
        columns: ['serialNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'device',
        constraint: 'device_imei_key',
        columns: ['imei'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'device',
        constraint: 'device_imei2_key',
        columns: ['imei2'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'device',
        constraint: 'device_meid_key',
        columns: ['meid'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'device',
        index: 'device_brand_model_idx_3aabac73',
        columns: ['brand', 'model'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'device',
        index: 'device_lastSeenAt_idx_b69845da',
        columns: ['lastSeenAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'device',
        index: 'device_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'device',
        foreignKey: {
          name: 'device_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
