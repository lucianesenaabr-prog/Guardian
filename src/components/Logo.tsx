export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 2.5 4.5 6.8v8.1c0 7.2 4.7 12.4 11.5 14.6 6.8-2.2 11.5-7.4 11.5-14.6V6.8L16 2.5Z"
        fill="var(--primary)"
      />
      <path
        d="M7.5 16.5h4.2l2-4.8 3.4 9 2.2-4.2h5.2"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
