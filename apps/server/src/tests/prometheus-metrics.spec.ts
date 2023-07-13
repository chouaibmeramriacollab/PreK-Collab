import { ok } from 'node:assert';
import { beforeEach, describe, test } from 'node:test';

import { Test } from '@nestjs/testing';
import { register } from 'prom-client';

import { MetricsModule } from '../metrics';
import { Metrics } from '../metrics/metrics';

let metrics: Metrics;

beforeEach(async () => {
  const module = await Test.createTestingModule({
    imports: [MetricsModule],
  }).compile();

  metrics = module.get(Metrics);
});

describe('MetricsModule', () => {
  test('should be able to increment counter', async () => {
    metrics.socketIOCounter(1, { event: 'client-handshake' });
    const socketIOCounterMetric = await register.getSingleMetric(
      'socket_io_counter'
    );
    ok(socketIOCounterMetric);

    ok(
      JSON.stringify((await socketIOCounterMetric.get()).values) ===
        '[{"value":1,"labels":{"event":"client-handshake"}}]'
    );
  });

  test('should be able to timer', async () => {
    const endTimer = metrics.socketIOTimer({ event: 'client-handshake' });
    await new Promise(resolve => setTimeout(resolve, 50));
    endTimer();

    const endTimer2 = metrics.socketIOTimer({ event: 'client-handshake' });
    await new Promise(resolve => setTimeout(resolve, 100));
    endTimer2();

    const socketIOTimerMetric = await register.getSingleMetric(
      'socket_io_timer'
    );
    ok(socketIOTimerMetric);

    const observations = (await socketIOTimerMetric.get()).values;

    for (const observation of observations) {
      if (
        observation.labels.event === 'client-handshake' &&
        'quantile' in observation.labels
      ) {
        ok(observation.value >= 0.05);
        ok(observation.value <= 0.15);
      }
    }
  });
});
