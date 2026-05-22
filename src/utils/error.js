export class FinanceError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'FinanceError';
    this.source = options.source;
    this.code = options.code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

export function wrapRequestError(source, error, fallbackMessage) {
  if (error instanceof FinanceError) {
    throw error;
  }

  const status = error?.response?.status;
  const code = error?.code;
  const message = error?.response?.data?.message || error?.message || fallbackMessage;

  throw new FinanceError(message || fallbackMessage, {
    source,
    code,
    status,
    cause: error,
  });
}
