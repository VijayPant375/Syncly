function InlineSpinner({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={`${className} animate-spin`}
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export default function LoadingButton({
  children,
  loadingText,
  isLoading = false,
  className = '',
  disabled = false,
  spinnerClassName,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={className}
    >
      {isLoading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <InlineSpinner className={spinnerClassName || 'w-4 h-4'} />
          <span>{loadingText || children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
