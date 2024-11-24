
export class RetryUtil {
  static async executeWithRetry<T>(maxRetries: number, retryDelay: number, operation: () => Promise<T>): Promise<T> {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        if (retries === maxRetries - 1) {
          throw error;
        }
        retries++;
        await RetryUtil.delay(retryDelay * Math.pow(2, retries));
      }
    }

    throw new Error('최대 재시도 횟수를 초과했습니다.');
  }

  private static async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
