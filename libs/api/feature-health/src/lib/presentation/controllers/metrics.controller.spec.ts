import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller.js';
import { PrometheusService } from '@teddy-monorepo/api/core';

jest.mock('@teddy-monorepo/api/core');

describe('MetricsController', () => {
  let controller: MetricsController;
  let prometheusService: jest.Mocked<PrometheusService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [PrometheusService],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
    prometheusService = module.get(PrometheusService);
  });

  describe('getMetrics', () => {
    it('should return metrics in Prometheus format', async () => {
      const metricsOutput = `# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1027
http_requests_total{method="POST",status="201"} 423

# HELP http_request_duration_seconds HTTP request duration in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 500
http_request_duration_seconds_bucket{le="0.5"} 950
http_request_duration_seconds_bucket{le="+Inf"} 1027
http_request_duration_seconds_sum 300.5
http_request_duration_seconds_count 1027`;

      prometheusService.getMetrics.mockResolvedValue(metricsOutput);

      const result = await controller.getMetrics();

      expect(result).toBe(metricsOutput);
      expect(prometheusService.getMetrics).toHaveBeenCalledTimes(1);
    });

    it('should return empty metrics when no data exists', async () => {
      prometheusService.getMetrics.mockResolvedValue('');

      const result = await controller.getMetrics();

      expect(result).toBe('');
      expect(prometheusService.getMetrics).toHaveBeenCalledTimes(1);
    });

    it('should return metrics with multiple metric types', async () => {
      const metricsOutput = `# HELP http_requests_total Total requests
# TYPE http_requests_total counter
http_requests_total 100

# HELP memory_usage_bytes Memory usage
# TYPE memory_usage_bytes gauge
memory_usage_bytes 52428800

# HELP response_time_seconds Response time
# TYPE response_time_seconds summary
response_time_seconds{quantile="0.5"} 0.05
response_time_seconds{quantile="0.9"} 0.1
response_time_seconds_sum 10.5
response_time_seconds_count 200`;

      prometheusService.getMetrics.mockResolvedValue(metricsOutput);

      const result = await controller.getMetrics();

      expect(result).toContain('counter');
      expect(result).toContain('gauge');
      expect(result).toContain('summary');
    });

    it('should call prometheus service without parameters', async () => {
      prometheusService.getMetrics.mockResolvedValue('# metrics');

      await controller.getMetrics();

      expect(prometheusService.getMetrics).toHaveBeenCalledWith();
    });

    it('should propagate errors from prometheus service', async () => {
      const error = new Error('Metrics collection failed');
      prometheusService.getMetrics.mockRejectedValue(error);

      await expect(controller.getMetrics()).rejects.toThrow('Metrics collection failed');
    });

    it('should return metrics with labels', async () => {
      const metricsOutput = `# HELP http_requests_total Total requests
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/api/clients",status="200"} 50
http_requests_total{method="POST",endpoint="/api/clients",status="201"} 25
http_requests_total{method="GET",endpoint="/api/dashboard",status="200"} 30`;

      prometheusService.getMetrics.mockResolvedValue(metricsOutput);

      const result = await controller.getMetrics();

      expect(result).toContain('method=');
      expect(result).toContain('endpoint=');
      expect(result).toContain('status=');
    });

    it('should handle large metrics output', async () => {
      const largeMetrics = Array.from({ length: 1000 }, (_, i) => 
        `http_requests_total{endpoint="/api/endpoint${i}"} ${i * 10}`
      ).join('\n');

      prometheusService.getMetrics.mockResolvedValue(largeMetrics);

      const result = await controller.getMetrics();

      expect(result.length).toBeGreaterThan(1000);
      expect(result).toContain('endpoint="/api/endpoint0"');
      expect(result).toContain('endpoint="/api/endpoint999"');
    });
  });
});
