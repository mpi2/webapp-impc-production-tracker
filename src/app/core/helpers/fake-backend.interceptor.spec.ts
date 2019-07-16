import { FakeBackendInterceptor } from './fake-backend.interceptor';

describe('FakeBackend', () => {
  it('should create an instance', () => {
    expect(new FakeBackendInterceptor()).toBeTruthy();
  });
});
